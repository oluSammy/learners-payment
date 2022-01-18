import express from "express";
import { protectRoute } from "../controllers/auth.controller";
import { createCourse, getAllCourses } from "../controllers/course.controller";

const router = express.Router();

router.use(protectRoute);

router.post("/", createCourse);
router.get("/", getAllCourses);

export default router;
