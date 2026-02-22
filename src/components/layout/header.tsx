'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  Search, Heart, ShoppingBag, User, Menu,
  ChevronDown, ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/lib/site';
import { useCartStore } from '@/store/cart.store';
import { useWishlistStore } from '@/store/wishlist.store';
import { useUIStore } from '@/store/ui.store';
import { useScrollPosition } from '@/hooks/use-scroll-position';
import { MobileNav } from './mobile-nav';
import { SearchOverlay } from './search-overlay';

export function Header() {
  const { data: session } = useSession();
  const { isScrolled } = useScrollPosition();
  const cartItems = useCartStore((s) => s.totalItems());
  const openCart = useCartStore((s) => s.openDrawer);
  const wishlistCount = useWishlistStore((s) => s.count());
  const { openSearch, searchOpen, mobileNavOpen, toggleMobileNav, closeMobileNav } = useUIStore();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userDropdown, setUserDropdown] = useState(false);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-brand-primary text-white text-xs py-2 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex gap-12">
          <span>FREE SHIPPING ABOVE ₹1,999</span>
          <span>|</span>
          <span>USE CODE WELCOME10 FOR 10% OFF</span>
          <span>|</span>
          <span>NEW ARRIVALS EVERY WEEK</span>
          <span>|</span>
          <span>FREE SHIPPING ABOVE ₹1,999</span>
          <span>|</span>
          <span>USE CODE WELCOME10 FOR 10% OFF</span>
          <span>|</span>
          <span>NEW ARRIVALS EVERY WEEK</span>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-white/95 backdrop-blur-sm shadow-sm'
            : 'bg-white'
        )}
      >
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">
            {/* Left: Mobile Menu + Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleMobileNav}
                className="lg:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Toggle menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <Link href="/" className="font-heading italic text-2xl font-bold text-brand-primary tracking-wide">
                {siteConfig.brand.name}
              </Link>
            </div>

            {/* Center: Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {siteConfig.navigation.header.map((item) => {
                const hasChildren = 'children' in item && item.children;
                const isSale = 'isSale' in item && (item as Record<string, unknown>).isSale;
                return (
                  <div
                    key={item.labelKey}
                    className="relative"
                    onMouseEnter={() => hasChildren ? setActiveDropdown(item.labelKey) : undefined}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        'text-sm font-medium transition-colors py-6 flex items-center gap-1',
                        isSale
                          ? 'text-brand-crimson font-semibold'
                          : 'text-neutral-600 hover:text-brand-primary'
                      )}
                    >
                      {item.labelKey}
                      {hasChildren && <ChevronDown className="h-3.5 w-3.5" />}
                    </Link>

                    {/* Mega Dropdown */}
                    {hasChildren && activeDropdown === item.labelKey && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-[600px] bg-white rounded-lg shadow-dropdown border border-neutral-100 p-6 grid grid-cols-3 gap-6">
                        {(item as unknown as { children: Array<{ labelKey: string; href: string; children?: Array<{ labelKey: string; href: string }> }> }).children.map((group: { labelKey: string; href: string; children?: Array<{ labelKey: string; href: string }> }) => (
                          <div key={group.labelKey}>
                            <Link
                              href={group.href}
                              className="text-sm font-semibold text-brand-primary mb-3 block hover:text-brand-accent"
                            >
                              {group.labelKey}
                            </Link>
                            {group.children && (
                              <ul className="space-y-2">
                                {group.children.map((sub: { labelKey: string; href: string }) => (
                                  <li key={sub.labelKey}>
                                    <Link
                                      href={sub.href}
                                      className="text-sm text-neutral-500 hover:text-brand-primary transition-colors"
                                    >
                                      {sub.labelKey}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Right: Icons */}
            <div className="flex items-center gap-1">
              <button
                onClick={openSearch}
                className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-neutral-100 rounded-md transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              <Link
                href="/wishlist"
                className="relative p-2 min-w-[44px] min-h-[44px] items-center justify-center hover:bg-neutral-100 rounded-md transition-colors hidden md:flex"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 bg-brand-crimson text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button
                onClick={openCart}
                className="relative p-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-neutral-100 rounded-md transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartItems > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 bg-brand-accent text-brand-primary text-[10px] font-bold rounded-full flex items-center justify-center animate-scale-bounce">
                    {cartItems}
                  </span>
                )}
              </button>

              <div
                className="relative"
                onMouseEnter={() => setUserDropdown(true)}
                onMouseLeave={() => setUserDropdown(false)}
              >
                <button className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-neutral-100 rounded-md transition-colors">
                  <User className="h-5 w-5" />
                </button>
                {userDropdown && (
                  <div className="absolute right-0 top-full w-48 bg-white rounded-lg shadow-dropdown border border-neutral-100 py-2">
                    {session ? (
                      <>
                        <Link href="/account" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                          My Account
                        </Link>
                        <Link href="/account/orders" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                          Orders
                        </Link>
                        <Link href="/wishlist" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                          Wishlist
                        </Link>
                        {session.user?.role === 'ADMIN' && (
                          <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                            Admin Panel <ExternalLink className="h-3 w-3" />
                          </Link>
                        )}
                        <hr className="my-1 border-neutral-100" />
                        <Link href="/api/auth/signout" className="block px-4 py-2 text-sm text-error hover:bg-neutral-50">
                          Logout
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link href="/login" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                          Login
                        </Link>
                        <Link href="/register" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                          Create Account
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <MobileNav isOpen={mobileNavOpen} onClose={closeMobileNav} />
      <SearchOverlay />
    </>
  );
}
