import { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  quantity: number;
  price: number;
  image: string;
  onSale: boolean;
  categoryId: Schema.Types.ObjectId;
}
