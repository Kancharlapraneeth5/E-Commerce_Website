// Simple order fetch without items (for access checks)
export async function getOrderByIdSimple(prisma: PrismaClient, orderId: number) {
  return prisma.order.findUnique({ where: { id: orderId } });
}
import { PrismaClient } from '@prisma/client';

export async function getOrdersByUserId(prisma: PrismaClient, userId: number) {
  return prisma.order.findMany({ where: { userId }, include: { items: true } });
}

export async function getOrderById(prisma: PrismaClient, orderId: number) {
  return prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
}
