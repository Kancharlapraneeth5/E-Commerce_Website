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
exports.getAllReviews = exports.getReviewsByProductId = exports.getReviewById = exports.deleteReview = exports.createReview = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function parseDateToISO(dateStr) {
    // If already ISO, return as is
    if (!dateStr || dateStr.includes("T"))
        return dateStr;
    // Expecting DD-MM-YYYY
    const [day, month, year] = dateStr.split("-");
    if (day && month && year) {
        return new Date(`${year}-${month}-${day}T00:00:00.000Z`).toISOString();
    }
    return dateStr;
}
const createReview = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (data.date && typeof data.date === "string") {
        data.date = parseDateToISO(data.date);
    }
    return prisma.review.create({ data });
});
exports.createReview = createReview;
const deleteReview = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.review.delete({ where: { id } });
});
exports.deleteReview = deleteReview;
const getReviewById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.review.findUnique({ where: { id } });
});
exports.getReviewById = getReviewById;
const getReviewsByProductId = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.review.findMany({ where: { productId } });
});
exports.getReviewsByProductId = getReviewsByProductId;
const getAllReviews = () => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.review.findMany();
});
exports.getAllReviews = getAllReviews;
