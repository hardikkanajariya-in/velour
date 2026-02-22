'use client';

import { useEffect, useCallback, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

const sizeStyles = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[95vw] max-h-[95vh]',
};

export function Modal({ isOpen, onClose, children, title, size = 'md', className }: ModalProps) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative w-full bg-white rounded-xl shadow-lg overflow-hidden',
          'animate-[fadeUp_0.2s_ease-out]',
          sizeStyles[size],
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
            <h2 className="text-lg font-semibold text-brand-primary">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-neutral-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        {!title && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-1 rounded-md hover:bg-neutral-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        <div className="overflow-y-auto max-h-[80vh]">{children}</div>
      </div>
    </div>
  );
}
