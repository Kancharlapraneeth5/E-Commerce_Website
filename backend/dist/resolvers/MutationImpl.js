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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const apollo_server_errors_1 = require("apollo-server-errors");
const uuid_1 = require("uuid");
exports.Mutation = {
    addNewCategory: (parent_1, _a, context_1) => __awaiter(void 0, [parent_1, _a, context_1], void 0, function* (parent, { input }, context) {
        if (context.user.role === "admin") {
            const { name } = input;
            const newCategory = {
                id: (0, uuid_1.v4)(),
                name,
            };
            try {
                yield context.CategoryModel.create(newCategory);
                return newCategory;
            }
            catch (err) {
                if (err.errmsg.includes("duplicate key error") &&
                    err.code === 11000) {
                    throw new apollo_server_errors_1.ApolloError("Category name must be unique", "Conflict", {
                        statusCode: 409,
                    });
                }
                throw err;
            }
        }
        else {
            throw new apollo_server_errors_1.ApolloError("Permission Denied!", "Forbidden", {
                statusCode: 403,
            });
        }
    }),
    addNewProduct: (parent_1, _a, context_1) => __awaiter(void 0, [parent_1, _a, context_1], void 0, function* (parent, { input }, context) {
        if (context.user.role === "admin") {
            const { name, image, price, onSale, quantity, categoryId, description } = input;
            const newProduct = {
                id: (0, uuid_1.v4)(),
                name,
                image,
                price,
                onSale,
                quantity,
                categoryId,
                description,
            };
            try {
                yield context.ProductModel.create(newProduct);
                return newProduct;
            }
            catch (err) {
                if (err.errmsg.includes("duplicate key error") &&
                    err.code === 11000) {
                    throw new apollo_server_errors_1.ApolloError("Product name must be unique", "Conflict", {
                        statusCode: 409,
                    });
                }
                throw err;
            }
        }
        else {
            throw new apollo_server_errors_1.ApolloError("Permission Denied!", "Forbidden", {
                statusCode: 403,
            });
        }
    }),
    addNewProducts: (parent_1, _a, context_1) => __awaiter(void 0, [parent_1, _a, context_1], void 0, function* (parent, { input }, context) {
        if (context.user.role === "admin") {
            const newProducts = input.products.map((productinput) => {
                const { name, image, price, onSale, quantity, categoryId, description, } = productinput;
                const newProduct = {
                    id: (0, uuid_1.v4)(),
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
        }
        else {
            throw new apollo_server_errors_1.ApolloError("Permission Denied!", "Forbidden", {
                statusCode: 403,
            });
        }
    }),
    addNewReview: (parent_1, _a, context_1) => __awaiter(void 0, [parent_1, _a, context_1], void 0, function* (parent, { input }, context) {
        if (context.user.role === "admin") {
            const { date, title, comment, rating, productID } = input;
            const newReview = {
                id: (0, uuid_1.v4)(),
                date,
                title,
                comment,
                rating,
                productID,
            };
            try {
                yield context.ReviewModel.create(newReview);
                return newReview;
            }
            catch (err) {
                if (err.errmsg.includes("duplicate key error") &&
                    err.code === 11000) {
                    throw new apollo_server_errors_1.ApolloError("Review must be unique", "Conflict", {
                        statusCode: 409,
                    });
                }
                throw err;
            }
        }
        else {
            throw new apollo_server_errors_1.ApolloError("Permission Denied!", "Forbidden", {
                statusCode: 403,
            });
        }
    }),
    addNewUser: (parent_1, _a, context_1) => __awaiter(void 0, [parent_1, _a, context_1], void 0, function* (parent, { input }, context) {
        if (context.user.role === "admin") {
            const { username, password, role } = input;
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            const newUser = {
                id: (0, uuid_1.v4)(),
                username,
                password: hashedPassword,
                role,
            };
            try {
                yield context.PeopleModel.create(newUser);
                return newUser;
            }
            catch (err) {
                if (err.errmsg.includes("duplicate key error") &&
                    err.code === 11000) {
                    throw new apollo_server_errors_1.ApolloError("Username must be unique", "Conflict", {
                        statusCode: 409,
                    });
                }
                throw err;
            }
        }
        else {
            throw new apollo_server_errors_1.ApolloError("Permission Denied!", "Forbidden", {
                statusCode: 403,
            });
        }
    }),
    deleteCategory: (parent_1, _a, context_1) => __awaiter(void 0, [parent_1, _a, context_1], void 0, function* (parent, { id }, context) {
        if (context.user.role === "admin") {
            try {
                let query = {
                    categoryId: id,
                    $set: { categoryId: null },
                };
                yield context.CategoryModel.findByIdAndDelete(id);
                yield context.ProductModel.updateMany(query);
                return true;
            }
            catch (err) {
                throw new apollo_server_errors_1.ApolloError("An error occurred while deleting the category", "Internal Server Error", {
                    statusCode: 500,
                });
            }
        }
        else {
            throw new apollo_server_errors_1.ApolloError("Permission Denied!", "Forbidden", {
                statusCode: 403,
            });
        }
    }),
    deleteProduct: (parent_1, _a, context_1) => __awaiter(void 0, [parent_1, _a, context_1], void 0, function* (parent, { id }, context) {
        if (context.user.role === "admin") {
            try {
                let query = { productId: id };
                yield context.ProductModel.findByIdAndDelete(id);
                yield context.ReviewModel.deleteMany(query);
                return true;
            }
            catch (err) {
                throw new apollo_server_errors_1.ApolloError("An error occurred while deleting the product", "Internal Server Error", {
                    statusCode: 500,
                });
            }
        }
        else {
            throw new apollo_server_errors_1.ApolloError("Permission Denied!", "Forbidden", {
                statusCode: 403,
            });
        }
    }),
    deleteReview: (parent_1, _a, context_1) => __awaiter(void 0, [parent_1, _a, context_1], void 0, function* (parent, { id }, context) {
        if (context.user.role === "admin") {
            try {
                yield context.ReviewModel.findByIdAndDelete(id);
                return true;
            }
            catch (err) {
                throw new apollo_server_errors_1.ApolloError("An error occurred while deleting the review", "Internal Server Error", {
                    statusCode: 500,
                });
            }
        }
        else {
            throw new apollo_server_errors_1.ApolloError("Permission Denied!", "Forbidden", {
                statusCode: 403,
            });
        }
    }),
    updateCategory: (parent_1, _a, context_1) => __awaiter(void 0, [parent_1, _a, context_1], void 0, function* (parent, { id, input }, context) {
        if (context.user.role === "admin") {
            try {
                const updatedCategory = yield context.CategoryModel.findByIdAndUpdate(id, input, {
                    new: true,
                });
                return updatedCategory;
            }
            catch (err) {
                throw new apollo_server_errors_1.ApolloError("An error occurred while updating the category", "Internal Server Error", {
                    statusCode: 500,
                });
            }
        }
        else {
            throw new apollo_server_errors_1.ApolloError("Permission Denied!", "Forbidden", {
                statusCode: 403,
            });
        }
    }),
};
