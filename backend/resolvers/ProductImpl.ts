import { ApolloError } from "apollo-server-errors";
import { getCategoryById } from "../models/categoryModel";
import { getReviewsByProductId } from "../models/reviewModel";

export const Product = {
  category: async (
    { categoryId }: { categoryId: string },
    _args: any
  ) => {
    try {
      return await getCategoryById(Number(categoryId));
    } catch (err) {
      throw new ApolloError("An error occurred while fetching the category", "Internal Server Error", { statusCode: 500 });
    }
  },
  reviews: async (
    { id }: { id: string },
    _args: any
  ) => {
    try {
      return await getReviewsByProductId(Number(id));
    } catch (err) {
      throw new ApolloError("An error occurred while fetching the reviews", "Internal Server Error", { statusCode: 500 });
    }
  },
};
