import express from "express";
import { protectRoute } from "../controllers/auth.controller";
import {
  courseController,
  getAllCourses,
} from "../controllers/course.controller";

const router = express.Router();

router.post("/", protectRoute, courseController);
router.get("/", protectRoute, getAllCourses);

export default router;
