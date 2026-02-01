
import { PrismaClient, OrderStatus } from '@prisma/client';

export async function createOrderFromCart(prisma: PrismaClient, userId: number, shippingAddress: string) {
  const cart = await prisma.cart.findUnique({ where: { userId }, include: { items: { include: { product: true } } } });
  if (!cart || cart.items.length === 0) throw new Error('Cart is empty');
  // Validate stock for each item
  for (const item of cart.items) {
    if (item.quantity > item.product.quantity) {
      throw new Error(`Product ${item.product.name} does not have enough stock.`);
    }
  }
  const totalAmount = cart.items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
  const order = await prisma.order.create({
    data: {
      userId,
      status: OrderStatus.PENDING_PAYMENT,
      totalAmount,
      shippingAddress,
      items: {
        create: cart.items.map(item => ({ productId: item.productId, quantity: item.quantity, price: item.product.price }))
      }
    },
    include: { items: true }
  });
  // Do NOT clear cart or reduce inventory here
  return order;
}


export async function updateOrderStatus(prisma: PrismaClient, orderId: number, status: string, changedById?: number) {
  // Fetch current order
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error('Order not found');
  const validTransitions: Record<OrderStatus, OrderStatus[]> = {
    PENDING: [OrderStatus.PAID, OrderStatus.CANCELLED],
    PAID: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
    SHIPPED: [OrderStatus.DELIVERED],
    DELIVERED: [],
    CANCELLED: []
  };
  const newStatus = status as OrderStatus;
  if (!validTransitions[order.status].includes(newStatus)) {
    throw new Error(`Invalid status transition from ${order.status} to ${newStatus}`);
  }
  // Update order status
  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus },
    include: { items: true }
  });
  
  // Log status change
  await prisma.orderStatusHistory.create({
    data: {
      orderId: order.id,
      oldStatus: order.status,
      newStatus: newStatus,
      changedById: changedById ?? order.userId // Use provided user/admin id, fallback to order.userId
    }
  });
  return updatedOrder;
}

export async function cancelOrder(prisma: PrismaClient, orderId: number) {
  return prisma.order.update({ where: { id: orderId }, data: { status: 'CANCELLED' } });
}

// Reduce inventory for all items in an order
export const reduceInventoryForOrder = async (prisma: PrismaClient, orderId: number) => {
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (!order) throw new Error('Order not found');
  for (const item of order.items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { quantity: { decrement: item.quantity } },
    });
  }
};
