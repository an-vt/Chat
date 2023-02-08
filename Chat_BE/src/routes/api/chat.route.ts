import express from "express";
import {
  addChatController,
  addMemberController,
  getAllMemberUnAdd,
  getRoomByUserController,
} from "../../controller/chat.controller";
import {
  addMessageController,
  getAllMessageController,
} from "../../controller/message.controller";
import { validateRequest } from "../../middleware";
import {
  addMemberSchema,
  createChatSchema,
  getRoomByUserSchema,
} from "../../schema/chat.schema";
import { createMessageSchema } from "../../schema/message.schema";
const chatRouter = express.Router();

chatRouter.get("/message/:roomId", getAllMessageController);
chatRouter.post("/add", validateRequest(createChatSchema), addChatController);
chatRouter.post(
  "/room/add",
  validateRequest(addMemberSchema),
  addMemberController
);
chatRouter.get(
  "/room/user/:userId",
  validateRequest(getRoomByUserSchema),
  getRoomByUserController
);
chatRouter.post(
  "/message",
  validateRequest(createMessageSchema),
  addMessageController
);
chatRouter.get("/member/unadd", getAllMemberUnAdd);

export { chatRouter };
