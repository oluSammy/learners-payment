import { flutterHook, initPayment } from "./../controllers/payments.controller";
import express from "express";
import { protectRoute } from "../controllers/auth.controller";

const router = express.Router();

router.post("/init", protectRoute, initPayment);
router.post("/hook", flutterHook);

export default router;
