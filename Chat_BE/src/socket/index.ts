import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import {
  listMemberUnAddSocket,
  listRoomSocket,
  readMessageSocket,
  senderMessageSocket,
  updateUnreadCountSocket,
  disconnectUserSocket,
} from "./chatSocket";
import { connectedUserSocket } from "./userSocket";

const configureSockets = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  return {
    connectedUserSocket: connectedUserSocket(io, socket),
    senderMessgeSocket: senderMessageSocket(io, socket),
    listMemberUnAddSocket: listMemberUnAddSocket(io, socket),
    listRoomSocket: listRoomSocket(io, socket),
    updateUnreadCountSocket: updateUnreadCountSocket(io, socket),
    readMessageSocket: readMessageSocket(io, socket),
    disconnectUserSocket: disconnectUserSocket(io, socket),
  };
};

const onConnection =
  (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) =>
  async (
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  ) => {
    const {
      connectedUserSocket,
      senderMessgeSocket,
      listMemberUnAddSocket,
      listRoomSocket,
      updateUnreadCountSocket,
      readMessageSocket,
      disconnectUserSocket,
    } = configureSockets(io, socket);

    socket.on("connected-user", connectedUserSocket);
    socket.on("disconnect-user", disconnectUserSocket);
    socket.on("msg-send", senderMessgeSocket);
    socket.on("list-member-unadd-send", listMemberUnAddSocket);
    socket.on("list-room-send", listRoomSocket);
    socket.on("update-unread-send", updateUnreadCountSocket);
    socket.on("read-message-send", readMessageSocket);
  };

export { onConnection };
