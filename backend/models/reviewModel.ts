import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createReview = async (data: any) => {
	return prisma.review.create({ data });
};
export const deleteReview = async (id: number) => {
	return prisma.review.delete({ where: { id } });
};

export const getReviewById = async (id: number) => {
	return prisma.review.findUnique({ where: { id } });
};

export const getReviewsByProductId = async (productId: number) => {
	return prisma.review.findMany({ where: { productId } });
};

export const getAllReviews = async () => {
	return prisma.review.findMany();
};
