/**
 * Shopping cart related TypeScript types
 */

import { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export interface AddToCartData {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemData {
  productId: string;
  quantity: number;
}

export interface CartResponse {
  cart: Cart;
  message?: string;
}

// Local storage cart (for guest users)
export interface LocalCartItem {
  productId: string;
  quantity: number;
  addedAt: string;
}
