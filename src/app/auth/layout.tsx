import type { Metadata } from "next";

export const metadata: Metadata = { title: "Authentication" };
export const dynamic = "force-dynamic";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-8 sm:py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <a
            href="/"
            className="text-xl sm:text-2xl font-heading font-bold tracking-wider"
          >
            VELOUR
          </a>
          <p className="text-[10px] sm:text-xs text-muted-foreground tracking-widest mt-1">
            WEAR THE STORY
          </p>
        </div>
        <div className="bg-background rounded-card shadow-md p-5 sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
