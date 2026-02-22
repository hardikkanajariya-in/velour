'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DataTable } from '@/components/admin/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { formatPrice } from '@/lib/utils';
import { Plus, Search } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products ?? []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  const filtered = search
    ? products.filter((p) =>
        (p.name as string).toLowerCase().includes(search.toLowerCase())
      )
    : products;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-heading font-bold">Products</h1>
        <Link href="/admin/products/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> Add Product
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm min-h-[44px]"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : (
        <DataTable
          columns={[
            {
              key: 'image',
              label: '',
              className: 'w-12',
              render: (item) => {
                const images = item.images as Array<{ url: string }>;
                return images?.[0] ? (
                  <img src={images[0].url} alt="" className="w-10 h-10 rounded object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded bg-muted" />
                );
              },
            },
            { key: 'name', label: 'Name' },
            { key: 'sku', label: 'SKU' },
            {
              key: 'basePrice',
              label: 'Price',
              render: (item) => formatPrice(item.basePrice as number),
            },
            {
              key: 'stock',
              label: 'Stock',
              render: (item) => {
                const variants = item.variants as Array<{ stock: number }>;
                const total = variants?.reduce((sum: number, v: { stock: number }) => sum + v.stock, 0) ?? 0;
                return (
                  <Badge variant={total > 0 ? 'success' : 'error'}>
                    {total} units
                  </Badge>
                );
              },
            },
            {
              key: 'isActive',
              label: 'Status',
              render: (item) => (
                <Badge variant={item.isActive ? 'success' : 'default'}>
                  {item.isActive ? 'Active' : 'Draft'}
                </Badge>
              ),
            },
            {
              key: 'actions',
              label: '',
              render: (item) => (
                <Link
                  href={`/admin/products/${item.id}`}
                  className="text-sm text-accent hover:underline"
                >
                  Edit
                </Link>
              ),
            },
          ]}
          data={filtered}
          emptyMessage="No products found"
        />
      )}
    </div>
  );
}
