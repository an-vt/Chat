import { Response } from "express";
import mongoose, { LeanDocument } from "mongoose";
import { avatarGroupBase64Default } from "../common/constants";
import log from "../logger";
import { AttendeeDocument } from "../model/attendee.model";
import { MemberDocument } from "../model/member.model";
import { RoomDocument, TYPE_ROOM } from "../model/room.model";
import { UserDocument } from "../model/user.model";
import {
  addRoomAttendeeService,
  getAllRoomByUserService,
  getAllRoomIdByUserService,
} from "../service/chat.service";
import {
  addMemberService,
  findAllMemberService,
} from "../service/member.service";
import { findAllUser, findUser } from "../service/user.service";

const addAttendee = async (
  roomId: mongoose.Types.ObjectId,
  type: TYPE_ROOM,
  userId: mongoose.Types.ObjectId,
  nameRoom?: string,
  avatarUrl?: string
) => {
  const user = await findUser({ _id: userId });

  if (user) {
    let room: Partial<RoomDocument> = {};

    if (type === "GROUP") {
      room = {
        _id: roomId,
        name: nameRoom,
        unreadCount: 0,
        type,
        avatarUrl: avatarGroupBase64Default,
      };
    } else {
      room = {
        _id: roomId,
        name: nameRoom,
        unreadCount: 0,
        type,
        avatarUrl: avatarUrl,
      };
    }

    const attendee: any = {
      _id: userId,
      rooms: [room],
    };

    // update attendee
    await addRoomAttendeeService(attendee);
  }
};

const addMember = async (
  roomId: mongoose.Types.ObjectId,
  type: TYPE_ROOM,
  userAuthId: mongoose.Types.ObjectId,
  idMember: mongoose.Types.ObjectId
) => {
  const isAdmin = userAuthId.equals(idMember);
  const member: Partial<MemberDocument> = {
    role: type === "SELF" ? "ADMIN" : isAdmin ? "ADMIN" : "MEMBER",
    roomId: roomId,
    userId: idMember,
  };

  await addMemberService(member as MemberDocument);
};

export async function addChatController(req: any, res: Response) {
  const NEXT_INDEX_RECEIVER = 1;
  try {
    const userAuth: UserDocument = req?.user;

    const type: TYPE_ROOM = req.body.type;
    const memberIds: string[] = req.body.memberIds;
    const groupName: string = req.body.groupName;
    const roomId = mongoose.Types.ObjectId();
    const userAuthId = new mongoose.Types.ObjectId(userAuth["_id"]);
    for (const id of memberIds) {
      const memberId = new mongoose.Types.ObjectId(id);
      const userId = mongoose.Types.ObjectId(id);

      let nameGroup = groupName;
      let avatarUrl = "";
      if (type === "SELF") {
        const indexReceiver =
          (memberIds.indexOf(id) + NEXT_INDEX_RECEIVER) % memberIds.length;
        const idReceiver = memberIds[indexReceiver];
        const user: LeanDocument<UserDocument> | null = await findUser({
          _id: idReceiver,
        });
        if (user) {
          nameGroup = user?.name;
          avatarUrl = user?.avatarUrl;
        }
      }

      // add attendee
      await addAttendee(roomId, type, userId, nameGroup, avatarUrl);

      // add member
      await addMember(roomId, type, userAuthId, memberId);
    }

    return res.status(200).json({ msg: "Add chat successfully" });
  } catch (e: any) {
    log.error(e);
    return res.status(400).send(e.message);
  }
}

export async function addMemberController(req: any, res: Response) {
  try {
    const userAuth: UserDocument = req?.user;

    const memberIdObject = mongoose.Types.ObjectId(req.body.memberId);
    const roomIdObject = mongoose.Types.ObjectId(req.body.roomId);
    const type: TYPE_ROOM = "GROUP";
    const userAuthId = new mongoose.Types.ObjectId(userAuth["_id"]);
    // add attendee
    await addAttendee(roomIdObject, type, memberIdObject);

    // add member
    await addMember(roomIdObject, type, userAuthId, memberIdObject);

    return res.status(200).json({ msg: "Add member successfully" });
  } catch (e: any) {
    log.error(e);
    return res.status(400).send(e.message);
  }
}

export async function getRoomByUserController(req: any, res: Response) {
  try {
    const { userId } = req.params;
    const { _id } = req.user;
    const userIdObject = new mongoose.Types.ObjectId(_id);
    const data: LeanDocument<AttendeeDocument> | null =
      await getAllRoomByUserService({
        _id: userId,
      });
    if (data) {
      const promises = data.rooms.map((room) =>
        findAllMemberService({ roomId: room._id })
      );
      const response = await Promise.all(promises);
      const newData = data.rooms.map((item, index) => ({
        ...item,
        members: response[index].filter(
          (member) => !member.userId.equals(userIdObject)
        ),
      }));
      data.rooms = newData;
      return res.send(data);
    }
  } catch (e: any) {
    log.error(e);
    return res.status(400).send(e.message);
  }
}

export async function getAllMemberUnAdd(req: any, res: Response) {
  try {
    const { _id: userAuthId } = req.user;
    const attendee = await getAllRoomIdByUserService({
      _id: userAuthId,
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
                  $ne: userAuthId,
                },
              },
            ],
          })) ?? [];
      const member =
        filters.length > 0
          ? await findAllMemberService({
              $or: filters,
            })
          : [];
      const filterUsers =
        member.map((member) => ({
          _id: {
            $ne: member.userId,
          },
        })) ?? [];

      // filter remove user auth
      filterUsers.push({
        _id: {
          $ne: userAuthId,
        },
      });
      const users = await findAllUser({
        $and: filterUsers,
      });
      return res.send(users);
    } else {
      const userNotAuths = await findAllUser({ _id: { $ne: userAuthId } });
      return res.send(userNotAuths);
    }
  } catch (e: any) {
    log.error(e);
    return res.status(400).send(e.message);
  }
}
