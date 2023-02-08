import { RoomType } from "../common/constants";
import { UserInfo } from "./User";

export interface Member {
  _id: string;
  role: RoomType;
  roomId: string;
  userId: string;
  user?: UserInfo;
}
