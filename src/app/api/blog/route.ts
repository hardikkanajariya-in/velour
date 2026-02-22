import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/blog — public blog listing
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = 9;

    const where: Record<string, unknown> = { isPublished: true };
    if (category) where.category = category;
    if (tag) where.tags = { has: tag };

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverImage: true,
          author: true,
          tags: true,
          category: true,
          publishedAt: true,
        },
      }),
      prisma.blogPost.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      total,
      totalPages: Math.ceil(total / limit),
      page,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 },
    );
  }
}
