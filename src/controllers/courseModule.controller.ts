import { Request, Response } from "express";
import {
  validateCreateModule,
  validateUpdateModule,
} from "../validation/validation";
import CourseModule from "../models/courseModule.model";
import Course from "../models/courses.model";

export const createCourseModule = async (req: Request, res: Response) => {
  console.log(req.user);

  try {
    const { error } = validateCreateModule(req.body);

    if (error) {
      return res.status(400).json({
        message: `${error.message}`,
      });
    }

    const courseModule = await CourseModule.create(req.body);

    res.status(200).json({
      message: "course module created",
      data: courseModule,
    });
  } catch (e: any) {
    console.log(e, "(**");

    res.status(500).json({
      message: "an error ocurredaaaa",
    });
  }
};

export const getAllModules = async (req: Request, res: Response) => {
  try {
    const allModules = await CourseModule.find();

    res.status(200).json({
      message: "all modules",
      data: allModules,
    });
  } catch (e: any) {
    res.status(500).json({
      message: "an error ocurred",
    });
  }
};

export const getModuleCourses = async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;

    const courses = await Course.find({ moduleId });

    res.status(200).json({
      message: "success",
      data: courses,
    });
  } catch (e: any) {
    res.status(500).json({
      status: "error",
      message: "an error occurred",
    });
  }
};

export const updateModuleCourse = async (req: Request, res: Response) => {
  try {
    const { error } = validateUpdateModule(req.body);

    if (error) {
      return res.status(400).json({
        message: `${error.message}`,
      });
    }

    // res.send("hello");

    const { id } = req.params;

    const data = await CourseModule.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });

    res.status(201).json({
      status: "success",
      data,
    });
  } catch (e: any) {
    console.log(e);

    res.status(500).json({
      status: "error",
      message: "an error occurred",
    });
  }
};
