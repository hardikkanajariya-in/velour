import type { ProductVariant, ProductImage } from "./product";

export interface CartItemData {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    basePrice: number;
    images: ProductImage[];
  };
  variant: ProductVariant;
}

export interface CartState {
  items: CartItemData[];
  isOpen: boolean;
  isLoading: boolean;
}
