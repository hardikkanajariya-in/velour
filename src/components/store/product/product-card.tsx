'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import { cn, formatPrice, getDiscountPercentage } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useWishlistStore } from '@/store/wishlist.store';
import { useUIStore } from '@/store/ui.store';
import type { ProductListItem } from '@/types/product';

interface ProductCardProps {
  product: ProductListItem;
  className?: string;
  onQuickView?: (product: ProductListItem) => void;
}

export function ProductCard({ product, className, onQuickView }: ProductCardProps) {
  const { items: wishlist, toggleItem } = useWishlistStore();
  const { addToRecentlyViewed } = useUIStore();
  const isWishlisted = wishlist.includes(product.id);

  const primaryImage = product.images?.[0]?.url ?? '/placeholder-product.png';
  const secondaryImage = product.images?.[1]?.url;

  const price = product.basePrice;
  const hasCompare = product.comparePrice !== null && product.comparePrice > price;
  const discount = hasCompare ? getDiscountPercentage(product.comparePrice!, price) : 0;

  const isOutOfStock = product.variants?.every((v) => v.stock === 0);

  return (
    <div className={cn('group relative', className)}>
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-card bg-muted">
        <Link
          href={`/products/${product.slug}`}
          onClick={() => addToRecentlyViewed(product.id)}
          className="block h-full w-full"
        >
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className={cn(
              'object-cover transition-all duration-500',
              secondaryImage && 'group-hover:opacity-0'
            )}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {secondaryImage && (
            <Image
              src={secondaryImage}
              alt={`${product.name} alternate`}
              fill
              className="object-cover opacity-0 group-hover:opacity-100 transition-all duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {discount > 0 && (
            <Badge variant="sale" className="text-[10px]">
              -{discount}%
            </Badge>
          )}
          {product.isNewArrival && (
            <Badge variant="new" className="text-[10px]">New</Badge>
          )}
          {isOutOfStock && (
            <Badge variant="default" className="text-[10px]">
              Sold Out
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleItem(product.id);
            }}
            className={cn(
              'p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-colors',
              isWishlisted && 'text-red-500'
            )}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={cn('h-4 w-4', isWishlisted && 'fill-current')} />
          </button>
          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onQuickView(product);
              }}
              className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-colors"
              aria-label="Quick view"
            >
              <Eye className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Quick Add */}
        {!isOutOfStock && (
          <div className="absolute bottom-0 inset-x-0 p-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <Link
              href={`/products/${product.slug}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-brand-primary text-white text-sm font-medium rounded-button hover:bg-brand-primary/90 transition-colors"
            >
              <ShoppingBag className="h-4 w-4" />
              View Product
            </Link>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-3 space-y-1">
        {product.brand && (
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
            {product.brand.name}
          </p>
        )}
        <Link
          href={`/products/${product.slug}`}
          className="block text-sm font-medium line-clamp-1 hover:text-brand-accent transition-colors"
        >
          {product.name}
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{formatPrice(price)}</span>
          {hasCompare && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.comparePrice!)}
            </span>
          )}
        </div>

        {/* Rating */}
        {product.averageRating > 0 && (
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-muted-foreground">
              {product.averageRating.toFixed(1)}
              {product.reviewCount > 0 && ` (${product.reviewCount})`}
            </span>
          </div>
        )}

        {/* Color Swatches */}
        {product.variants && product.variants.length > 0 && (
          <div className="flex items-center gap-1 pt-1">
            {[...new Set(product.variants.map((v) => v.color).filter(Boolean))]
              .slice(0, 4)
              .map((color) => (
                <span
                  key={color}
                  className="h-3 w-3 rounded-full border border-border"
                  style={{ backgroundColor: color?.toLowerCase() }}
                  title={color ?? ''}
                />
              ))}
            {[...new Set(product.variants.map((v) => v.color).filter(Boolean))].length > 4 && (
              <span className="text-[10px] text-muted-foreground">
                +{[...new Set(product.variants.map((v) => v.color).filter(Boolean))].length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
