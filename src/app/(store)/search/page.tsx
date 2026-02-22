import { prisma } from '@/lib/prisma';
import { ProductGrid } from '@/components/store/product/product-grid';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { EmptyState } from '@/components/ui/empty-state';
import { Search } from 'lucide-react';
import type { Metadata } from 'next';

interface SearchPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: q ? `Search: ${q}` : 'Search' };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;

  if (!q) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-12">
        <EmptyState
          icon={<Search className="w-12 h-12" />}
          heading="Search for products"
          description="Enter a search term to find products."
          actionLabel="Browse All"
          actionHref="/products"
        />
      </div>
    );
  }

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { tags: { has: q.toLowerCase() } },
      ],
    },
    take: 40,
    orderBy: { totalSold: 'desc' },
    include: {
      images: { orderBy: { order: 'asc' } },
      variants: true,
      category: { select: { id: true, name: true, slug: true } },
      brand: { select: { id: true, name: true, slug: true } },
    },
  });

  return (
    <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-6">
      <Breadcrumb items={[{ label: `Search: "${q}"` }]} />

      <h1 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold mt-4 mb-2">
        Search Results for &ldquo;{q}&rdquo;
      </h1>
      <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">{products.length} results found</p>

      {products.length === 0 ? (
        <EmptyState
          icon={<Search className="w-12 h-12" />}
          heading="No results found"
          description={`We couldn't find any products matching "${q}". Try a different search.`}
          actionLabel="Browse All Products"
          actionHref="/products"
        />
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
