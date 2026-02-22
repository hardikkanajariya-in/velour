import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status, message } = await request.json();

    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        timeline: {
          create: {
            status,
            message: message ?? `Order ${status.toLowerCase()}`,
          },
        },
      },
      include: {
        timeline: { orderBy: { createdAt: "desc" } },
      },
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Admin order PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 },
    );
  }
}
