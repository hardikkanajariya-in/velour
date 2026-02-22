'use client';

import { Button } from '@/components/ui/button';

export function NewsletterForm() {
  return (
    <form
      className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto w-full"
      onSubmit={(e: React.FormEvent) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder="Enter your email"
        className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-button text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 min-h-[44px]"
      />
      <Button className="bg-brand-accent text-brand-primary hover:bg-brand-accent/90 whitespace-nowrap min-h-[44px]">
        Subscribe
      </Button>
    </form>
  );
}
