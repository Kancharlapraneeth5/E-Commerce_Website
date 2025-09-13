import { ApolloError } from "apollo-server-express";
import { Args, Context, IQueryName } from "./Query";
import { ICart } from "../models/cartModel";

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
    let query: IQueryName = { name: ProductName };

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
      let query: IQueryName = { name: categoryName };
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

  reviewsByProductId: async (
    parent: any,
    { productId }: any,
    context: Context
  ) => {
    try {
      const result = await context.ReviewModel.find({
        productId: productId,
      });
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
    { minRating, maxRating, categoryId }: Args,
    context: Context
  ): Promise<any> => {
    try {
      const reviews = await context.ReviewModel.find({
        rating: { $gte: minRating, $lte: maxRating },
      });
      console.log("reviews data", reviews);
      const productIDs = reviews.map((review) => review.get("productId"));
      console.log("productIDs data", productIDs);
      const products = await context.ProductModel.find({
        _id: { $in: productIDs },
        categoryId: categoryId,
      });
      console.log("products data", products);
      return products;
    } catch (err) {
      throw new ApolloError(
        "An error occurred while fetching the products",
        "Internal Server Error",
        { statusCode: 500 }
      );
    }
  },

  productsByCategory: async (
    parent: any,
    { categoryId }: Args,
    context: Context
  ): Promise<any> => {
    try {
      const products = await context.ProductModel.find({
        categoryId: categoryId,
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

  // Get cart for a specific user
  getCart: async (
    parent: any,
    { userId }: Args,
    context: Context
  ): Promise<ICart | null> => {
    try {
      // Input validation
      if (!userId) {
        throw new ApolloError("User ID is required", "Bad Request", {
          statusCode: 400,
        });
      }

      // Check permission - user can only access their own cart
      if (context.user._id.toString() !== userId.toString()) {
        throw new ApolloError("Permission Denied!", "Forbidden", {
          statusCode: 403,
        });
      }

      // Check if user exists
      const user = await context.PeopleModel.findById(userId);
      if (!user) {
        throw new ApolloError("User not found", "Not Found", {
          statusCode: 404,
        });
      }

      // Find the cart for the user
      const cart = (await context.CartModel.findOne({
        userId,
      })) as ICart | null;

      // If no cart exists, return null (or empty cart structure)
      if (!cart) {
        return null;
      }

      return cart;
    } catch (err) {
      // If it's already an ApolloError, re-throw it
      if (err instanceof ApolloError) {
        throw err;
      }

      // Handle any other errors
      throw new ApolloError(
        "An error occurred while fetching the cart",
        "Internal Server Error",
        { statusCode: 500 }
      );
    }
  },
};
