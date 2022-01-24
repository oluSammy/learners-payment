import { Request, Response, NextFunction } from "express";
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

// const generateAuthToken = async (learnerId: string) => {
//   try {
//     const { data } = await axios({
//       method: "post",
//       url: `${process.env.MISSION_CENTER_BASE_URL}/device/auth/token`,
//       headers: generateHeader(
//         `${process.env.MISSION_CENTER_BASE_URL}/device/auth/token`,
//         {
//           learnerId,
//         }
//       ),
//       data: { learnerId },
//     });

//     return data.response;
//   } catch (e: any) {
//     console.log(e);

//     throw new Error(e);
//   }
// };

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: "unauthorized",
        message: `please login to access this resource`,
      });
    }

    const decodedToken: any = jwt.verify(
      token as string,
      process.env.JWT_SECRET as string
    );

    if (!decodedToken) {
      return res.status(404).json({
        status: "unauthorized",
        message: `user no longer exists`,
      });
    }

    const user = await Learner.findOne({ email: decodedToken.email });

    if (!user) {
      return res.status(404).json({
        status: "unauthorized",
        message: `user no longer exists`,
      });
    }

    req.user = user;

    next();
  } catch (e: any) {
    console.log(e.message);

    if (e.message === "jwt expired") {
      return res.status(500).json({
        status: "error",
        message: "token expired",
      });
    }

    return res.status(500).json({
      status: "error",
      message: "an error occurred",
    });
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
        },
        "post"
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
        req.body,
        "post"
      ),
      data: req.body,
    });

    // add learner to db
    const learner = await Learner.create({
      login: req.body.login,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
      learnerId: data.response.learnerId,
      phoneNumber: req.body.phoneNumber,
    });

    learner.password = "";

    // const authToken = await generateAuthToken(learner.learnerId);
    const token = generateAppToken(req.body.email);

    res.status(201).json({
      message: "Learner created successfully",
      data: learner,
      token,
    });
  } catch (e: any) {
    if (e.response) {
      console.log(e.response.data);
      return res.status(400).json({
        message: e.response.data.msg || e.response.data.meta.msg,
      });
    }

    console.log(e);

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

    const { data } = await axios({
      method: "GET",
      url: `${process.env.MISSION_CENTER_BASE_URL}/learner/${learner.learnerId}`,
      headers: generateHeader(
        `${process.env.MISSION_CENTER_BASE_URL}/learner/${learner.learnerId}`,
        "",
        "get"
      ),
    });

    console.log("data", data);

    // const authToken = await generateAuthToken(learner.learnerId);
    const token = generateAppToken(req.body.email);

    res.status(201).json({
      message: "login successful",
      data: learner,
      token,
    });
  } catch (e: any) {
    console.log(e.response.data);

    if (
      e.response &&
      e.response.data &&
      e.response.data.meta.msg === "LEARNER_NOT_FOUND"
    ) {
      return res.status(400).json({
        message: "learner no longer exist",
      });
    }

    // console.log(e);

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
