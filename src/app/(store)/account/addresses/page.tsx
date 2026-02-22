'use client';

import { useEffect, useState } from 'react';
import { AddressForm } from '@/components/store/checkout/address-form';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Trash2, Plus, Star } from 'lucide-react';
import toast from 'react-hot-toast';

interface Address {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  async function fetchAddresses() {
    try {
      const res = await fetch('/api/user/addresses');
      if (res.ok) {
        setAddresses(await res.json());
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleSubmit(data: any) {
    try {
      const res = await fetch('/api/user/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success('Address saved');
        setShowForm(false);
        fetchAddresses();
      }
    } catch {
      toast.error('Failed to save address');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this address?')) return;
    try {
      const res = await fetch(`/api/user/addresses?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAddresses((prev) => prev.filter((a) => a.id !== id));
        toast.success('Address deleted');
      }
    } catch {
      toast.error('Failed to delete');
    }
  }

  async function handleSetDefault(id: string) {
    try {
      const res = await fetch(`/api/user/addresses`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isDefault: true }),
      });
      if (res.ok) {
        setAddresses((prev) =>
          prev.map((a) => ({ ...a, isDefault: a.id === id }))
        );
        toast.success('Default address updated');
      }
    } catch {
      toast.error('Failed to update');
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-heading font-bold">My Addresses</h2>
        <Button variant="secondary" onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          {showForm ? 'Cancel' : 'Add Address'}
        </Button>
      </div>

      {showForm && (
        <div className="mb-6 p-6 border border-border rounded-card">
          <h3 className="text-sm font-medium mb-4">New Address</h3>
          <AddressForm onSubmit={handleSubmit} submitLabel="Save Address" />
        </div>
      )}

      {addresses.length === 0 && !showForm ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No addresses saved yet. Add one above.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`p-4 border rounded-card relative ${
                addr.isDefault ? 'border-accent bg-accent/5' : 'border-border'
              }`}
            >
              {addr.isDefault && (
                <span className="absolute top-3 right-3 text-xs text-accent font-medium flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" /> Default
                </span>
              )}
              <p className="font-medium text-sm">{addr.fullName}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}
              </p>
              <p className="text-sm text-muted-foreground">
                {addr.city}, {addr.state} - {addr.pincode}
              </p>
              <p className="text-sm text-muted-foreground">{addr.phone}</p>

              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border">
                {!addr.isDefault && (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-xs text-accent hover:underline"
                  >
                    Set as Default
                  </button>
                )}
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="text-xs text-red-600 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
