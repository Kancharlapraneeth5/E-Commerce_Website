import mongoose, { Document } from "mongoose";

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  items: Array<{
    productId: mongoose.Types.ObjectId;
    quantity: number;
  }>;
}
