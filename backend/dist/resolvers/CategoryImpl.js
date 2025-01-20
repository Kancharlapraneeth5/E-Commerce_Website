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
exports.Category = void 0;
const apollo_server_errors_1 = require("apollo-server-errors");
exports.Category = {
    // here the parent is the category object which has the id field
    products: (_a, _b, context_1) => __awaiter(void 0, [_a, _b, context_1], void 0, function* ({ id }, { filter }, context) {
        // categoryId is the field in Query interface
        // id is the field in the object passed as the first argument { id }: { id: string }
        let query = { categoryId: id };
        if (filter) {
            if (filter.onSale !== undefined) {
                query.onSale = filter.onSale;
            }
        }
        try {
            const filterCategoryProducts = yield context.ProductModel.find(query);
            return filterCategoryProducts;
        }
        catch (err) {
            throw new apollo_server_errors_1.ApolloError("An error occurred while fetching the products", "Internal Server Error", { statusCode: 500 });
        }
    }),
};
