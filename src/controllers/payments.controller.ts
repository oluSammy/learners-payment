import { Request, Response } from "express";
import Payments from "../models/payments.model";
import {
  validateMultipleInitPayment,
  validateSingleInitPayment,
  validateCartPayment,
} from "../validation/validation";
import axios from "axios";
import Course from "../models/courses.model";
import CourseModule from "../models/courseModule.model";

export const initPayment = async (req: Request, res: Response) => {
  // verify req body
  const { error } = validateSingleInitPayment(req.body);

  if (error) {
    return res.status(400).json({
      message: `${error.message}`,
    });
  }

  // check if user has already paid for a course
  const hasPaid = await Payments.findOne({
    learnerId: req.user!.learnerId,
    trainingId: req.body.trainingId,
    status: "successful",
  });

  if (hasPaid) {
    return res.status(400).json({
      message: `user has paid for the course`,
    });
  }

  // check if training exists
  const training = await Course.findById(req.body.trainingId);

  if (!training) {
    return res.status(404).json({
      message: `Training not found`,
    });
  }

  try {
    // create payment in DB, status - pending
    const payment = await Payments.create({
      learnerId: req.user!.learnerId,
      amount: training.amount, //
      name: req.user!.login,
      email: req.user!.email,
      trainingTitle: training.title,
      trainingId: [req.body.trainingId],
      phoneNumber: req.user!.phoneNumber,
      paymentType: "single",
    });

    // initialize payment in flutterwave
    const { data } = await axios({
      method: "post",
      url: "https://api.flutterwave.com/v3/payments",
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_PRIVATE_KEY}`,
      },
      data: {
        tx_ref: payment._id,
        amount: training.amount,
        payment_options: "card",
        currency: "NGN",
        redirect_url: req.body.frontendRedirectUrl,
        meta: {
          consumer_id: req.user!.learnerId,
        },
        customer: {
          email: req.user!.email,
          phonenumber: req.user!.phoneNumber,
          name: req.user!.login,
        },
        customizations: {
          title: training.title,
          description: `payment for ${training.title}`,
        },
      },
    });

    // send payment link to client
    res.status(201).json({
      message: "Payment initiated successfully",
      data: payment,
      link: data.data.link,
    });
  } catch (e: any) {
    console.log(e.response.data);
    // console.log(e);

    res.status(500).json({
      message: "an error occurred",
    });
  }
};

export const initModulePayment = async (req: Request, res: Response) => {
  // verify req body
  const { error } = validateMultipleInitPayment(req.body);

  if (error) {
    return res.status(400).json({
      message: `${error.message}`,
    });
  }

  // check if user has already paid for a module
  const hasPaid = await Payments.findOne({
    learnerId: req.user!.learnerId,
    status: "successful",
    moduleId: req.body.moduleId,
  });

  // console.log(req.body.moduleId, req.user!.learnerId);

  // console.log(hasPaid);

  if (hasPaid) {
    return res.status(400).json({
      message: `user has paid for the module`,
    });
  }
  // check if training exists
  const module = await CourseModule.findById(req.body.moduleId);

  if (!module) {
    return res.status(404).json({
      message: `module not found`,
    });
  }

  // get all trainings in module
  const trainings = await Course.find({ moduleId: req.body.moduleId });

  if (!trainings.length) {
    return res.status(404).json({
      message: "this module has no course",
    });
  }

  const courseIds = trainings.map((course) => course._id);

  try {
    const payment = await Payments.create({
      learnerId: req.user!.learnerId,
      amount: module.amount,
      name: req.user!.login,
      email: req.user!.email,
      trainingTitle: module.title,
      trainingId: courseIds,
      phoneNumber: req.user!.phoneNumber,
      paymentType: "module",
      moduleId: [module.id],
    });

    // initialize payment in flutterwave
    const { data } = await axios({
      method: "post",
      url: "https://api.flutterwave.com/v3/payments",
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_PRIVATE_KEY}`,
      },
      data: {
        tx_ref: payment._id,
        amount: module.amount,
        payment_options: "card",
        currency: "NGN",
        redirect_url: req.body.frontendRedirectUrl,
        meta: {
          consumer_id: req.user!.learnerId,
        },
        customer: {
          email: req.user!.email,
          phonenumber: req.user!.phoneNumber,
          name: req.user!.login,
        },
        customizations: {
          title: module.title,
          description: `payment for ${module.title}`,
        },
      },
    });

    // send payment link to client
    res.status(201).json({
      message: "Payment initiated successfully",
      data: payment,
      link: data.data.link,
    });
  } catch (e: any) {
    console.log(e.response.data);
    // console.log(e);

    res.status(500).json({
      message: "an error occurred",
    });
  }
};

