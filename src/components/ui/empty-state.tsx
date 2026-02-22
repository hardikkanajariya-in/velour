import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface EmptyStateProps {
  icon?: ReactNode;
  heading: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  heading,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      {icon && <div className="mb-4 text-neutral-300">{icon}</div>}
      <h3 className="text-lg font-semibold text-brand-primary mb-2">{heading}</h3>
      {description && (
        <p className="text-sm text-neutral-500 max-w-md mb-6">{description}</p>
      )}
      {actionLabel && (
        <Button
          variant="primary"
          onClick={onAction}
          {...(actionHref ? { as: 'a' as const, href: actionHref } : {})}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
