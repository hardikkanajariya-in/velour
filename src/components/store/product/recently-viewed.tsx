'use client';

import { useEffect, useState } from 'react';
import { useUIStore } from '@/store/ui.store';
import { ProductCard } from './product-card';
import type { ProductListItem } from '@/types/product';

interface RecentlyViewedProps {
  title?: string;
  excludeId?: string;
}

export function RecentlyViewed({ title = 'Recently Viewed', excludeId }: RecentlyViewedProps) {
  const { recentlyViewed } = useUIStore();
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ids = recentlyViewed.filter((id) => id !== excludeId).slice(0, 4);
    if (ids.length === 0) return;

    setLoading(true);
    fetch(`/api/products?ids=${ids.join(',')}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [recentlyViewed, excludeId]);

  if (products.length === 0 && !loading) return null;

  return (
    <section className="py-12">
      <h2 className="text-2xl font-heading font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
