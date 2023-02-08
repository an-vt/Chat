import { DocumentDefinition, FilterQuery } from "mongoose";
import Member, { MemberDocument } from "../model/member.model";

export async function addMemberService(
  input: DocumentDefinition<MemberDocument>
) {
  try {
    return await Member.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function findMemberNotByRoomService(conditions: any[]) {
  try {
    return await Member.find({
      $and: conditions,
    });
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function findAllMemberService(query: FilterQuery<MemberDocument>) {
  return Member.find(query);
}

export async function findMemberService(query: FilterQuery<MemberDocument>) {
  return Member.findOne(query);
}
