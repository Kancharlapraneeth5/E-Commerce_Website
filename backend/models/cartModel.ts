import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createCart = async (userId: number, items: any[]) => {
	return prisma.cart.create({ data: { userId, items: { create: items } }, include: { items: true } });
};
export const upsertCart = async (userId: number, items: any[]) => {
	return prisma.cart.upsert({
		where: { userId },
		update: { items: { create: items } },
		create: { userId, items: { create: items } },
		include: { items: true }
	});
};
export const updateCartItem = async (cartItemId: number, quantity: number) => {
	return prisma.cartItem.update({ where: { id: cartItemId }, data: { quantity } });
};
export const deleteCartItem = async (cartItemId: number) => {
	return prisma.cartItem.delete({ where: { id: cartItemId } });
};

export const getCartByUserId = async (userId: number) => {
	// userId is unique in Cart
	return prisma.cart.findUnique({ where: { userId }, include: { items: true } });
};

export const getCartItem = async (cartId: number, productId: number) => {
	// CartItem does not have a compound unique key in schema.prisma, so we filter by cartId and productId
	return prisma.cartItem.findFirst({ where: { cartId, productId } });
};

export const getAllCarts = async () => {
	return prisma.cart.findMany({ include: { items: true } });
};

export const getCartItemsByUserId = async (userId: number) => {
	// Find the cart for the user, then get items by cartId
	const cart = await prisma.cart.findUnique({ where: { userId } });
	if (!cart) return [];
	return prisma.cartItem.findMany({ where: { cartId: cart.id } });
};
