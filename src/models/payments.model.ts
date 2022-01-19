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
    },
    trainingId: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    paymentType: {
      type: String,
      enum: ["single", "module", "cart"],
      required: true,
    },
    flwRef: String,
    transactionID: String,
    moduleId: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    },
  },
  {
    timestamps: true,
  }
);

const Payments = mongoose.model("Payments", paymentSchema);

export default Payments;
