'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/admin/data-table';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await fetch('/api/admin/customers');
        if (res.ok) {
          const data = await res.json();
          setCustomers(data.customers ?? []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
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
      <h1 className="text-2xl font-heading font-bold">Customers</h1>

      <DataTable
        columns={[
          { key: 'name', label: 'Name', render: (item) => (item.name as string) ?? 'N/A' },
          { key: 'email', label: 'Email' },
          {
            key: 'role',
            label: 'Role',
            render: (item) => (
              <Badge variant={item.role === 'ADMIN' ? 'warning' : 'default'}>
                {item.role as string}
              </Badge>
            ),
          },
          {
            key: '_count',
            label: 'Orders',
            render: (item) => {
              const count = item._count as { orders: number } | undefined;
              return count?.orders ?? 0;
            },
          },
          {
            key: 'createdAt',
            label: 'Joined',
            render: (item) => formatDate(item.createdAt as string),
          },
        ]}
        data={customers}
        emptyMessage="No customers yet"
      />
    </div>
  );
}
