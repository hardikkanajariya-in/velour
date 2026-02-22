import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'image' | 'avatar' | 'button';
}

const variantStyles = {
  text: 'h-4 w-full rounded',
  card: 'h-64 w-full rounded-card',
  image: 'aspect-[3/4] w-full rounded-lg',
  avatar: 'h-10 w-10 rounded-full',
  button: 'h-10 w-24 rounded-button',
};

export function Skeleton({ className, variant = 'text' }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-shimmer bg-neutral-200',
        variantStyles[variant],
        className
      )}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton variant="image" />
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
