'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | '...')[] = [];
  const maxVisible = 5;

  if (totalPages <= maxVisible + 2) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <nav className={cn('flex items-center justify-center gap-1', className)}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed min-w-[44px] min-h-[44px] flex items-center justify-center"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`dots-${i}`} className="px-2 text-neutral-400">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              'min-w-[44px] min-h-[44px] rounded-md text-sm font-medium transition-colors flex items-center justify-center',
              page === currentPage
                ? 'bg-brand-primary text-white'
                : 'hover:bg-neutral-100 text-neutral-600'
            )}
          >
            {page}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed min-w-[44px] min-h-[44px] flex items-center justify-center"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
