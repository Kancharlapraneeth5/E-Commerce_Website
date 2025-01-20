import mongoose, { Schema } from "mongoose";
import { IProduct } from "./productModel";

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, "Product name is required"],
  },
  description: {
    type: String,
    required: [true, "Product description is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Product quantity is required"],
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
  },
  image: {
    type: String,
    required: [true, "Product image is required"],
  },
  onSale: {
    type: Boolean,
    required: [true, "Product onSale is required"],
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Product category is required"],
  },
});

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;
