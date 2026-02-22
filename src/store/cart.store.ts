import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItemData } from "@/types/cart";

interface CartStore {
  items: CartItemData[];
  isOpen: boolean;
  isLoading: boolean;

  addItem: (item: CartItemData) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  setLoading: (loading: boolean) => void;
  setItems: (items: CartItemData[]) => void;

  totalItems: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isLoading: false,

      addItem: (item) => {
        const items = get().items;
        const existing = items.find((i) => i.variantId === item.variantId);

        if (existing) {
          set({
            items: items.map((i) =>
              i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i,
            ),
          });
        } else {
          set({ items: [...items, item] });
        }
      },

      removeItem: (variantId) => {
        set({ items: get().items.filter((i) => i.variantId !== variantId) });
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.variantId === variantId ? { ...i, quantity } : i,
          ),
        });
      },

      clearCart: () => set({ items: [] }),
      openDrawer: () => set({ isOpen: true }),
      closeDrawer: () => set({ isOpen: false }),
      setLoading: (loading) => set({ isLoading: loading }),
      setItems: (items) => set({ items }),

      totalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: () =>
        get().items.reduce(
          (sum, item) =>
            sum +
            (item.product.basePrice + item.variant.additionalPrice) *
              item.quantity,
          0,
        ),
    }),
    {
      name: "velour-cart",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            },
      ),
      partialize: (state) => ({ items: state.items }),
      skipHydration: true,
    },
  ),
);
