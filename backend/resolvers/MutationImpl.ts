import { ApolloError } from "apollo-server-errors";
import bcrypt from "bcryptjs";
import {
  CategoryInput,
  ProductInput,
  ProductInputs,
  ReviewInput,
  UserInput,
  updateCategoryInput,
  deleteCategoryQuery,
  deleteProductQuery,
  deleteReviewQuery,
  Context,
  addToCartInput,
  removeFromCartInput,
  updateCartInput,
} from "./Mutation";
import { getCategoryById, getCategoryByName, getAllCategories, createCategory, updateCategory, deleteCategory } from "../models/categoryModel";
import { getProductById, getProductByName, getAllProducts, createProduct, createProducts, updateProduct, deleteProduct } from "../models/productModel";
import { getReviewById, getReviewsByProductId, getAllReviews, createReview, deleteReview } from "../models/reviewModel";
import { getUserById, getUserByUsername, getAllUsers, createUser } from "../models/peopleModel";
import { getCartByUserId, getCartItem, createCart, upsertCart, updateCartItem, deleteCartItem } from "../models/cartModel";
import { addToCartTransaction, removeFromCartTransaction, updateCartTransaction } from "../models/cartTransactionModel";
import { createOrderFromCart, updateOrderStatus, cancelOrder } from "../models/orderMutationModel";
import { updatePaymentStatus, updatePaymentTransactionId, updatePaymentMethod, deletePayment } from "../models/paymentMutationModel";
import { PaymentStatus, PaymentMethod } from "@prisma/client";

