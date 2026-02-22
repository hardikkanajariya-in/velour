"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { formatPrice } from "@/lib/utils";

export function CartItems() {
  const { items, updateQuantity, removeItem } = useCartStore();

  if (items.length === 0) return null;

  return (
    <div className="divide-y border rounded-card">
      {items.map((item) => (
        <div
          key={item.variantId}
          className="flex gap-3 sm:gap-4 p-3 sm:p-4 md:p-6"
        >
          <div className="relative h-24 sm:h-28 w-20 sm:w-24 shrink-0 rounded-card overflow-hidden bg-muted">
            {item.product.images[0] ? (
              <Image
                src={item.product.images[0].url}
                alt={item.product.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-muted-foreground/30" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <Link
                  href={`/products/${item.product.slug}`}
                  className="font-medium hover:text-brand-accent transition-colors line-clamp-1"
                >
                  {item.product.name}
                </Link>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {item.variant.size && `Size: ${item.variant.size}`}
                  {item.variant.size && item.variant.color && " · "}
                  {item.variant.color && `Color: ${item.variant.color}`}
                </p>
              </div>
              <button
                onClick={() => removeItem(item.variantId)}
                className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors shrink-0"
                aria-label="Remove item"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center border border-border rounded-button">
                <button
                  onClick={() =>
                    updateQuantity(item.variantId, item.quantity - 1)
                  }
                  className="p-2 hover:bg-muted transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-medium">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    updateQuantity(item.variantId, item.quantity + 1)
                  }
                  className="p-2 hover:bg-muted transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="font-semibold">
                {formatPrice(
                  (item.product.basePrice + item.variant.additionalPrice) *
                    item.quantity,
                )}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
