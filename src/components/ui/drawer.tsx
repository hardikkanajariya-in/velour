'use client';

import { useEffect, useCallback, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  side?: 'right' | 'left' | 'bottom';
  className?: string;
}

export function Drawer({ isOpen, onClose, children, title, side = 'right', className }: DrawerProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const sideStyles = {
    right: 'right-0 top-0 h-full w-full max-w-[85vw] sm:max-w-md animate-[slideInRight_0.3s_ease-out]',
    left: 'left-0 top-0 h-full w-full max-w-[85vw] sm:max-w-md animate-[slideInLeft_0.3s_ease-out]',
    bottom: 'bottom-0 left-0 w-full max-h-[85vh] rounded-t-2xl animate-[fadeUp_0.3s_ease-out]',
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          'fixed bg-white shadow-lg flex flex-col',
          sideStyles[side],
          className
        )}
      >
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-neutral-200 shrink-0">
          <h2 className="text-base sm:text-lg font-semibold text-brand-primary">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-neutral-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
      </div>
    </div>
  );
}
