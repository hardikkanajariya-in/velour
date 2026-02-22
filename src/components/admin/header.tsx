'use client';

import { useSession, signOut } from 'next-auth/react';
import { Bell, LogOut } from 'lucide-react';
import { getInitials } from '@/lib/utils';

export function AdminHeader() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6 sticky top-0 z-30">
      <h2 className="text-sm font-medium text-muted-foreground">Admin Panel</h2>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xs">
            {getInitials(user?.name ?? 'A')}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium leading-none">{user?.name ?? 'Admin'}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
}
