'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/admin/data-table';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { formatPrice, formatDate } from '@/lib/utils';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/constants';

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/admin/orders');
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders ?? []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-heading font-bold">Orders</h1>

      <DataTable
        columns={[
          {
            key: 'orderNumber',
            label: 'Order #',
            render: (item) => (
              <span className="font-medium">#{item.orderNumber as string}</span>
            ),
          },
          {
            key: 'user',
            label: 'Customer',
            render: (item) => {
              const user = item.user as { name?: string; email?: string } | null;
              return (
                <div>
                  <p className="text-sm">{user?.name ?? (item.guestName as string) ?? 'Guest'}</p>
                  <p className="text-xs text-muted-foreground">{user?.email ?? (item.guestEmail as string) ?? ''}</p>
                </div>
              );
            },
          },
          {
            key: 'items',
            label: 'Items',
            render: (item) => {
              const items = item.items as unknown[];
              return `${items?.length ?? 0} items`;
            },
          },
          {
            key: 'total',
            label: 'Total',
            render: (item) => <span className="font-medium">{formatPrice(item.total as number)}</span>,
          },
          {
            key: 'paymentStatus',
            label: 'Payment',
            render: (item) => {
              const status = item.paymentStatus as string;
              return (
                <Badge variant={status === 'PAID' ? 'success' : status === 'FAILED' ? 'error' : 'warning'}>
                  {status}
                </Badge>
              );
            },
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
        data={orders}
        onRowClick={(item) => router.push(`/admin/orders/${item.id}`)}
        emptyMessage="No orders yet"
      />
    </div>
  );
}
