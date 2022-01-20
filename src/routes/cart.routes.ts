import { protectRoute } from "./../controllers/auth.controller";
import {
  addToCart,
  removeItemFromCart,
  clearCart,
  getCartOfAUser,
} from "./../controllers/cart.controller";
import express from "express";

const router = express.Router();

router.use(protectRoute);

router.post("/", addToCart);
router.get("/", getCartOfAUser);
router.delete("/", clearCart);
router.put("/:id", removeItemFromCart);

export default router;
