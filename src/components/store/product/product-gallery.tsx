'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProductImage } from '@/types/product';

interface ProductGalleryProps {
  images: ProductImage[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  const activeImage = images[activeIndex] ?? images[0];

  const handlePrev = useCallback(() => {
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  }

  if (!images.length) {
    return (
      <div className="aspect-square bg-muted rounded-card flex items-center justify-center">
        <span className="text-muted-foreground text-sm">No image</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[600px] scrollbar-thin">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              className={cn(
                'relative h-16 w-16 md:h-20 md:w-20 shrink-0 rounded-card overflow-hidden border-2 transition-colors',
                i === activeIndex ? 'border-brand-accent' : 'border-transparent hover:border-border'
              )}
            >
              <Image
                src={img.url}
                alt={img.altText ?? `${name} ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div className="flex-1 relative">
        <div
          className={cn(
            'relative aspect-[3/4] md:aspect-square overflow-hidden rounded-card bg-muted cursor-crosshair',
            isZoomed && 'cursor-zoom-out'
          )}
          onClick={() => setIsZoomed(!isZoomed)}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setIsZoomed(false)}
        >
          <Image
            src={activeImage?.url ?? '/placeholder-product.png'}
            alt={activeImage?.altText ?? name}
            fill
            className={cn(
              'object-cover transition-transform duration-300',
              isZoomed && 'scale-[2.5]'
            )}
            style={
              isZoomed
                ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` }
                : undefined
            }
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />

          {!isZoomed && (
            <button
              className="absolute bottom-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
              aria-label="Zoom image"
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(true);
              }}
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  i === activeIndex ? 'w-6 bg-brand-accent' : 'w-1.5 bg-white/60'
                )}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
