import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/blog
export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

// POST /api/admin/blog
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const post = await prisma.blogPost.create({
      data: {
        title: body.title,
        slug,
        excerpt: body.excerpt,
        content: body.content,
        coverImage: body.coverImage || '',
        author: body.author || 'Admin',
        tags: body.tags || [],
        category: body.category || 'Fashion',
        isPublished: body.isPublished || false,
        publishedAt: body.isPublished ? new Date() : null,
      },
    });
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

// PATCH /api/admin/blog
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (data.isPublished !== undefined) {
      data.publishedAt = data.isPublished ? new Date() : null;
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data,
    });
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// DELETE /api/admin/blog
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
