import { Document, Model } from "mongoose";

export interface Filter {
  // In TypeScript, the ? symbol is used to mark a property as optional.
  // By adding a ? after the property name, you're telling TypeScript that this property might not always be present.
  onSale?: boolean;
}

// ProductModel: This property is expected to be of type Model<Document>.
// Model<Document> is a type provided by Mongoose, a popular MongoDB object modeling tool designed to work in an
// asynchronous environment. Model<Document> represents a MongoDB model, which is a constructor function that creates
// and reads documents from the underlying MongoDB database
export interface Context {
  ProductModel: Model<Document>;
}

export interface Args {
  filter: Filter;
}

export interface Query {
  categoryId: string;
  onSale?: boolean;
}
