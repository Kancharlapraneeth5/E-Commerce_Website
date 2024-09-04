import { ApolloError } from "apollo-server-express";
import { Args, Context, IQuery } from "./Query";

export const Query = {
  // In Apollo Server, each field in your schema has a corresponding resolver function.
  // A resolver function is responsible for fetching the data for its field. The resolver function takes
  // four positional arguments:

  // parent-> This is the result returned from the resolver for the parent field.
  // For a root field (a field on the Query, Mutation, or Subscription type), parent is undefined.

  // args-> This is an object that contains all GraphQL arguments provided for the field. For example,
  // if the field was called with myField(arg1: "value"), the args object is { arg1: "value" }.

  // context-> This is an object shared by all resolvers in a particular query.
  // It's used to store per-request state, including authentication information, dataloader instances,
  // and anything else that should be taken into account when resolving the query

  // info-> his argument contains information about the execution state of the query.
  // It includes the field name, path to the field from the root, and more. It's mostly used in advanced cases,
  // like schema stitching

  // THE ORDER OF THE PARAMETERS IN THE RESOLVER FUNCTION IS VERY IMPORTANT!!!!!!

  // THE ORDER IS parent, args, context, info

  products: async (parent: any, { filter }: Args, context: Context) => {
    let filterProducts: any;

    try {
      if (filter) {
        if (filter.onSale === true) {
          console.log("I am in true...");
          filterProducts = await context.ProductModel.find(filter);
        } else if (filter.onSale === false) {
          filterProducts = await context.ProductModel.find(filter);
        }
      } else {
        filterProducts = await context.ProductModel.find();
      }
      return filterProducts;
    } catch (err) {
      throw new ApolloError(
        "An error occurred while fetching the products",
        "Internal Server Error",
        {
          statusCode: 500,
        }
      );
    }
  },

  product: async (parent: any, args: Args, context: Context) => {
    const { productId } = args;
    try {
      const result = await context.ProductModel.findById(productId);
      return result;
    } catch (err) {
      throw new ApolloError(
        "An error occurred while fetching the product",
        "Internal Server Error",
        {
          statusCode: 500,
        }
      );
    }
  },

  productByName: async (
    parent: any,
    { productName }: Args,
    context: Context
  ) => {
    const ProductName = productName;
    let query: IQuery = { name: ProductName };

    try {
      const result = await context.ProductModel.findOne(query);
      return result;
    } catch (err) {
      throw new ApolloError(
        "An error occurred while fetching the product by name",
        "Internal Server Error",
        {
          statusCode: 500,
        }
      );
    }
  },

  categories: async (parent: any, args: any, context: Context) => {
    try {
      const result = await context.CategoryModel.find();
      return result;
    } catch (err) {
      throw new ApolloError(
        "An error occurred while fetching the categories",
        "Internal Server Error",
        {
          statusCode: 500,
        }
      );
    }
  },

  category: async (parent: any, { categoryId }: Args, context: Context) => {
    try {
      const result = await context.CategoryModel.findById(categoryId);
      return result;
    } catch (err) {
      throw new ApolloError(
        "An error occurred while fetching the category",
        "Internal Server Error",
        {
          statusCode: 500,
        }
      );
    }
  },

  categoryByName: async (
    parent: any,
    { categoryName }: Args,
    context: Context
  ) => {
    try {
      let query: IQuery = { name: categoryName };
      const result = await context.CategoryModel.findOne(query);
      return result;
    } catch (err) {
      throw new ApolloError(
        "An error occurred while fetching the category by name",
        "Internal Server Error",
        {
          statusCode: 500,
        }
      );
    }
  },

  reviews: async (parent: any, args: any, context: Context) => {
    try {
      const result = await context.ReviewModel.find();
      console.log(result);
      return result;
    } catch (err) {
      throw new ApolloError(
        "An error occurred while fetching the categories",
        "Internal Server Error",
        {
          statusCode: 500,
        }
      );
    }
  },

  review: async (parent: any, { reviewId }: Args, context: Context) => {
    try {
      console.log("the reviewId is.." + reviewId);
      const result = await context.ReviewModel.findById(reviewId);
      console.log("the result is.." + result);
      return result;
    } catch (err) {
      throw new ApolloError(
        "An error occurred while fetching the review",
        "Internal Server Error",
        {
          statusCode: 500,
        }
      );
    }
  },

  productsByReviewRating: async (
    parent: any,
    { rating }: Args,
    context: Context
  ): Promise<any> => {
    try {
      const reviews = await context.ReviewModel.find({ rating: rating });
      const productIDs = reviews.map((review) => review.get("productId"));
      const products = await context.ProductModel.find({
        _id: { $in: productIDs },
      });
      return products;
    } catch (err) {
      throw new ApolloError(
        "An error occurred while fetching the products",
        "Internal Server Error",
        { statusCode: 500 }
      );
    }
  },
};
