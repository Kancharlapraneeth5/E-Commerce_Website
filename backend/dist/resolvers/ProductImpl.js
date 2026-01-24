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
exports.Product = {
    category: (_a, _args_1, context_1) => __awaiter(void 0, [_a, _args_1, context_1], void 0, function* ({ categoryId }, _args, context) {
        try {
            const category = yield context.prisma.category.findUnique({ where: { id: Number(categoryId) } });
            return category;
        }
        catch (err) {
            throw new apollo_server_errors_1.ApolloError("An error occurred while fetching the category", "Internal Server Error", { statusCode: 500 });
        }
    }),
    reviews: (_a, _args_1, context_1) => __awaiter(void 0, [_a, _args_1, context_1], void 0, function* ({ id }, _args, context) {
        try {
            const reviews = yield context.prisma.review.findMany({ where: { productId: Number(id) } });
            return reviews;
        }
        catch (err) {
            throw new apollo_server_errors_1.ApolloError("An error occurred while fetching the reviews", "Internal Server Error", { statusCode: 500 });
        }
    }),
};
