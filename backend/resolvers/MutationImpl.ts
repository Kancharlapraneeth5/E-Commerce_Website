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
  addToCartInput,
  removeFromCartInput,
  updateCartInput,
  Order,
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
    _parent: any,
    { input }: { input: addToCartInput },
    context: Context
  ) => {
    const { userId, items } = input;

    if (!userId) {
      throw new ApolloError("UserId is required", "Bad Request", {
        statusCode: 400,
      });
    }

    // HANDLE THE USERID VALIDATION GENERIC CASES IN THE API GATE WAY

    if (items.length === 0) {
      throw new ApolloError("Items array cannot be empty", "Bad Request", {
        statusCode: 400,
      });
    }

    // Check if user exists
    const user = await context.PeopleModel.findById(userId);
    if (!user) {
      throw new ApolloError("User not found", "Not Found", {
        statusCode: 404,
      });
    }

    // Check permission
    if (context.user._id.toString() !== userId.toString()) {
      throw new ApolloError("Permission Denied!", "Forbidden", {
        statusCode: 403,
      });
    }

    // Utility: Validate and decrement product stock
    const validateAndDecrementProduct = async (
      productId: string,
      quantity: number
    ) => {
      const product = (await context.ProductModel.findById(
        productId
      )) as IProduct | null;
      if (!product) {
        throw new ApolloError("Product not found", "Not Found", {
          statusCode: 404,
        });
      }
      if (quantity > product.quantity) {
        throw new ApolloError(
          "Requested quantity exceeds available stock",
          "Bad Request",
          {
            statusCode: 400,
          }
        );
      }
      product.quantity -= quantity;
      await product.save();
    };

    // Check if cart exists
    let cart = (await context.CartModel.findOne({ userId })) as ICart | null;

    // IF CART DOESN'T EXIST FOR THE USER, CREATE A NEW ONE
    if (!cart) {
      // New cart case
      // UPDATE THE QUANTITY IN THE PRODUCTS COLLECTION FOR EACH ITEM
      for (const item of items) {
        await validateAndDecrementProduct(
          item.productId.toString(),
          item.quantity
        );
      }

      // CREATE A NEW CART OBJECT AND SAVE IT TO THE DATABASE
      const newCart = new context.CartModel({
        id: uuid(),
        userId,
        items,
      });

      await newCart.save();
      return newCart;
    }

    // CART EXISTS, UPDATE IT
    // Update existing cart case
    // UPDATE THE QUANTITY IN THE PRODUCTS COLLECTION FOR EACH ITEM
    for (const item of items) {
      const existingItem = cart.items.find(
        (i) => i.productId.toString() === item.productId.toString()
      );

      // UPDATE THE PRODUCT QUANTITY IN THE PRODUCTS COLLECTION
      await validateAndDecrementProduct(
        item.productId.toString(),
        item.quantity
      );

      // IF ITEM ALREADY EXISTS IN CART, INCREMENT THE QUANTITY
      if (existingItem) {
        existingItem.quantity += item.quantity;
      }
      // ELSE, ADD THE NEW ITEM TO THE CART
      else {
        cart.items.push(item);
      }
    }

    await cart.save();
    return cart;
  },

  // Remove item from cart
  removeFromCart: async (
    _parent: any,
    { input }: { input: removeFromCartInput },
    context: Context
  ) => {
    const { userId, productId } = input;

    if (!userId || !productId) {
      throw new ApolloError(
        "UserId and ProductId are required",
        "Bad Request",
        {
          statusCode: 400,
        }
      );
    }

    // HANDLE THE USERID/PRODUCTID VALIDATION GENERIC CASES IN THE API GATE WAY

    // Check if user exists
    const user = await context.PeopleModel.findById(userId);
    if (!user) {
      throw new ApolloError("User not found", "Not Found", {
        statusCode: 404,
      });
    }

    // Check permission
    if (context.user._id.toString() !== userId.toString()) {
      throw new ApolloError("Permission Denied!", "Forbidden", {
        statusCode: 403,
      });
    }

    // Check if cart exists
    const cart = (await context.CartModel.findOne({ userId })) as ICart | null;
    if (!cart) {
      throw new ApolloError("Cart not found", "Not Found", {
        statusCode: 404,
      });
    }

    // Find the item in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );
    if (itemIndex === -1) {
      throw new ApolloError("Item not found in cart", "Not Found", {
        statusCode: 404,
      });
    }

    // Remove the item from the cart
    // What is this splice method?
    // array.splice(startIndex, deleteCount)
    // This method deletes the items starting from startIndex and deletes deleteCount number of items

    // EXAMPLE TO UNDERSTAND SPLICE:
    // const arr = [10, 20, 30, 40, 50];
    // arr.splice(1, 2);  // removes 2 elements: index 1 (20) and index 2 (30)
    // console.log(arr);  // [10, 40, 50]
    cart.items.splice(itemIndex, 1);
    await cart.save();
    return true;
  },

  // Update cart item quantity
  updateCart: async (
    _parent: any,
    { input }: { input: updateCartInput },
    context: Context
  ) => {
    const { userId, productId, quantity } = input;
    // Input validation
    if (!userId || !productId || quantity < 0) {
      throw new ApolloError("Invalid input parameters", "Bad Request", {
        statusCode: 400,
      });
    }

    // HANDLE THE USERID/PRODUCTID VALIDATION GENERIC CASES IN THE API GATE WAY

    // Check if user exists
    const user = await context.PeopleModel.findById(userId);
    if (!user) {
      throw new ApolloError("User not found", "Not Found", {
        statusCode: 404,
      });
    }

    // Check permission - user can only update their own cart
    if (context.user._id.toString() !== userId.toString()) {
      throw new ApolloError("Permission Denied!", "Forbidden", {
        statusCode: 403,
      });
    }

    // Check if product exists
    const product = (await context.ProductModel.findById(
      productId
    )) as IProduct | null;
    if (!product) {
      throw new ApolloError("Product not found", "Not Found", {
        statusCode: 404,
      });
    }

    // Check if cart exists
    let cart = (await context.CartModel.findOne({ userId })) as ICart | null;
    if (!cart) {
      throw new ApolloError("Cart not found", "Not Found", {
        statusCode: 404,
      });
    }

    // Find the item in the cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    if (existingItemIndex === -1) {
      throw new ApolloError("Item not found in cart", "Not Found", {
        statusCode: 404,
      });
    }

    const existingItem = cart.items[existingItemIndex];
    const currentQuantityInCart = existingItem.quantity;

    // Handle quantity = 0 (remove item from cart)
    if (quantity === 0) {
      // Restore the quantity back to product inventory
      product.quantity += currentQuantityInCart;
      await product.save();

      // Remove item from cart
      cart.items.splice(existingItemIndex, 1);
      await cart.save();

      return cart;
    }

    // Calculate quantity difference
    const quantityDifference = quantity - currentQuantityInCart;

    // If increasing quantity, check if enough stock is available
    if (quantityDifference > 0) {
      if (quantityDifference > product.quantity) {
        throw new ApolloError(
          `Insufficient stock. Only ${product.quantity} items available to add.`,
          "Bad Request",
          {
            statusCode: 400,
          }
        );
      }
      // Decrease product inventory
      product.quantity -= quantityDifference;
    }
    // If decreasing quantity, restore stock to product inventory
    else if (quantityDifference < 0) {
      product.quantity += Math.abs(quantityDifference);
    }

    // Update the cart item quantity
    existingItem.quantity = quantity;

    // Save both product and cart
    await product.save();
    await cart.save();

    return cart;
  },

  placeOrder: async (
    _parent: any,
    { userId }: { userId: string },
    context: Context
  ) => {
    if (!userId) {
      throw new ApolloError("UserId is required", "Bad Request", {
        statusCode: 400,
      });
    }

    // Check if user exists
    const user = await context.PeopleModel.findById(userId);
    if (!user) {
      throw new ApolloError("User not found", "Not Found", {
        statusCode: 404,
      });
    }

    // Check if cart exists
    const cart = (await context.CartModel.findOne({ userId })) as ICart | null;
    if (!cart) {
      throw new ApolloError("Cart not found", "Not Found", {
        statusCode: 404,
      });
    }

    const orderItems = [];

    // Create order
    let totalAmount = 0;
    for (const item of cart.items) {
      const product = (await context.ProductModel.findById(
        item.productId
      )) as IProduct | null;

      if (!product) {
        throw new ApolloError("Product not found", "Not Found", {
          statusCode: 404,
        });
      }

      const priceAtPurchase = product.price;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase,
      });

      totalAmount += priceAtPurchase * item.quantity;
    }

    // Save order
    const order = new context.OrderModel({
      userId,
      items: orderItems,
      totalAmount,
      status: "pending",
      createdAt: new Date(),
    });

    // Save the order to the database
    await order.save();

    // Clear cart
    cart.items = [];
    await cart.save();

    return order;
  },
};
