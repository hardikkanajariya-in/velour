import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="py-3">
      <ol className="flex items-center gap-1.5 text-sm text-neutral-500 flex-wrap">
        <li>
          <Link href="/" className="hover:text-brand-primary transition-colors flex items-center gap-1">
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-neutral-300" />
            {item.href ? (
              <Link href={item.href} className="hover:text-brand-primary transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-brand-primary font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
