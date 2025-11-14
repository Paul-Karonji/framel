/**
 * Product related TypeScript types
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  stock: number;
  imageURLs: string[];
  featured: boolean;
  colors?: string[];
  occasion?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProductCategory = 'roses' | 'bouquets' | 'occasions' | 'plants' | 'gifts';

export interface ProductFilters {
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  search?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'name' | 'newest';
  page?: number;
  limit?: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  stock: number;
  imageURLs: string[];
  featured?: boolean;
  colors?: string[];
  occasion?: string;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}
