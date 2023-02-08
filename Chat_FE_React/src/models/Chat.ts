import { MessageType, RoomType } from "../common/constants";
import { Member } from "./Member";

export interface Attendee {
  _id: string;
  rooms: Room[];
}
export interface Room {
  _id: string;
  type: RoomType;
  unreadCount: number;
  name: string;
  avatarUrl: string;
  lastUpdatedTimestamp: string;
  members: Member[];
}

export interface Message {
  _id?: string;
  content: string;
  senderUId: string;
  senderName: string;
  senderAvatarUrl: string;
  type: MessageType;
  roomId: string;
  receivers: string[];
  sendingTimestamp: string;
}

export interface RoomAdd {
  memberIds: string[];
  type: RoomType;
  groupName?: string;
}
