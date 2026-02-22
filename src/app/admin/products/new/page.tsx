'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Trash2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

interface Variant {
  size: string;
  color: string;
  colorHex: string;
  stock: number;
  additionalPrice: number;
}

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState<Variant[]>([
    { size: 'M', color: 'Black', colorHex: '#000000', stock: 10, additionalPrice: 0 },
  ]);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  function addVariant() {
    setVariants([...variants, { size: '', color: '', colorHex: '#000000', stock: 0, additionalPrice: 0 }]);
  }

  function removeVariant(index: number) {
    setVariants(variants.filter((_, i) => i !== index));
  }

  function updateVariant(index: number, field: keyof Variant, value: string | number) {
    setVariants(variants.map((v, i) => (i === index ? { ...v, [field]: value } : v)));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        if (res.ok) {
          const data = await res.json();
          setImages((prev) => [...prev, data.url]);
        }
      }
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(data: Record<string, unknown>) {
    if (variants.length === 0) {
      toast.error('Add at least one variant');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          basePrice: Number(data.basePrice),
          comparePrice: data.comparePrice ? Number(data.comparePrice) : null,
          costPrice: data.costPrice ? Number(data.costPrice) : null,
          images: images.map((url, i) => ({ url, altText: '', isPrimary: i === 0, order: i })),
          variants,
          tags: typeof data.tags === 'string' ? (data.tags as string).split(',').map((t: string) => t.trim()) : [],
          isFeatured: data.isFeatured === 'true',
          isNewArrival: data.isNewArrival === 'true',
          isBestSeller: data.isBestSeller === 'true',
          isActive: data.isActive !== 'false',
        }),
      });

      if (res.ok) {
        toast.success('Product created');
        router.push('/admin/products');
      } else {
        const err = await res.json();
        toast.error(err.error ?? 'Failed to create product');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl space-y-8">
      <h1 className="text-2xl font-heading font-bold">New Product</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info */}
        <div className="p-6 bg-background border border-border rounded-card space-y-4">
          <h2 className="text-lg font-heading font-bold">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Product Name *" {...register('name', { required: true })} error={errors.name ? 'Required' : undefined} />
            <Input label="SKU" {...register('sku')} placeholder="Auto-generated if empty" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Description *</label>
            <textarea
              {...register('description', { required: true })}
              rows={4}
              className="w-full px-4 py-3 border border-border rounded-lg text-sm resize-none"
              placeholder="Product description..."
            />
          </div>
          <Input label="Short Description" {...register('shortDescription')} />
        </div>

        {/* Pricing */}
        <div className="p-6 bg-background border border-border rounded-card space-y-4">
          <h2 className="text-lg font-heading font-bold">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Base Price (₹) *" type="number" {...register('basePrice', { required: true })} />
            <Input label="Compare Price (₹)" type="number" {...register('comparePrice')} />
            <Input label="Cost Price (₹)" type="number" {...register('costPrice')} />
          </div>
        </div>

        {/* Organization */}
        <div className="p-6 bg-background border border-border rounded-card space-y-4">
          <h2 className="text-lg font-heading font-bold">Organization</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Category ID *" {...register('categoryId', { required: true })} />
            <Input label="Brand ID" {...register('brandId')} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Gender"
              {...register('gender')}
              options={[
                { label: 'Unisex', value: 'UNISEX' },
                { label: 'Men', value: 'MEN' },
                { label: 'Women', value: 'WOMEN' },
                { label: 'Kids', value: 'KIDS' },
              ]}
            />
            <Input label="Tags (comma-separated)" {...register('tags')} placeholder="casual, summer, cotton" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select label="Featured" {...register('isFeatured')} options={[{ label: 'No', value: 'false' }, { label: 'Yes', value: 'true' }]} />
            <Select label="New Arrival" {...register('isNewArrival')} options={[{ label: 'No', value: 'false' }, { label: 'Yes', value: 'true' }]} />
            <Select label="Best Seller" {...register('isBestSeller')} options={[{ label: 'No', value: 'false' }, { label: 'Yes', value: 'true' }]} />
          </div>
        </div>

        {/* Images */}
        <div className="p-6 bg-background border border-border rounded-card space-y-4">
          <h2 className="text-lg font-heading font-bold">Images</h2>
          <div className="flex flex-wrap gap-3">
            {images.map((url, i) => (
              <div key={i} className="relative w-24 h-24 rounded overflow-hidden group">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, j) => j !== i))}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}
            <label className="w-24 h-24 border-2 border-dashed border-border rounded flex items-center justify-center cursor-pointer hover:border-accent transition-colors">
              {uploading ? <Spinner size="sm" /> : <Plus className="w-6 h-6 text-muted-foreground" />}
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Variants */}
        <div className="p-6 bg-background border border-border rounded-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-heading font-bold">Variants</h2>
            <Button type="button" variant="secondary" onClick={addVariant} className="gap-2">
              <Plus className="w-4 h-4" /> Add Variant
            </Button>
          </div>

          {variants.map((variant, i) => (
            <div key={i} className="flex items-end gap-3 p-4 bg-surface rounded-lg">
              <div className="flex-1">
                <label className="block text-xs font-medium mb-1">Size</label>
                <input
                  value={variant.size}
                  onChange={(e) => updateVariant(i, 'size', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded text-sm"
                  placeholder="S, M, L, XL..."
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium mb-1">Color</label>
                <input
                  value={variant.color}
                  onChange={(e) => updateVariant(i, 'color', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded text-sm"
                  placeholder="Black, White..."
                />
              </div>
              <div className="w-20">
                <label className="block text-xs font-medium mb-1">Stock</label>
                <input
                  type="number"
                  value={variant.stock}
                  onChange={(e) => updateVariant(i, 'stock', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-border rounded text-sm"
                />
              </div>
              <div className="w-24">
                <label className="block text-xs font-medium mb-1">+Price</label>
                <input
                  type="number"
                  value={variant.additionalPrice}
                  onChange={(e) => updateVariant(i, 'additionalPrice', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-border rounded text-sm"
                />
              </div>
              <button
                type="button"
                onClick={() => removeVariant(i)}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* SEO */}
        <div className="p-6 bg-background border border-border rounded-card space-y-4">
          <h2 className="text-lg font-heading font-bold">SEO</h2>
          <Input label="SEO Title" {...register('seoTitle')} />
          <Input label="SEO Description" {...register('seoDescription')} />
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? <Spinner size="sm" /> : 'Create Product'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
