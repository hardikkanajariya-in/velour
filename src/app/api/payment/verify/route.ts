import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { verifyRazorpaySignature } from "@/lib/razorpay";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      await request.json();

    // Verify signature
    const isValid = verifyRazorpaySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    );

    if (!isValid) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "FAILED",
          timeline: {
            create: {
              status: "PENDING",
              message: "Payment verification failed",
            },
          },
        },
      });
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 },
      );
    }

    // Update order
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "PAID",
        status: "CONFIRMED",
        razorpayPaymentId,
        timeline: {
          create: {
            status: "CONFIRMED",
            message: "Payment received, order confirmed",
          },
        },
      },
    });

    // Decrement stock
    const orderItems = await prisma.orderItem.findMany({
      where: { orderId: order.id },
    });

    for (const item of orderItems) {
      await prisma.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      });
      await prisma.product.update({
        where: { id: item.productId },
        data: { totalSold: { increment: item.quantity } },
      });
    }

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ success: true, orderNumber: order.orderNumber });
  } catch (error) {
    console.error("Payment verify error:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 },
    );
  }
}
