import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

function parseDateToISO(dateStr: string): string {
	// If already ISO, return as is
	if (!dateStr || dateStr.includes("T")) return dateStr;
	// Expecting DD-MM-YYYY
	const [day, month, year] = dateStr.split("-");
	if (day && month && year) {
		return new Date(`${year}-${month}-${day}T00:00:00.000Z`).toISOString();
	}
	return dateStr;
}

export const createReview = async (data: any) => {
	if (data.date && typeof data.date === "string") {
		data.date = parseDateToISO(data.date);
	}
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
