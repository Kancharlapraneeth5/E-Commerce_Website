import { ApolloError } from "apollo-server-errors";
import { Args } from "./Category";
import { getProductsByCategory } from "../models/productModel";

export const Category = {
  products: async (
    { id }: { id: string },
    { filter }: Args
  ) => {
    try {
      return await getProductsByCategory(Number(id), filter);
    } catch (err) {
      throw new ApolloError("An error occurred while fetching the products", "Internal Server Error", { statusCode: 500 });
    }
  },
};
