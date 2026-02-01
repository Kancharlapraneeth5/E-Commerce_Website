import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createRazorpayOrder } from '../models/razorpayModel';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/payment/razorpay/order
router.post('/order', async (req: Request, res: Response) => {
  try {
    const { orderId, amount } = req.body;
    if (!orderId || !amount) {
      return res.status(400).json({ error: 'orderId and amount are required' });
    }
    const razorpayOrder = await createRazorpayOrder(prisma, orderId, amount);
    res.json({ order: razorpayOrder });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create Razorpay order', details: err });
  }
});


// POST /api/payment/razorpay/webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
  const crypto = await import('crypto');
  const secret = process.env.RAZORPAY_KEY_SECRET as string;
  const signature = req.headers['x-razorpay-signature'] as string;
  const body = req.body;

  // Verify signature
  const expectedSignature = crypto.createHmac('sha256', secret)
    .update(req.body)
    .digest('hex');
  if (signature !== expectedSignature) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  // Parse event
  const event = JSON.parse(body.toString());
  if (event.event === 'payment.captured') {
    try {
      // You should store order_id in Razorpay order notes or receipt for mapping
      const razorpayOrderId = event.payload.payment.entity.order_id;
      // Find your order by razorpayOrderId (store mapping in your DB when creating Razorpay order)
      // For demo, assume receipt is 'order_<orderId>'
      const receipt = event.payload.payment.entity.notes?.receipt || event.payload.payment.entity.notes?.order_id;
      let orderId = null;
      if (receipt && receipt.startsWith('order_')) {
        orderId = parseInt(receipt.replace('order_', ''));
      }
      if (!orderId) {
        return res.status(400).json({ error: 'Order ID not found in payment notes/receipt' });
      }
      const { updateOrderStatus } = await import('../models/orderMutationModel');
      const { reduceInventoryForOrder } = await import('../models/orderMutationModel');
      const { clearCartByUserId } = await import('../models/cartModel');
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();
      // Update order status to PAID
      await updateOrderStatus(prisma, orderId, 'PAID');
      // Reduce inventory
      await reduceInventoryForOrder(prisma, orderId);
      // Clear cart for user
      const order = await prisma.order.findUnique({ where: { id: orderId } });
      if (order) {
        await clearCartByUserId(prisma, order.userId);
      }
    } catch (err) {
      return res.status(500).json({ error: 'Failed to process payment success', details: err });
    }
  }
  res.status(200).json({ status: 'ok' });
});

export default router;
