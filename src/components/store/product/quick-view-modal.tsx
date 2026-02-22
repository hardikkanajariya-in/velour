'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { X, Heart, ShoppingBag, Minus, Plus, Star, Truck, RotateCcw, Shield } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { VariantSelector } from './variant-selector';
import { useCartStore } from '@/store/cart.store';
import { useWishlistStore } from '@/store/wishlist.store';
import { formatPrice, getDiscountPercentage } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { ProductListItem, ProductVariant } from '@/types/product';
import Link from 'next/link';

interface QuickViewModalProps {
  product: ProductListItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();
  const { items: wishlist, toggleItem: toggleWishlist } = useWishlistStore();

  if (!product) return null;

  const isWishlisted = wishlist.includes(product.id);
  const primaryImage = product.images?.[0]?.url ?? '/placeholder-product.png';
  const price = selectedVariant
    ? product.basePrice + selectedVariant.additionalPrice
    : product.basePrice;
  const hasCompare = product.comparePrice !== null && product.comparePrice > price;
  const discount = hasCompare ? getDiscountPercentage(product.comparePrice!, price) : 0;

  function handleAddToCart() {
    if (!selectedVariant || !product) return;
    addItem({
      id: `${product.id}-${selectedVariant.id}`,
      productId: product.id,
      variantId: selectedVariant.id,
      quantity,
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        basePrice: product.basePrice,
        images: product.images,
      },
      variant: selectedVariant,
    });
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Image */}
        <div className="relative aspect-[3/4] rounded-card overflow-hidden bg-muted">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col">
          {product.brand && (
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              {product.brand.name}
            </p>
          )}
          <h2 className="text-xl font-semibold mb-2">{product.name}</h2>

          {product.averageRating > 0 && (
            <div className="flex items-center gap-1 mb-3">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{product.averageRating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
            </div>
          )}

          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl font-bold">{formatPrice(price)}</span>
            {hasCompare && (
              <>
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.comparePrice!)}
                </span>
                <span className="text-xs font-semibold text-green-600">-{discount}%</span>
              </>
            )}
          </div>

          {/* Variant Selector */}
          <div className="mb-4">
            <VariantSelector
              variants={product.variants}
              selectedVariant={selectedVariant}
              onSelect={setSelectedVariant}
            />
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-sm font-medium">Qty:</span>
            <div className="flex items-center border rounded-button">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2 hover:bg-muted transition-colors"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-10 text-center text-sm font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="p-2 hover:bg-muted transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mb-5">
            <Button
              className="flex-1"
              onClick={handleAddToCart}
              disabled={!selectedVariant || (selectedVariant && selectedVariant.stock === 0)}
              leftIcon={<ShoppingBag className="h-4 w-4" />}
            >
              {selectedVariant?.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
            </Button>
            <Button
              variant={isWishlisted ? 'danger' : 'secondary'}
              onClick={() => toggleWishlist(product.id)}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={cn('h-4 w-4', isWishlisted && 'fill-current')} />
            </Button>
          </div>

          {/* USPs */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Truck className="h-3.5 w-3.5" />
              Free shipping on orders above ₹1,999
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <RotateCcw className="h-3.5 w-3.5" />
              Easy 14-day returns
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3.5 w-3.5" />
              100% authentic products
            </div>
          </div>

          <Link
            href={`/products/${product.slug}`}
            onClick={onClose}
            className="mt-auto pt-4 text-sm text-brand-accent hover:underline"
          >
            View Full Details →
          </Link>
        </div>
      </div>
    </Modal>
  );
}
