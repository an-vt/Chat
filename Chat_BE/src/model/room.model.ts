import mongoose from "mongoose";

export type TYPE_ROOM = "GROUP" | "SELF";

export interface RoomAdd {
  memberIds: string[];
  type: TYPE_ROOM;
  groupName?: string;
}
export interface RoomDocument extends mongoose.Document {
  name: string;
  unreadCount: number;
  type: TYPE_ROOM;
  avatarUrl: string;
  lastUpdatedTimestamp: Date;
}

const RoomSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.String,
    require: true,
  },
  unreadCount: {
    type: mongoose.Schema.Types.Number,
    required: true,
    default: 0,
  },
  type: {
    type: mongoose.Schema.Types.String,
    default: "SELF",
  },
  avatarUrl: {
    type: mongoose.Schema.Types.String,
    default: "",
  },
  lastUpdatedTimestamp: {
    type: mongoose.Schema.Types.Date,
    default: new Date(),
  },
});

export default RoomSchema;
