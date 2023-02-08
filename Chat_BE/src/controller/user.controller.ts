import { Request, Response } from "express";
import { get, omit } from "lodash";
import { MemberDocument } from "model/member.model";
import mongoose from "mongoose";
import { avatarBase64Default } from "../common/constants";
import log from "../logger";
import {
  createAttendeeService,
  updateAvatarRoomAttendeeService,
} from "../service/chat.service";
import { findAllMemberService } from "../service/member.service";
import {
  createUser,
  findAllUser,
  findUser,
  updateUser,
} from "../service/user.service";

export async function createUserHandler(req: Request, res: Response) {
  try {
    const emailExisted = await findUser({ email: req.body.email });
    if (emailExisted)
      return res.status(409).json({ msg: "Email already used" });
    const user = await createUser({
      ...req.body,
      avatarUrl: avatarBase64Default,
    });
    const attendee = {
      _id: user["_id"],
      rooms: [],
    };
    await createAttendeeService(attendee);
    return res.send(omit(user.toJSON(), "password"));
  } catch (e: any) {
    log.error(e);
    return res.status(409).send(e.message);
  }
}

export async function updateAvatar(req: any, res: Response) {
  try {
    const userId = req.params.id;
    const userIdObject = new mongoose.Types.ObjectId(userId);
    const { avatarUrl } = req.body;

    const data: MemberDocument[] = await findAllMemberService({
      userId,
      role: "ADMIN",
    });
    const roomIds = data?.map((room) => room.roomId);

    const members: MemberDocument[] = [];

    for (const roomId of roomIds) {
      const member: MemberDocument[] = await findAllMemberService({ roomId });
      const memberUpdate: MemberDocument[] = member?.filter(
        (member) => !member.userId.equals(userIdObject)
      );
      members.push(...memberUpdate);
    }

    for (const member of members) {
      await updateAvatarRoomAttendeeService(
        {
          _id: member.userId,
        },
        {
          $set: {
            "rooms.$[ele].avatarUrl": avatarUrl,
          },
        },
        {
          arrayFilters: [
            {
              "ele._id": member.roomId,
              "ele.type": "SELF",
            },
          ],
          multi: true,
        }
      );
    }
    //$and: [{ "ele._id": roomId }, { "ele.type": "SELF" }],
    await updateUser(userId, { avatarUrl, isAvatar: !!avatarUrl });
    return res.status(200).json({
      msg: "Upload successful",
    });
  } catch (e: any) {
    log.error(e);
    return res.status(409).send(e.message);
  }
}

export async function getAllUser(req: Request, res: Response) {
  try {
    const userId = req.params.id;

    const users = await findAllUser({ _id: { $ne: userId } });
    return res
      .status(200)
      .json(users.map((user) => omit(user.toJSON(), "password")));
  } catch (e: any) {
    log.error(e);
    return res.status(409).send(e.message);
  }
}

export async function getMe(req: any, res: Response) {
  try {
    const userId = get(req.user, "_id");
    const user = await findUser({ _id: userId });
    return res.status(200).json(omit(user, ["password"]));
  } catch (e: any) {
    log.error(e);
    return res.status(409).send(e.message);
  }
}
