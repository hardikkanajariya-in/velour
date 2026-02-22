export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
  displayOrder: number;
  isActive: boolean;
  children?: Category[];
  _count?: { products: number };
}

export interface CategoryTree extends Category {
  children: CategoryTree[];
}
