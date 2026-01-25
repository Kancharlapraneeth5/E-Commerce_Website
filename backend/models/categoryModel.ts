import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createCategory = async (name: string) => {
	return prisma.category.create({ data: { name } });
};
export const updateCategory = async (id: number, name: string) => {
	return prisma.category.update({ where: { id }, data: { name } });
};
export const deleteCategory = async (id: number) => {
	return prisma.category.delete({ where: { id } });
};

export const getCategoryById = async (id: number) => {
	return prisma.category.findUnique({ where: { id } });
};

export const getCategoryByName = async (name: string) => {
	return prisma.category.findFirst({ where: { name } });
};

export const getAllCategories = async () => {
	return prisma.category.findMany();
};
