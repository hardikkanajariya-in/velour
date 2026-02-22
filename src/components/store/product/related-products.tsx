'use client';

import { ProductCard } from './product-card';
import type { ProductListItem } from '@/types/product';

interface RelatedProductsProps {
  products: ProductListItem[];
  title?: string;
}

export function RelatedProducts({ products, title = 'You May Also Like' }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-12">
      <h2 className="text-2xl font-heading font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
