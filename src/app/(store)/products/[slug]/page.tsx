'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { ProductGallery } from '@/components/store/product/product-gallery';
import { VariantSelector } from '@/components/store/product/variant-selector';
import { SizeGuideModal } from '@/components/store/product/size-guide-modal';
import { ReviewList } from '@/components/store/review/review-list';
import { ReviewForm } from '@/components/store/review/review-form';
import { RelatedProducts } from '@/components/store/product/related-products';
import { RecentlyViewed } from '@/components/store/product/recently-viewed';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Rating } from '@/components/ui/rating';
import { Tabs } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useCartStore } from '@/store/cart.store';
import { useWishlistStore } from '@/store/wishlist.store';
import { useUIStore } from '@/store/ui.store';
import { formatPrice, getDiscountPercentage, getEstimatedDelivery, cn } from '@/lib/utils';
import { siteConfig } from '@/../site.config';
import type { Product, ProductVariant, ProductListItem } from '@/types/product';
import type { Review } from '@/types/review';
import {
  Heart, ShoppingBag, Truck, RotateCcw, Shield, Share2, Minus, Plus, Ruler,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<ProductListItem[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const { addItem, openDrawer } = useCartStore();
  const { items: wishlistItems, toggleItem: toggleWishlist } = useWishlistStore();
  const { addToRecentlyViewed } = useUIStore();

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${slug}`);
      if (!res.ok) throw new Error('Product not found');
      const data = await res.json();
      setProduct(data.product);
      setReviews(data.reviews ?? []);
      setRelatedProducts(data.relatedProducts ?? []);
      if (data.product.variants?.length > 0) {
        const inStock = data.product.variants.find((v: ProductVariant) => v.stock > 0);
        setSelectedVariant(inStock ?? data.product.variants[0]);
      }
    } catch {
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  useEffect(() => {
    if (product) addToRecentlyViewed(product.id);
  }, [product, addToRecentlyViewed]);

  if (loading) return <ProductDetailSkeleton />;
  if (!product) return <div className="py-20 text-center text-muted-foreground">Product not found</div>;

  const price = selectedVariant
    ? product.basePrice + selectedVariant.additionalPrice
    : product.basePrice;
  const discount = product.comparePrice ? getDiscountPercentage(product.comparePrice, price) : 0;
  const isWishlisted = wishlistItems.includes(product.id);
  const inStock = selectedVariant ? selectedVariant.stock > 0 : false;
  const remaining = siteConfig.shipping.freeShippingThreshold - price * quantity;

  function handleAddToCart() {
    if (!selectedVariant) {
      toast.error('Please select a size');
      return;
    }
    if (!inStock) {
      toast.error('This variant is out of stock');
      return;
    }
    addItem({
      id: `${product!.id}-${selectedVariant.id}`,
      productId: product!.id,
      variantId: selectedVariant.id,
      quantity,
      product: {
        id: product!.id,
        name: product!.name,
        slug: product!.slug,
        basePrice: product!.basePrice,
        images: product!.images,
      },
      variant: selectedVariant,
    });
    openDrawer();
    toast.success('Added to cart');
  }

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied!');
    } catch {
      toast.error('Failed to copy link');
    }
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-6">
      <Breadcrumb
        items={[
          { label: 'Products', href: '/products' },
          ...(product.category
            ? [{ label: product.category.name, href: `/category/${product.category.slug}` }]
            : []),
          { label: product.name },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-6">
        {/* Gallery */}
        <ProductGallery images={product.images} name={product.name} />

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="flex flex-wrap gap-2 mb-3">
            {product.isNewArrival && <Badge variant="new">New Arrival</Badge>}
            {product.isBestSeller && <Badge variant="hot">Best Seller</Badge>}
            {discount > 0 && <Badge variant="sale">{discount}% OFF</Badge>}
          </div>

          {product.brand && (
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
              {product.brand.name}
            </p>
          )}

          <h1 className="text-2xl md:text-3xl font-heading font-bold mb-2">{product.name}</h1>

          <div className="flex items-center gap-3 mb-4">
            <Rating value={product.averageRating} />
            <span className="text-sm text-muted-foreground">
              ({product.reviewCount} review{product.reviewCount !== 1 ? 's' : ''})
            </span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-2xl font-bold">{formatPrice(price)}</span>
            {product.comparePrice && product.comparePrice > price && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>

          {product.shortDescription && (
            <p className="text-muted-foreground mb-6">{product.shortDescription}</p>
          )}

          {/* Variant Selector */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Select Size & Color</span>
              <button
                onClick={() => setShowSizeGuide(true)}
                className="text-sm text-accent hover:underline flex items-center gap-1"
              >
                <Ruler className="w-3.5 h-3.5" /> Size Guide
              </button>
            </div>
            <VariantSelector
              variants={product.variants}
              selectedVariant={selectedVariant}
              onSelect={setSelectedVariant}
            />
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm font-medium">Quantity</span>
            <div className="flex items-center border border-border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-muted transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center text-sm font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="p-2 hover:bg-muted transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stock Status */}
          {selectedVariant && (
            <p className={cn('text-sm mb-4', inStock ? 'text-green-600' : 'text-red-600')}>
              {inStock
                ? selectedVariant.stock <= 5
                  ? `Only ${selectedVariant.stock} left in stock!`
                  : 'In Stock'
                : 'Out of Stock'}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 mb-6">
            <Button onClick={handleAddToCart} disabled={!inStock} className="flex-1 gap-2">
              <ShoppingBag className="w-4 h-4" />
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            <Button
              variant={isWishlisted ? 'accent' : 'secondary'}
              onClick={() => toggleWishlist(product!.id)}
              className="px-4"
            >
              <Heart className={cn('w-5 h-5', isWishlisted && 'fill-current')} />
            </Button>
            <Button variant="secondary" onClick={handleShare} className="px-4">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>

          {/* Free Shipping Info */}
          {remaining > 0 ? (
            <p className="text-sm text-muted-foreground mb-6">
              Add {formatPrice(remaining)} more for <strong>free shipping</strong>
            </p>
          ) : (
            <p className="text-sm text-green-600 font-medium mb-6">
              ✓ Eligible for free shipping
            </p>
          )}

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 border-t border-border pt-6">
            <div className="flex flex-col items-center text-center gap-1">
              <Truck className="w-5 h-5 text-accent" />
              <span className="text-xs font-medium">Free Shipping</span>
              <span className="text-xs text-muted-foreground">{getEstimatedDelivery(5).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <RotateCcw className="w-5 h-5 text-accent" />
              <span className="text-xs font-medium">Easy Returns</span>
              <span className="text-xs text-muted-foreground">15-day policy</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <Shield className="w-5 h-5 text-accent" />
              <span className="text-xs font-medium">Secure Payment</span>
              <span className="text-xs text-muted-foreground">100% protected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description / Reviews */}
      <div className="mt-12">
        <Tabs
          tabs={[
            {
              label: 'Description',
              value: 'description',
              content: (
                <div className="prose max-w-none py-6">
                  <div dangerouslySetInnerHTML={{ __html: product.description }} />
                </div>
              ),
            },
            {
              label: `Reviews (${product.reviewCount})`,
              value: 'reviews',
              content: (
                <div className="py-6 space-y-8">
                  <ReviewList
                    reviews={reviews}
                    averageRating={product.averageRating}
                    totalReviews={product.reviewCount}
                  />
                  <div className="border-t border-border pt-8">
                    <h3 className="text-lg font-heading font-bold mb-4">Write a Review</h3>
                    <ReviewForm productId={product.id} onSuccess={fetchProduct} />
                  </div>
                </div>
              ),
            },
            {
              label: 'Shipping & Returns',
              value: 'shipping',
              content: (
                <div className="py-6 space-y-4 text-sm text-muted-foreground">
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Shipping</h4>
                    <p>Free shipping on orders above {formatPrice(siteConfig.shipping.freeShippingThreshold)}.</p>
                    <p>Standard delivery: {getEstimatedDelivery(5).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Returns</h4>
                    <p>Easy 15-day returns. Items must be unworn with original tags attached.</p>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Related Products */}
      <RelatedProducts products={relatedProducts} />

      {/* Recently Viewed */}
      <RecentlyViewed excludeId={product.id} />

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-6">
      <Skeleton className="h-4 w-64 mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <Skeleton className="aspect-square rounded-card" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-24 w-full" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-14 rounded" />
            ))}
          </div>
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
