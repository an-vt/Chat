import mongoose from "mongoose";
import RoomSchema, { RoomDocument } from "./room.model";

export interface AttendeeDocument extends mongoose.Document {
  _id: string;
  rooms: RoomDocument[];
}

const AttendeeSchema = new mongoose.Schema({
  rooms: [RoomSchema],
});

const Attendee = mongoose.model<AttendeeDocument>("Attendee", AttendeeSchema);

export default Attendee;
