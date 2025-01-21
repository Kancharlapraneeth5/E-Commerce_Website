import { Document, Schema } from "mongoose";

export interface IReview extends Document {
  date: Date;
  title: string;
  comment: string;
  rating: number;
  productId: Schema.Types.ObjectId;
}
