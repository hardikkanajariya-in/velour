'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, TrendingUp, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/ui.store';
import { useDebounce } from '@/hooks/use-debounce';

const popularSearches = ['Dresses', 'Jeans', 'T-Shirts', 'Kurtas', 'Sneakers', 'Jackets'];

export function SearchOverlay() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { searchOpen, closeSearch, searchQuery, setSearchQuery } = useUIStore();
  const debouncedQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch();
    };
    if (searchOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [searchOpen, closeSearch]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      closeSearch();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeSearch} />
      <div className="relative bg-white w-full shadow-lg">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-4 sm:py-6">
          <form onSubmit={handleSubmit} className="relative mb-4 sm:mb-6">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, brands, categories..."
              className="w-full pl-10 sm:pl-12 pr-12 py-3 sm:py-4 text-base sm:text-lg bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent"
            />
            <button
              type="button"
              onClick={closeSearch}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-neutral-200 rounded-md min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <X className="h-5 w-5" />
            </button>
          </form>

          {!debouncedQuery && (
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2.5 sm:mb-3 flex items-center gap-2">
                  <TrendingUp className="h-3.5 w-3.5" /> Popular Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSearch(term)}
                      className="px-3 sm:px-4 py-2 text-sm bg-neutral-100 hover:bg-neutral-200 rounded-full text-neutral-700 transition-colors min-h-[40px]"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
