import mongoose, { Document, Types } from "mongoose";

export interface ICart extends Document {
  userId: Types.ObjectId;
  items: Array<{
    productId: Types.ObjectId;
    quantity: number;
  }>;
}
