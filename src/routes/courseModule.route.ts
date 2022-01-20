import express from "express";
import { protectRoute } from "../controllers/auth.controller";
import {
  createCourseModule,
  getAllModules,
  getModuleCourses,
} from "../controllers/courseModule.controller";

const router = express.Router();

router.post("/", createCourseModule);
router.get("/", getAllModules);

router.get("/:moduleId", protectRoute, getModuleCourses);

export default router;
