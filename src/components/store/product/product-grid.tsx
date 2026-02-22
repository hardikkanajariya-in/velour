'use client';

import { ProductCard } from './product-card';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { PackageOpen } from 'lucide-react';
import type { ProductListItem } from '@/types/product';

interface ProductGridProps {
  products: ProductListItem[];
  loading?: boolean;
  columns?: 2 | 3 | 4;
  onQuickView?: (product: ProductListItem) => void;
}

export function ProductGrid({ products, loading, columns = 4, onQuickView }: ProductGridProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  };

  if (loading) {
    return (
      <div className={`grid ${gridCols[columns]} gap-4 md:gap-6`}>
        {Array.from({ length: columns * 2 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[3/4] rounded-card" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={<PackageOpen className="h-12 w-12" />}
        heading="No products found"
        description="Try adjusting your filters or search to find what you're looking for."
        actionLabel="Clear Filters"
        actionHref="/products"
      />
    );
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-4 md:gap-6`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
      ))}
    </div>
  );
}
