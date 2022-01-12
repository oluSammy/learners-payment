import express from "express";
import {
  createLearner,
  login,
  verifyIdentityToken,
} from "../controllers/auth.controller";

const router = express.Router();

router.route("/create").post(createLearner);
router.route("/login").post(login);
router.route("/verify").post(verifyIdentityToken);

// router.post('/learner', createLearner)

export default router;
