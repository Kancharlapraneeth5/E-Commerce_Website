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
const productModel_1 = require("../models/productModel");
exports.Category = {
    products: (_a, _b) => __awaiter(void 0, [_a, _b], void 0, function* ({ id }, { filter }) {
        try {
            return yield (0, productModel_1.getProductsByCategory)(Number(id), filter);
        }
        catch (err) {
            throw new apollo_server_errors_1.ApolloError("An error occurred while fetching the products", "Internal Server Error", { statusCode: 500 });
        }
    }),
};
