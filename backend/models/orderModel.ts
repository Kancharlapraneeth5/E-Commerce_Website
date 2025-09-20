import mongoose, { Document, Types } from "mongoose";

export interface IOrder extends Document {
  userId: Types.ObjectId;
  items: Array<{
    productId: Types.ObjectId;
    quantity: number;
    priceAtPurchase: number;
  }>;
  totalAmount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: Date;
}
