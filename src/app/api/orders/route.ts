import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { getShippingCost } from '@/lib/site';
import { GST_RATE } from '@/lib/constants';
import { generateOrderNumber } from '@/lib/utils';
import { sendOrderConfirmation } from '@/lib/resend';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              select: { name: true, slug: true, images: { take: 1 } },
            },
            variant: { select: { size: true, color: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Orders GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { shippingAddress, paymentMethod, couponCode } = body;

    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          include: { images: { take: 1 } },
        },
        variant: true,
      },
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Validate stock
    for (const item of cartItems) {
      if (item.variant.stock < item.quantity) {
        return NextResponse.json(
          { error: `${item.product.name} (${item.variant.size}) is out of stock` },
          { status: 400 }
        );
      }
    }

    // Calculate totals
    const subtotal = cartItems.reduce(
      (sum: number, item: typeof cartItems[number]) =>
        sum + (item.product.basePrice + item.variant.additionalPrice) * item.quantity,
      0
    );

    let discount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findFirst({
        where: {
          code: couponCode,
          isActive: true,
          validFrom: { lte: new Date() },
          validUntil: { gte: new Date() },
        },
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

    // Create order in transaction
    const order = await prisma.$transaction(async (tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0]) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: session.user!.id!,
          shippingAddress: body.shippingAddress ?? {},
          subtotal,
          discount,
          shippingCost: shipping,
          tax,
          total,
          paymentMethod: paymentMethod ?? 'ONLINE',
          paymentStatus: 'PENDING',
          status: 'PENDING',
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
            create: {
              status: 'PENDING',
              message: 'Order placed',
            },
          },
        },
      });

      // Decrement stock
      for (const item of cartItems) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
        await tx.product.update({
          where: { id: item.productId },
          data: { totalSold: { increment: item.quantity } },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { userId: session.user!.id! },
      });

      return newOrder;
    });

    // Send confirmation email (non-blocking)
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (user?.email) {
      sendOrderConfirmation(user.email, order.orderNumber, {
        items: cartItems.map((item: typeof cartItems[number]) => ({
          name: item.product.name,
          size: item.variant.size,
          color: item.variant.color,
          qty: item.quantity,
          price: item.product.basePrice + item.variant.additionalPrice,
          image: '',
        })),
        subtotal,
        discount,
        shipping,
        tax,
        total: order.total,
        address: '',
        estimatedDelivery: '',
      }).catch(console.error);
    }

    return NextResponse.json({ orderId: order.id, orderNumber: order.orderNumber }, { status: 201 });
  } catch (error) {
    console.error('Orders POST error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
