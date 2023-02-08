import log from "../logger";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { globalAny } from "../app";

const connectedUserSocket = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  return async function connectedUserSocket(userId: string) {
    log.info("User connected");
    const socketId = socket.id;
    socket.join(userId);
    globalAny.onlineUsers.set(userId, socketId);
  };
};

export { connectedUserSocket };
