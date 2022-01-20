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
    unique: true,
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

const Cart = mongoose.model<ICart>("Cart", cartSchema);

export default Cart;
