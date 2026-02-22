import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Authentication' };

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-heading font-bold tracking-wider">
            VELOUR
          </a>
          <p className="text-xs text-muted-foreground tracking-widest mt-1">WEAR THE STORY</p>
        </div>
        <div className="bg-background rounded-card shadow-md p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
