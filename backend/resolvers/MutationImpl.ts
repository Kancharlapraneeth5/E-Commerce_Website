import bcrypt from "bcryptjs";
import { ApolloError } from "apollo-server-errors";
import { v4 as uuid } from "uuid";
import mongoose from "mongoose";
import { ICart } from "../models/cartModel";
import { IProduct } from "../models/productModel";
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
  CartInput,
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

  // the below mutation is for adding a new user to the database
  // like a signup operation so don't need to check the role
  addNewUser: async (
    parent: any,
    { input }: { input: UserInput },
    context: Context
  ) => {
    const { username, password, role } = input;

    console.log("the input is.." + JSON.stringify(input));

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: uuid(),
      username,
      password: hashedPassword,
      role,
    };

    const existingUser = await context.PeopleModel.findOne({ username });
    console.log("existing user is.." + JSON.stringify(existingUser));
    try {
      if (existingUser) {
        console.log("Username must be unique");
        throw new ApolloError("Username must be unique", "Conflict", {
          statusCode: 409,
        });
      } else {
        await context.PeopleModel.create(newUser);
        return newUser;
      }
    } catch (err) {
      throw err;
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

  // addToCart(userId, productId, quantity)
  addToCart: async (
    parent: any,
    { input }: { input: CartInput },
    context: Context
  ) => {
    const { userId, items } = input;

    // Check if the user exists
    const user = await context.PeopleModel.findById(userId);

    // If the user token does not match the userId in the cart, throw an error (Forbiddeb)
    if (context.user._id.toString() !== userId.toString()) {
      throw new ApolloError("Permission Denied!", "Forbidden", {
        statusCode: 403,
      });
    }

    // If the user does not exist, throw an error
    if (!user) {
      throw new ApolloError("User not found", "Not Found", {
        statusCode: 404,
      });
    }

    // Check if the cart already exists for the user
    let cart = (await context.CartModel.findOne({ userId })) as ICart | null;

    // If the cart does not exist, create a new one
    if (!cart) {
      // Create a new cart if it doesn't exist
      const cartItem = {
        id: uuid(),
        userId,
        items,
      };
      // If not, create a new cart
      await new context.CartModel(cartItem).save();
      return cartItem;
    } else {
      // If it exists, update the items
      for (const item of items) {
        const existingItem = cart.items.find(
          (i) => i.productId === item.productId
        );
        if (existingItem) {
          // Check the available quantity in the product model
          const product = (await context.ProductModel.findById(
            item.productId
          )) as IProduct | null;
          // If the product does not exist, throw an error
          if (!product) {
            throw new ApolloError("Product not found", "Not Found", {
              statusCode: 404,
            });
          } else {
            // If the product exists, check if the requested quantity is available
            if (item.quantity > product.quantity) {
              throw new ApolloError(
                "Requested quantity exceeds available stock",
                "Bad Request",
                {
                  statusCode: 400,
                }
              );
            }
          }
          // If the item already exists in the cart, update the quantity
          existingItem.quantity += item.quantity;
          // Decrement the product quantity
          product.quantity -= item.quantity;
          // Save the updated product
          await product.save();
          // Ensure the quantity is also updated in the product model for the respective product
        } else {
          // If the item does not exist, add it to the cart
          cart.items.push(item);
        }
      }
      await cart.save();
    }
    // Save the cart
    return cart;
  },
};