export const Mutation = {
  createOrder: async (_parent: any, { input }: { input: { userId: number, shippingAddress: string } }, context: Context) => {
    if (!context.user || context.user.id !== input.userId) throw new ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
    try {
      const order = await createOrderFromCart(context.prisma, input.userId, input.shippingAddress);
      return order;
    } catch (err: any) {
      throw new ApolloError(err.message || "An error occurred while creating the order", "Internal Server Error", { statusCode: 500 });
    }
  },

  updateOrderStatus: async (_parent: any, { orderId, status }: { orderId: number, status: string }, context: Context) => {
    if (!context.user || context.user.role !== "admin") throw new ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
    try {
      const updatedOrder = await updateOrderStatus(context.prisma, orderId, status);
      return updatedOrder;
    } catch (err: any) {
      throw new ApolloError(err.message || "An error occurred while updating order status", "Internal Server Error", { statusCode: 500 });
    }
  },

  cancelOrder: async (_parent: any, { orderId }: { orderId: number }, context: Context) => {
    if (!context.user) throw new ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
    // Only allow cancel if order belongs to user and is pending
    const order = await context.prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.userId !== context.user.id) throw new ApolloError("Order not found or access denied", "Not Found", { statusCode: 404 });
    if (order.status !== "PENDING") throw new ApolloError("Only pending orders can be cancelled", "Bad Request", { statusCode: 400 });
    try {
      await cancelOrder(context.prisma, orderId);
      return true;
    } catch (err: any) {
      throw new ApolloError(err.message || "An error occurred while cancelling the order", "Internal Server Error", { statusCode: 500 });
    }
  },
  addNewCategory: async (_parent: any, { input }: { input: CategoryInput }, context: Context) => {
    if (context.user.role !== "admin") {
      throw new ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
    }
    try {
      // Use Prisma directly for create, but use model methods for fetches
      const newCategory = await createCategory(input.name);
      return await getCategoryById(newCategory.id);
    } catch (err: any) {
      if (err.code === "P2002") {
        throw new ApolloError("Category name must be unique", "Conflict", { statusCode: 409 });
      }
      throw err;
    }
  },

  addNewProduct: async (_parent: any, { input }: { input: ProductInput }, context: Context) => {
    if (context.user.role !== "admin") {
      throw new ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
    }
    try {
      const newProduct = await createProduct(input);
      return await getProductById(newProduct.id);
    } catch (err: any) {
      if (err.code === "P2002") {
        throw new ApolloError("Product name must be unique", "Conflict", { statusCode: 409 });
      }
      throw err;
    }
  },

  addNewProducts: async (_parent: any, { input }: { input: ProductInputs }, context: Context) => {
    if (context.user.role !== "admin") {
      throw new ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
    }
    try {
      const created = await createProducts(input.products);
      return created;
    } catch (err: any) {
      if (err.code === "P2002") {
        throw new ApolloError("Product name must be unique", "Conflict", { statusCode: 409 });
      }
      throw err;
    }
  },

  addNewReview: async (_parent: any, { input }: { input: ReviewInput }, context: Context) => {
    if (context.user.role !== "admin") {
      throw new ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
    }
    try {
      const newReview = await createReview(input);
      return await getReviewById(newReview.id);
    } catch (err: any) {
      if (err.code === "P2002") {
        throw new ApolloError("Review must be unique", "Conflict", { statusCode: 409 });
      }
      throw err;
    }
  },

  addNewUser: async (_parent: any, { input }: { input: UserInput }, context: Context) => {
    const { username, password, role } = input;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      // Check if username already exists using model method
      const existingUser = await getUserByUsername(username);
      if (existingUser) {
        throw new ApolloError("Username must be unique", "Conflict", { statusCode: 409 });
      }
      const newUser = await createUser({ username, password: hashedPassword, role });
      return await getUserById(newUser.id);
    } catch (err: any) {
      throw err;
    }
  },

  deleteCategory: async (_parent: any, input: deleteCategoryQuery, context: Context) => {
    const { categoryID } = input;
    if (context.user.role !== "admin") {
      throw new ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
    }
    try {
      await deleteCategory(categoryID);
      await updateProduct(categoryID, { categoryId: null }); // This may need to update multiple products
      return true;
    } catch (err) {
      throw new ApolloError("An error occurred while deleting the category", "Internal Server Error", { statusCode: 500 });
    }
  },

  deleteProduct: async (_parent: any, input: deleteProductQuery , context: Context) => {
    const { productID } = input;
    if (context.user.role !== "admin") {
      throw new ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
    }
    try {
      await deleteProduct(productID);
      // You may want to add a deleteManyReviewsByProductId method for bulk delete
      return true;
    } catch (err) {
      throw new ApolloError("An error occurred while deleting the product", "Internal Server Error", { statusCode: 500 });
    }
  },

  deleteReview: async (_parent: any, input: deleteReviewQuery, context: Context) => {
    const { reviewID } = input;
    if (context.user.role !== "admin") {
      throw new ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
    }
    try {
      await deleteReview(reviewID);
      return true;
    } catch (err) {
      throw new ApolloError("An error occurred while deleting the review", "Internal Server Error", { statusCode: 500 });
    }
  },

  updateCategory: async (_parent: any, input: updateCategoryInput & { categoryID: number }, context: Context) => {
    const { categoryID, name } = input;
    if (context.user.role !== "admin") {
      throw new ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
    }
    try {
      const updatedCategory = await updateCategory(categoryID, name);
      return updatedCategory;
    } catch (err) {
      throw new ApolloError("An error occurred while updating the category", "Internal Server Error", { statusCode: 500 });
    }
  },

  addToCart: async (_parent: any, { input }: { input: addToCartInput }, context: Context) => {
    const { userId, items } = input;
    if (!userId) {
      throw new ApolloError("UserId is required", "Bad Request", { statusCode: 400 });
    }
    if (items.length === 0) {
      throw new ApolloError("Items array cannot be empty", "Bad Request", { statusCode: 400 });
    }
    // Check if user exists
    const user = await getUserById(userId);
    if (!user) {
      throw new ApolloError("User not found", "Not Found", { statusCode: 404 });
    }
    // Check permission
    if (context.user.id !== userId) {
      throw new ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
    }
    try {
      await addToCartTransaction(userId, items, context);
      const persistedCart = await getCartByUserId(userId);
      return persistedCart;
    } catch (err) {
      throw err;
    }
  },

  removeFromCart: async (_parent: any, { input }: { input: removeFromCartInput }, context: Context) => {
    const { userId, productId } = input;
    if (!userId || !productId) {
      throw new ApolloError("UserId and ProductId are required", "Bad Request", { statusCode: 400 });
    }
    // Check if user exists
    const user = await getUserById(userId);
    if (!user) {
      throw new ApolloError("User not found", "Not Found", { statusCode: 404 });
    }
    // Check permission
    if (context.user.id !== userId) {
      throw new ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
    }
    try {
      await removeFromCartTransaction(userId, productId, context);
      return true;
    } catch (err) {
      throw err;
    }
  },

  updateCart: async (_parent: any, { input }: { input: updateCartInput }, context: Context) => {
    const { userId, productId, quantity } = input;
    if (!userId || !productId || quantity < 0) {
      throw new ApolloError("Invalid input parameters", "Bad Request", { statusCode: 400 });
    }
    // Check if user exists
    const user = await getUserById(userId);
    if (!user) {
      throw new ApolloError("User not found", "Not Found", { statusCode: 404 });
    }
    // Check permission
    if (context.user.id !== userId) {
      throw new ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
    }
    // Check if product exists
    const product = await getProductById(productId);
    if (!product) {
      throw new ApolloError("Product not found", "Not Found", { statusCode: 404 });
    }
    try {
      await updateCartTransaction(userId, productId, quantity, context);
      const updatedCart = await getCartByUserId(userId);
      return updatedCart;
    } catch (err) {
      throw err;
    }
  },
  
  updatePaymentStatus: async (_parent: any, { paymentId, status }: { paymentId: number, status: string }, context: Context) => {
    if (!context.user || context.user.role !== "admin") throw new ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
    try {
      const updated = await updatePaymentStatus(context.prisma, paymentId, status as PaymentStatus);
      return updated;
    } catch (err: any) {
      throw new ApolloError(err.message || "An error occurred while updating payment status", "Internal Server Error", { statusCode: 500 });
    }
  },

  updatePaymentTransactionId: async (_parent: any, { paymentId, transactionId }: { paymentId: number, transactionId: string }, context: Context) => {
    if (!context.user || context.user.role !== "admin") throw new ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
    try {
      const updated = await updatePaymentTransactionId(context.prisma, paymentId, transactionId);
      return updated;
    } catch (err: any) {
      throw new ApolloError(err.message || "An error occurred while updating payment transactionId", "Internal Server Error", { statusCode: 500 });
    }
  },

  updatePaymentMethod: async (_parent: any, { paymentId, method }: { paymentId: number, method: string }, context: Context) => {
    if (!context.user || context.user.role !== "admin") throw new ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
    try {
      const updated = await updatePaymentMethod(context.prisma, paymentId, method as PaymentMethod);
      return updated;
    } catch (err: any) {
      throw new ApolloError(err.message || "An error occurred while updating payment method", "Internal Server Error", { statusCode: 500 });
    }
  },

  deletePayment: async (_parent: any, { paymentId }: { paymentId: number }, context: Context) => {
    if (!context.user || context.user.role !== "admin") throw new ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
    try {
      await deletePayment(context.prisma, paymentId);
      return true;
    } catch (err: any) {
      throw new ApolloError(err.message || "An error occurred while deleting the payment", "Internal Server Error", { statusCode: 500 });
    }
  },
};
