import express from "express";
import apiRouter from "./api";
import authRouter from "./auth";
const router = express.Router();

router.use("/api/oauth/v1", authRouter);
router.use("/api/v1", apiRouter);

export default router;
