import { Timestamp } from 'firebase-admin/firestore';

// ============================================
// USER TYPES
// ============================================

export interface User {
  uid: string;
  email: string;
  name: string;
  phone: string;
  role: 'customer' | 'admin';
  addresses?: Address[];
  preferences?: {
    notifications: boolean;
    newsletter: boolean;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  additionalInfo?: string;
  isDefault: boolean;
}

// ============================================
// PRODUCT TYPES
// ============================================

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'roses' | 'bouquets' | 'occasions' | 'corporate';
  stock: number;
  imageURLs: string[];
  featured: boolean;
  colors?: string[];
  tags?: string[];
  rating?: number;
  reviewCount?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageURL: string;
  order: number;
}

// ============================================
// ORDER TYPES
// ============================================

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

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageURL: string;
}

// ============================================
// CART TYPES
// ============================================

export interface Cart {
  userId: string;
  items: CartItem[];
  updatedAt: Timestamp;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  addedAt: Timestamp;
}

// ============================================
// WISHLIST TYPES
// ============================================

export interface Wishlist {
  userId: string;
  items: WishlistItem[];
  updatedAt: Timestamp;
}

export interface WishlistItem {
  productId: string;
  addedAt: Timestamp;
}

// ============================================
// REVIEW TYPES
// ============================================

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  images?: string[];
  createdAt: Timestamp;
}

// ============================================
// API REQUEST/RESPONSE TYPES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}

// Auth Requests
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ResetPasswordRequest {
  email: string;
}

// Product Requests
export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageURLs?: string[];
  featured?: boolean;
  colors?: string[];
  tags?: string[];
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

// Order Requests
export interface CreateOrderRequest {
  items: {
    productId: string;
    quantity: number;
  }[];
  deliveryAddress: Omit<Address, 'id' | 'isDefault'>;
  deliveryDate: string;
  paymentMethod: 'mpesa';
}

// Payment Requests
export interface InitiatePaymentRequest {
  orderId: string;
  phone: string;
  amount: number;
}

export interface MpesaCallbackData {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: Array<{
          Name: string;
          Value: string | number;
        }>;
      };
    };
  };
}

// ============================================
// EXPRESS REQUEST EXTENSIONS
// ============================================

export interface AuthenticatedRequest extends Express.Request {
  user?: {
    uid: string;
    email: string;
    role: 'customer' | 'admin';
  };
}

// ============================================
// VALIDATION SCHEMAS (for Zod)
// ============================================

export interface ValidationError {
  field: string;
  message: string;
}
