/**
 * Application route constants
 * Centralized route management for type safety and maintainability
 */

export const ROUTES = {
  // Public routes
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id: string) => `/products/${id}`,
  CATEGORY: (slug: string) => `/products/category/${slug}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  CHECKOUT_SUCCESS: '/checkout/success',
  ABOUT: '/about',

  // Authentication routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',

  // User dashboard routes (protected)
  DASHBOARD: '/dashboard',
  ORDERS: '/orders',
  ORDER_DETAIL: (id: string) => `/orders/${id}`,
  WISHLIST: '/wishlist',
  PROFILE: '/profile',
  ADDRESSES: '/addresses',

  // Admin routes (protected, admin only)
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_PRODUCT_NEW: '/admin/products/new',
  ADMIN_PRODUCT_EDIT: (id: string) => `/admin/products/${id}/edit`,
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_ORDER_DETAIL: (id: string) => `/admin/orders/${id}`,
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_CUSTOMER_DETAIL: (id: string) => `/admin/customers/${id}`,
  ADMIN_ANALYTICS: '/admin/analytics',
} as const;

// Route groups for easier management
export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.PRODUCTS,
  ROUTES.CART,
  ROUTES.CHECKOUT,
  ROUTES.ABOUT,
];

export const AUTH_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
];

export const USER_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.ORDERS,
  ROUTES.WISHLIST,
  ROUTES.PROFILE,
  ROUTES.ADDRESSES,
];

export const ADMIN_ROUTES = [
  ROUTES.ADMIN_DASHBOARD,
  ROUTES.ADMIN_PRODUCTS,
  ROUTES.ADMIN_ORDERS,
  ROUTES.ADMIN_CUSTOMERS,
  ROUTES.ADMIN_ANALYTICS,
];
