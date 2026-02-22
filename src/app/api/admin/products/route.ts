import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { slugify, generateSku } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const limit = parseInt(searchParams.get('limit') ?? '20', 10);
    const search = searchParams.get('search') ?? '';

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          images: { take: 1, orderBy: { order: 'asc' } },
          variants: true,
          category: { select: { name: true } },
          brand: { select: { name: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({ products, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Admin products GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const slug = slugify(body.name);

    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug,
        description: body.description,
        shortDescription: body.shortDescription ?? null,
        categoryId: body.categoryId,
        brandId: body.brandId ?? null,
        basePrice: body.basePrice,
        comparePrice: body.comparePrice ?? null,
        costPrice: body.costPrice ?? null,
        sku: body.sku ?? generateSku('VLR'),
        tags: body.tags ?? [],
        gender: body.gender ?? 'UNISEX',
        isFeatured: body.isFeatured ?? false,
        isNewArrival: body.isNewArrival ?? false,
        isBestSeller: body.isBestSeller ?? false,
        isActive: body.isActive ?? true,
        seoTitle: body.seoTitle ?? null,
        seoDescription: body.seoDescription ?? null,
        images: body.images?.length ? {
          create: body.images.map((img: { url: string; altText?: string }, i: number) => ({
            url: img.url,
            altText: img.altText ?? null,
            isPrimary: i === 0,
            order: i,
          })),
        } : undefined,
        variants: body.variants?.length ? {
          create: body.variants.map((v: { size: string; color: string; colorHex?: string; stock: number; additionalPrice?: number }) => ({
            size: v.size,
            color: v.color,
            colorHex: v.colorHex ?? null,
            stock: v.stock,
            additionalPrice: v.additionalPrice ?? 0,
            sku: `${slug}-${v.size}-${v.color}`.toUpperCase(),
          })),
        } : undefined,
      },
      include: {
        images: true,
        variants: true,
        category: { select: { name: true } },
        brand: { select: { name: true } },
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Admin products POST error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
