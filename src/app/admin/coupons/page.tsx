'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/admin/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Modal } from '@/components/ui/modal';
import { formatPrice, formatDate } from '@/lib/utils';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrderAmount: number;
  maxDiscount: number | null;
  usageLimit: number | null;
  usedCount: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    code: '',
    type: 'PERCENTAGE',
    value: '',
    minOrderAmount: '0',
    maxDiscount: '',
    usageLimit: '',
    expiresAt: '',
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  async function fetchCoupons() {
    try {
      const res = await fetch('/api/admin/coupons');
      if (res.ok) {
        const data = await res.json();
        setCoupons(data.coupons ?? []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    setCreating(true);
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          value: Number(form.value),
          minOrderAmount: Number(form.minOrderAmount),
          maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
          usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
          expiresAt: form.expiresAt || null,
        }),
      });
      if (res.ok) {
        toast.success('Coupon created');
        setShowModal(false);
        setForm({ code: '', type: 'PERCENTAGE', value: '', minOrderAmount: '0', maxDiscount: '', usageLimit: '', expiresAt: '' });
        fetchCoupons();
      } else {
        toast.error('Failed to create coupon');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this coupon?')) return;
    try {
      const res = await fetch(`/api/admin/coupons?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCoupons((prev) => prev.filter((c) => c.id !== id));
        toast.success('Coupon deleted');
      }
    } catch {
      toast.error('Failed to delete');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-bold">Coupons</h1>
        <Button className="gap-2" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" /> Add Coupon
        </Button>
      </div>

      <DataTable<Coupon>
        columns={[
          { key: 'code', label: 'Code', render: (item) => <span className="font-mono font-bold">{item.code}</span> },
          {
            key: 'discount',
            label: 'Discount',
            render: (item) =>
              item.type === 'PERCENTAGE'
                ? `${item.value}%`
                : formatPrice(item.value as number),
          },
          {
            key: 'minOrderAmount',
            label: 'Min Order',
            render: (item) => formatPrice(item.minOrderAmount as number),
          },
          {
            key: 'usage',
            label: 'Usage',
            render: (item) =>
              `${item.usedCount}${item.usageLimit ? ` / ${item.usageLimit}` : ''}`,
          },
          {
            key: 'isActive',
            label: 'Status',
            render: (item) => (
              <Badge variant={item.isActive ? 'success' : 'default'}>
                {item.isActive ? 'Active' : 'Inactive'}
              </Badge>
            ),
          },
          {
            key: 'expiresAt',
            label: 'Expires',
            render: (item) => item.expiresAt ? formatDate(item.expiresAt as string) : 'Never',
          },
          {
            key: 'actions',
            label: '',
            render: (item) => (
              <button onClick={() => handleDelete(item.id as string)} className="text-red-600 hover:underline text-xs">
                <Trash2 className="w-4 h-4" />
              </button>
            ),
          },
        ]}
        data={coupons}
        emptyMessage="No coupons yet"
      />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Coupon">
        <div className="space-y-4">
          <Input
            label="Code"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            placeholder="SUMMER20"
          />
          <Select
            label="Type"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            options={[
              { label: 'Percentage', value: 'PERCENTAGE' },
              { label: 'Fixed Amount', value: 'FIXED' },
            ]}
          />
          <Input label="Value" type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
          <Input label="Min Order Amount" type="number" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} />
          <Input label="Max Discount (optional)" type="number" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} />
          <Input label="Usage Limit (optional)" type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} />
          <Input label="Expires At (optional)" type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
          <div className="flex gap-3 pt-2">
            <Button onClick={handleCreate} disabled={creating}>
              {creating ? <Spinner size="sm" /> : 'Create'}
            </Button>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
