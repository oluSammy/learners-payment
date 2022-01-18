import express from "express";
import { protectRoute } from "../controllers/auth.controller";
import {
  createCourseModule,
  getAllModules,
} from "../controllers/courseModule.controller";

const router = express.Router();

router.use(protectRoute);

router.post("/", createCourseModule);
router.get("/", getAllModules);

export default router;
