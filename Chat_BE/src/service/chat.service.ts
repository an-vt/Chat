import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import Attendee, { AttendeeDocument } from "../model/attendee.model";

export async function addRoomAttendeeService(
  input: DocumentDefinition<AttendeeDocument>
) {
  try {
    return await Attendee.updateOne(
      { _id: input._id },
      { $push: { rooms: input.rooms } }
    );
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function createAttendeeService(
  input: DocumentDefinition<AttendeeDocument>
) {
  try {
    return await Attendee.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getAllRoomByUserService(
  query: FilterQuery<AttendeeDocument>
) {
  try {
    return await Attendee.findOne(query).lean();
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getAllRoomIdByUserService(
  query: FilterQuery<AttendeeDocument>
) {
  try {
    return await Attendee.findOne(query);
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function updateAvatarRoomAttendeeService(
  filter: FilterQuery<AttendeeDocument>,
  update: UpdateQuery<AttendeeDocument>,
  options: QueryOptions
) {
  try {
    return await Attendee.updateMany(filter, update, options);
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function updateUnReadCountRoomAttendeeService(
  filter: FilterQuery<AttendeeDocument>,
  update: UpdateQuery<AttendeeDocument>,
  options: QueryOptions
) {
  try {
    return await Attendee.updateOne(filter, update, options);
  } catch (error: any) {
    throw new Error(error);
  }
}
