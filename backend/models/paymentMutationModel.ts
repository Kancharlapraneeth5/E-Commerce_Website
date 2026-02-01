import { PrismaClient, PaymentStatus, PaymentMethod } from '@prisma/client';

export async function updatePaymentStatus(prisma: PrismaClient, paymentId: number, status: PaymentStatus) {
  return prisma.payment.update({
    where: { id: paymentId },
    data: { status },
  });
}

export async function updatePaymentTransactionId(prisma: PrismaClient, paymentId: number, transactionId: string) {
  return prisma.payment.update({
    where: { id: paymentId },
    data: { transactionId },
  });
}

export async function updatePaymentMethod(prisma: PrismaClient, paymentId: number, method: PaymentMethod) {
  return prisma.payment.update({
    where: { id: paymentId },
    data: { method },
  });
}

export async function deletePayment(prisma: PrismaClient, paymentId: number) {
  return prisma.payment.delete({ where: { id: paymentId } });
}
