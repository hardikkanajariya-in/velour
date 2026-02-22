'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { formatPrice, formatDate } from '@/lib/utils';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/constants';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Order } from '@/types/order';

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/admin/orders?id=${id}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data.orders ? data.orders[0] : data);
          setNewStatus(data.orders ? data.orders[0]?.status : data.status);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  async function handleUpdateStatus() {
    if (!newStatus || newStatus === order?.status) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrder(updated);
        toast.success('Status updated');
      } else {
        toast.error('Failed to update');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Order not found.{' '}
        <Link href="/admin/orders" className="text-accent hover:underline">
          Back
        </Link>
      </div>
    );
  }

  const statusColor = ORDER_STATUS_COLORS[order.status] ?? 'default';
  const statusLabel = ORDER_STATUS_LABELS[order.status] ?? order.status;

  return (
    <div className="space-y-6 max-w-4xl">
      <Link href="/admin/orders" className="flex items-center gap-1 text-sm text-muted-foreground hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Order #{order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
        </div>
        <Badge variant={statusColor as 'default' | 'success' | 'warning' | 'error'}>
          {statusLabel}
        </Badge>
      </div>

      {/* Update Status */}
      <div className="p-4 bg-background border border-border rounded-card flex items-end gap-4">
        <div className="flex-1">
          <Select
            label="Update Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            options={ORDER_STATUSES.map((s) => ({
              label: ORDER_STATUS_LABELS[s] ?? s,
              value: s,
            }))}
          />
        </div>
        <Button onClick={handleUpdateStatus} disabled={updating || newStatus === order.status}>
          {updating ? <Spinner size="sm" /> : 'Update'}
        </Button>
      </div>

      {/* Order Items */}
      <div className="border border-border rounded-card overflow-hidden">
        <h2 className="text-sm font-medium p-4 bg-surface border-b border-border">Items</h2>
        <div className="divide-y divide-border">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 rounded bg-muted overflow-hidden flex-shrink-0">
                {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.productName}</p>
                <p className="text-xs text-muted-foreground">
                  {item.size} • {item.color} • Qty: {item.quantity}
                </p>
              </div>
              <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer & Address */}
        <div className="p-4 bg-background border border-border rounded-card space-y-3">
          <h2 className="text-sm font-medium">Customer</h2>
          <p className="text-sm">{order.shippingAddress.fullName}</p>
          <p className="text-sm text-muted-foreground">{order.shippingAddress.phone}</p>
          <p className="text-sm text-muted-foreground">
            {order.shippingAddress.line1}
            {order.shippingAddress.line2 && `, ${order.shippingAddress.line2}`}
          </p>
          <p className="text-sm text-muted-foreground">
            {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
          </p>
        </div>

        {/* Payment */}
        <div className="p-4 bg-background border border-border rounded-card space-y-2">
          <h2 className="text-sm font-medium">Payment Summary</h2>
          <div className="text-sm space-y-1">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(order.discount)}</span></div>
            )}
            <div className="flex justify-between"><span>Shipping</span><span>{order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost)}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>{formatPrice(order.tax)}</span></div>
            <div className="flex justify-between font-bold border-t pt-1"><span>Total</span><span>{formatPrice(order.total)}</span></div>
          </div>
          <p className="text-xs text-muted-foreground capitalize mt-2">
            Method: {order.paymentMethod} • Status: {order.paymentStatus.toLowerCase()}
          </p>
        </div>
      </div>

      {/* Timeline */}
      {order.timeline.length > 0 && (
        <div className="p-4 bg-background border border-border rounded-card">
          <h2 className="text-sm font-medium mb-3">Timeline</h2>
          <div className="space-y-2">
            {order.timeline.map((event) => (
              <div key={event.id} className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                <span>{event.message}</span>
                <span className="text-xs text-muted-foreground ml-auto">{formatDate(event.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
