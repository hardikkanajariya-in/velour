"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  value: number;
  max?: number;
  count?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

const sizeMap = { sm: "h-3.5 w-3.5", md: "h-4 w-4", lg: "h-5 w-5" };

export function Rating({
  value,
  max = 5,
  count,
  size = "md",
  interactive = false,
  onChange,
  className,
}: RatingProps) {
  const stars = Array.from({ length: max }, (_, i) => {
    const filled = i < Math.floor(value);
    const half = !filled && i < value;

    return (
      <button
        key={i}
        type="button"
        disabled={!interactive}
        onClick={() => interactive && onChange?.(i + 1)}
        className={cn(
          "p-0.5 transition-colors",
          interactive ? "cursor-pointer hover:scale-110" : "cursor-default",
        )}
      >
        <Star
          className={cn(
            sizeMap[size],
            filled
              ? "fill-brand-accent text-brand-accent"
              : half
                ? "fill-brand-accent/50 text-brand-accent"
                : "fill-neutral-200 text-neutral-200",
          )}
        />
      </button>
    );
  });

  return (
    <div className={cn("inline-flex items-center gap-0.5", className)}>
      {stars}
      {count !== undefined && (
        <span className="ml-1 text-xs text-neutral-500">({count})</span>
      )}
    </div>
  );
}
