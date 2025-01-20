import { ApolloError } from "apollo-server-errors";
import { Document } from "mongoose";
import { Query, Context } from "./Product";

// In the below two methods we are using two different promises to fetch the category and reviews of a product because
// In category method we are using findById method which returns a single document and in reviews method we are using
// find method which returns an array of documents.

// 1) Promise<Document | null>
// 2) Promise<Document[]>

export const Product = {
  category: async (
    // here the parent is the product object which has the categoryId field
    { categoryId }: { categoryId: string },
    args: any,
    context: Context
  ): Promise<Document | null> => {
    try {
      const Category = await context.CategoryModel.findById(categoryId);
      return Category;
    } catch (err) {
      throw new ApolloError(
        "An error occurred while fetching the category",
        "Internal Server Error",
        { statusCode: 500 }
      );
    }
  },

  reviews: async (
    // here the parent is the product object which has the productId field
    { id }: { id: string },
    args: any,
    context: Context
  ): Promise<Document[]> => {
    try {
      let query: Query = { productId: id };
      const reviews = await context.ReviewModel.find(query);
      return reviews;
    } catch (err) {
      throw new ApolloError(
        "An error occurred while fetching the reviews",
        "Internal Server Error",
        { statusCode: 500 }
      );
    }
  },
};
