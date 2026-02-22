'use client';

import { useCartStore } from '@/store/cart.store';
import { formatPrice } from '@/lib/utils';
import { getShippingCost, getRemainingForFreeShipping } from '@/lib/site';
import { GST_RATE } from '@/lib/constants';
import { Truck, ShieldCheck, Tag } from 'lucide-react';

interface OrderSummaryProps {
  couponDiscount?: number;
  couponCode?: string;
}

export function OrderSummary({ couponDiscount = 0, couponCode }: OrderSummaryProps) {
  const { items, subtotal: getSubtotal, totalItems } = useCartStore();
  const subtotal = getSubtotal();
  const shipping = getShippingCost(subtotal, 'standard');
  const tax = Math.round((subtotal - couponDiscount) * GST_RATE);
  const total = subtotal - couponDiscount + shipping + tax;
  const remaining = getRemainingForFreeShipping(subtotal);

  return (
    <div className="border rounded-card p-5 space-y-4 sticky top-24">
      <h3 className="font-semibold text-lg">Order Summary</h3>

      {/* Items List (compact) */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {items.map((item) => (
          <div key={item.variantId} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground truncate mr-2">
              {item.product.name} × {item.quantity}
            </span>
            <span className="font-medium whitespace-nowrap">
              {formatPrice((item.product.basePrice + item.variant.additionalPrice) * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 space-y-2.5">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal ({totalItems()} items)</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        {couponDiscount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span className="flex items-center gap-1">
              <Tag className="h-3.5 w-3.5" />
              Coupon ({couponCode})
            </span>
            <span>-{formatPrice(couponDiscount)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
            {shipping === 0 ? 'Free' : formatPrice(shipping)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax (GST 18%)</span>
          <span>{formatPrice(tax)}</span>
        </div>

        <div className="border-t pt-3 flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      {/* Free Shipping Message */}
      {remaining > 0 && (
        <div className="bg-surface rounded-card p-3 text-xs text-muted-foreground flex items-center gap-2">
          <Truck className="h-4 w-4 text-brand-accent shrink-0" />
          Add {formatPrice(remaining)} more for free shipping
        </div>
      )}

      <div className="pt-2 space-y-1.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" />
          100% Secure Payment
        </div>
      </div>
    </div>
  );
}
