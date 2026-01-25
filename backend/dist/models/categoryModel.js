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
exports.getAllCategories = exports.getCategoryByName = exports.getCategoryById = exports.deleteCategory = exports.updateCategory = exports.createCategory = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createCategory = (name) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.category.create({ data: { name } });
});
exports.createCategory = createCategory;
const updateCategory = (id, name) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.category.update({ where: { id }, data: { name } });
});
exports.updateCategory = updateCategory;
const deleteCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.category.delete({ where: { id } });
});
exports.deleteCategory = deleteCategory;
const getCategoryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.category.findUnique({ where: { id } });
});
exports.getCategoryById = getCategoryById;
const getCategoryByName = (name) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.category.findFirst({ where: { name } });
});
exports.getCategoryByName = getCategoryByName;
const getAllCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.category.findMany();
});
exports.getAllCategories = getAllCategories;
