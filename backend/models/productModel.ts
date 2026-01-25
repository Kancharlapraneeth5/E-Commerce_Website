import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createProduct = async (data: any) => {
	return prisma.product.create({ data });
};
export const createProducts = async (products: any[]) => {
	return prisma.product.createMany({ data: products });
};
export const updateProduct = async (id: number, data: any) => {
	return prisma.product.update({ where: { id }, data });
};
export const deleteProduct = async (id: number) => {
	return prisma.product.delete({ where: { id } });
};

export const getProductById = async (id: number) => {
	return prisma.product.findUnique({ where: { id } });
};

export const getProductByName = async (name: string) => {
	return prisma.product.findFirst({ where: { name } });
};

export const getProductsByCategory = async (categoryId: number, filter?: { onSale?: boolean }) => {
	const where: any = { categoryId };
	if (filter && filter.onSale !== undefined) {
		where.onSale = filter.onSale;
	}
	return prisma.product.findMany({ where });
};

export const getAllProducts = async (filter?: { onSale?: boolean }) => {
	return prisma.product.findMany({ where: filter || {} });
};
