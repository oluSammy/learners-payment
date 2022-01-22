import { protectRoute } from './../controllers/auth.controller';
import express from "express";
import {
  createCourseModule,
  getAllModules,
  getModuleCourses,
} from "../controllers/courseModule.controller";

const router = express.Router();

router.post("/", protectRoute, createCourseModule);
router.get("/", getAllModules);

router.get("/:moduleId", getModuleCourses);

export default router;
