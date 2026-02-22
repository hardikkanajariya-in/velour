'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatPrice, formatDate } from '@/lib/utils';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/constants';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingBag } from 'lucide-react';
import type { Order } from '@/types/order';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders');
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
      <div className="space-y-4">
        <h2 className="text-lg font-heading font-bold">My Orders</h2>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-card" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag className="w-12 h-12" />}
        heading="No orders yet"
        description="Start shopping to see your orders here."
        actionLabel="Shop Now"
        actionHref="/products"
      />
    );
  }

  return (
    <div>
      <h2 className="text-lg font-heading font-bold mb-4">My Orders</h2>

      <div className="space-y-4">
        {orders.map((order) => {
          const statusColor = ORDER_STATUS_COLORS[order.status] ?? 'default';
          const statusLabel = ORDER_STATUS_LABELS[order.status] ?? order.status;

          return (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="block p-3 sm:p-4 border border-border rounded-card hover:border-accent transition-colors"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div>
                  <p className="font-medium">Order #{order.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                </div>
                <Badge variant={statusColor as 'default' | 'success' | 'warning' | 'error'}>
                  {statusLabel}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm">
                <p className="text-muted-foreground">
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                </p>
                <p className="font-bold">{formatPrice(order.total)}</p>
              </div>

              {order.items.length > 0 && (
                <div className="flex gap-1.5 sm:gap-2 mt-2.5 sm:mt-3 overflow-x-auto scrollbar-none">
                  {order.items.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-muted flex-shrink-0 overflow-hidden"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-muted flex-shrink-0 flex items-center justify-center text-xs text-muted-foreground">
                      +{order.items.length - 4}
                    </div>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
