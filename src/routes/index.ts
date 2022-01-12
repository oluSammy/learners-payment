import express, { NextFunction, Request, Response } from "express";
import learnerRouter from "./learner.routes";
import paymentRouter from "./payment.routes";

const router = express.Router();

/* GET home page. */
router.use("/learner", learnerRouter);
router.use("/payments", paymentRouter);

export default router;
