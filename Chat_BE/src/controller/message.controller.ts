import { Response } from "express";
import log from "../logger";
import { MessageDocument } from "../model/message.model";
import {
  createMessageService,
  getAllMessageService,
} from "../service/message.service";

export async function addMessageController(req: any, res: Response) {
  try {
    // add message
    await createMessageService(req.body as MessageDocument);

    return res.status(200).json({ msg: "Add message successfully" });
  } catch (e: any) {
    log.error(e);
    return res.status(400).send(e.message);
  }
}

export async function getAllMessageController(req: any, res: Response) {
  try {
    const { roomId } = req.params;
    const data = await getAllMessageService(roomId);
    return res.status(200).json(data);
  } catch (e: any) {
    log.error(e);
    return res.status(409).send(e.message);
  }
}
