import express from "express";
import { protectRoute } from "../controllers/auth.controller";
import { createCourse, getAllCourses } from "../controllers/course.controller";

const router = express.Router();

router.post("/", protectRoute, createCourse);
router.get("/", getAllCourses);

export default router;
