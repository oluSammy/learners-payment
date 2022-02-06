import express from "express";
import { protectRoute } from "../controllers/auth.controller";
import {
  createCourse,
  getAllCourses,
  updateCourse,
} from "../controllers/course.controller";

const router = express.Router();

router.post("/", protectRoute, createCourse);
router.get("/", getAllCourses);
router.patch("/:id", protectRoute, updateCourse);

export default router;
