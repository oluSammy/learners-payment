import express, { NextFunction, Request, Response } from "express";
import learnerRouter from "./learner.routes";

const router = express.Router();

/* GET home page. */
router.use("/learner", learnerRouter);

export default router;
