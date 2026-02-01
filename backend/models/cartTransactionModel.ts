import { ApolloError } from "apollo-server-errors";
import { getProductById } from "./productModel";
import { getCartByUserId, getCartItem } from "./cartModel";

export async function addToCartTransaction(userId: number, items: Array<{ productId: number, quantity: number }>, context: any) {
  return await context.prisma.$transaction(async (tx: any) => {
    for (const item of items) {
      const product = await getProductById(item.productId);
      if (!product) {
        throw new ApolloError("Product not found", "Not Found", { statusCode: 404 });
      }
      // No inventory change here, just check if requested quantity is positive
      if (item.quantity <= 0) {
        throw new ApolloError(`Quantity must be greater than zero for product ${item.productId}`, "Bad Request", { statusCode: 400 });
      }
    }
    // Find or create cart first
    let cart = await tx.cart.findUnique({ where: { userId }, include: { items: true } }) as { id: number, items: Array<{ id: number, productId: number, quantity: number }> } | null;
    if (!cart) {
      cart = await tx.cart.create({
        data: {
          userId,
          items: { create: items.map(item => ({ productId: item.productId, quantity: item.quantity })) },
        },
        include: { items: true },
      }) as { id: number, items: Array<{ id: number, productId: number, quantity: number }> };
    } else {
      // For each item, upsert cartItem
      for (const item of items) {
        const existingItem = cart.items.find((i: { productId: number }) => i.productId === item.productId);
        if (existingItem) {
          await tx.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + item.quantity },
          });
        } else {
          await tx.cartItem.create({
            data: { cartId: cart.id, productId: item.productId, quantity: item.quantity },
          });
        }
      }
    }
    // Return updated cart
    return await tx.cart.findUnique({ where: { userId }, include: { items: true } });
  });
}

export async function removeFromCartTransaction(userId: number, productId: number, context: any) {
  return await context.prisma.$transaction(async (tx: any) => {
    const cart = await getCartByUserId(userId);
    if (!cart) {
      throw new ApolloError("Cart not found", "Not Found", { statusCode: 404 });
    }
    const cartItem = await getCartItem(cart.id, productId);
    if (!cartItem) {
      throw new ApolloError("Item not found in cart", "Not Found", { statusCode: 404 });
    }
    await tx.product.update({ where: { id: productId }, data: { quantity: { increment: cartItem.quantity } } });
    await tx.cartItem.delete({ where: { id: cartItem.id } });
  });
}

export async function updateCartTransaction(userId: number, productId: number, quantity: number, context: any) {
  return await context.prisma.$transaction(async (tx: any) => {
    const cart = await tx.cart.findUnique({ where: { userId } });
    if (!cart) {
      throw new ApolloError("Cart not found", "Not Found", { statusCode: 404 });
    }
    const cartItem = await tx.cartItem.findFirst({ where: { cartId: cart.id, productId } });
    if (!cartItem) {
      throw new ApolloError("Item not found in cart", "Not Found", { statusCode: 404 });
    }
    const product = await getProductById(productId);
    if (!product) {
      throw new ApolloError("Product not found", "Not Found", { statusCode: 404 });
    }
    const currentQuantityInCart = cartItem.quantity;
    if (quantity === 0) {
      await tx.product.update({ where: { id: productId }, data: { quantity: { increment: currentQuantityInCart } } });
      await tx.cartItem.delete({ where: { id: cartItem.id } });
      return;
    }
    const quantityDifference = quantity - currentQuantityInCart;
    if (quantityDifference > 0) {
      if (product.quantity < quantityDifference) {
        throw new ApolloError(`Insufficient stock. Only ${product.quantity} items available to add.`, "Bad Request", { statusCode: 400 });
      }
      await tx.product.update({ where: { id: productId }, data: { quantity: { decrement: quantityDifference } } });
    } else if (quantityDifference < 0) {
      await tx.product.update({ where: { id: productId }, data: { quantity: { increment: Math.abs(quantityDifference) } } });
    }
    await tx.cartItem.update({ where: { id: cartItem.id }, data: { quantity } });
  });
}
