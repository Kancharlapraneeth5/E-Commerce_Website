import { Document, Model } from "mongoose";

// CategoryModel: This property is expected to be of type Model<Document>.
// Model<Document> is a type provided by Mongoose, a popular MongoDB object modeling tool designed to work in an
// asynchronous environment. Model<Document> represents a MongoDB model, which is a constructor function that creates
// and reads documents from the underlying MongoDB database
export interface Context {
  CategoryModel: Model<Document>;
  ReviewModel: Model<Document>;
}

export interface Query {
  productId: string;
}
