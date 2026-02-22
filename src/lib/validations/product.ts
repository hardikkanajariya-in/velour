import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  shortDescription: z.string().max(150, 'Short description must be 150 characters or less').optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  categoryId: z.string().min(1, 'Category is required'),
  brandId: z.string().optional(),
  basePrice: z.number().positive('Price must be positive'),
  comparePrice: z.number().positive().optional(),
  costPrice: z.number().positive().optional(),
  sku: z.string().min(1, 'SKU is required'),
  tags: z.array(z.string()).default([]),
  gender: z.enum(['MEN', 'WOMEN', 'KIDS', 'UNISEX']),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isActive: z.boolean().default(true),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
});

export const productVariantSchema = z.object({
  size: z.string().min(1, 'Size is required'),
  color: z.string().min(1, 'Color is required'),
  colorHex: z.string().optional(),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  additionalPrice: z.number().default(0),
  sku: z.string().min(1, 'Variant SKU is required'),
});

export const productFilterSchema = z.object({
  category: z.string().optional(),
  brand: z.string().optional(),
  gender: z.enum(['MEN', 'WOMEN', 'KIDS', 'UNISEX']).optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  sort: z.string().optional(),
  page: z.number().default(1),
  limit: z.number().default(12),
  search: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
export type ProductVariantInput = z.infer<typeof productVariantSchema>;
export type ProductFilterInput = z.infer<typeof productFilterSchema>;
