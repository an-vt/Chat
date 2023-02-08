import express from "express";
import apiRouter from "./api";
const router = express.Router();
import authRouter from "./auth";

router.use("/oauth", authRouter);
router.use("/api/v1", apiRouter);

export default router;
