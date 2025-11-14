/**
 * Application configuration constants
 */

export const APP_CONFIG = {
  NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Framel',
  URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',

  // Cloudinary
  CLOUDINARY: {
    CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'deiw3mdvi',
    UPLOAD_PRESET: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'framel_products',
  },

  // Feature flags
  FEATURES: {
    ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    PWA: process.env.NEXT_PUBLIC_ENABLE_PWA === 'true',
  },

  // Pagination
  ITEMS_PER_PAGE: 12,

  // Cart
  MAX_CART_ITEMS: 50,

  // Delivery fee (in KES)
  DELIVERY_FEE: 500,

  // Product categories
  CATEGORIES: [
    { value: 'roses', label: 'Roses' },
    { value: 'bouquets', label: 'Bouquets' },
    { value: 'occasions', label: 'Special Occasions' },
    { value: 'plants', label: 'Plants' },
    { value: 'gifts', label: 'Gifts' },
  ],

  // Order statuses
  ORDER_STATUSES: [
    { value: 'processing', label: 'Processing', color: '#FFB74D' },
    { value: 'confirmed', label: 'Confirmed', color: '#64B5F6' },
    { value: 'dispatched', label: 'Dispatched', color: '#9575CD' },
    { value: 'delivered', label: 'Delivered', color: '#7BAE7F' },
    { value: 'cancelled', label: 'Cancelled', color: '#E57373' },
  ],

  // Payment statuses
  PAYMENT_STATUSES: [
    { value: 'pending', label: 'Pending', color: '#FFB74D' },
    { value: 'completed', label: 'Completed', color: '#7BAE7F' },
    { value: 'failed', label: 'Failed', color: '#E57373' },
  ],
} as const;

export default APP_CONFIG;
