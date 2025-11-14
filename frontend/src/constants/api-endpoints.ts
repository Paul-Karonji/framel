/**
 * API endpoint constants
 * Centralized API endpoint management
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    REGISTER: `${API_BASE}/auth/register`,
    RESET_PASSWORD: `${API_BASE}/auth/reset-password`,
    PROFILE: `${API_BASE}/auth/profile`,
    UPDATE_PROFILE: `${API_BASE}/auth/profile`,
    DELETE_ACCOUNT: `${API_BASE}/auth/account`,
    VERIFY_EMAIL: `${API_BASE}/auth/verify-email`,
    CHECK_ADMIN: `${API_BASE}/auth/check-admin`,
  },

  // Product endpoints
  PRODUCTS: {
    LIST: `${API_BASE}/products`,
    DETAIL: (id: string) => `${API_BASE}/products/${id}`,
    FEATURED: `${API_BASE}/products/featured`,
    BY_CATEGORY: (category: string) => `${API_BASE}/products/category/${category}`,
    SEARCH: `${API_BASE}/products/search`,
    CREATE: `${API_BASE}/products`,
    UPDATE: (id: string) => `${API_BASE}/products/${id}`,
    DELETE: (id: string) => `${API_BASE}/products/${id}`,
    UPLOAD_IMAGES: (id: string) => `${API_BASE}/products/${id}/images`,
    UPDATE_FEATURED: (id: string) => `${API_BASE}/products/${id}/featured`,
    UPDATE_STOCK: (id: string) => `${API_BASE}/products/${id}/stock`,
  },

  // Cart endpoints
  CART: {
    GET: `${API_BASE}/cart`,
    ADD: `${API_BASE}/cart/add`,
    UPDATE: `${API_BASE}/cart/update`,
    REMOVE: (productId: string) => `${API_BASE}/cart/remove/${productId}`,
    CLEAR: `${API_BASE}/cart/clear`,
  },

  // Order endpoints
  ORDERS: {
    CREATE: `${API_BASE}/orders`,
    LIST: `${API_BASE}/orders`,
    USER_ORDERS: `${API_BASE}/orders/user/me`,
    DETAIL: (id: string) => `${API_BASE}/orders/${id}`,
    BY_ORDER_ID: (orderId: string) => `${API_BASE}/orders/order/${orderId}`,
    CANCEL: (id: string) => `${API_BASE}/orders/${id}/cancel`,
    UPDATE_STATUS: (id: string) => `${API_BASE}/orders/${id}/status`,
  },

  // Payment endpoints
  PAYMENT: {
    MPESA_INITIATE: `${API_BASE}/payment/mpesa/initiate`,
    MPESA_STATUS: (checkoutRequestId: string) =>
      `${API_BASE}/payment/mpesa/status/${checkoutRequestId}`,
    MPESA_CALLBACK: `${API_BASE}/payment/mpesa/callback`,
    VERIFY: `${API_BASE}/payment/verify`,
  },

  // Wishlist endpoints
  WISHLIST: {
    GET: `${API_BASE}/wishlist`,
    ADD: `${API_BASE}/wishlist/add`,
    REMOVE: (productId: string) => `${API_BASE}/wishlist/remove/${productId}`,
    CHECK: (productId: string) => `${API_BASE}/wishlist/check/${productId}`,
  },

  // Category endpoints
  CATEGORIES: {
    LIST: `${API_BASE}/categories`,
    DETAIL: (id: string) => `${API_BASE}/categories/${id}`,
    CREATE: `${API_BASE}/categories`,
    UPDATE: (id: string) => `${API_BASE}/categories/${id}`,
    DELETE: (id: string) => `${API_BASE}/categories/${id}`,
  },

  // Review endpoints
  REVIEWS: {
    BY_PRODUCT: (productId: string) => `${API_BASE}/reviews/product/${productId}`,
    CREATE: `${API_BASE}/reviews`,
    UPDATE: (id: string) => `${API_BASE}/reviews/${id}`,
    DELETE: (id: string) => `${API_BASE}/reviews/${id}`,
    MARK_HELPFUL: (id: string) => `${API_BASE}/reviews/${id}/helpful`,
  },

  // Admin endpoints
  ADMIN: {
    ANALYTICS: `${API_BASE}/admin/analytics`,
    USERS: `${API_BASE}/auth/users`,
    USER_DETAIL: (uid: string) => `${API_BASE}/auth/users/${uid}`,
    UPDATE_USER_ROLE: (uid: string) => `${API_BASE}/auth/users/${uid}/role`,
  },
} as const;

export default API_ENDPOINTS;
