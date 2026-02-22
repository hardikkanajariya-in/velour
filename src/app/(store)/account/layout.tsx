'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { User, ShoppingBag, MapPin, Heart, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

const accountNav = [
  { label: 'My Account', href: '/account', icon: User },
  { label: 'My Orders', href: '/account/orders', icon: ShoppingBag },
  { label: 'Addresses', href: '/account/addresses', icon: MapPin },
  { label: 'Wishlist', href: '/account/wishlist', icon: Heart },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/account');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-6">
      <h1 className="text-2xl md:text-3xl font-heading font-bold mb-8">My Account</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <nav className="space-y-1">
          {accountNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-600 hover:bg-red-50 w-full transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </nav>

        <div className="lg:col-span-3">{children}</div>
      </div>
    </div>
  );
}
