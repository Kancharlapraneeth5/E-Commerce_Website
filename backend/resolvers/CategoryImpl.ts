import { ApolloError } from "apollo-server-errors";
import { Document } from "mongoose";
import { Args, Context, Query } from "./Category";

export const Category = {
  // here the parent is the category object which has the id field
  products: async (
    { id }: { id: string },
    { filter }: Args,
    context: Context
  ): Promise<Document[]> => {
    // categoryId is the field in Query interface
    // id is the field in the object passed as the first argument { id }: { id: string }
    let query: Query = { categoryId: id };

    if (filter) {
      if (filter.onSale !== undefined) {
        query.onSale = filter.onSale;
      }
    }

    try {
      const filterCategoryProducts = await context.ProductModel.find(query);
      return filterCategoryProducts;
    } catch (err) {
      throw new ApolloError(
        "An error occurred while fetching the products",
        "Internal Server Error",
        { statusCode: 500 }
      );
    }
  },
};
