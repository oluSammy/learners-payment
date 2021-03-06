import { Request, Response } from "express";
import {
  validateCreateCourse,
  validateUpdateCourse,
} from "../validation/validation";
import Course from "../models/courses.model";

export const createCourse = async (req: Request, res: Response) => {
  const { error } = validateCreateCourse(req.body);

  if (error) {
    return res.status(400).json({
      message: `${error.message}`,
    });
  }

  try {
    const course = await Course.create(req.body);

    res.status(201).json({
      status: "success",
      data: course,
    });
  } catch (e: any) {
    console.log(e);

    res.status(500).json({
      message: "an error occurred",
    });
  }
};

export const getAllCourses = async (__: Request, res: Response) => {
  try {
    const courses = await Course.find();

    res.status(200).json({
      status: "success",
      data: courses,
    });
  } catch (e: any) {
    res.status(500).json({
      message: "an error occurred",
    });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  const { error } = validateUpdateCourse(req.body);

  if (error) {
    return res.status(400).json({
      message: `${error.message}`,
    });
  }

  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json({
      status: "success",
      data: course,
    });
  } catch (e: any) {
    res.status(500).json({
      message: "an error occurred",
    });
  }
};
