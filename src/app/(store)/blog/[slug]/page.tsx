import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowLeft } from "lucide-react";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug, isPublished: true },
    select: { title: true, excerpt: true, coverImage: true, seoTitle: true, seoDesc: true },
  });

  if (!post) return { title: "Post Not Found" };

  return {
    title: post.seoTitle || post.title,
    description: post.seoDesc || post.excerpt,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDesc || post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { slug, isPublished: true },
  });

  if (!post) notFound();

  return (
    <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-6">
      <Breadcrumb
        items={[{ label: "Blog", href: "/blog" }, { label: post.title }]}
      />

      <article className="max-w-3xl mx-auto">
        {/* Back */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-6 sm:mb-8">
          <Badge variant="featured" className="mb-3">
            {post.category}
          </Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mb-3 sm:mb-4">
            {post.title}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mb-4">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {post.author}
            </span>
            {post.publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative aspect-[16/9] rounded-card overflow-hidden bg-muted mb-8 sm:mb-10">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-neutral max-w-none text-sm sm:text-base leading-relaxed text-foreground/90 whitespace-pre-line">
          {post.content}
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-8 sm:mt-10 pt-6 border-t border-border">
            <p className="text-sm font-medium mb-3">Tags</p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs bg-surface text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Back CTA */}
        <div className="mt-10 sm:mt-14 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all posts
          </Link>
        </div>
      </article>
    </div>
  );
}
