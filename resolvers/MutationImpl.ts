import bcrypt from "bcryptjs";
import { ApolloError } from "apollo-server-errors";
import { v4 as uuid } from "uuid";
import mongoose from "mongoose";
import {
  CategoryInput,
  ProductInput,
  ProductInputs,
  ReviewInput,
  UserInput,
  updateCategoryInput,
  deleteCategoryQuery,
  Context,
  deleteProductQuery,
  deleteReviewQuery,
  MyError,
} from "./Mutation";

export const Mutation = {
  addNewCategory: async (
    parent: any,
    { input }: { input: CategoryInput },
    context: Context
  ) => {
    if (context.user.role === "admin") {
      const { name } = input;
      const newCategory = {
        id: uuid(),
        name,
      };

      try {
        await context.CategoryModel.create(newCategory);
        return newCategory;
      } catch (err) {
        if (
          (err as MyError).errmsg.includes("duplicate key error") &&
          (err as MyError).code === 11000
        ) {
          throw new ApolloError("Category name must be unique", "Conflict", {
            statusCode: 409,
          });
        }
        throw err;
      }
    } else {
      throw new ApolloError("Permission Denied!", "Forbidden", {
        statusCode: 403,
      });
    }
  },

  addNewProduct: async (
    parent: any,
    { input }: { input: ProductInput },
    context: Context
  ) => {
    if (context.user.role === "admin") {
      const { name, image, price, onSale, quantity, categoryId, description } =
        input;
      const newProduct = {
        id: uuid(),
        name,
        image,
        price,
        onSale,
        quantity,
        categoryId,
        description,
      };

      try {
        await context.ProductModel.create(newProduct);
        return newProduct;
      } catch (err) {
        if (
          (err as MyError).errmsg.includes("duplicate key error") &&
          (err as MyError).code === 11000
        ) {
          throw new ApolloError("Product name must be unique", "Conflict", {
            statusCode: 409,
          });
        }
        throw err;
      }
    } else {
      throw new ApolloError("Permission Denied!", "Forbidden", {
        statusCode: 403,
      });
    }
  },

  // (try altair to test this mutation)
  addNewProducts: async (
    parent: any,
    { input }: { input: ProductInputs },
    context: Context
  ) => {
    console.log("the input is.." + JSON.stringify(input.products));
    if (context.user.role === "admin") {
      const newProducts = input.products.map((productinput) => {
        const {
          name,
          image,
          price,
          onSale,
          quantity,
          categoryId,
          description,
        } = productinput;
        const newProduct = {
          id: uuid(),
          name,
          image,
          price,
          onSale,
          quantity,
          categoryId,
          description,
        };

        return newProduct;
      });

      context.ProductModel.create(newProducts);
      return newProducts;
    } else {
      throw new ApolloError("Permission Denied!", "Forbidden", {
        statusCode: 403,
      });
    }
  },

  addNewReview: async (
    parent: any,
    { input }: { input: ReviewInput },
    context: Context
  ) => {
    if (context.user.role === "admin") {
      const { date, title, comment, rating, productId } = input;
      const newReview = {
        id: uuid(),
        date,
        title,
        comment,
        rating,
        productId,
      };

      try {
        await context.ReviewModel.create(newReview);
        return newReview;
      } catch (err) {
        if (
          (err as MyError).errmsg.includes("duplicate key error") &&
          (err as MyError).code === 11000
        ) {
          throw new ApolloError("Review must be unique", "Conflict", {
            statusCode: 409,
          });
        }
        throw err;
      }
    } else {
      throw new ApolloError("Permission Denied!", "Forbidden", {
        statusCode: 403,
      });
    }
  },

  addNewUser: async (
    parent: any,
    { input }: { input: UserInput },
    context: Context
  ) => {
    if (context.user.role === "admin") {
      const { username, password, role } = input;

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = {
        id: uuid(),
        username,
        password: hashedPassword,
        role,
      };

      try {
        await context.PeopleModel.create(newUser);
        return newUser;
      } catch (err) {
        if (
          (err as MyError).errmsg.includes("duplicate key error") &&
          (err as MyError).code === 11000
        ) {
          throw new ApolloError("Username must be unique", "Conflict", {
            statusCode: 409,
          });
        }
        throw err;
      }
    } else {
      throw new ApolloError("Permission Denied!", "Forbidden", {
        statusCode: 403,
      });
    }
  },

  deleteCategory: async (
    parent: any,
    { categoryID }: { categoryID: string },
    context: Context
  ) => {
    if (context.user.role === "admin") {
      try {
        let query: deleteCategoryQuery = {
          // converting the string to ObjectId
          categoryId: new mongoose.Types.ObjectId(categoryID),
        };
        let updateOperation = { $set: { categoryId: null } };
        await context.CategoryModel.findByIdAndDelete(query.categoryId);
        await context.ProductModel.updateMany(query, updateOperation);
        return true;
      } catch (err) {
        throw new ApolloError(
          "An error occurred while deleting the category",
          "Internal Server Error",
          {
            statusCode: 500,
          }
        );
      }
    } else {
      throw new ApolloError("Permission Denied!", "Forbidden", {
        statusCode: 403,
      });
    }
  },

  deleteProduct: async (
    parent: any,
    { productID }: { productID: string },
    context: Context
  ) => {
    if (context.user.role === "admin") {
      try {
        let query: deleteProductQuery = {
          productId: new mongoose.Types.ObjectId(productID),
        };
        await context.ProductModel.findByIdAndDelete(query.productId);
        await context.ReviewModel.deleteMany(query);
        return true;
      } catch (err) {
        throw new ApolloError(
          "An error occurred while deleting the product",
          "Internal Server Error",
          {
            statusCode: 500,
          }
        );
      }
    } else {
      throw new ApolloError("Permission Denied!", "Forbidden", {
        statusCode: 403,
      });
    }
  },

  deleteReview: async (
    parent: any,
    { reviewID }: { reviewID: string },
    context: Context
  ) => {
    if (context.user.role === "admin") {
      try {
        await context.ReviewModel.findByIdAndDelete(reviewID);
        return true;
      } catch (err) {
        throw new ApolloError(
          "An error occurred while deleting the review",
          "Internal Server Error",
          {
            statusCode: 500,
          }
        );
      }
    } else {
      throw new ApolloError("Permission Denied!", "Forbidden", {
        statusCode: 403,
      });
    }
  },

  updateCategory: async (
    parent: any,
    { categoryID, input }: { categoryID: string; input: updateCategoryInput },
    context: Context
  ) => {
    if (context.user.role === "admin") {
      try {
        const updatedCategory = await context.CategoryModel.findByIdAndUpdate(
          categoryID,
          input,
          {
            // By default, MongoDB's findByIdAndUpdate operation returns the original document before it was updated.
            // If you set new: true, it will return the updated document.
            new: true,
          }
        );
        return updatedCategory;
      } catch (err) {
        throw new ApolloError(
          "An error occurred while updating the category",
          "Internal Server Error",
          {
            statusCode: 500,
          }
        );
      }
    } else {
      throw new ApolloError("Permission Denied!", "Forbidden", {
        statusCode: 403,
      });
    }
  },
};
