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

export interface Order {
  id: string;
  orderId: string; // Custom format: FRM-20251113-0001
  userId?: string; // Optional for guest orders
  guestId?: string; // For guest tracking
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryAddress: Address;
  deliveryDate: Timestamp;
  paymentMethod: 'mpesa';
  paymentStatus: 'pending' | 'completed' | 'failed';
  mpesaReceiptNumber?: string;
  checkoutRequestId?: string; // M-Pesa STK push checkout request ID
  merchantRequestId?: string; // M-Pesa STK push merchant request ID
  orderStatus: 'processing' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
