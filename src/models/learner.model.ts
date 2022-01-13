import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { ILearner } from "../interfaces/interfaces";

// Define the schema for the learner model
const learnerSchema = new mongoose.Schema({
  login: {
    type: String,
    unique: true,
  },
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  learnerId: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
});

// pre save middleware to hash password
learnerSchema.pre<ILearner>("save", async function (next) {
  if (!this.isModified) return next();

  this.password = await bcrypt.hash(this.password, 12);
  // // delete passwordConfirm field
  // this.passwordConfirm = undefined;

  next();
});

const Learner = mongoose.model<ILearner>("Learner", learnerSchema);

export default Learner;
