import { Category, SubCategory } from './category.types';
import { Brand } from './brand.types';

export type DiscountType = 'percentage' | 'fixed';

export interface ProductDiscount {
  discount: number;
  type: DiscountType;
}

export interface ProductRating {
  avg: number;
  count: number;
}

export interface Product {
  _id: string;
  name: string;
  slug?: string;
  description: string;
  price: number;
  priceAfterDiscount?: number;
  discount?: ProductDiscount;
  stock: number;
  gallery: string[];
  category: Category | string;
  subCategory?: SubCategory | string;
  brand?: Brand | string;
  rating?: ProductRating;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  categoryId?: string;
  subCategoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export interface ProductsResponse {
  data: Product[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  totalProducts?: number;
}
