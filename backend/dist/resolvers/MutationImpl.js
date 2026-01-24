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
exports.Mutation = {
    addNewCategory: (_parent_1, _a, context_1) => __awaiter(void 0, [_parent_1, _a, context_1], void 0, function* (_parent, { input }, context) {
        if (context.user.role !== "admin") {
            throw new apollo_server_errors_1.ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
        }
        try {
            const newCategory = yield context.prisma.category.create({ data: { name: input.name } });
            return newCategory;
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
            const newProduct = yield context.prisma.product.create({ data: input });
            return newProduct;
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
            const created = yield context.prisma.product.createMany({ data: input.products });
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
            const newReview = yield context.prisma.review.create({ data: input });
            return newReview;
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
            const newUser = yield context.prisma.people.create({ data: { username, password: hashedPassword, role } });
            return newUser;
        }
        catch (err) {
            if (err.code === "P2002") {
                throw new apollo_server_errors_1.ApolloError("Username must be unique", "Conflict", { statusCode: 409 });
            }
            throw err;
        }
    }),
    deleteCategory: (_parent_1, _a, context_1) => __awaiter(void 0, [_parent_1, _a, context_1], void 0, function* (_parent, { input }, context) {
        const { categoryId } = input;
        if (context.user.role !== "admin") {
            throw new apollo_server_errors_1.ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
        }
        try {
            yield context.prisma.category.delete({ where: { id: categoryId } });
            yield context.prisma.product.updateMany({ where: { categoryId }, data: { categoryId: null } });
            return true;
        }
        catch (err) {
            throw new apollo_server_errors_1.ApolloError("An error occurred while deleting the category", "Internal Server Error", { statusCode: 500 });
        }
    }),
    deleteProduct: (_parent_1, _a, context_1) => __awaiter(void 0, [_parent_1, _a, context_1], void 0, function* (_parent, { input }, context) {
        const { productId } = input;
        if (context.user.role !== "admin") {
            throw new apollo_server_errors_1.ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
        }
        try {
            yield context.prisma.product.delete({ where: { id: productId } });
            yield context.prisma.review.deleteMany({ where: { productId } });
            return true;
        }
        catch (err) {
            throw new apollo_server_errors_1.ApolloError("An error occurred while deleting the product", "Internal Server Error", { statusCode: 500 });
        }
    }),
    deleteReview: (_parent_1, _a, context_1) => __awaiter(void 0, [_parent_1, _a, context_1], void 0, function* (_parent, { input }, context) {
        const { reviewId } = input;
        if (context.user.role !== "admin") {
            throw new apollo_server_errors_1.ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
        }
        try {
            yield context.prisma.review.delete({ where: { id: reviewId } });
            return true;
        }
        catch (err) {
            throw new apollo_server_errors_1.ApolloError("An error occurred while deleting the review", "Internal Server Error", { statusCode: 500 });
        }
    }),
    updateCategory: (_parent_1, _a, context_1) => __awaiter(void 0, [_parent_1, _a, context_1], void 0, function* (_parent, { input }, context) {
        const { categoryId, categoryName } = input;
        if (context.user.role !== "admin") {
            throw new apollo_server_errors_1.ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
        }
        try {
            const updatedCategory = yield context.prisma.category.update({ where: { id: categoryId }, data: { name: categoryName } });
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
        const user = yield context.prisma.people.findUnique({ where: { id: userId } });
        if (!user) {
            throw new apollo_server_errors_1.ApolloError("User not found", "Not Found", { statusCode: 404 });
        }
        // Check permission
        if (context.user.id !== userId) {
            throw new apollo_server_errors_1.ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
        }
        // Transaction: decrement product stock and update cart atomically
        try {
            yield context.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
                // For each item, decrement product stock if enough quantity
                for (const item of items) {
                    const product = yield tx.product.findUnique({ where: { id: item.productId } });
                    if (!product) {
                        throw new apollo_server_errors_1.ApolloError("Product not found", "Not Found", { statusCode: 404 });
                    }
                    if (product.quantity < item.quantity) {
                        throw new apollo_server_errors_1.ApolloError(`Requested quantity exceeds available stock for product ${item.productId}`, "Bad Request", { statusCode: 400 });
                    }
                    yield tx.product.update({ where: { id: item.productId }, data: { quantity: { decrement: item.quantity } } });
                }
                // Upsert cart
                const cart = yield tx.cart.upsert({
                    where: { userId },
                    update: {
                        items: {
                            upsert: items.map(item => ({
                                where: { productId_userId: { productId: item.productId, userId } },
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
            }));
            const persistedCart = yield context.prisma.cart.findUnique({ where: { userId }, include: { items: true } });
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
        const user = yield context.prisma.people.findUnique({ where: { id: userId } });
        if (!user) {
            throw new apollo_server_errors_1.ApolloError("User not found", "Not Found", { statusCode: 404 });
        }
        // Check permission
        if (context.user.id !== userId) {
            throw new apollo_server_errors_1.ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
        }
        // Transaction: restore product inventory and remove the item atomically
        try {
            yield context.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
                // Find cart item
                const cartItem = yield tx.cartItem.findUnique({ where: { productId_userId: { productId, userId } } });
                if (!cartItem) {
                    throw new apollo_server_errors_1.ApolloError("Item not found in cart", "Not Found", { statusCode: 404 });
                }
                // Restore product quantity
                yield tx.product.update({ where: { id: productId }, data: { quantity: { increment: cartItem.quantity } } });
                // Remove item from cart
                yield tx.cartItem.delete({ where: { productId_userId: { productId, userId } } });
            }));
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
        const user = yield context.prisma.people.findUnique({ where: { id: userId } });
        if (!user) {
            throw new apollo_server_errors_1.ApolloError("User not found", "Not Found", { statusCode: 404 });
        }
        // Check permission
        if (context.user.id !== userId) {
            throw new apollo_server_errors_1.ApolloError("Permission Denied!", "Forbidden", { statusCode: 403 });
        }
        // Check if product exists
        const product = yield context.prisma.product.findUnique({ where: { id: productId } });
        if (!product) {
            throw new apollo_server_errors_1.ApolloError("Product not found", "Not Found", { statusCode: 404 });
        }
        // Transaction: adjust inventory and update cart
        try {
            yield context.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
                const cartItem = yield tx.cartItem.findUnique({ where: { productId_userId: { productId, userId } } });
                if (!cartItem) {
                    throw new apollo_server_errors_1.ApolloError("Item not found in cart", "Not Found", { statusCode: 404 });
                }
                const currentQuantityInCart = cartItem.quantity;
                if (quantity === 0) {
                    yield tx.product.update({ where: { id: productId }, data: { quantity: { increment: currentQuantityInCart } } });
                    yield tx.cartItem.delete({ where: { productId_userId: { productId, userId } } });
                    return;
                }
                const quantityDifference = quantity - currentQuantityInCart;
                if (quantityDifference > 0) {
                    if (product.quantity < quantityDifference) {
                        throw new apollo_server_errors_1.ApolloError(`Insufficient stock. Only ${product.quantity} items available to add.`, "Bad Request", { statusCode: 400 });
                    }
                    yield tx.product.update({ where: { id: productId }, data: { quantity: { decrement: quantityDifference } } });
                }
                else if (quantityDifference < 0) {
                    yield tx.product.update({ where: { id: productId }, data: { quantity: { increment: Math.abs(quantityDifference) } } });
                }
                yield tx.cartItem.update({ where: { productId_userId: { productId, userId } }, data: { quantity } });
            }));
            const updatedCart = yield context.prisma.cart.findUnique({ where: { userId }, include: { items: true } });
            return updatedCart;
        }
        catch (err) {
            throw err;
        }
    }),
};
