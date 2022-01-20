import { Request, Response } from "express";
import Cart from "../models/cart.model";
import Payments from "../models/payments.model";
import { validateAddToCart } from "../validation/validation";

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { error } = validateAddToCart(req.body);

    if (error) {
      return res.status(400).json({
        message: `${error.message}`,
      });
    }

    if (req.body.type === "course") {
      const hasPaid = await Payments.findOne({
        learnerId: req.user!.learnerId,
        status: "successful",
        moduleId: req.body.item,
      });

      if (hasPaid) {
        return res.status(400).json({
          message: `user has paid for the module`,
        });
      }
    } else {
      const hasPaid = await Payments.findOne({
        learnerId: req.user!.learnerId,
        trainingId: req.body.item,
        status: "successful",
      });

      if (hasPaid) {
        return res.status(400).json({
          message: `user has paid for the course`,
        });
      }
    }

    const cart = await Cart.create({
      ...req.body,
      user: req.user!._id,
      type: req.body.type === "course" ? "CourseModule" : "Course",
    });

    res.status(201).json({
      message: "Successfully added to cart",
      data: cart,
    });
  } catch (e: any) {
    console.log(e.code);
    if (e.code === 11000) {
      return res.status(400).json({
        message: "Item already in cart",
      });
    }
    res.status(500).json({ message: "an error occurred" });
  }
};

export const removeItemFromCart = async (req: Request, res: Response) => {
  try {
    const cartItem = await Cart.findByIdAndDelete(req.params.id);

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    res.status(201).json({
      message: "Successfully removed from cart",
    });
  } catch (e) {
    res.status(500).json({ message: "an error occurred" });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    await Cart.deleteMany({ user: req.user!._id });

    res.status(200).json({
      message: "Successfully cleared from cart",
    });
  } catch (e) {
    res.status(500).json({ message: "an error occurred" });
  }
};

export const getCartOfAUser = async (req: Request, res: Response) => {
  try {
    const cartItems = await Cart.find({ user: req.user!._id }).populate({
      path: "item",
    });

    res.status(200).json({
      message: "Successfully fetched cart",
      data: cartItems,
    });
  } catch (e) {
    res.status(500).json({ message: "an error occurred" });
  }
};
