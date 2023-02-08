import { AttendeeDocument } from "model/attendee.model";
import { MessageModel } from "model/message.model";
import { ReadMessageSocket } from "model/message.socket.model";
import { RoomAdd } from "model/room.model";
import mongoose, { LeanDocument } from "mongoose";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { globalAny } from "../app";
import log from "../logger";
import {
  getAllRoomByUserService,
  getAllRoomIdByUserService,
  updateUnReadCountRoomAttendeeService,
} from "../service/chat.service";
import { findAllMemberService } from "../service/member.service";
import { getAllMessageService } from "../service/message.service";
import { findAllUser } from "../service/user.service";

const senderMessageSocket = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  return async function senderMessageSocket(data: MessageModel) {
    const { roomId, senderUId, receivers } = data;
    const memberIds = [...receivers, senderUId];
    const sendUserSocket = globalAny.onlineUsers.get(senderUId);

    if (sendUserSocket) {
      try {
        for (const memberId of memberIds) {
          const data = await getAllMessageService(roomId);
          io.to(memberId).emit("msg-receive", data);
        }
      } catch (error: any) {
        log.error(error.message);
      }
    }
  };
};

const listMemberUnAddSocket = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  return async function listMemberUnAddSocket(data: RoomAdd) {
    for (const memberId of data.memberIds) {
      const userIdSocket = globalAny.onlineUsers.get(memberId);
      if (userIdSocket) {
        try {
          const attendee = await getAllRoomIdByUserService({
            _id: memberId,
          });

          if (attendee && attendee?.rooms?.length > 0) {
            const filters: any[] =
              attendee?.rooms
                .filter((room) => room.type === "SELF")
                .map((room) => ({
                  $and: [
                    { roomId: room._id },
                    {
                      userId: {
                        $ne: memberId,
                      },
                    },
                  ],
                })) ?? [];
            const member = await findAllMemberService({
              $or: filters,
            });
            const filterUsers =
              member.map((member) => ({
                _id: {
                  $ne: member.userId,
                },
              })) ?? [];

            // filter remove user auth
            filterUsers.push({
              _id: {
                $ne: memberId,
              },
            });
            const users = await findAllUser({
              $and: filterUsers,
            });
            io.to(memberId).emit("list-member-unadd-receive", users);
          } else {
            const userNotAuths = await findAllUser({ _id: { $ne: memberId } });
            io.to(memberId).emit("list-member-unadd-receive", userNotAuths);
          }
        } catch (error: any) {
          log.error(error.message);
        }
      }
    }
  };
};

const sendlistRoom = async (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  memberIds: string[]
) => {
  for (const memberId of memberIds) {
    const userSocketId = globalAny.onlineUsers.get(memberId);
    if (userSocketId) {
      try {
        const userIdObject = new mongoose.Types.ObjectId(memberId);
        const results: LeanDocument<AttendeeDocument> | null =
          await getAllRoomByUserService({
            _id: memberId,
          });
        if (results) {
          const promises = results.rooms.map((room) =>
            findAllMemberService({ roomId: room._id })
          );
          const response = await Promise.all(promises);
          const newData = results.rooms.map((item, index) => ({
            ...item,
            members: response[index].filter(
              (member) => !member.userId.equals(userIdObject)
            ),
          }));
          results.rooms = newData;
        }
        io.to(memberId).emit("list-room-receive", results);
      } catch (e: any) {
        log.error(e);
      }
    }
  }
};

const listRoomSocket = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  return (data: RoomAdd) => sendlistRoom(io, socket, data.memberIds);
};

const updateUnreadCountSocket = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  return async function updateUnreadCountSocket(data: MessageModel) {
    // update unread count and lastUpdatedTimestamp
    const { receivers, roomId, senderUId } = data;
    const memberIds = [senderUId, ...receivers];

    for (const receiverId of receivers) {
      await updateUnReadCountRoomAttendeeService(
        {
          _id: receiverId,
        },
        {
          $set: {
            "rooms.$[ele].lastUpdatedTimestamp": new Date().toString(),
          },
          $inc: {
            "rooms.$[ele].unreadCount": 1,
          },
        },
        {
          arrayFilters: [
            {
              "ele._id": roomId,
            },
          ],
        }
      );
    }

    // update lastUpdatedTimestamp  sender
    await updateUnReadCountRoomAttendeeService(
      {
        _id: senderUId,
      },
      {
        $set: {
          "rooms.$[ele].lastUpdatedTimestamp": new Date().toString(),
        },
      },
      {
        arrayFilters: [
          {
            "ele._id": roomId,
          },
        ],
      }
    );

    // send list members to user
    await sendlistRoom(io, socket, memberIds);
  };
};

const readMessageSocket = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  return async function readMessageSocket({
    roomId,
    senderId,
  }: ReadMessageSocket) {
    const memberIds = [senderId];
    // update lastUpdatedTimestamp  sender
    await updateUnReadCountRoomAttendeeService(
      {
        _id: senderId,
      },
      {
        $set: {
          "rooms.$[ele].lastUpdatedTimestamp": new Date().toString(),
          "rooms.$[ele].unreadCount": 0,
        },
      },
      {
        arrayFilters: [
          {
            "ele._id": roomId,
          },
        ],
      }
    );

    // send list members to user
    await sendlistRoom(io, socket, memberIds);
  };
};

const disconnectUserSocket = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  return async function disconnectUserSocket(senderId: string) {
    const senderUserSocket = globalAny.onlineUsers.get(senderId);
    if (senderId) {
      log.info("Disconnect user");
      globalAny.onlineUsers.delete(senderId);
    }
  };
};

export {
  senderMessageSocket,
  listMemberUnAddSocket,
  listRoomSocket,
  updateUnreadCountSocket,
  readMessageSocket,
  disconnectUserSocket,
};
