import { PrismaClient } from '@prisma/client';

export async function getPaymentById(prisma: PrismaClient, paymentId: number) {
  return prisma.payment.findUnique({ where: { id: paymentId } });
}

export async function getPaymentsByOrderId(prisma: PrismaClient, orderId: number) {
  return prisma.payment.findMany({ where: { orderId } });
}

export async function getPaymentsByUserId(prisma: PrismaClient, userId: number) {
  // Find all orders for the user
  const orders = await prisma.order.findMany({ where: { userId } });
  const orderIds = orders.map((o: any) => o.id);
  return prisma.payment.findMany({ where: { orderId: { in: orderIds } } });
}
