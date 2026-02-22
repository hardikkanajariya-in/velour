'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, User, Heart, LogIn } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/lib/site';
import { Drawer } from '@/components/ui/drawer';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const { data: session } = useSession();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (key: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Menu" side="left">
      <nav className="py-2">
        {siteConfig.navigation.header.map((item) => {
          const hasChildren = 'children' in item && item.children;
          const isSale = 'isSale' in item && (item as Record<string, unknown>).isSale;
          const isExpanded = expandedItems.has(item.labelKey);

          return (
            <div key={item.labelKey} className="border-b border-neutral-100">
              {hasChildren ? (
                <>
                  <button
                    onClick={() => toggleExpand(item.labelKey)}
                    className={cn(
                      'flex items-center justify-between w-full px-4 py-3 text-sm font-medium min-h-[44px]',
                      isSale ? 'text-brand-crimson' : 'text-brand-primary'
                    )}
                  >
                    {item.labelKey}
                    <ChevronDown
                      className={cn('h-4 w-4 transition-transform', isExpanded && 'rotate-180')}
                    />
                  </button>
                  <div className={cn('accordion-content', isExpanded && 'open')}>
                    <div>
                      {(item as unknown as { children: Array<{ labelKey: string; href: string; children?: Array<{ labelKey: string; href: string }> }> }).children.map((group: { labelKey: string; href: string; children?: Array<{ labelKey: string; href: string }> }) => (
                        <div key={group.labelKey} className="px-4 pb-3">
                          <Link
                            href={group.href}
                            onClick={onClose}
                            className="block text-sm font-semibold text-brand-primary py-2"
                          >
                            {group.labelKey}
                          </Link>
                          {group.children?.map((sub: { labelKey: string; href: string }) => (
                            <Link
                              key={sub.labelKey}
                              href={sub.href}
                              onClick={onClose}
                              className="block pl-4 py-1.5 text-sm text-neutral-500 hover:text-brand-primary"
                            >
                              {sub.labelKey}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'block px-4 py-3 text-sm font-medium min-h-[44px]',
                    isSale ? 'text-brand-crimson' : 'text-brand-primary'
                  )}
                >
                  {item.labelKey}
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-neutral-200 mt-auto p-4 space-y-2">
        {session ? (
          <>
            <Link href="/account" onClick={onClose} className="flex items-center gap-3 px-3 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 rounded-md min-h-[44px]">
              <User className="h-4 w-4" /> My Account
            </Link>
            <Link href="/wishlist" onClick={onClose} className="flex items-center gap-3 px-3 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 rounded-md min-h-[44px]">
              <Heart className="h-4 w-4" /> Wishlist
            </Link>
          </>
        ) : (
          <Link
            href="/auth/login"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-brand-primary hover:bg-neutral-50 rounded-md min-h-[44px]"
          >
            <LogIn className="h-4 w-4" /> Login / Register
          </Link>
        )}
      </div>
    </Drawer>
  );
}
