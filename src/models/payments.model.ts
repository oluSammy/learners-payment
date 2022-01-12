import mongoose from "mongoose";
import bcrypt from "bcryptjs";
// import { ILearner } from "../interfaces/interfaces";

// Define the schema for the learner model
const paymentSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    learnerId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "success", "failed"],
    },
    trainingId: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Payments = mongoose.model("Payments", paymentSchema);

export default Payments;
