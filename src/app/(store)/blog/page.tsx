import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Style guides, fashion trends, and behind-the-scenes stories from VELOUR.",
};

export default async function BlogPage() {
  let posts: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverImage: string;
    author: string;
    tags: string[];
    category: string;
    publishedAt: Date | null;
  }[] = [];

  try {
    posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
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
    });
  } catch {
    // Database error — show empty state
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-6">
      <Breadcrumb items={[{ label: "Blog" }]} />

      {/* Header */}
      <div className="text-center py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mb-3 sm:mb-4">
          The VELOUR Journal
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Style guides, fashion trends, and behind-the-scenes stories.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">
            No posts yet. Check back soon!
          </p>
        </div>
      ) : (
        <>
          {/* Featured Post */}
          <Link
            href={`/blog/${posts[0].slug}`}
            className="block group mb-10 sm:mb-14"
          >
            <div className="relative aspect-[21/9] rounded-card overflow-hidden bg-muted mb-4 sm:mb-6">
              {posts[0].coverImage && (
                <Image
                  src={posts[0].coverImage}
                  alt={posts[0].title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  priority
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8">
                <Badge variant="featured" className="mb-2 sm:mb-3">
                  {posts[0].category}
                </Badge>
                <h2 className="text-lg sm:text-2xl md:text-3xl font-heading font-bold text-white mb-2">
                  {posts[0].title}
                </h2>
                <p className="text-white/80 text-sm sm:text-base line-clamp-2 max-w-2xl">
                  {posts[0].excerpt}
                </p>
              </div>
            </div>
          </Link>

          {/* Post Grid */}
          {posts.length > 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {posts.slice(1).map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group"
                >
                  <div className="relative aspect-[16/10] rounded-card overflow-hidden bg-muted mb-3 sm:mb-4">
                    {post.coverImage && (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    )}
                  </div>
                  <Badge variant="default" className="mb-2 text-xs">
                    {post.category}
                  </Badge>
                  <h3 className="font-heading font-bold text-sm sm:text-base mb-1 sm:mb-2 group-hover:text-accent transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2 sm:mb-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </span>
                    {post.publishedAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.publishedAt).toLocaleDateString(
                          "en-IN",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
