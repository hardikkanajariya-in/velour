import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') ?? '';

    if (q.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { tags: { hasSome: [q.toLowerCase()] } },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        basePrice: true,
        images: { take: 1, orderBy: { order: 'asc' } },
      },
      take: 8,
    });

    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
        name: { contains: q, mode: 'insensitive' },
      },
      select: { id: true, name: true, slug: true },
      take: 4,
    });

    return NextResponse.json({ products, categories });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
