import { Request, Response } from "express";
import Payments from "../models/payments.model";
import { validateInitPayment } from "../validation/validation";
import axios from "axios";

export const initPayment = async (req: Request, res: Response) => {
  /**
   * get trainingId, amount, name, email, redirectUrl, learnerId, trainingTitle, maybe training price
   * create new transaction doc
   * initiate payment with payment provider
   * send payment provider response to client
   */

  const { error } = validateInitPayment(req.body);

  if (error) {
    return res.status(400).json({
      message: `${error.message}`,
    });
  }

  try {
    const payment = await Payments.create({
      learnerId: req.body.learnerId,
      amount: req.body.amount,
      name: req.body.name,
      email: req.body.email,
      trainingTitle: req.body.trainingTitle,
      trainingId: req.body.trainingId,
      phoneNumber: req.body.phoneNumber,
    });

    const { data } = await axios({
      method: "post",
      url: "https://api.flutterwave.com/v3/payments",
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_PRIVATE_KEY}`,
      },
      data: {
        tx_ref: req.body.learnerId,
        amount: req.body.amount,
        payment_options: "card",
        currency: "NGN",
        redirect_url:
          "https://webhook.site/9d0b00ba-9a69-44fa-a43d-a82c33c36fdc",
        meta: {
          consumer_id: req.body.learnerId,
        },
        customer: {
          email: req.body.email,
          phonenumber: req.body.phoneNumber,
          name: req.body.name,
        },
        customizations: {
          title: req.body.trainingTitle,
          description: `payment for ${req.body.trainingTitle}`,
          logo: "https://assets.piedpiper.com/logo.png",
        },
      },
    });

    res.status(201).json({
      message: "Payment initiated successfully",
      data: payment,
      link: data.data.link,
    });
  } catch (e: any) {
    console.log(e.response.data);

    res.status(500).json({
      message: "an error occurred",
    });
  }
};
