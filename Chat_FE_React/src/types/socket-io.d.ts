import { Attendee, Message, Room, UserInfo } from "models";

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  "msg-receive": (data: Message[]) => void;
  "list-member-unadd-receive": (data: UserInfo[]) => void;
  "list-room-receive": (data: Attendee) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  "connected-user": (userId: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
