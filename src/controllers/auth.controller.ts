import { Request, Response } from "express";
import Learner from "../models/learner.model";
import axios from "axios";
import { generateHeader } from "../utils/generateHeader";
import {
  validateSignup,
  validateLogin,
  validateVerifyIdentityToken,
} from "../validation/validation";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateAppToken = (email: string): string => {
  const token = jwt.sign({ email }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES as string,
  });

  return token;
};

const generateAuthToken = async (learnerId: string) => {
  try {
    const { data } = await axios({
      method: "post",
      url: `${process.env.MISSION_CENTER_BASE_URL}/device/auth/token`,
      headers: generateHeader(
        `${process.env.MISSION_CENTER_BASE_URL}/device/auth/token`,
        {
          learnerId,
        }
      ),
      data: { learnerId },
    });

    return data.response;
  } catch (e: any) {
    console.log(e);

    throw new Error(e);
  }
};

const verifyAuthToken = async (learnerId: string, token: string) => {
  console.log({ learnerId, token }, "(**())");
  try {
    const { data } = await axios({
      method: "post",
      url: `${process.env.MISSION_CENTER_BASE_URL}/verifyIdentityToken`,
      headers: generateHeader(
        `${process.env.MISSION_CENTER_BASE_URL}/verifyIdentityToken`,
        {
          learnerId,
          token,
        }
      ),
      data: { learnerId, token },
    });

    console.log(data);

    return data;
  } catch (e: any) {
    console.log(e.response.data);

    throw new Error(e);
  }
};

const validatePassword = async (
  loginPass: string,
  dbPass: string
): Promise<boolean> => {
  return await bcrypt.compare(loginPass, dbPass);
};

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

    // add learner to db
    const learner = await Learner.create({
      login: req.body.login,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      learnerId: data.response.learnerId,
    });

    learner.password = "";

    const authToken = await generateAuthToken(learner.learnerId);
    const appToken = generateAppToken(req.body.email);

    res.status(201).json({
      message: "Learner created successfully",
      data: learner,
      token: { appToken, authToken },
    });
  } catch (e: any) {
    if (e.response) {
      console.log(e.response.data);
      return res.status(400).json({
        message: e.response.data.msg || e.response.data.meta.msg,
      });
    }

    return res.status(500).json({
      message: "an error occurred",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { error } = validateLogin(req.body);

    if (error) {
      return res.status(400).json({
        message: `${error.message}`,
      });
    }

    // user logs in with email
    const learner = await Learner.findOne({ email: req.body.email }).select(
      "+password"
    );

    if (
      !learner ||
      !(await validatePassword(req.body.password, learner.password))
    ) {
      return res.status(400).json({
        message: `invalid login credentials`,
      });
    }

    const authToken = await generateAuthToken(learner.learnerId);
    const appToken = generateAppToken(req.body.email);

    res.status(201).json({
      message: "login successful",
      data: learner,
      token: { appToken, authToken },
    });
  } catch (e) {
    return res.status(500).json({
      message: "an error occurred",
    });
  }
};

export const verifyIdentityToken = async (req: Request, res: Response) => {
  try {
    let token: string | undefined;

    const { error } = validateVerifyIdentityToken(req.body);

    if (error) {
      return res.status(400).json({
        message: `${error.message}`,
      });
    }

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "please provide a token",
      });
    }

    await verifyAuthToken(req.body.learnerId, token);

    // next();
  } catch (e) {
    // console.log(e);

    return res.status(500).json({
      message: "an error occurred",
    });
  }
};
