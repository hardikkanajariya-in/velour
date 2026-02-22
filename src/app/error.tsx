'use client';

import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="text-center max-w-md">
        <h1 className="text-5xl sm:text-6xl font-heading font-bold text-primary mb-3 sm:mb-4">Oops!</h1>
        <p className="text-base sm:text-lg text-muted-foreground mb-2">Something went wrong</p>
        <p className="text-sm text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="primary" onClick={reset}>
            Try Again
          </Button>
          <Button variant="secondary" onClick={() => (window.location.href = '/')}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
