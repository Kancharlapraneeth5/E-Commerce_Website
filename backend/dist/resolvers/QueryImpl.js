"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = void 0;
const apollo_server_errors_1 = require("apollo-server-errors");
const productModel_1 = require("../models/productModel");
const categoryModel_1 = require("../models/categoryModel");
const reviewModel_1 = require("../models/reviewModel");
exports.Query = {
    products: (_parent_1, _a) => __awaiter(void 0, [_parent_1, _a], void 0, function* (_parent, { filter }) {
        try {
            return yield (0, productModel_1.getAllProducts)(filter);
        }
        catch (err) {
            throw new apollo_server_errors_1.ApolloError("An error occurred while fetching the products", "Internal Server Error", { statusCode: 500 });
        }
    }),
    product: (_parent_1, _a) => __awaiter(void 0, [_parent_1, _a], void 0, function* (_parent, { productId }) {
        try {
            if (typeof productId !== "number") {
                throw new apollo_server_errors_1.ApolloError("productId is required and must be a number", "Bad Request", { statusCode: 400 });
            }
            return yield (0, productModel_1.getProductById)(productId);
        }
        catch (err) {
            throw new apollo_server_errors_1.ApolloError("An error occurred while fetching the product", "Internal Server Error", { statusCode: 500 });
        }
    }),
    productByName: (_parent_1, _a) => __awaiter(void 0, [_parent_1, _a], void 0, function* (_parent, { productName }) {
        try {
            if (typeof productName !== "string") {
                throw new apollo_server_errors_1.ApolloError("productName is required and must be a string", "Bad Request", { statusCode: 400 });
            }
            return yield (0, productModel_1.getProductByName)(productName);
        }
        catch (err) {
            throw new apollo_server_errors_1.ApolloError("An error occurred while fetching the product by name", "Internal Server Error", { statusCode: 500 });
        }
    }),
    categories: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield (0, categoryModel_1.getAllCategories)();
        }
        catch (err) {
            throw new apollo_server_errors_1.ApolloError("An error occurred while fetching the categories", "Internal Server Error", { statusCode: 500 });
        }
    }),
    category: (_parent_1, _a) => __awaiter(void 0, [_parent_1, _a], void 0, function* (_parent, { categoryId }) {
        try {
            if (typeof categoryId !== "number") {
                throw new apollo_server_errors_1.ApolloError("categoryId is required and must be a number", "Bad Request", { statusCode: 400 });
            }
            return yield (0, categoryModel_1.getCategoryById)(categoryId);
        }
        catch (err) {
            throw new apollo_server_errors_1.ApolloError("An error occurred while fetching the category", "Internal Server Error", { statusCode: 500 });
        }
    }),
    categoryByName: (_parent_1, _a) => __awaiter(void 0, [_parent_1, _a], void 0, function* (_parent, { categoryName }) {
        try {
            if (typeof categoryName !== "string") {
                throw new apollo_server_errors_1.ApolloError("categoryName is required and must be a string", "Bad Request", { statusCode: 400 });
            }
            return yield (0, categoryModel_1.getCategoryByName)(categoryName);
        }
        catch (err) {
            throw new apollo_server_errors_1.ApolloError("An error occurred while fetching the category by name", "Internal Server Error", { statusCode: 500 });
        }
    }),
    reviews: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield (0, reviewModel_1.getAllReviews)();
        }
        catch (err) {
            throw new apollo_server_errors_1.ApolloError("An error occurred while fetching the reviews", "Internal Server Error", { statusCode: 500 });
        }
    }),
    reviewsByProductId: (_parent_1, _a) => __awaiter(void 0, [_parent_1, _a], void 0, function* (_parent, { productId }) {
        try {
            if (typeof productId !== "number") {
                throw new apollo_server_errors_1.ApolloError("productId is required and must be a number", "Bad Request", { statusCode: 400 });
            }
            return yield (0, reviewModel_1.getReviewsByProductId)(productId);
        }
        catch (err) {
            throw new apollo_server_errors_1.ApolloError("An error occurred while fetching the reviews by product", "Internal Server Error", { statusCode: 500 });
        }
    }),
    review: (_parent_1, _a) => __awaiter(void 0, [_parent_1, _a], void 0, function* (_parent, { reviewId }) {
        try {
            if (typeof reviewId !== "number") {
                throw new apollo_server_errors_1.ApolloError("reviewId is required and must be a number", "Bad Request", { statusCode: 400 });
            }
            return yield (0, reviewModel_1.getReviewById)(reviewId);
        }
        catch (err) {
            throw new apollo_server_errors_1.ApolloError("An error occurred while fetching the review", "Internal Server Error", { statusCode: 500 });
        }
    }),
    productsByReviewRating: (_parent_1, _a, context_1) => __awaiter(void 0, [_parent_1, _a, context_1], void 0, function* (_parent, { minRating, maxRating, categoryId }, context) {
        try {
            const reviews = yield context.prisma.review.findMany({ where: { rating: { gte: minRating, lte: maxRating } } });
            const productIds = reviews.map((r) => r.productId);
            const products = yield context.prisma.product.findMany({ where: { id: { in: productIds }, categoryId } });
            return products;
        }
        catch (err) {
            throw new apollo_server_errors_1.ApolloError("An error occurred while fetching products by review rating", "Internal Server Error", { statusCode: 500 });
        }
    }),
    productsByCategory: (_parent_1, _a, context_1) => __awaiter(void 0, [_parent_1, _a, context_1], void 0, function* (_parent, { categoryId }, context) {
        try {
            const products = yield context.prisma.product.findMany({ where: { categoryId } });
            return products;
        }
        catch (err) {
            throw new apollo_server_errors_1.ApolloError("An error occurred while fetching products by category", "Internal Server Error", { statusCode: 500 });
        }
    }),
    getCart: (_parent_1, _a, context_1) => __awaiter(void 0, [_parent_1, _a, context_1], void 0, function* (_parent, { userId }, context) {
        try {
            if (!userId) {
                throw new apollo_server_errors_1.ApolloError("User ID is required", "Bad Request", { statusCode: 400 });
            }
            // Check if user exists
            const user = yield context.prisma.people.findUnique({ where: { id: userId } });
            if (!user) {
                throw new apollo_server_errors_1.ApolloError("User not found", "Not Found", { statusCode: 404 });
            }
            // Check permission - user can only access their own cart
            if (context.user.id !== userId) {
                throw new apollo_server_errors_1.ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
            }
            // Find the cart for the user
            const cart = yield context.prisma.cart.findUnique({ where: { userId }, include: { items: true } });
            return cart || null;
        }
        catch (err) {
            throw new apollo_server_errors_1.ApolloError("An error occurred while fetching the cart", "Internal Server Error", { statusCode: 500 });
        }
    }),
};
