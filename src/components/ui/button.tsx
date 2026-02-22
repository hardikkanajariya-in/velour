import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  as?: 'button' | 'a';
  href?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-primary text-white hover:bg-neutral-800 shadow-button',
  secondary:
    'border-[1.5px] border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white',
  accent:
    'bg-brand-accent text-brand-primary hover:bg-brand-accent/90',
  ghost:
    'text-brand-primary hover:bg-neutral-100',
  danger:
    'bg-error text-white hover:bg-red-700',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-7 py-3 text-base gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      as = 'button',
      href,
      ...props
    },
    ref
  ) => {
    const classes = cn(
      'inline-flex items-center justify-center font-medium rounded-button transition-all duration-200 focus-ring min-h-[44px] select-none',
      variantStyles[variant],
      sizeStyles[size],
      (disabled || isLoading) && 'opacity-50 cursor-not-allowed pointer-events-none',
      className
    );

    if (as === 'a' && href) {
      return (
        <a href={href} className={classes}>
          {leftIcon}
          {children}
          {rightIcon}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : leftIcon}
        {children}
        {rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
