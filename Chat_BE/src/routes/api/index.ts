import express from "express";
import { chatRouter } from "./chat.route";
import { userRouter } from "./user.route";
const apiRouter = express.Router();

apiRouter.use("/users", userRouter);
apiRouter.use("/chat", chatRouter);

export default apiRouter;
