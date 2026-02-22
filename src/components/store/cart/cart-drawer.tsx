"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Minus,
  Plus,
  Trash2,
  Tag,
  ShoppingBag,
  ArrowRight,
  X,
} from "lucide-react";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart.store";
import { formatPrice } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import { getRemainingForFreeShipping } from "@/lib/site";
import { useState } from "react";

export function CartDrawer() {
  const router = useRouter();
  const {
    items,
    isOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    subtotal: getSubtotal,
  } = useCartStore();
  const [couponCode, setCouponCode] = useState("");

  const subtotal = getSubtotal();
  const remaining = getRemainingForFreeShipping(subtotal);
  const freeShippingProgress = Math.min(
    (subtotal / siteConfig.shipping.freeShippingThreshold) * 100,
    100,
  );

  function handleCheckout() {
    closeDrawer();
    router.push("/checkout");
  }

  return (
    <Drawer isOpen={isOpen} onClose={closeDrawer} title="Your Bag" side="right">
      <div className="flex flex-col h-full">
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Your bag is empty</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Looks like you haven&apos;t added anything yet
            </p>
            <Button
              onClick={() => {
                closeDrawer();
                router.push("/products");
              }}
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            {/* Free Shipping Progress */}
            <div className="px-4 py-3 bg-surface border-b">
              {remaining > 0 ? (
                <>
                  <p className="text-xs text-muted-foreground mb-2">
                    Add{" "}
                    <span className="font-semibold text-brand-crimson">
                      {formatPrice(remaining)}
                    </span>{" "}
                    more for free shipping
                  </p>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-accent rounded-full transition-all duration-500"
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </>
              ) : (
                <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                  🎉 You&apos;ve unlocked free shipping!
                </p>
              )}
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto divide-y">
              {items.map((item) => {
                const itemPrice =
                  item.product.basePrice + item.variant.additionalPrice;
                return (
                  <div key={item.variantId} className="flex gap-3 p-3 sm:p-4">
                    <div className="relative h-20 w-16 sm:h-24 sm:w-20 shrink-0 rounded-card overflow-hidden bg-muted">
                      {item.product.images[0] ? (
                        <Image
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <ShoppingBag className="h-6 w-6 text-muted-foreground/40" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.product.slug}`}
                        onClick={closeDrawer}
                        className="text-sm font-medium line-clamp-1 hover:text-brand-accent transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.variant.size && `Size: ${item.variant.size}`}
                        {item.variant.size && item.variant.color && " · "}
                        {item.variant.color && `Color: ${item.variant.color}`}
                      </p>
                      <p className="text-sm font-semibold mt-1">
                        {formatPrice(itemPrice)}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-border rounded-button">
                          <button
                            onClick={() =>
                              updateQuantity(item.variantId, item.quantity - 1)
                            }
                            className="p-1.5 hover:bg-muted transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.variantId, item.quantity + 1)
                            }
                            className="p-1.5 hover:bg-muted transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Coupon Input */}
            <div className="px-4 py-3 border-t bg-surface">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) =>
                      setCouponCode(e.target.value.toUpperCase())
                    }
                    placeholder="Coupon code"
                    className="w-full pl-9 pr-3 py-2 text-sm border rounded-button focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
                  />
                  {couponCode && (
                    <button
                      onClick={() => setCouponCode("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                      <X className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  )}
                </div>
                <Button variant="secondary" size="sm" disabled={!couponCode}>
                  Apply
                </Button>
              </div>
            </div>

            {/* Summary & Checkout */}
            <div className="px-4 py-4 border-t space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Subtotal ({items.length} item{items.length > 1 ? "s" : ""})
                </span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Taxes & shipping calculated at checkout
              </p>
              <Button className="w-full" onClick={handleCheckout}>
                Proceed to Checkout
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <button
                onClick={closeDrawer}
                className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
}
