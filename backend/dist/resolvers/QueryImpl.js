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
exports.Query = {
    products: (_parent_1, _a, context_1) => __awaiter(void 0, [_parent_1, _a, context_1], void 0, function* (_parent, { filter }, context) {
        try {
            const where = {};
            if (filter && filter.onSale !== undefined) {
                where.onSale = filter.onSale;
            }
            const products = yield context.prisma.product.findMany({ where });
            return products;
        }
        catch (err) {
            throw new apollo_server_errors_1.ApolloError("An error occurred while fetching the products", "Internal Server Error", { statusCode: 500 });
        }
    }),
    product: (_parent_1, _a, context_1) => __awaiter(void 0, [_parent_1, _a, context_1], void 0, function* (_parent, { productId }, context) {
        try {
            const product = yield context.prisma.product.findUnique({ where: { id: productId } });
            return product;
        }
        catch (err) {
            throw new apollo_server_errors_1.ApolloError("An error occurred while fetching the product", "Internal Server Error", { statusCode: 500 });
        }
    }),
    productByName: (_parent_1, _a, context_1) => __awaiter(void 0, [_parent_1, _a, context_1], void 0, function* (_parent, { productName }, context) {
        try {
            const product = yield context.prisma.product.findFirst({ where: { name: productName } });
            return product;
        }
        catch (err) {
            throw new apollo_server_errors_1.ApolloError("An error occurred while fetching the product by name", "Internal Server Error", { statusCode: 500 });
        }
    }),
    categories: (_parent, _args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const categories = yield context.prisma.category.findMany();
            return categories;
        }
        catch (err) {
            throw new apollo_server_errors_1.ApolloError("An error occurred while fetching the categories", "Internal Server Error", { statusCode: 500 });
        }
    }),
    category: (_parent_1, _a, context_1) => __awaiter(void 0, [_parent_1, _a, context_1], void 0, function* (_parent, { categoryId }, context) {
        try {
            const category = yield context.prisma.category.findUnique({ where: { id: categoryId } });
            return category;
        }
        catch (err) {
            throw new apollo_server_errors_1.ApolloError("An error occurred while fetching the category", "Internal Server Error", { statusCode: 500 });
        }
    }),
    categoryByName: (_parent_1, _a, context_1) => __awaiter(void 0, [_parent_1, _a, context_1], void 0, function* (_parent, { categoryName }, context) {
        try {
            const category = yield context.prisma.category.findFirst({ where: { name: categoryName } });
            return category;
        }
        catch (err) {
            throw new apollo_server_errors_1.ApolloError("An error occurred while fetching the category by name", "Internal Server Error", { statusCode: 500 });
        }
    }),
    reviews: (_parent, _args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const reviews = yield context.prisma.review.findMany();
            return reviews;
        }
        catch (err) {
            throw new apollo_server_errors_1.ApolloError("An error occurred while fetching the reviews", "Internal Server Error", { statusCode: 500 });
        }
    }),
    reviewsByProductId: (_parent_1, _a, context_1) => __awaiter(void 0, [_parent_1, _a, context_1], void 0, function* (_parent, { productId }, context) {
        try {
            const reviews = yield context.prisma.review.findMany({ where: { productId } });
            return reviews;
        }
        catch (err) {
            throw new apollo_server_errors_1.ApolloError("An error occurred while fetching the reviews by product", "Internal Server Error", { statusCode: 500 });
        }
    }),
    review: (_parent_1, _a, context_1) => __awaiter(void 0, [_parent_1, _a, context_1], void 0, function* (_parent, { reviewId }, context) {
        try {
            const review = yield context.prisma.review.findUnique({ where: { id: reviewId } });
            return review;
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
