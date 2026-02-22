import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type BadgeVariant =
  | "new"
  | "sale"
  | "featured"
  | "hot"
  | "limited"
  | "default"
  | "success"
  | "warning"
  | "error";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  new: "bg-brand-accent text-brand-primary",
  sale: "bg-brand-crimson text-white",
  featured: "bg-brand-primary text-white",
  hot: "bg-orange-500 text-white",
  limited: "bg-purple-600 text-white",
  default: "bg-neutral-100 text-neutral-700",
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  error: "bg-red-100 text-red-800",
};

export function Badge({
  variant = "default",
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
