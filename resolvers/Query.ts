import { Document, Model } from "mongoose";

export interface Filter {
  // In TypeScript, the ? symbol is used to mark a property as optional.
  // By adding a ? after the property name, you're telling TypeScript that this property might not always be present.
  onSale?: boolean;
}

export interface Args {
  filter: Filter;
  productId: string;
  productName: string;
  categoryId: string;
  categoryName: string;
  reviewId: string;
  rating: number;
}

export interface Context {
  ProductModel: Model<Document>;
  CategoryModel: Model<Document>;
  ReviewModel: Model<Document>;
}

export interface IQuery {
  name: string;
}
