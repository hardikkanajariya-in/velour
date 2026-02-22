export interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
  isPrimary: boolean;
  order: number;
}

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  colorHex: string | null;
  stock: number;
  additionalPrice: number;
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  categoryId: string;
  brandId: string | null;
  basePrice: number;
  comparePrice: number | null;
  costPrice: number | null;
  sku: string;
  tags: string[];
  gender: "MEN" | "WOMEN" | "KIDS" | "UNISEX";
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isActive: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  totalSold: number;
  viewCount: number;
  averageRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
  variants: ProductVariant[];
  category?: { id: string; name: string; slug: string };
  brand?: { id: string; name: string; slug: string } | null;
}

export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  comparePrice: number | null;
  gender: "MEN" | "WOMEN" | "KIDS" | "UNISEX";
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  averageRating: number;
  reviewCount: number;
  images: ProductImage[];
  variants: ProductVariant[];
  category?: { id: string; name: string; slug: string };
  brand?: { id: string; name: string; slug: string } | null;
}

export interface ProductsResponse {
  products: ProductListItem[];
  total: number;
  page: number;
  totalPages: number;
}
