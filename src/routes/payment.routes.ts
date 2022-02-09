import {
  flutterHook,
  initPayment,
  verifyPayment,
  getUserTrainings,
  initModulePayment,
  initCartPayment,
  testNotify,
} from "./../controllers/payments.controller";
import express from "express";
import { protectRoute } from "../controllers/auth.controller";

const router = express.Router();

router.post("/hook", flutterHook);

router.use(protectRoute);
// router.post("/testing", testNotify);
// router.post("/init", initPayment);
// router.post("/moduleinit", initModulePayment);
router.post("/cart-payment-init", initCartPayment);
router.get("/", getUserTrainings);
router.get("/verify/:id", verifyPayment);

export default router;
