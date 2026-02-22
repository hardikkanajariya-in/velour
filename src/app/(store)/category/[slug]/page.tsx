import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/store/product/product-grid";
import { ProductSort } from "@/components/store/product/product-sort";
import { UrlPagination } from "@/components/store/url-pagination";
import type { Category } from "@/types/category";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { PRODUCTS_PER_PAGE } from "@/lib/constants";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return {};
  return {
    title: category.name,
    description:
      category.description ?? `Shop ${category.name} collection at VELOUR.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const sp = await searchParams;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      children: { where: { isActive: true }, orderBy: { displayOrder: "asc" } },
    },
  });

  if (!category) notFound();

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

  // Include products from child categories as well
  const categoryIds = [
    category.id,
    ...category.children.map((c: Category) => c.id),
  ];

  const where = { isActive: true, categoryId: { in: categoryIds } };

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
          { label: category.name },
        ]}
      />

      <div className="mb-6 sm:mb-8 mt-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-muted-foreground mt-2 max-w-2xl">
            {category.description}
          </p>
        )}
        <p className="text-sm text-muted-foreground mt-1">{total} products</p>
      </div>

      {/* Subcategories */}
      {category.children.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
          {category.children.map((child: Category) => (
            <a
              key={child.id}
              href={`/category/${child.slug}`}
              className="px-3 sm:px-4 py-2 border border-border rounded-full text-xs sm:text-sm hover:bg-primary hover:text-primary-foreground transition-colors min-h-[36px] flex items-center"
            >
              {child.name}
            </a>
          ))}
        </div>
      )}

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
