import mongoose from "mongoose";

export interface MessageModel {
  content: string;
  receivers: string[];
  senderUId: string;
  senderName: string;
  senderAvatarUrl: string;
  type: string;
  roomId: string;
  sendingTimestamp: string;
}
export interface MessageDocument extends mongoose.Document {
  content: string;
  receivers: string[];
  senderUId: string;
  senderName: string;
  senderAvatarUrl: string;
  type: string;
  roomId: string;
  sendingTimestamp: string;
}

const MessageSchema = new mongoose.Schema({
  content: {
    type: mongoose.Schema.Types.String,
    require: true,
  },
  receivers: {
    type: mongoose.Schema.Types.Array,
    require: true,
  },
  senderUId: {
    type: mongoose.Schema.Types.String,
    require: true,
  },
  senderName: {
    type: mongoose.Schema.Types.String,
    require: true,
  },
  senderAvatarUrl: {
    type: mongoose.Schema.Types.String,
    require: true,
  },
  type: {
    type: mongoose.Schema.Types.String,
    require: true,
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "room",
  },
  sendingTimestamp: {
    type: mongoose.Schema.Types.Date,
  },
});

const Message = mongoose.model<MessageDocument>("Message", MessageSchema);

export default Message;
