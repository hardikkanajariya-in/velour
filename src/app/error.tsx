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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-heading font-bold text-primary mb-4">Oops!</h1>
        <p className="text-lg text-muted-foreground mb-2">Something went wrong</p>
        <p className="text-sm text-muted-foreground mb-8">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <div className="flex gap-3 justify-center">
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
