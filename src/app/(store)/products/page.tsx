import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/store/product/product-grid";
import { ProductFilter } from "@/components/store/product/product-filter";
import { ProductSort } from "@/components/store/product/product-sort";
import { UrlPagination } from "@/components/store/url-pagination";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { PRODUCTS_PER_PAGE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "All Products",
  description: "Browse our complete collection of premium fashion products.",
};

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1", 10);
  const sort = params.sort ?? "";
  const category = params.category ?? "";
  const brand = params.brand ?? "";
  const size = params.size ?? "";
  const color = params.color ?? "";
  const price = params.price ?? "";
  const gender = params.gender ?? "";
  const search = params.search ?? "";
  const featured = params.featured ?? "";
  const newArrivals = params.new ?? "";

  const where: Record<string, unknown> = { isActive: true };

  if (category) where.category = { slug: { in: category.split(",") } };
  if (brand) where.brand = { slug: { in: brand.split(",") } };
  if (size)
    where.variants = {
      some: { size: { in: size.split(",") }, stock: { gt: 0 } },
    };
  if (color) where.variants = { some: { color: { in: color.split(",") } } };
  if (gender)
    where.gender = {
      in: gender.split(",").map((g: string) => g.toUpperCase()),
    };
  if (featured === "true") where.isFeatured = true;
  if (newArrivals === "true") where.isNewArrival = true;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  if (price) {
    const [min, max] = price.split("-").map(Number);
    if (!isNaN(min)) where.basePrice = { gte: min };
    if (!isNaN(max))
      where.basePrice = {
        ...((where.basePrice as Record<string, unknown>) ?? {}),
        lte: max,
      };
  }

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

  const [products, total, categories, brands] = await Promise.all([
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
    prisma.category.findMany({
      where: { isActive: true },
      select: {
        name: true,
        slug: true,
        _count: { select: { products: { where: { isActive: true } } } },
      },
      orderBy: { name: "asc" },
    }),
    prisma.brand.findMany({
      select: {
        name: true,
        slug: true,
        _count: { select: { products: { where: { isActive: true } } } },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE);

  const categoryOptions = categories.map(
    (c: { name: string; slug: string; _count: { products: number } }) => ({
      label: c.name,
      value: c.slug,
      count: c._count.products,
    }),
  );
  const brandOptions = brands.map(
    (b: { name: string; slug: string; _count: { products: number } }) => ({
      label: b.name,
      value: b.slug,
      count: b._count.products,
    }),
  );
  const priceRanges = [
    { label: "Under ₹500", value: "0-500" },
    { label: "₹500 - ₹1,000", value: "500-1000" },
    { label: "₹1,000 - ₹2,000", value: "1000-2000" },
    { label: "₹2,000 - ₹5,000", value: "2000-5000" },
    { label: "Over ₹5,000", value: "5000-99999" },
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-6">
      <Breadcrumb items={[{ label: "Products" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 mt-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold">
            {search ? `Results for "${search}"` : "All Products"}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {total} products found
          </p>
        </div>
        <ProductSort />
      </div>

      <div className="flex gap-6 lg:gap-8">
        <div className="w-64 shrink-0 hidden lg:block">
          <ProductFilter
            categories={categoryOptions}
            brands={brandOptions}
            priceRanges={priceRanges}
            totalProducts={total}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="lg:hidden mb-4">
            <ProductFilter
              categories={categoryOptions}
              brands={brandOptions}
              priceRanges={priceRanges}
              totalProducts={total}
            />
          </div>

          <ProductGrid products={products} />

          {totalPages > 1 && (
            <div className="mt-8">
              <UrlPagination currentPage={page} totalPages={totalPages} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
