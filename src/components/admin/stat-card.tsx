import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: ReactNode;
  className?: string;
}

export function StatCard({ title, value, change, changeType = 'neutral', icon, className }: StatCardProps) {
  return (
    <div className={cn('p-4 sm:p-6 bg-background border border-border rounded-card', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs sm:text-sm text-muted-foreground">{title}</p>
          <p className="text-xl sm:text-2xl font-heading font-bold mt-1 truncate">{value}</p>
          {change && (
            <p
              className={cn(
                'text-xs mt-1',
                changeType === 'positive' && 'text-green-600',
                changeType === 'negative' && 'text-red-600',
                changeType === 'neutral' && 'text-muted-foreground'
              )}
            >
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
