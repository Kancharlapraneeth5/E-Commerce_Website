import mongoose, { Schema } from "mongoose";
import { ICart } from "./cartModel";

const cartSchema = new Schema<ICart>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "People",
    required: [true, "User ID is required"],
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product ID is required"],
      },
      quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        min: [1, "Quantity must be at least 1"],
      },
    },
  ],
});

const Cart = mongoose.model<ICart>("Cart", cartSchema);

export default Cart;
