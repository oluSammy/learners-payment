import mongoose from "mongoose";
import { ICart } from "../utils/interface";

const cartSchema = new mongoose.Schema<ICart>({
  user: {
    type: String,
    required: true,
    ref: "Learner",
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "type",
  },
  type: {
    type: String,
    enum: ["CourseModule", "Course"],
    required: true,
  },
});

// cartSchema.pre<ICart>(/^find/, (next) => {
//   this.populate("item");

//   next();
// });

cartSchema.index({ user: 1, item: 1 }, { unique: true });

const Cart = mongoose.model<ICart>("Cart", cartSchema);

export default Cart;
