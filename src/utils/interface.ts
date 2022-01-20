import mongoose from "mongoose";

export interface ICart {
  user: string;
  item: mongoose.Schema.Types.ObjectId;
  type: string;
}
