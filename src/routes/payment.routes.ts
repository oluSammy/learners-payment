import { initPayment } from "./../controllers/payments.controller";
import express from "express";

const router = express.Router();

router.post("/init", initPayment);

export default router;
