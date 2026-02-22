'use client';

import Link from 'next/link';
import { CartItems } from '@/components/store/cart/cart-items';
import { OrderSummary } from '@/components/store/checkout/order-summary';
import { EmptyState } from '@/components/ui/empty-state';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart.store';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { items } = useCartStore();

  return (
    <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-6">
      <Breadcrumb items={[{ label: 'Cart' }]} />

      <h1 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold mt-4 mb-5 sm:mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12" />}
          heading="Your cart is empty"
          description="Looks like you haven't added anything to your cart yet."
          actionLabel="Continue Shopping"
          actionHref="/products"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <CartItems />
          </div>
          <div>
            <OrderSummary />
            <div className="mt-4 space-y-3">
              <Link href="/checkout" className="block">
                <Button className="w-full gap-2">
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/products" className="block">
                <Button variant="secondary" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
