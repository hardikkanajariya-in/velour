import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PRODUCTS_PER_PAGE } from "@/lib/constants";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = parseInt(
      searchParams.get("limit") ?? String(PRODUCTS_PER_PAGE),
      10,
    );
    const sort = searchParams.get("sort") ?? "";
    const category = searchParams.get("category") ?? "";
    const brand = searchParams.get("brand") ?? "";
    const size = searchParams.get("size") ?? "";
    const color = searchParams.get("color") ?? "";
    const price = searchParams.get("price") ?? "";
    const gender = searchParams.get("gender") ?? "";
    const search = searchParams.get("search") ?? "";
    const featured = searchParams.get("featured");
    const newArrivals = searchParams.get("new");
    const bestSellers = searchParams.get("bestsellers");
    const ids = searchParams.get("ids")?.split(",").filter(Boolean) ?? [];

    const where: Record<string, unknown> = { isActive: true };

    if (ids.length > 0) {
      where.id = { in: ids };
    }

    if (category) {
      const categories = category.split(",");
      where.category = { slug: { in: categories } };
    }

    if (brand) {
      const brands = brand.split(",");
      where.brand = { slug: { in: brands } };
    }

    if (size) {
      const sizes = size.split(",");
      where.variants = { some: { size: { in: sizes }, stock: { gt: 0 } } };
    }

    if (color) {
      const colors = color.split(",");
      where.variants = {
        ...((where.variants as Record<string, unknown>) ?? {}),
        some: {
          ...(((where.variants as Record<string, unknown>)?.some as Record<
            string,
            unknown
          >) ?? {}),
          color: { in: colors },
        },
      };
    }

    if (gender) {
      where.gender = {
        in: gender.split(",").map((g: string) => g.toUpperCase()),
      };
    }

    if (price) {
      const [min, max] = price.split("-").map(Number);
      if (!isNaN(min))
        where.basePrice = {
          ...((where.basePrice as Record<string, unknown>) ?? {}),
          gte: min,
        };
      if (!isNaN(max))
        where.basePrice = {
          ...((where.basePrice as Record<string, unknown>) ?? {}),
          lte: max,
        };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { hasSome: [search.toLowerCase()] } },
      ];
    }

    if (featured === "true") where.isFeatured = true;
    if (newArrivals === "true") where.isNewArrival = true;
    if (bestSellers === "true") where.isBestSeller = true;

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
      case "name-asc":
        orderBy = { name: "asc" };
        break;
      case "name-desc":
        orderBy = { name: "desc" };
        break;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          images: { orderBy: { order: "asc" } },
          variants: true,
          category: { select: { id: true, name: true, slug: true } },
          brand: { select: { id: true, name: true, slug: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Products GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
