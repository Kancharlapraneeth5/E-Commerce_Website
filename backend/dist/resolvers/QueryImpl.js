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
const apollo_server_express_1 = require("apollo-server-express");
exports.Query = {
    // In Apollo Server, each field in your schema has a corresponding resolver function.
    // A resolver function is responsible for fetching the data for its field. The resolver function takes
    // four positional arguments:
    // parent-> This is the result returned from the resolver for the parent field.
    // For a root field (a field on the Query, Mutation, or Subscription type), parent is undefined.
    // args-> This is an object that contains all GraphQL arguments provided for the field. For example,
    // if the field was called with myField(arg1: "value"), the args object is { arg1: "value" }.
    // context-> This is an object shared by all resolvers in a particular query.
    // It's used to store per-request state, including authentication information, dataloader instances,
    // and anything else that should be taken into account when resolving the query
    // info-> his argument contains information about the execution state of the query.
    // It includes the field name, path to the field from the root, and more. It's mostly used in advanced cases,
    // like schema stitching
    // THE ORDER OF THE PARAMETERS IN THE RESOLVER FUNCTION IS VERY IMPORTANT!!!!!!
    // THE ORDER IS parent, args, context, info
    products: (parent_1, _a, context_1) => __awaiter(void 0, [parent_1, _a, context_1], void 0, function* (parent, { filter }, context) {
        let filterProducts;
        try {
            if (filter) {
                if (filter.onSale === true) {
                    console.log("I am in true...");
                    filterProducts = yield context.ProductModel.find(filter);
                }
                else if (filter.onSale === false) {
                    filterProducts = yield context.ProductModel.find(filter);
                }
            }
            else {
                filterProducts = yield context.ProductModel.find();
            }
            return filterProducts;
        }
        catch (err) {
            throw new apollo_server_express_1.ApolloError("An error occurred while fetching the products", "Internal Server Error", {
                statusCode: 500,
            });
        }
    }),
    product: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        const { productId } = args;
        try {
            const result = yield context.ProductModel.findById(productId);
            return result;
        }
        catch (err) {
            throw new apollo_server_express_1.ApolloError("An error occurred while fetching the product", "Internal Server Error", {
                statusCode: 500,
            });
        }
    }),
    productByName: (parent_1, _a, context_1) => __awaiter(void 0, [parent_1, _a, context_1], void 0, function* (parent, { productName }, context) {
        const ProductName = productName;
        let query = { name: ProductName };
        try {
            const result = yield context.ProductModel.findOne(query);
            return result;
        }
        catch (err) {
            throw new apollo_server_express_1.ApolloError("An error occurred while fetching the product by name", "Internal Server Error", {
                statusCode: 500,
            });
        }
    }),
    categories: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield context.CategoryModel.find();
            return result;
        }
        catch (err) {
            throw new apollo_server_express_1.ApolloError("An error occurred while fetching the categories", "Internal Server Error", {
                statusCode: 500,
            });
        }
    }),
    category: (parent_1, _a, context_1) => __awaiter(void 0, [parent_1, _a, context_1], void 0, function* (parent, { categoryId }, context) {
        try {
            const result = yield context.CategoryModel.findById(categoryId);
            return result;
        }
        catch (err) {
            throw new apollo_server_express_1.ApolloError("An error occurred while fetching the category", "Internal Server Error", {
                statusCode: 500,
            });
        }
    }),
    categoryByName: (parent_1, _a, context_1) => __awaiter(void 0, [parent_1, _a, context_1], void 0, function* (parent, { categoryName }, context) {
        try {
            let query = { name: categoryName };
            const result = yield context.CategoryModel.findOne(query);
            return result;
        }
        catch (err) {
            throw new apollo_server_express_1.ApolloError("An error occurred while fetching the category by name", "Internal Server Error", {
                statusCode: 500,
            });
        }
    }),
    reviews: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield context.ReviewModel.find();
            console.log(result);
            return result;
        }
        catch (err) {
            throw new apollo_server_express_1.ApolloError("An error occurred while fetching the categories", "Internal Server Error", {
                statusCode: 500,
            });
        }
    }),
    reviewsByProductId: (parent_1, _a, context_1) => __awaiter(void 0, [parent_1, _a, context_1], void 0, function* (parent, { productId }, context) {
        try {
            const result = yield context.ReviewModel.find({
                productId: productId,
            });
            console.log(result);
            return result;
        }
        catch (err) {
            throw new apollo_server_express_1.ApolloError("An error occurred while fetching the categories", "Internal Server Error", {
                statusCode: 500,
            });
        }
    }),
    review: (parent_1, _a, context_1) => __awaiter(void 0, [parent_1, _a, context_1], void 0, function* (parent, { reviewId }, context) {
        try {
            console.log("the reviewId is.." + reviewId);
            const result = yield context.ReviewModel.findById(reviewId);
            console.log("the result is.." + result);
            return result;
        }
        catch (err) {
            throw new apollo_server_express_1.ApolloError("An error occurred while fetching the review", "Internal Server Error", {
                statusCode: 500,
            });
        }
    }),
    productsByReviewRating: (parent_1, _a, context_1) => __awaiter(void 0, [parent_1, _a, context_1], void 0, function* (parent, { minRating, maxRating, categoryId }, context) {
        try {
            const reviews = yield context.ReviewModel.find({
                rating: { $gte: minRating, $lte: maxRating },
            });
            console.log("reviews data", reviews);
            const productIDs = reviews.map((review) => review.get("productId"));
            console.log("productIDs data", productIDs);
            const products = yield context.ProductModel.find({
                _id: { $in: productIDs },
                categoryId: categoryId,
            });
            console.log("products data", products);
            return products;
        }
        catch (err) {
            throw new apollo_server_express_1.ApolloError("An error occurred while fetching the products", "Internal Server Error", { statusCode: 500 });
        }
    }),
    productsByCategory: (parent_1, _a, context_1) => __awaiter(void 0, [parent_1, _a, context_1], void 0, function* (parent, { categoryId }, context) {
        try {
            const products = yield context.ProductModel.find({
                categoryId: categoryId,
            });
            return products;
        }
        catch (err) {
            throw new apollo_server_express_1.ApolloError("An error occurred while fetching the products", "Internal Server Error", { statusCode: 500 });
        }
    }),
};
