import mongoose from "mongoose";
import { RoomDocument } from "./room.model";
import { UserDocument, UserModel } from "./user.model";

export type ROLE = "ADMIN" | "MEMBER";

export interface MemberModel {
  role: ROLE;
  roomId: string;
  user: UserModel;
}
export interface MemberDocument extends mongoose.Document {
  role: ROLE;
  roomId: RoomDocument["_id"];
  userId: UserDocument["_id"];
}

const MemberSchema = new mongoose.Schema({
  role: String,
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "room",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

const Member = mongoose.model<MemberDocument>("Member", MemberSchema);

export default Member;
