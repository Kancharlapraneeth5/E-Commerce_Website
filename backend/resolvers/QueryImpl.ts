import { ApolloError } from "apollo-server-errors";
import { Args, Context } from "./Query";
import { getAllProducts, getProductById, getProductByName, getProductsByCategory } from "../models/productModel";
import { getAllCategories, getCategoryById, getCategoryByName } from "../models/categoryModel";
import { getAllReviews, getReviewById, getReviewsByProductId } from "../models/reviewModel";
import { getOrdersByUserId, getOrderById, getOrderByIdSimple } from "../models/orderModel";
import { getPaymentById, getPaymentsByOrderId, getPaymentsByUserId } from "../models/paymentModel";

export const Query = {
  products: async (_parent: any, { filter }: Args) => {
    try {
      return await getAllProducts(filter);
    } catch (err) {
      throw new ApolloError("An error occurred while fetching the products", "Internal Server Error", { statusCode: 500 });
    }
  },
  product: async (_parent: any, { productId }: Args) => {
    try {
      if (typeof productId !== "number") {
        throw new ApolloError("productId is required and must be a number", "Bad Request", { statusCode: 400 });
      }
      return await getProductById(productId);
    } catch (err) {
      throw new ApolloError("An error occurred while fetching the product", "Internal Server Error", { statusCode: 500 });
    }
  },
  productByName: async (_parent: any, { productName }: Args) => {
    try {
      if (typeof productName !== "string") {
        throw new ApolloError("productName is required and must be a string", "Bad Request", { statusCode: 400 });
      }
      return await getProductByName(productName);
    } catch (err) {
      throw new ApolloError("An error occurred while fetching the product by name", "Internal Server Error", { statusCode: 500 });
    }
  },
  categories: async () => {
    try {
      return await getAllCategories();
    } catch (err) {
      throw new ApolloError("An error occurred while fetching the categories", "Internal Server Error", { statusCode: 500 });
    }
  },
  category: async (_parent: any, { categoryId }: Args) => {
    try {
      if (typeof categoryId !== "number") {
        throw new ApolloError("categoryId is required and must be a number", "Bad Request", { statusCode: 400 });
      }
      return await getCategoryById(categoryId);
    } catch (err) {
      throw new ApolloError("An error occurred while fetching the category", "Internal Server Error", { statusCode: 500 });
    }
  },
  categoryByName: async (_parent: any, { categoryName }: Args) => {
    try {
      if (typeof categoryName !== "string") {
        throw new ApolloError("categoryName is required and must be a string", "Bad Request", { statusCode: 400 });
      }
      return await getCategoryByName(categoryName);
    } catch (err) {
      throw new ApolloError("An error occurred while fetching the category by name", "Internal Server Error", { statusCode: 500 });
    }
  },

  reviews: async () => {
    try {
      return await getAllReviews();
    } catch (err) {
      throw new ApolloError("An error occurred while fetching the reviews", "Internal Server Error", { statusCode: 500 });
    }
  },

  reviewsByProductId: async (_parent: any, { productId }: Args) => {
    try {
      if (typeof productId !== "number") {
        throw new ApolloError("productId is required and must be a number", "Bad Request", { statusCode: 400 });
      }
      return await getReviewsByProductId(productId);
    } catch (err) {
      throw new ApolloError("An error occurred while fetching the reviews by product", "Internal Server Error", { statusCode: 500 });
    }
  },

  review: async (_parent: any, { reviewId }: Args) => {
    try {
      if (typeof reviewId !== "number") {
        throw new ApolloError("reviewId is required and must be a number", "Bad Request", { statusCode: 400 });
      }
      return await getReviewById(reviewId);
    } catch (err) {
      throw new ApolloError("An error occurred while fetching the review", "Internal Server Error", { statusCode: 500 });
    }
  },

  productsByReviewRating: async (_parent: any, { minRating, maxRating, categoryId }: Args, context: Context) => {
    try {
      const reviews: Array<{ productId: number }> = await context.prisma.review.findMany({ where: { rating: { gte: minRating, lte: maxRating } } });
      const productIds = reviews.map((r: { productId: number }) => r.productId);
      const products = await context.prisma.product.findMany({ where: { id: { in: productIds }, categoryId } });
      return products;
    } catch (err) {
      throw new ApolloError("An error occurred while fetching products by review rating", "Internal Server Error", { statusCode: 500 });
    }
  },

  productsByCategory: async (_parent: any, { categoryId }: Args, context: Context) => {
    try {
      const products = await context.prisma.product.findMany({ where: { categoryId } });
      return products;
    } catch (err) {
      throw new ApolloError("An error occurred while fetching products by category", "Internal Server Error", { statusCode: 500 });
    }
  },

  getCart: async (_parent: any, { userId }: Args, context: Context) => {
    try {
      if (!userId) {
        throw new ApolloError("User ID is required", "Bad Request", { statusCode: 400 });
      }
      // Check if user exists
      const user = await context.prisma.people.findUnique({ where: { id: userId } });
      if (!user) {
        throw new ApolloError("User not found", "Not Found", { statusCode: 404 });
      }
      // Check permission - user can only access their own cart
      if (context.user.id !== userId) {
        throw new ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
      }
      // Find the cart for the user
      const cart = await context.prisma.cart.findUnique({ where: { userId }, include: { items: true } });
      return cart || null;
    } catch (err) {
      throw new ApolloError("An error occurred while fetching the cart", "Internal Server Error", { statusCode: 500 });
    }
  },

  orders: async (_parent: any, _args: any, context: Context) => {
    // List all orders for authenticated user
    try {
      if (!context.user) throw new ApolloError("Authentication required", "Forbidden", { statusCode: 403 });
      return await getOrdersByUserId(context.prisma, context.user.id);
    } catch (err) {
      throw new ApolloError("An error occurred while fetching orders", "Internal Server Error", { statusCode: 500 });
    }
  },

  order: async (_parent: any, { orderId }: { orderId: number }, context: Context) => {
    // Get details of a specific order
    try {
      if (!context.user) throw new ApolloError("Authentication required", "Forbidden", { statusCode: 403 });
      const order = await getOrderById(context.prisma, orderId);
      if (!order || order.userId !== context.user.id) throw new ApolloError("Order not found or access denied", "Not Found", { statusCode: 404 });
      return order;
    } catch (err) {
      throw new ApolloError("An error occurred while fetching the order", "Internal Server Error", { statusCode: 500 });
    }
  },

  // Payment read operations
  payment: async (_parent: any, { paymentId }: { paymentId: number }, context: Context) => {
    try {
      if (!context.user) throw new ApolloError("Authentication required", "Forbidden", { statusCode: 403 });
      const payment = await getPaymentById(context.prisma, paymentId);
      if (!payment) throw new ApolloError("Payment not found", "Not Found", { statusCode: 404 });
      // Optionally, check if user is allowed to view this payment (by order ownership)
      const order = payment.orderId ? await getOrderByIdSimple(context.prisma, payment.orderId) : null;
      if (order && order.userId !== context.user.id && context.user.role !== "admin") {
        throw new ApolloError("Access denied", "Forbidden", { statusCode: 403 });
      }
      return payment;
    } catch (err) {
      throw new ApolloError("An error occurred while fetching the payment", "Internal Server Error", { statusCode: 500 });
    }
  },

  paymentsByOrder: async (_parent: any, { orderId }: { orderId: number }, context: Context) => {
    try {
      if (!context.user) throw new ApolloError("Authentication required", "Forbidden", { statusCode: 403 });
      const order = await getOrderByIdSimple(context.prisma, orderId);
      if (!order || order.userId !== context.user.id) throw new ApolloError("Order not found or access denied", "Not Found", { statusCode: 404 });
      const payments = await getPaymentsByOrderId(context.prisma, orderId);
      return payments;
    } catch (err) {
      throw new ApolloError("An error occurred while fetching payments for the order", "Internal Server Error", { statusCode: 500 });
    }
  },

  paymentsByUser: async (_parent: any, { userId }: { userId: number }, context: Context) => {
    try {
      if (!context.user) throw new ApolloError("Authentication required", "Forbidden", { statusCode: 403 });
      if (context.user.id !== userId && context.user.role !== "admin") {
        throw new ApolloError("Access denied", "Forbidden", { statusCode: 403 });
      }
      const payments = await getPaymentsByUserId(context.prisma, userId);
      return payments;
    } catch (err) {
      throw new ApolloError("An error occurred while fetching payments for the user", "Internal Server Error", { statusCode: 500 });
    }
  },
  };