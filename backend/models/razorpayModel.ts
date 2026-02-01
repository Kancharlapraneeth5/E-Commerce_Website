import razorpay from '../src/lib/razorpay';
import { PrismaClient } from '@prisma/client';

export async function createRazorpayOrder(prisma: PrismaClient, orderId: number, amount: number, currency = 'INR') {
  // amount in paise (e.g., 100 INR = 10000)
  const options = {
    amount: amount * 100, // Razorpay expects amount in paise
    currency,
    receipt: `order_${orderId}`,
    payment_capture: 1,
  };
  const razorpayOrder = await razorpay.orders.create(options);
  // Optionally, store razorpayOrder.id in your DB for reconciliation
  return razorpayOrder;
}
