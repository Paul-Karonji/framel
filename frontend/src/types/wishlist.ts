/**
 * Wishlist related TypeScript types
 */

import { Product } from './product';

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

export interface Wishlist {
  items: WishlistItem[];
  total: number;
}

export interface AddToWishlistData {
  productId: string;
}

export interface WishlistResponse {
  wishlist: Wishlist;
  message?: string;
}
