import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UIStore {
  searchQuery: string;
  searchOpen: boolean;
  recentlyViewed: string[];
  mobileNavOpen: boolean;

  setSearchQuery: (query: string) => void;
  openSearch: () => void;
  closeSearch: () => void;
  addToRecentlyViewed: (productId: string) => void;
  clearRecentlyViewed: () => void;
  toggleMobileNav: () => void;
  closeMobileNav: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      searchQuery: "",
      searchOpen: false,
      recentlyViewed: [],
      mobileNavOpen: false,

      setSearchQuery: (query) => set({ searchQuery: query }),
      openSearch: () => set({ searchOpen: true }),
      closeSearch: () => set({ searchOpen: false, searchQuery: "" }),

      addToRecentlyViewed: (productId) => {
        const current = get().recentlyViewed.filter((id) => id !== productId);
        set({ recentlyViewed: [productId, ...current].slice(0, 10) });
      },

      clearRecentlyViewed: () => set({ recentlyViewed: [] }),
      toggleMobileNav: () => set({ mobileNavOpen: !get().mobileNavOpen }),
      closeMobileNav: () => set({ mobileNavOpen: false }),
    }),
    {
      name: "velour-ui",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            },
      ),
      partialize: (state) => ({ recentlyViewed: state.recentlyViewed }),
      skipHydration: true,
    },
  ),
);
