import { Request, Response } from "express";
import { validateCreateModule } from "../validation/validation";
import CourseModule from "../models/courseModule.model";

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

