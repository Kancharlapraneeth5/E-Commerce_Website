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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutation = void 0;
const apollo_server_errors_1 = require("apollo-server-errors");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const categoryModel_1 = require("../models/categoryModel");
const productModel_1 = require("../models/productModel");
const reviewModel_1 = require("../models/reviewModel");
const peopleModel_1 = require("../models/peopleModel");
const cartModel_1 = require("../models/cartModel");
const cartTransactionModel_1 = require("../models/cartTransactionModel");
exports.Mutation = {
    addNewCategory: (_parent_1, _a, context_1) => __awaiter(void 0, [_parent_1, _a, context_1], void 0, function* (_parent, { input }, context) {
        if (context.user.role !== "admin") {
            throw new apollo_server_errors_1.ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
        }
        try {
            // Use Prisma directly for create, but use model methods for fetches
            const newCategory = yield (0, categoryModel_1.createCategory)(input.name);
            return yield (0, categoryModel_1.getCategoryById)(newCategory.id);
        }
        catch (err) {
            if (err.code === "P2002") {
                throw new apollo_server_errors_1.ApolloError("Category name must be unique", "Conflict", { statusCode: 409 });
            }
            throw err;
        }
    }),
    addNewProduct: (_parent_1, _a, context_1) => __awaiter(void 0, [_parent_1, _a, context_1], void 0, function* (_parent, { input }, context) {
        if (context.user.role !== "admin") {
            throw new apollo_server_errors_1.ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
        }
        try {
            const newProduct = yield (0, productModel_1.createProduct)(input);
            return yield (0, productModel_1.getProductById)(newProduct.id);
        }
        catch (err) {
            if (err.code === "P2002") {
                throw new apollo_server_errors_1.ApolloError("Product name must be unique", "Conflict", { statusCode: 409 });
            }
            throw err;
        }
    }),
    addNewProducts: (_parent_1, _a, context_1) => __awaiter(void 0, [_parent_1, _a, context_1], void 0, function* (_parent, { input }, context) {
        if (context.user.role !== "admin") {
            throw new apollo_server_errors_1.ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
        }
        try {
            const created = yield (0, productModel_1.createProducts)(input.products);
            return created;
        }
        catch (err) {
            if (err.code === "P2002") {
                throw new apollo_server_errors_1.ApolloError("Product name must be unique", "Conflict", { statusCode: 409 });
            }
            throw err;
        }
    }),
    addNewReview: (_parent_1, _a, context_1) => __awaiter(void 0, [_parent_1, _a, context_1], void 0, function* (_parent, { input }, context) {
        if (context.user.role !== "admin") {
            throw new apollo_server_errors_1.ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
        }
        try {
            const newReview = yield (0, reviewModel_1.createReview)(input);
            return yield (0, reviewModel_1.getReviewById)(newReview.id);
        }
        catch (err) {
            if (err.code === "P2002") {
                throw new apollo_server_errors_1.ApolloError("Review must be unique", "Conflict", { statusCode: 409 });
            }
            throw err;
        }
    }),
    addNewUser: (_parent_1, _a, context_1) => __awaiter(void 0, [_parent_1, _a, context_1], void 0, function* (_parent, { input }, context) {
        const { username, password, role } = input;
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        try {
            // Check if username already exists using model method
            const existingUser = yield (0, peopleModel_1.getUserByUsername)(username);
            if (existingUser) {
                throw new apollo_server_errors_1.ApolloError("Username must be unique", "Conflict", { statusCode: 409 });
            }
            const newUser = yield (0, peopleModel_1.createUser)({ username, password: hashedPassword, role });
            return yield (0, peopleModel_1.getUserById)(newUser.id);
        }
        catch (err) {
            throw err;
        }
    }),
    deleteCategory: (_parent, input, context) => __awaiter(void 0, void 0, void 0, function* () {
        const { categoryID } = input;
        if (context.user.role !== "admin") {
            throw new apollo_server_errors_1.ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
        }
        try {
            yield (0, categoryModel_1.deleteCategory)(categoryID);
            yield (0, productModel_1.updateProduct)(categoryID, { categoryId: null }); // This may need to update multiple products
            return true;
        }
        catch (err) {
            throw new apollo_server_errors_1.ApolloError("An error occurred while deleting the category", "Internal Server Error", { statusCode: 500 });
        }
    }),
    deleteProduct: (_parent, input, context) => __awaiter(void 0, void 0, void 0, function* () {
        const { productID } = input;
        if (context.user.role !== "admin") {
            throw new apollo_server_errors_1.ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
        }
        try {
            yield (0, productModel_1.deleteProduct)(productID);
            // You may want to add a deleteManyReviewsByProductId method for bulk delete
            return true;
        }
        catch (err) {
            throw new apollo_server_errors_1.ApolloError("An error occurred while deleting the product", "Internal Server Error", { statusCode: 500 });
        }
    }),
    deleteReview: (_parent, input, context) => __awaiter(void 0, void 0, void 0, function* () {
        const { reviewID } = input;
        if (context.user.role !== "admin") {
            throw new apollo_server_errors_1.ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
        }
        try {
            yield (0, reviewModel_1.deleteReview)(reviewID);
            return true;
        }
        catch (err) {
            throw new apollo_server_errors_1.ApolloError("An error occurred while deleting the review", "Internal Server Error", { statusCode: 500 });
        }
    }),
    updateCategory: (_parent, input, context) => __awaiter(void 0, void 0, void 0, function* () {
        const { categoryID, name } = input;
        if (context.user.role !== "admin") {
            throw new apollo_server_errors_1.ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
        }
        try {
            const updatedCategory = yield (0, categoryModel_1.updateCategory)(categoryID, name);
            return updatedCategory;
        }
        catch (err) {
            throw new apollo_server_errors_1.ApolloError("An error occurred while updating the category", "Internal Server Error", { statusCode: 500 });
        }
    }),
    addToCart: (_parent_1, _a, context_1) => __awaiter(void 0, [_parent_1, _a, context_1], void 0, function* (_parent, { input }, context) {
        const { userId, items } = input;
        if (!userId) {
            throw new apollo_server_errors_1.ApolloError("UserId is required", "Bad Request", { statusCode: 400 });
        }
        if (items.length === 0) {
            throw new apollo_server_errors_1.ApolloError("Items array cannot be empty", "Bad Request", { statusCode: 400 });
        }
        // Check if user exists
        const user = yield (0, peopleModel_1.getUserById)(userId);
        if (!user) {
            throw new apollo_server_errors_1.ApolloError("User not found", "Not Found", { statusCode: 404 });
        }
        // Check permission
        if (context.user.id !== userId) {
            throw new apollo_server_errors_1.ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
        }
        try {
            yield (0, cartTransactionModel_1.addToCartTransaction)(userId, items, context);
            const persistedCart = yield (0, cartModel_1.getCartByUserId)(userId);
            return persistedCart;
        }
        catch (err) {
            throw err;
        }
    }),
    removeFromCart: (_parent_1, _a, context_1) => __awaiter(void 0, [_parent_1, _a, context_1], void 0, function* (_parent, { input }, context) {
        const { userId, productId } = input;
        if (!userId || !productId) {
            throw new apollo_server_errors_1.ApolloError("UserId and ProductId are required", "Bad Request", { statusCode: 400 });
        }
        // Check if user exists
        const user = yield (0, peopleModel_1.getUserById)(userId);
        if (!user) {
            throw new apollo_server_errors_1.ApolloError("User not found", "Not Found", { statusCode: 404 });
        }
        // Check permission
        if (context.user.id !== userId) {
            throw new apollo_server_errors_1.ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
        }
        try {
            yield (0, cartTransactionModel_1.removeFromCartTransaction)(userId, productId, context);
            return true;
        }
        catch (err) {
            throw err;
        }
    }),
    updateCart: (_parent_1, _a, context_1) => __awaiter(void 0, [_parent_1, _a, context_1], void 0, function* (_parent, { input }, context) {
        const { userId, productId, quantity } = input;
        if (!userId || !productId || quantity < 0) {
            throw new apollo_server_errors_1.ApolloError("Invalid input parameters", "Bad Request", { statusCode: 400 });
        }
        // Check if user exists
        const user = yield (0, peopleModel_1.getUserById)(userId);
        if (!user) {
            throw new apollo_server_errors_1.ApolloError("User not found", "Not Found", { statusCode: 404 });
        }
        // Check permission
        if (context.user.id !== userId) {
            throw new apollo_server_errors_1.ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
        }
        // Check if product exists
        const product = yield (0, productModel_1.getProductById)(productId);
        if (!product) {
            throw new apollo_server_errors_1.ApolloError("Product not found", "Not Found", { statusCode: 404 });
        }
        try {
            yield (0, cartTransactionModel_1.updateCartTransaction)(userId, productId, quantity, context);
            const updatedCart = yield (0, cartModel_1.getCartByUserId)(userId);
            return updatedCart;
        }
        catch (err) {
            throw err;
        }
    }),
};
