import express from "express";
import { login, refreshTokenAuthen } from "../../controller/auth.controller";
import { createUserHandler } from "../../controller/user.controller";
import { validateRequest } from "../../middleware";
import {
  createUserSchema,
  createUserSessionSchema,
} from "../../schema/user.schema";
const authRouter = express.Router();

// Register user
authRouter.post(
  "/register",
  validateRequest(createUserSchema),
  createUserHandler
);

// Login
authRouter.post("/token", validateRequest(createUserSessionSchema), login);

// refresh token
authRouter.get("/token/refresh", refreshTokenAuthen);

export default authRouter;
