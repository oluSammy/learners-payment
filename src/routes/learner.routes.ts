import express from "express";
import { createLearner } from "../controllers/auth.controller";

const router = express.Router();

router.route("/create").post(createLearner);

// router.post('/learner', createLearner)

export default router;
