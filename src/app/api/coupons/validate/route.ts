import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { code, subtotal } = await request.json();

    const coupon = await prisma.coupon.findFirst({
      where: {
        code: code.toUpperCase(),
        isActive: true,
        validFrom: { lte: new Date() },
        validUntil: { gte: new Date() },
      },
    });

    if (!coupon) {
      return NextResponse.json({ error: 'Invalid or expired coupon' }, { status: 400 });
    }

    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      return NextResponse.json(
        { error: `Minimum order of ₹${coupon.minOrderAmount} required` },
        { status: 400 }
      );
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 400 });
    }

    let discount: number;
    if (coupon.type === 'PERCENTAGE') {
      discount = Math.min(
        (subtotal * coupon.value) / 100,
        coupon.maxDiscount ?? Infinity
      );
    } else {
      discount = coupon.value;
    }

    return NextResponse.json({
      valid: true,
      discount: Math.round(discount),
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        description: coupon.description,
      },
    });
  } catch (error) {
    console.error('Coupon validate error:', error);
    return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 });
  }
}
