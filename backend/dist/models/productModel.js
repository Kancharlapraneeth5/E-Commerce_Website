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
exports.getAllProducts = exports.getProductsByCategory = exports.getProductByName = exports.getProductById = exports.deleteProduct = exports.updateProduct = exports.createProducts = exports.createProduct = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createProduct = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.product.create({ data });
});
exports.createProduct = createProduct;
const createProducts = (products) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.product.createMany({ data: products });
});
exports.createProducts = createProducts;
const updateProduct = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.product.update({ where: { id }, data });
});
exports.updateProduct = updateProduct;
const deleteProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.product.delete({ where: { id } });
});
exports.deleteProduct = deleteProduct;
const getProductById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.product.findUnique({ where: { id } });
});
exports.getProductById = getProductById;
const getProductByName = (name) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.product.findFirst({ where: { name } });
});
exports.getProductByName = getProductByName;
const getProductsByCategory = (categoryId, filter) => __awaiter(void 0, void 0, void 0, function* () {
    const where = { categoryId };
    if (filter && filter.onSale !== undefined) {
        where.onSale = filter.onSale;
    }
    return prisma.product.findMany({ where });
});
exports.getProductsByCategory = getProductsByCategory;
const getAllProducts = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.product.findMany({ where: filter || {} });
});
exports.getAllProducts = getAllProducts;
