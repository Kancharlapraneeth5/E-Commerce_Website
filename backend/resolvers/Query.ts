import { Document, Model } from "mongoose";

export interface filterProducts {
  // In TypeScript, the ? symbol is used to mark a property as optional.
  // By adding a ? after the property name, you're telling TypeScript that this property might not always be present.
  onSale?: boolean;
}

export interface Args {
  filter: filterProducts;
  productId: string;
  productName: string;
  categoryId: string;
  categoryName: string;
  reviewId: string;
  minRating: number;
  maxRating: number;
  userId: string;
}

export interface Context {
  ProductModel: Model<Document>;
  CategoryModel: Model<Document>;
  ReviewModel: Model<Document>;
  CartModel: Model<Document>;
  PeopleModel: Model<Document>;
  user: {
    _id: string;
    username: string;
    password: string;
    role: string;
    __v: number;
  };
}

export interface IQueryName {
  name: string;
}
