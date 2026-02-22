import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const banners = await prisma.banner.findMany({
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ banners });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const count = await prisma.banner.count();

  const banner = await prisma.banner.create({
    data: {
      title: body.title,
      subtitle: body.subtitle || null,
      image: body.image,
      link: body.link || null,
      position: body.position || "hero",
      order: count,
      isActive: true,
    },
  });

  return NextResponse.json(banner, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id, ...data } = body;

  const banner = await prisma.banner.update({ where: { id }, data });

  return NextResponse.json(banner);
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  await prisma.banner.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
