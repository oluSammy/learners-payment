import mongoose from "mongoose";

export interface ILearner extends mongoose.Document {
  login: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  learnerId: string;
}
