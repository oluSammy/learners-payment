import express, { NextFunction, Request, Response } from "express";
import learnerRouter from "./learner.routes";
import paymentRouter from "./payment.routes";
import courseRouter from "./course.routes";
import courseModuleRouter from "./courseModule.route";

const router = express.Router();

/* GET home page. */
router.use("/learner", learnerRouter);
router.use("/payments", paymentRouter);
router.use("/course", courseRouter);
router.use("/module", courseModuleRouter);

export default router;
