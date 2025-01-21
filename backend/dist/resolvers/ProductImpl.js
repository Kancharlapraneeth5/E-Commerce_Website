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
exports.Product = void 0;
const apollo_server_errors_1 = require("apollo-server-errors");
// In the below two methods we are using two different promises to fetch the category and reviews of a product because
// In category method we are using findById method which returns a single document and in reviews method we are using
// find method which returns an array of documents.
// 1) Promise<Document | null>
// 2) Promise<Document[]>
exports.Product = {
    category: (_a, args_1, context_1) => __awaiter(void 0, [_a, args_1, context_1], void 0, function* (
    // here the parent is the product object which has the categoryId field
    { categoryId }, args, context) {
        try {
            const Category = yield context.CategoryModel.findById(categoryId);
            return Category;
        }
        catch (err) {
            throw new apollo_server_errors_1.ApolloError("An error occurred while fetching the category", "Internal Server Error", { statusCode: 500 });
        }
    }),
    reviews: (_a, args_1, context_1) => __awaiter(void 0, [_a, args_1, context_1], void 0, function* (
    // here the parent is the product object which has the productId field
    { id }, args, context) {
        try {
            let query = { productId: id };
            const reviews = yield context.ReviewModel.find(query);
            return reviews;
        }
        catch (err) {
            throw new apollo_server_errors_1.ApolloError("An error occurred while fetching the reviews", "Internal Server Error", { statusCode: 500 });
        }
    }),
};
