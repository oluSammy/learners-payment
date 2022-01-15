import {
  flutterHook,
  initPayment,
  verifyPayment,
  getUserTrainings,
} from "./../controllers/payments.controller";
import express from "express";
import { protectRoute } from "../controllers/auth.controller";

const router = express.Router();

router.use(protectRoute);

router.post("/init", initPayment);
router.post("/hook", flutterHook);
router.get("/", getUserTrainings);
router.get("/verify/:id", verifyPayment);

export default router;
