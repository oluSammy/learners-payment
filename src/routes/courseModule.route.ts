import { protectRoute } from "./../controllers/auth.controller";
import express from "express";
import {
  createCourseModule,
  getAllModules,
  getModuleCourses,
  updateModuleCourse,
} from "../controllers/courseModule.controller";

const router = express.Router();

router.get("/", getAllModules);
router.get("/:moduleId", getModuleCourses);

router.use(protectRoute);
router.post("/", createCourseModule);
router.patch("/:id", updateModuleCourse);

export default router;
