'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { formatPrice, formatDate } from '@/lib/utils';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';
import type { Order } from '@/types/order';

const STATUS_ICONS: Record<string, React.ReactNode> = {
  PENDING: <Clock className="w-4 h-4" />,
  CONFIRMED: <CheckCircle className="w-4 h-4" />,
  PROCESSING: <Package className="w-4 h-4" />,
  SHIPPED: <Truck className="w-4 h-4" />,
  DELIVERED: <CheckCircle className="w-4 h-4" />,
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders?id=${id}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Order not found</p>
        <Link href="/account/orders" className="text-accent hover:underline text-sm mt-2 inline-block">
          Back to orders
        </Link>
      </div>
    );
  }

  const statusColor = ORDER_STATUS_COLORS[order.status] ?? 'default';
  const statusLabel = ORDER_STATUS_LABELS[order.status] ?? order.status;

  return (
    <div className="space-y-6">
      <Link href="/account/orders" className="text-sm text-muted-foreground hover:underline flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
        <div>
          <h2 className="text-base sm:text-lg font-heading font-bold">Order #{order.orderNumber}</h2>
          <p className="text-sm text-muted-foreground">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <Badge variant={statusColor as 'default' | 'success' | 'warning' | 'error'}>
          {statusLabel}
        </Badge>
      </div>

      {/* Timeline */}
      {order.timeline.length > 0 && (
        <div className="p-4 bg-surface rounded-card">
          <h3 className="text-sm font-medium mb-3">Order Timeline</h3>
          <div className="space-y-3">
            {order.timeline.map((event, i) => (
              <div key={event.id} className="flex items-start gap-3">
                <div className={`mt-0.5 ${i === 0 ? 'text-accent' : 'text-muted-foreground'}`}>
                  {STATUS_ICONS[event.status] ?? <Clock className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-sm font-medium">{event.message}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(event.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="border border-border rounded-card overflow-hidden">
        <h3 className="text-sm font-medium p-3 sm:p-4 border-b border-border bg-surface">
          Items ({order.items.length})
        </h3>
        <div className="divide-y divide-border">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded bg-muted flex-shrink-0 overflow-hidden">
                {item.image && (
                  <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.productName}</p>
                <p className="text-xs text-muted-foreground">
                  Size: {item.size} {item.color && `• Color: ${item.color}`}
                </p>
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p className="font-medium text-sm">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Shipping Address */}
        <div className="p-4 bg-surface rounded-card">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Shipping Address
          </h3>
          <p className="text-sm">{order.shippingAddress.fullName}</p>
          <p className="text-sm text-muted-foreground">{order.shippingAddress.line1}</p>
          {order.shippingAddress.line2 && (
            <p className="text-sm text-muted-foreground">{order.shippingAddress.line2}</p>
          )}
          <p className="text-sm text-muted-foreground">
            {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
          </p>
          <p className="text-sm text-muted-foreground">{order.shippingAddress.phone}</p>
        </div>

        {/* Payment Summary */}
        <div className="p-4 bg-surface rounded-card">
          <h3 className="text-sm font-medium mb-3">Payment Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount {order.couponCode && `(${order.couponCode})`}</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>{formatPrice(order.tax)}</span>
            </div>
            <div className="flex justify-between font-bold border-t border-border pt-2">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3 capitalize">
            Payment: {order.paymentMethod} • {order.paymentStatus.toLowerCase()}
          </p>
        </div>
      </div>

      {/* Tracking */}
      {order.trackingNumber && (
        <div className="p-4 bg-surface rounded-card">
          <h3 className="text-sm font-medium mb-1">Tracking</h3>
          <p className="text-sm">Tracking Number: {order.trackingNumber}</p>
          {order.trackingUrl && (
            <a
              href={order.trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent hover:underline"
            >
              Track your order →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
