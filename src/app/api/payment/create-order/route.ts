import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { createRazorpayOrder } from '@/lib/razorpay';
import { getShippingCost } from '@/lib/site';
import { GST_RATE } from '@/lib/constants';
import { generateOrderNumber } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { shippingAddress, couponCode } = await request.json();

    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: { product: { include: { images: { take: 1 } } }, variant: true },
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const subtotal = cartItems.reduce(
      (sum: number, item: typeof cartItems[number]) =>
        sum + (item.product.basePrice + item.variant.additionalPrice) * item.quantity,
      0
    );

    let discount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findFirst({
        where: { code: couponCode, isActive: true },
      });
      if (coupon) {
        discount = coupon.type === 'PERCENTAGE'
          ? Math.min((subtotal * coupon.value) / 100, coupon.maxDiscount ?? Infinity)
          : coupon.value;
      }
    }

    const shipping = getShippingCost(subtotal, 'standard');
    const tax = Math.round((subtotal - discount) * GST_RATE);
    const total = subtotal - discount + shipping + tax;

    const orderNumber = generateOrderNumber();

    // Create Razorpay order
    const razorpayOrder = await createRazorpayOrder(total, orderNumber);

    // Create order in DB with PENDING status
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session.user.id,
        shippingAddress: shippingAddress ?? {},
        subtotal,
        discount,
        shippingCost: shipping,
        tax,
        total,
        paymentMethod: 'ONLINE',
        paymentStatus: 'PENDING',
        status: 'PENDING',
        razorpayOrderId: razorpayOrder.id,
        items: {
          create: cartItems.map((item: typeof cartItems[number]) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.product.basePrice + item.variant.additionalPrice,
            productName: item.product.name,
            size: item.variant.size,
            color: item.variant.color,
            image: item.product.images?.[0]?.url ?? '',
          })),
        },
        timeline: {
          create: { status: 'PENDING', message: 'Order created, payment pending' },
        },
      },
    });

    return NextResponse.json({
      orderId: order.id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    console.error('Payment create-order error:', error);
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 });
  }
}
