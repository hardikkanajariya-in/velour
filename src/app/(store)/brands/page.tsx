import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Breadcrumb } from "@/components/layout/breadcrumb";

export const metadata: Metadata = {
  title: "Brands",
  description:
    "Explore all brands available at VELOUR — from our house label to curated partner brands.",
};

export default async function BrandsPage() {
  let brands: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    description: string | null;
    _count: { products: number };
  }[] = [];

  try {
    brands = await prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        description: true,
        _count: { select: { products: true } },
      },
    });
  } catch {
    // Database error — show empty state
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-6">
      <Breadcrumb items={[{ label: "Brands" }]} />

      {/* Header */}
      <div className="text-center py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mb-3 sm:mb-4">
          Our Brands
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          From our house label to curated partner brands — each one chosen for
          quality, design, and craftsmanship.
        </p>
      </div>

      {brands.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">
            No brands available at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/products?brand=${brand.slug}`}
              className="group block p-6 sm:p-8 bg-surface rounded-card hover:shadow-md transition-all border border-transparent hover:border-accent/20"
            >
              <div className="flex items-center gap-4 mb-3 sm:mb-4">
                {brand.logo ? (
                  <div className="w-12 h-12 rounded-full bg-muted overflow-hidden flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center">
                    <span className="text-lg font-heading font-bold text-brand-accent">
                      {brand.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <h2 className="font-heading font-bold text-base sm:text-lg group-hover:text-accent transition-colors">
                    {brand.name}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {brand._count.products}{" "}
                    {brand._count.products === 1 ? "product" : "products"}
                  </p>
                </div>
              </div>
              {brand.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {brand.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
