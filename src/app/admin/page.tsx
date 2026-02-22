'use client';

import { useEffect, useState } from 'react';
import { StatCard } from '@/components/admin/stat-card';
import { DataTable } from '@/components/admin/data-table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice, formatDate } from '@/lib/utils';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/constants';
import { DollarSign, ShoppingCart, Users, Package } from 'lucide-react';
import Link from 'next/link';

interface Analytics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrders: Array<Record<string, unknown>>;
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  revenueChange: number;
  orderChange: number;
}

export default function AdminDashboard() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch('/api/admin/analytics');
        if (res.ok) {
          setData(await res.json());
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-heading font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-card" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-card" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={formatPrice(data.totalRevenue)}
          change={`${data.revenueChange >= 0 ? '+' : ''}${data.revenueChange.toFixed(1)}% from last month`}
          changeType={data.revenueChange >= 0 ? 'positive' : 'negative'}
          icon={<DollarSign className="w-5 h-5" />}
        />
        <StatCard
          title="Total Orders"
          value={data.totalOrders}
          change={`${data.orderChange >= 0 ? '+' : ''}${data.orderChange.toFixed(1)}% from last month`}
          changeType={data.orderChange >= 0 ? 'positive' : 'negative'}
          icon={<ShoppingCart className="w-5 h-5" />}
        />
        <StatCard
          title="Total Customers"
          value={data.totalCustomers}
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard
          title="Total Products"
          value={data.totalProducts}
          icon={<Package className="w-5 h-5" />}
        />
      </div>

      {/* Monthly Revenue Chart (simple bar representation) */}
      {data.monthlyRevenue.length > 0 && (
        <div className="p-6 bg-background border border-border rounded-card">
          <h2 className="text-lg font-heading font-bold mb-4">Monthly Revenue</h2>
          <div className="flex items-end gap-2 h-48">
            {data.monthlyRevenue.map((item) => {
              const maxRevenue = Math.max(...data.monthlyRevenue.map((r) => r.revenue));
              const height = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-muted-foreground">
                    {formatPrice(item.revenue)}
                  </span>
                  <div
                    className="w-full bg-accent/20 rounded-t"
                    style={{ height: `${Math.max(height, 2)}%` }}
                  >
                    <div
                      className="w-full bg-accent rounded-t transition-all"
                      style={{ height: '100%' }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="p-6 bg-background border border-border rounded-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-heading font-bold">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-accent hover:underline">
            View All
          </Link>
        </div>

        <DataTable
          columns={[
            { key: 'orderNumber', label: 'Order #', render: (item) => `#${item.orderNumber}` },
            {
              key: 'user',
              label: 'Customer',
              render: (item) => {
                const user = item.user as { name?: string } | null;
                return user?.name ?? (item.guestName as string) ?? 'Guest';
              },
            },
            {
              key: 'total',
              label: 'Total',
              render: (item) => formatPrice(item.total as number),
            },
            {
              key: 'status',
              label: 'Status',
              render: (item) => {
                const status = item.status as string;
                const color = ORDER_STATUS_COLORS[status] ?? 'default';
                const label = ORDER_STATUS_LABELS[status] ?? status;
                return <Badge variant={color as 'default' | 'success' | 'warning' | 'error'}>{label}</Badge>;
              },
            },
            {
              key: 'createdAt',
              label: 'Date',
              render: (item) => formatDate(item.createdAt as string),
            },
          ]}
          data={data.recentOrders}
          emptyMessage="No orders yet"
        />
      </div>
    </div>
  );
}
