import mongoose, { Schema } from "mongoose";
import { ICategory } from "./categoryModel";

const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: [true, "Category name is required"],
    unique: true,
  },
});

const Category = mongoose.model<ICategory>("Category", categorySchema);

export default Category;
