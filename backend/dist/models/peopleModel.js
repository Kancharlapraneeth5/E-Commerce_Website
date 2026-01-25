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
exports.clearUserRefreshToken = exports.findUserByRefreshToken = exports.updateUserById = exports.getAllUsers = exports.getUserByUsername = exports.getUserById = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.people.create({ data });
});
exports.createUser = createUser;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.people.findUnique({ where: { id } });
});
exports.getUserById = getUserById;
const getUserByUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.people.findFirst({ where: { username } });
});
exports.getUserByUsername = getUserByUsername;
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.people.findMany();
});
exports.getAllUsers = getAllUsers;
const updateUserById = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.people.update({ where: { id }, data });
});
exports.updateUserById = updateUserById;
const findUserByRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.people.findFirst({ where: { refreshToken } });
});
exports.findUserByRefreshToken = findUserByRefreshToken;
const clearUserRefreshToken = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.people.update({ where: { id }, data: { refreshToken: null } });
});
exports.clearUserRefreshToken = clearUserRefreshToken;
