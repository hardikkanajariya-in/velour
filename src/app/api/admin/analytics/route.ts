import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const previousThirtyDays = new Date(
      now.getTime() - 60 * 24 * 60 * 60 * 1000,
    );

    const [
      totalRevenue,
      prevRevenue,
      totalOrders,
      prevOrders,
      totalCustomers,
      totalProducts,
      recentOrders,
      topProducts,
      monthlyRevenue,
    ] = await Promise.all([
      prisma.order.aggregate({
        where: { createdAt: { gte: thirtyDaysAgo }, paymentStatus: "PAID" },
        _sum: { total: true },
      }),
      prisma.order.aggregate({
        where: {
          createdAt: { gte: previousThirtyDays, lt: thirtyDaysAgo },
          paymentStatus: "PAID",
        },
        _sum: { total: true },
      }),
      prisma.order.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.order.count({
        where: { createdAt: { gte: previousThirtyDays, lt: thirtyDaysAgo } },
      }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          user: { select: { name: true, email: true } },
          _count: { select: { items: true } },
        },
      }),
      prisma.product.findMany({
        orderBy: { totalSold: "desc" },
        where: { isActive: true },
        take: 5,
        select: {
          id: true,
          name: true,
          slug: true,
          totalSold: true,
          basePrice: true,
          images: { take: 1, orderBy: { order: "asc" } },
        },
      }),
      // Last 12 months revenue
      prisma.$queryRawUnsafe<Array<{ month: string; revenue: number }>>(
        `SELECT TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon') as month,
                COALESCE(SUM(total), 0)::float as revenue
         FROM "Order"
         WHERE "paymentStatus" = 'PAID'
           AND "createdAt" >= NOW() - INTERVAL '12 months'
         GROUP BY DATE_TRUNC('month', "createdAt")
         ORDER BY DATE_TRUNC('month', "createdAt")`,
      ),
    ]);

    const currentRevenue = totalRevenue._sum.total ?? 0;
    const previousRevenueVal = prevRevenue._sum.total ?? 0;
    const revenueGrowth =
      previousRevenueVal > 0
        ? ((currentRevenue - previousRevenueVal) / previousRevenueVal) * 100
        : 0;
    const ordersGrowth =
      prevOrders > 0 ? ((totalOrders - prevOrders) / prevOrders) * 100 : 0;

    return NextResponse.json({
      stats: {
        revenue: currentRevenue,
        revenueGrowth: Math.round(revenueGrowth * 10) / 10,
        orders: totalOrders,
        ordersGrowth: Math.round(ordersGrowth * 10) / 10,
        customers: totalCustomers,
        products: totalProducts,
      },
      recentOrders,
      topProducts,
      monthlyRevenue,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}
