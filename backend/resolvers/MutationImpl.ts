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

export const Mutation = {
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

  deleteCategory: async (_parent: any, { input }: { input: deleteCategoryQuery }, context: Context) => {
    const { categoryId } = input;
    if (context.user.role !== "admin") {
      throw new ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
    }
    try {
      await deleteCategory(categoryId);
      await updateProduct(categoryId, { categoryId: null }); // This may need to update multiple products
      return true;
    } catch (err) {
      throw new ApolloError("An error occurred while deleting the category", "Internal Server Error", { statusCode: 500 });
    }
  },

  deleteProduct: async (_parent: any, { input }: { input: deleteProductQuery }, context: Context) => {
    const { productId } = input;
    if (context.user.role !== "admin") {
      throw new ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
    }
    try {
      await deleteProduct(productId);
      // You may want to add a deleteManyReviewsByProductId method for bulk delete
      return true;
    } catch (err) {
      throw new ApolloError("An error occurred while deleting the product", "Internal Server Error", { statusCode: 500 });
    }
  },

  deleteReview: async (_parent: any, { input }: { input: deleteReviewQuery }, context: Context) => {
    const { reviewId } = input;
    if (context.user.role !== "admin") {
      throw new ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
    }
    try {
      await deleteReview(reviewId);
      return true;
    } catch (err) {
      throw new ApolloError("An error occurred while deleting the review", "Internal Server Error", { statusCode: 500 });
    }
  },

  updateCategory: async (_parent: any, { input }: { input: updateCategoryInput & { categoryId: number } }, context: Context) => {
    const { categoryId, categoryName } = input;
    if (context.user.role !== "admin") {
      throw new ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
    }
    try {
      const updatedCategory = await updateCategory(categoryId, categoryName);
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
    // Transaction: decrement product stock and update cart atomically
    try {
      await context.prisma.$transaction(async (tx: typeof context.prisma) => {
        // For each item, decrement product stock if enough quantity
        for (const item of items) {
          const product = await getProductById(item.productId);
          if (!product) {
            throw new ApolloError("Product not found", "Not Found", { statusCode: 404 });
          }
          if (product.quantity < item.quantity) {
            throw new ApolloError(`Requested quantity exceeds available stock for product ${item.productId}`, "Bad Request", { statusCode: 400 });
          }
          await tx.product.update({ where: { id: item.productId }, data: { quantity: { decrement: item.quantity } } });
        }
        // Upsert cart
        const cart = await tx.cart.upsert({
          where: { userId },
          update: {
            items: {
              upsert: items.map(item => ({
                where: { cartId_productId: { cartId: undefined, productId: item.productId } }, // cartId will be set after cart is created
                update: { quantity: { increment: item.quantity } },
                create: { productId: item.productId, quantity: item.quantity },
              })),
            },
          },
          create: {
            userId,
            items: { create: items.map(item => ({ productId: item.productId, quantity: item.quantity })) },
          },
          include: { items: true },
        });
        return cart;
      });
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
    // Transaction: restore product inventory and remove the item atomically
    try {
      await context.prisma.$transaction(async (tx: typeof context.prisma) => {
        // Find cart for user
        const cart = await getCartByUserId(userId);
        if (!cart) {
          throw new ApolloError("Cart not found", "Not Found", { statusCode: 404 });
        }
        // Find cart item
        const cartItem = await getCartItem(cart.id, productId);
        if (!cartItem) {
          throw new ApolloError("Item not found in cart", "Not Found", { statusCode: 404 });
        }
        // Restore product quantity
        await tx.product.update({ where: { id: productId }, data: { quantity: { increment: cartItem.quantity } } });
        // Remove item from cart
        await tx.cartItem.delete({ where: { id: cartItem.id } });
      });
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
    // Transaction: adjust inventory and update cart
    try {
      await context.prisma.$transaction(async (tx: typeof context.prisma) => {
        // Find cart for user
        const cart = await tx.cart.findUnique({ where: { userId } });
        if (!cart) {
          throw new ApolloError("Cart not found", "Not Found", { statusCode: 404 });
        }
        // Find cart item
        const cartItem = await tx.cartItem.findFirst({ where: { cartId: cart.id, productId } });
        if (!cartItem) {
          throw new ApolloError("Item not found in cart", "Not Found", { statusCode: 404 });
        }
        const currentQuantityInCart = cartItem.quantity;
        if (quantity === 0) {
          await tx.product.update({ where: { id: productId }, data: { quantity: { increment: currentQuantityInCart } } });
          await tx.cartItem.delete({ where: { id: cartItem.id } });
          return;
        }
        const quantityDifference = quantity - currentQuantityInCart;
        if (quantityDifference > 0) {
          if (product.quantity < quantityDifference) {
            throw new ApolloError(`Insufficient stock. Only ${product.quantity} items available to add.`, "Bad Request", { statusCode: 400 });
          }
          await tx.product.update({ where: { id: productId }, data: { quantity: { decrement: quantityDifference } } });
        } else if (quantityDifference < 0) {
          await tx.product.update({ where: { id: productId }, data: { quantity: { increment: Math.abs(quantityDifference) } } });
        }
        await tx.cartItem.update({ where: { id: cartItem.id }, data: { quantity } });
      });
      const updatedCart = await getCartByUserId(userId);
      return updatedCart;
    } catch (err) {
      throw err;
    }
  },
};