export const initCartPayment = async (req: Request, res: Response) => {
  try {
    // validate req body
    const { error } = validateCartPayment(req.body);

    if (error) {
      return res.status(400).json({
        message: `${error.message}`,
      });
    }

    let total = 0;
    let trainingIds: any = [];

    // check if user has paid for the module
    if (req.body.moduleIds) {
      const hasPaid = await Payments.findOne({
        learnerId: req.user!.learnerId,
        status: "successful",
        moduleId: req.body.moduleIds,
      });

      if (hasPaid) {
        return res.status(400).json({
          status: "error",
          message: "user has already paid for this module",
          data: hasPaid,
        });
      }

      const allModules = await CourseModule.find({
        _id: {
          $in: req.body.moduleIds,
        },
      });

      total += allModules.reduce((prev, curr) => {
        return prev + curr.amount;
      }, 0);

      const courses = await Course.find({
        moduleId: {
          $in: req.body.moduleIds,
        },
      });

      courses.forEach((course: any) => {
        trainingIds.push(course._id.toString());
      });
    }

    // check if user has paid for the course
    if (req.body.singleCourseIds) {
      const hasPaid = await Payments.findOne({
        learnerId: req.user!.learnerId,
        status: "successful",
        trainingId: {
          $all: req.body.singleCourseIds,
        },
      });

      if (hasPaid) {
        return res.status(400).json({
          status: "error",
          message: "user has already paid for this course",
          data: hasPaid,
        });
      }

      // get all courses in training ids to determine total price
      // const singleCoursesTotal =
      const courses = await Course.find({
        _id: {
          $in: req.body.singleCourseIds,
        },
      });

      total += courses.reduce((prev, curr) => {
        return prev + curr.amount;
      }, 0);

      trainingIds = [...trainingIds, ...req.body.singleCourseIds];
    }

    const payment = await Payments.create({
      learnerId: req.user!.learnerId,
      amount: total,
      name: req.user!.login,
      email: req.user!.email,
      trainingTitle: "trainingIds",
      trainingId: trainingIds,
      phoneNumber: req.user!.phoneNumber,
      paymentType: "cart",
      moduleId: req.body.moduleIds,
    });

    // initialize payment in flutterwave
    const { data } = await axios({
      method: "post",
      url: "https://api.flutterwave.com/v3/payments",
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_PRIVATE_KEY}`,
      },
      data: {
        tx_ref: payment._id,
        amount: total,
        payment_options: "card",
        currency: "NGN",
        redirect_url: req.body.frontendRedirectUrl,
        meta: {
          consumer_id: req.user!.learnerId,
        },
        customer: {
          email: req.user!.email,
          phonenumber: req.user!.phoneNumber,
          name: req.user!.login,
        },
        customizations: {
          title: "module.title",
          description: `payment for cart`,
        },
      },
    });

    res.status(200).json({
      message: "looking good",
      data: payment,
      link: data.data.link,
    });
  } catch (e: any) {
    console.log(e);
    res.status(500).json({
      message: "an error occurred",
    });
  }
};

// web hook to confirm payment and update database
export const flutterHook = async (req: Request, res: Response) => {
  // retrieve the signature from the header
  const hash = req.headers["verif-hash"];

  console.log(req.body);

  if (!hash) {
    // discard the request,only a post with the right Flutterwave signature header gets our attention
    res.status(400).end();
  } else {
    // Get signature stored as env variable on your server
    const secret_hash = process.env.MY_HASH as string;

    if (hash !== secret_hash) {
      // silently exit, or check that you are passing the right hash on your server.
      res.status(400).end();
    } else {
      res.status(200).end();

      await Payments.findByIdAndUpdate(req.body.txRef, {
        flwRef: req.body.flwRef,
        status: req.body.status,
        transactionID: req.body.id,
      });

      console.log("update mission centre");
      // update learner status

      // txRef, flwRef, amount, status,
      // update mission centre as course purchased
    }
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { data } = await axios({
      method: "get",
      url: `https://api.flutterwave.com/v3/transactions/${req.params.id}/verify`,
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_PRIVATE_KEY}`,
      },
    });

    const payment = await Payments.findByIdAndUpdate(
      data.data.tx_ref,
      {
        flwRef: data.data.tx_ref,
        status: req.body.flw_ref,
        transactionID: req.body.id,
      },
      { new: true }
    );

    res.status(200).json({
      message: "ok",
      data: payment,
    });

    // console.log(data);
  } catch (e: any) {
    console.log(e);

    if (e.response) {
      if (e.response.data.message === "No transaction was found for this id") {
        return res.status(400).json({
          status: "error",
          message: "No transaction was found for this id",
        });
      }
    }

    res.status(500).json({
      message: "an error occurred",
    });
  }
};

export const getUserTrainings = async (req: Request, res: Response) => {
  try {
    const payments = await Payments.find({
      learnerId: req.user!.learnerId,
      status: "successful",
    }).select("-learnerId -name -phoneNumber -createdAt -flwRef -__v");

    res.status(200).json({
      status: "success",
      data: payments,
    });
  } catch (e) {
    res.status(500).json({
      message: "an error occurred",
    });
  }
};
