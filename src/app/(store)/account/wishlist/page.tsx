'use client';

import { useEffect, useState } from 'react';
import { useWishlistStore } from '@/store/wishlist.store';
import { ProductCard } from '@/components/store/product/product-card';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart } from 'lucide-react';
import type { ProductListItem } from '@/types/product';

export default function WishlistPage() {
  const { items: wishlistIds } = useWishlistStore();
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWishlist() {
      if (wishlistIds.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/wishlist`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products ?? data ?? []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchWishlist();
  }, [wishlistIds]);

  if (loading) {
    return (
      <div>
        <h2 className="text-lg font-heading font-bold mb-4">My Wishlist</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-card" />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={<Heart className="w-12 h-12" />}
        heading="Your wishlist is empty"
        description="Save items you love for later."
        actionLabel="Discover Products"
        actionHref="/products"
      />
    );
  }

  return (
    <div>
      <h2 className="text-lg font-heading font-bold mb-4">
        My Wishlist ({products.length})
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
