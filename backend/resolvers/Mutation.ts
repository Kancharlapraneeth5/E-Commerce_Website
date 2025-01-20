import { Document, Model } from "mongoose";
import { Types } from "mongoose";

export interface CategoryInput {
  name: string;
}

export interface ProductInput {
  name: string;
  image: string;
  price: number;
  onSale: boolean;
  quantity: number;
  categoryId: string;
  description: string;
}

export interface ProductInputs {
  products: ProductInput[];
}

export interface ReviewInput {
  date: Date;
  title: string;
  comment: string;
  rating: number;
  productId: string;
}

export interface UserInput {
  username: string;
  password: string;
  role: string;
}

export interface deleteCategoryQuery {
  categoryId: Types.ObjectId;
}

export interface deleteProductQuery {
  productId: Types.ObjectId;
}

export interface deleteReviewQuery {
  reviewId: Types.ObjectId;
}

export interface updateCategoryInput {
  categoryName: string;
}

export interface Context {
  user: { role: string };
  CategoryModel: Model<Document>;
  ProductModel: Model<Document>;
  ReviewModel: Model<Document>;
  PeopleModel: Model<Document>;
}

export interface MyError {
  errmsg: string;
  code: number;
}
