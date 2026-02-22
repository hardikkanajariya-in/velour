'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Spinner } from '@/components/ui/spinner';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  link: string | null;
  isActive: boolean;
  order: number;
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: '', subtitle: '', image: '', link: '' });

  useEffect(() => {
    fetchBanners();
  }, []);

  async function fetchBanners() {
    try {
      const res = await fetch('/api/admin/banners');
      if (res.ok) {
        const data = await res.json();
        setBanners(data.banners ?? []);
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
      const res = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success('Banner created');
        setShowModal(false);
        setForm({ title: '', subtitle: '', image: '', link: '' });
        fetchBanners();
      }
    } catch {
      toast.error('Failed to create');
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this banner?')) return;
    try {
      const res = await fetch(`/api/admin/banners?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBanners((prev) => prev.filter((b) => b.id !== id));
        toast.success('Deleted');
      }
    } catch {
      toast.error('Failed');
    }
  }

  async function toggleActive(id: string, isActive: boolean) {
    try {
      await fetch(`/api/admin/banners`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !isActive }),
      });
      setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, isActive: !isActive } : b)));
    } catch {
      toast.error('Failed');
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
        <h1 className="text-2xl font-heading font-bold">Banners</h1>
        <Button className="gap-2" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" /> Add Banner
        </Button>
      </div>

      <div className="space-y-4">
        {banners.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No banners yet</p>
        ) : (
          banners.map((banner) => (
            <div key={banner.id} className="flex items-center gap-4 p-4 border border-border rounded-card">
              <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
              <div className="w-32 h-16 rounded overflow-hidden bg-muted flex-shrink-0">
                {banner.image && <img src={banner.image} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{banner.title}</p>
                {banner.subtitle && <p className="text-sm text-muted-foreground truncate">{banner.subtitle}</p>}
              </div>
              <button onClick={() => toggleActive(banner.id, banner.isActive)}>
                <Badge variant={banner.isActive ? 'success' : 'default'}>
                  {banner.isActive ? 'Active' : 'Hidden'}
                </Badge>
              </button>
              <button onClick={() => handleDelete(banner.id)} className="text-red-600 hover:bg-red-50 p-2 rounded">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Banner">
        <div className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input label="Subtitle" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
          <Input label="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          <Input label="Link (optional)" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
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
