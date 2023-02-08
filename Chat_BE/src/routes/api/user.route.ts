import express from "express";
import {
  getAllUser,
  getMe,
  updateAvatar,
} from "../../controller/user.controller";
const userRouter = express.Router();

userRouter.put("/:id/avatar", updateAvatar);
userRouter.get("/me", getMe);
userRouter.get("/", getAllUser);

export { userRouter };
