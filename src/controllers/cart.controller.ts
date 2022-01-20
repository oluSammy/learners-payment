import { Request, Response } from "express";
import Cart from "../models/cart.model";
import { validateAddToCart } from "../validation/validation";

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { error } = validateAddToCart(req.body);

    if (error) {
      return res.status(400).json({
        message: `${error.message}`,
      });
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
  } catch (e) {
    res.status(500).json({ message: "e.message" });
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
    res.status(500).json({ message: "e.message" });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    await Cart.deleteMany({ user: req.user!._id });

    res.status(200).json({
      message: "Successfully cleared from cart",
    });
  } catch (e) {
    res.status(500).json({ message: "e.message" });
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
    res.status(500).json({ message: "e.message" });
  }
};
