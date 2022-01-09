import { Request, Response } from "express";
import Learner from "../models/learner.model";
import axios from "axios";
import { generateHeader } from "../utils/generateHeader";
import { validateSignup } from "../validation/validation";

export const createLearner = async (req: Request, res: Response) => {
  const { error } = validateSignup(req.body);

  if (error) {
    return res.status(400).json({
      message: `${error.message}`,
    });
  }

  try {
    const prevLearner = await Learner.find({
      $or: [{ email: req.body.email }, { login: req.body.login }],
    });

    if (prevLearner.length > 0) {
      return res.status(400).json({
        message: `${req.body.email} or ${req.body.login} already exists`,
      });
    }

    // create learner on mission center
    const { data } = await axios({
      method: "post",
      url: `${process.env.MISSION_CENTER_BASE_URL}/learner`,
      headers: generateHeader(
        `${process.env.MISSION_CENTER_BASE_URL}/learner`,
        req.body
      ),
      data: req.body,
    });

    console.log(data.response);

    /**
     * login
        firstName
        lastName
        email
        password
        learnerId
     */

    // add learner to db
    const learner = await Learner.create({
      login: req.body.login,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      learnerId: data.response.learnerId,
    });

    res.status(201).json({
      message: "Learner created successfully",
      data: learner,
    });
  } catch (e: any) {
    if (e.response) {
      console.log(e.response.data);
      return res.status(400).json({
        message: e.response.data.msg || e.response.data.meta.msg,
      });
    }
    console.log(e);
    res.send("working!!!!!!!");
  }
};
