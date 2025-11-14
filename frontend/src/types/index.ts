/**
 * Barrel export for all TypeScript types
 * Import types from this file for convenience
 */

export * from './product';
export * from './user';
export * from './cart';
export * from './order';
export * from './payment';
export * from './wishlist';
export * from './category';
export * from './review';
export * from './analytics';

// Common API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}
