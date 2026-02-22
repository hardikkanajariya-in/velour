import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, rating, title, comment } = await request.json();

    // Check if user has purchased this product
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: { userId: session.user.id, status: 'DELIVERED' },
      },
    });

    // Check if user already reviewed
    const existingReview = await prisma.review.findFirst({
      where: { productId, userId: session.user.id },
    });

    if (existingReview) {
      return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        productId,
        userId: session.user.id,
        rating,
        title: title || null,
        body: comment,
        isVerified: !!hasPurchased,
        isApproved: true, // Auto-approve for now
      },
    });

    // Update product average rating
    const reviews = await prisma.review.findMany({
      where: { productId, isApproved: true },
      select: { rating: true },
    });

    const avgRating = reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviews.length;

    await prisma.product.update({
      where: { id: productId },
      data: {
        averageRating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error('Reviews POST error:', error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
