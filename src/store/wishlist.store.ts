import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistStore {
  items: string[];
  isLoaded: boolean;

  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  toggleItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  setItems: (items: string[]) => void;
  count: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoaded: false,

      addItem: (productId) => {
        const items = get().items;
        if (!items.includes(productId)) {
          set({ items: [...items, productId] });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((id) => id !== productId) });
      },

      toggleItem: (productId) => {
        const items = get().items;
        if (items.includes(productId)) {
          set({ items: items.filter((id) => id !== productId) });
        } else {
          set({ items: [...items, productId] });
        }
      },

      isInWishlist: (productId) => get().items.includes(productId),
      setItems: (items) => set({ items, isLoaded: true }),
      count: () => get().items.length,
    }),
    {
      name: 'velour-wishlist',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
