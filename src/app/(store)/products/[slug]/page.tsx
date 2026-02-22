import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ProductDetailClient } from '@/components/store/product/product-detail-client';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    select: { name: true, shortDescription: true, seoTitle: true, seoDescription: true, images: { take: 1, orderBy: { order: 'asc' } } },
  });

  if (!product) return { title: 'Product Not Found' };

  return {
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.shortDescription || `Shop ${product.name} at VELOUR`,
    openGraph: {
      title: product.seoTitle || product.name,
      description: product.seoDescription || product.shortDescription || `Shop ${product.name} at VELOUR`,
      images: product.images[0]?.url ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      images: { orderBy: { order: 'asc' } },
      variants: true,
      category: { select: { id: true, name: true, slug: true } },
      brand: { select: { id: true, name: true, slug: true } },
      reviews: {
        where: { isApproved: true },
        include: {
          user: { select: { id: true, name: true, avatar: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });

  if (!product) notFound();

  // Increment view count (fire-and-forget)
  prisma.product.update({
    where: { id: product.id },
    data: { viewCount: { increment: 1 } },
  }).catch(() => {});

  // Get related products
  const relatedProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      id: { not: product.id },
      OR: [
        ...(product.categoryId ? [{ categoryId: product.categoryId }] : []),
        ...(product.brandId ? [{ brandId: product.brandId }] : []),
      ],
    },
    include: {
      images: { orderBy: { order: 'asc' } },
      variants: true,
      category: { select: { id: true, name: true, slug: true } },
      brand: { select: { id: true, name: true, slug: true } },
    },
    take: 4,
  });

  // Serialize dates to strings for client component
  const serializedProduct = JSON.parse(JSON.stringify(product));
  const serializedReviews = JSON.parse(JSON.stringify(product.reviews));
  const serializedRelated = JSON.parse(JSON.stringify(relatedProducts));

  return (
    <ProductDetailClient
      product={serializedProduct}
      reviews={serializedReviews}
      relatedProducts={serializedRelated}
    />
  );
}
