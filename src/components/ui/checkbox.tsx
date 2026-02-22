'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const checkboxId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex items-start gap-2">
        <div className="relative flex items-center justify-center">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            className={cn(
              'peer h-5 w-5 rounded border border-neutral-300 appearance-none cursor-pointer',
              'checked:bg-brand-primary checked:border-brand-primary',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50',
              'transition-colors duration-200',
              className
            )}
            {...props}
          />
          <Check className="absolute h-3 w-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
        </div>
        {label && (
          <label htmlFor={checkboxId} className="text-sm text-neutral-600 cursor-pointer leading-5">
            {label}
          </label>
        )}
        {error && <p className="text-xs text-error">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
