import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/store/product/product-grid";
import { ProductSort } from "@/components/store/product/product-sort";
import { UrlPagination } from "@/components/store/url-pagination";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { PRODUCTS_PER_PAGE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sale",
  description:
    "Shop the best deals and discounts at VELOUR. Grab your favourites before they're gone!",
};

interface SalePageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function SalePage({ searchParams }: SalePageProps) {
  const sp = await searchParams;

  const page = parseInt(sp.page ?? "1", 10);
  const sort = sp.sort ?? "";

  let orderBy: Record<string, string> = { createdAt: "desc" };
  switch (sort) {
    case "price-asc":
      orderBy = { basePrice: "asc" };
      break;
    case "price-desc":
      orderBy = { basePrice: "desc" };
      break;
    case "newest":
      orderBy = { createdAt: "desc" };
      break;
    case "popular":
      orderBy = { totalSold: "desc" };
      break;
    case "rating":
      orderBy = { averageRating: "desc" };
      break;
  }

  const where = {
    isActive: true,
    comparePrice: { not: null },
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * PRODUCTS_PER_PAGE,
      take: PRODUCTS_PER_PAGE,
      include: {
        images: { orderBy: { order: "asc" } },
        variants: true,
        category: { select: { id: true, name: true, slug: true } },
        brand: { select: { id: true, name: true, slug: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE);

  return (
    <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-6">
      <Breadcrumb
        items={[
          { label: "Products", href: "/products" },
          { label: "Sale" },
        ]}
      />

      <div className="mb-6 sm:mb-8 mt-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold">
          Sale
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Shop our best deals &amp; discounts — limited-time prices on your
          favourite styles.
        </p>
        <p className="text-sm text-muted-foreground mt-1">{total} products</p>
      </div>

      <div className="flex items-center justify-end mb-3 sm:mb-4">
        <ProductSort />
      </div>

      <ProductGrid products={products} />

      {totalPages > 1 && (
        <div className="mt-8">
          <UrlPagination currentPage={page} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}
