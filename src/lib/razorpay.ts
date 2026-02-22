import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createRazorpayOrder(
  amount: number,
  receipt: string
): Promise<{ id: string; amount: number; currency: string }> {
  const order = await razorpay.orders.create({
    amount: Math.round(amount * 100), // Razorpay expects paise
    currency: 'INR',
    receipt,
  });

  return {
    id: order.id,
    amount: Number(order.amount),
    currency: order.currency,
  };
}

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex');

  return expectedSignature === signature;
}

export { razorpay };
