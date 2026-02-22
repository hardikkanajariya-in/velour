'use client';

import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionItem {
  title: string;
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
}

export function Accordion({ items, allowMultiple = false, className }: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggle = (index: number) => {
    setOpenItems((prev) => {
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className={cn('divide-y divide-neutral-200 border-y border-neutral-200', className)}>
      {items.map((item, index) => {
        const isOpen = openItems.has(index);
        return (
          <div key={index}>
            <button
              onClick={() => toggle(index)}
              className="flex items-center justify-between w-full px-1 py-4 text-left text-sm font-medium text-brand-primary min-h-[48px] gap-3"
            >
              <span className="flex-1">{item.title}</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-neutral-500 transition-transform duration-300',
                  isOpen && 'rotate-180'
                )}
              />
            </button>
            <div className={cn('accordion-content', isOpen && 'open')}>
              <div>
                <div className="px-1 pb-4 text-sm text-neutral-600 leading-relaxed">
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
