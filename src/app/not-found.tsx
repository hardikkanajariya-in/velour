import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="text-center max-w-md">
        <h1 className="text-6xl sm:text-8xl font-heading font-bold text-primary mb-3 sm:mb-4">404</h1>
        <h2 className="text-xl sm:text-2xl font-heading font-semibold mb-2">Page Not Found</h2>
        <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-primary text-white px-6 py-3 rounded-button font-medium hover:bg-primary/90 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
