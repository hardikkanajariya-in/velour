'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useCallback } from 'react';
import { ChevronDown, X, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { SORT_OPTIONS, PRODUCT_SIZES } from '@/lib/constants';

interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface ProductFilterProps {
  categories?: FilterOption[];
  brands?: FilterOption[];
  colors?: FilterOption[];
  priceRanges?: FilterOption[];
  totalProducts?: number;
}

export function ProductFilter({
  categories = [],
  brands = [],
  colors = [],
  priceRanges = [],
  totalProducts = 0,
}: ProductFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const selectedCategories = searchParams.get('category')?.split(',').filter(Boolean) ?? [];
  const selectedBrands = searchParams.get('brand')?.split(',').filter(Boolean) ?? [];
  const selectedSizes = searchParams.get('size')?.split(',').filter(Boolean) ?? [];
  const selectedColors = searchParams.get('color')?.split(',').filter(Boolean) ?? [];
  const selectedPrice = searchParams.get('price') ?? '';
  const selectedSort = searchParams.get('sort') ?? '';

  const updateFilter = useCallback(
    (key: string, value: string, isMulti = true) => {
      const params = new URLSearchParams(searchParams.toString());

      if (isMulti) {
        const current = params.get(key)?.split(',').filter(Boolean) ?? [];
        const updated = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];

        if (updated.length > 0) {
          params.set(key, updated.join(','));
        } else {
          params.delete(key);
        }
      } else {
        if (params.get(key) === value) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }

      params.delete('page');
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  function clearAll() {
    router.push(pathname);
  }

  const hasFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    selectedSizes.length > 0 ||
    selectedColors.length > 0 ||
    selectedPrice !== '';

  const filterContent = (
    <div className="space-y-1">
      {/* Active Filters */}
      {hasFilters && (
        <div className="pb-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Active Filters
            </span>
            <button
              onClick={clearAll}
              className="text-xs text-brand-accent hover:underline"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[...selectedCategories, ...selectedBrands, ...selectedSizes, ...selectedColors, selectedPrice]
              .filter(Boolean)
              .map((filter) => (
                <span
                  key={filter}
                  className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-muted rounded-full"
                >
                  {filter}
                  <button className="hover:text-brand-accent">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
          </div>
        </div>
      )}

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="border-b border-border pb-4">
          <h3 className="text-sm font-semibold mb-3">Category</h3>
          <div className="space-y-2">
            {categories.map((cat) => (
              <label key={cat.value} className="flex items-center gap-2 cursor-pointer group">
                <Checkbox
                  checked={selectedCategories.includes(cat.value)}
                  onChange={() => updateFilter('category', cat.value)}
                />
                <span className="text-sm group-hover:text-brand-accent transition-colors">
                  {cat.label}
                </span>
                {cat.count !== undefined && (
                  <span className="text-xs text-muted-foreground ml-auto">({cat.count})</span>
                )}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Size Filter */}
      <div className="border-b border-border pb-4">
        <h3 className="text-sm font-semibold mb-3">Size</h3>
        <div className="flex flex-wrap gap-2">
          {PRODUCT_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => updateFilter('size', size)}
              className={cn(
                'min-w-[2.5rem] px-2.5 py-1.5 text-xs font-medium border rounded-button transition-all',
                selectedSizes.includes(size)
                  ? 'border-brand-primary bg-brand-primary text-white'
                  : 'border-border hover:border-brand-primary'
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      {brands.length > 0 && (
        <div className="border-b border-border pb-4">
          <h3 className="text-sm font-semibold mb-3">Brand</h3>
          <div className="space-y-2">
            {brands.map((brand) => (
              <label key={brand.value} className="flex items-center gap-2 cursor-pointer group">
                <Checkbox
                  checked={selectedBrands.includes(brand.value)}
                  onChange={() => updateFilter('brand', brand.value)}
                />
                <span className="text-sm group-hover:text-brand-accent transition-colors">
                  {brand.label}
                </span>
                {brand.count !== undefined && (
                  <span className="text-xs text-muted-foreground ml-auto">({brand.count})</span>
                )}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Color Filter */}
      {colors.length > 0 && (
        <div className="border-b border-border pb-4">
          <h3 className="text-sm font-semibold mb-3">Color</h3>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color.value}
                onClick={() => updateFilter('color', color.value)}
                className={cn(
                  'h-7 w-7 rounded-full border-2 transition-all',
                  selectedColors.includes(color.value)
                    ? 'border-brand-accent ring-2 ring-brand-accent/30'
                    : 'border-border hover:border-brand-accent/50'
                )}
                style={{ backgroundColor: color.value.toLowerCase() }}
                title={color.label}
                aria-label={`Color: ${color.label}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Price Filter */}
      {priceRanges.length > 0 && (
        <div className="pb-4">
          <h3 className="text-sm font-semibold mb-3">Price</h3>
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <label key={range.value} className="flex items-center gap-2 cursor-pointer group">
                <Checkbox
                  checked={selectedPrice === range.value}
                  onChange={() => updateFilter('price', range.value, false)}
                />
                <span className="text-sm group-hover:text-brand-accent transition-colors">
                  {range.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setMobileOpen(!mobileOpen)}
          leftIcon={<SlidersHorizontal className="h-4 w-4" />}
        >
          Filters {hasFilters && `(${[...selectedCategories, ...selectedBrands, ...selectedSizes, ...selectedColors].length})`}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-white p-5 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Filters</h3>
              <button onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            {filterContent}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">
              Filters
              {totalProducts > 0 && (
                <span className="text-sm text-muted-foreground font-normal ml-1">
                  ({totalProducts} products)
                </span>
              )}
            </h3>
          </div>
          {filterContent}
        </div>
      </aside>
    </>
  );
}
