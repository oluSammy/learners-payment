import express from "express";
import { protectRoute } from "../controllers/auth.controller";
import {
  createCourseModule,
  getAllModules,
  getModuleCourses,
} from "../controllers/courseModule.controller";

const router = express.Router();

router.use(protectRoute);

router.post("/", createCourseModule);
router.get("/", getAllModules);
router.get("/:moduleId", getModuleCourses);

export default router;
