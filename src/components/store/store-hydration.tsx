"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { useUIStore } from "@/store/ui.store";

export function StoreHydration() {
  useEffect(() => {
    useCartStore.persist.rehydrate();
    useWishlistStore.persist.rehydrate();
    useUIStore.persist.rehydrate();
  }, []);

  return null;
}
