'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { ProductVariant } from '@/types/product';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onSelect: (variant: ProductVariant) => void;
}

export function VariantSelector({ variants, selectedVariant, onSelect }: VariantSelectorProps) {
  const sizes = [...new Set(variants.map((v) => v.size))];
  const colors = [...new Set(variants.map((v) => v.color).filter(Boolean))];

  const [selectedSize, setSelectedSize] = useState<string | null>(selectedVariant?.size ?? null);
  const [selectedColor, setSelectedColor] = useState<string | null>(selectedVariant?.color ?? null);

  function handleSizeSelect(size: string) {
    setSelectedSize(size);
    const variant = variants.find(
      (v) => v.size === size && (selectedColor ? v.color === selectedColor : true)
    );
    if (variant) onSelect(variant);
    else {
      // Find first available variant with this size
      const firstAvailable = variants.find((v) => v.size === size && v.stock > 0);
      if (firstAvailable) {
        setSelectedColor(firstAvailable.color);
        onSelect(firstAvailable);
      }
    }
  }

  function handleColorSelect(color: string) {
    setSelectedColor(color);
    const variant = variants.find(
      (v) => v.color === color && (selectedSize ? v.size === selectedSize : true)
    );
    if (variant) onSelect(variant);
    else {
      const firstAvailable = variants.find((v) => v.color === color && v.stock > 0);
      if (firstAvailable) {
        setSelectedSize(firstAvailable.size);
        onSelect(firstAvailable);
      }
    }
  }

  function isVariantAvailable(size: string, color?: string | null): boolean {
    return variants.some(
      (v) =>
        v.size === size &&
        (color ? v.color === color : true) &&
        v.stock > 0
    );
  }

  return (
    <div className="space-y-5">
      {/* Colors */}
      {colors.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">
              Color: <span className="text-muted-foreground font-normal">{selectedColor ?? 'Select'}</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const available = selectedSize ? isVariantAvailable(selectedSize, color) : true;
              return (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  disabled={!available}
                  className={cn(
                    'relative h-8 w-8 rounded-full border-2 transition-all',
                    selectedColor === color
                      ? 'border-brand-accent ring-2 ring-brand-accent/30'
                      : 'border-border hover:border-brand-accent/50',
                    !available && 'opacity-30 cursor-not-allowed'
                  )}
                  title={color}
                  aria-label={`Color: ${color}`}
                >
                  <span
                    className="absolute inset-1 rounded-full"
                    style={{ backgroundColor: color.toLowerCase() }}
                  />
                  {!available && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="block w-full h-px bg-muted-foreground rotate-45 origin-center" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Sizes */}
      {sizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">
              Size: <span className="text-muted-foreground font-normal">{selectedSize ?? 'Select'}</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const available = selectedColor
                ? isVariantAvailable(size, selectedColor)
                : isVariantAvailable(size);
              return (
                <button
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  disabled={!available}
                  className={cn(
                    'min-w-[3rem] px-3 py-2 text-sm font-medium border rounded-button transition-all',
                    selectedSize === size
                      ? 'border-brand-primary bg-brand-primary text-white'
                      : 'border-border hover:border-brand-primary',
                    !available && 'opacity-30 cursor-not-allowed line-through'
                  )}
                  aria-label={`Size: ${size}`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Stock info */}
      {selectedVariant && (
        <p className="text-xs text-muted-foreground">
          {selectedVariant.stock > 0 ? (
            selectedVariant.stock <= 5 ? (
              <span className="text-brand-crimson font-medium">Only {selectedVariant.stock} left!</span>
            ) : (
              <span className="text-green-600">In stock</span>
            )
          ) : (
            <span className="text-red-500 font-medium">Out of stock</span>
          )}
        </p>
      )}
    </div>
  );
}
