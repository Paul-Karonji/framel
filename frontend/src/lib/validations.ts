/**
 * Zod validation schemas for forms
 */

import { z } from 'zod';

// Authentication schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .max(100, 'Password is too long'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long'),
  phone: z
    .string()
    .regex(/^(?:254|\+254|0)?([17]\d{8})$/, 'Invalid Kenyan phone number')
    .transform((val) => {
      // Normalize to 254XXXXXXXXX format
      const cleaned = val.replace(/\D/g, '');
      if (cleaned.startsWith('0')) {
        return '254' + cleaned.slice(1);
      }
      if (cleaned.startsWith('254')) {
        return cleaned;
      }
      return '254' + cleaned;
    }),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const updateProfileSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters').optional(),
  phone: z
    .string()
    .regex(/^(?:254|\+254|0)?([17]\d{8})$/, 'Invalid Kenyan phone number')
    .optional(),
});

// Product schemas
export const createProductSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  category: z.enum(['roses', 'bouquets', 'occasions', 'plants', 'gifts']),
  stock: z.number().int().nonnegative('Stock must be a non-negative integer'),
  imageURLs: z.array(z.string().url()).min(1, 'At least one image is required'),
  featured: z.boolean().optional(),
  colors: z.array(z.string()).optional(),
  occasion: z.string().optional(),
});

// Product schema for admin forms (allows any category)
export const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(2, 'Category is required'),
  stock: z.number().int().nonnegative('Stock must be a non-negative integer'),
  featured: z.boolean().optional(),
});

// Order schemas
export const deliveryDetailsSchema = z.object({
  recipientName: z.string().min(2, 'Recipient name is required'),
  phone: z.string().regex(/^(?:254|\+254|0)?([17]\d{8})$/, 'Invalid Kenyan phone number'),
  street: z.string().min(3, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  county: z.string().min(2, 'County is required'),
  deliveryDate: z.string().min(1, 'Delivery date is required'),
  specialInstructions: z.string().optional(),
});

export const createOrderSchema = z.object({
  deliveryDetails: deliveryDetailsSchema,
});

// Payment schemas
export const mpesaPaymentSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  phoneNumber: z
    .string()
    .regex(/^(?:254|\+254|0)?([17]\d{8})$/, 'Invalid Kenyan phone number')
    .transform((val) => {
      // Normalize to 254XXXXXXXXX format
      const cleaned = val.replace(/\D/g, '');
      if (cleaned.startsWith('0')) {
        return '254' + cleaned.slice(1);
      }
      if (cleaned.startsWith('254')) {
        return cleaned;
      }
      return '254' + cleaned;
    }),
  amount: z.number().positive('Amount must be positive'),
});

// Review schema
export const createReviewSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
  comment: z.string().min(10, 'Review must be at least 10 characters'),
});

// Address schema
export const addressSchema = z.object({
  recipientName: z.string().min(2, 'Recipient name is required'),
  phone: z.string().regex(/^(?:254|\+254|0)?([17]\d{8})$/, 'Invalid Kenyan phone number'),
  street: z.string().min(3, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  county: z.string().min(2, 'County is required'),
  isDefault: z.boolean().optional(),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type CreateProductFormData = z.infer<typeof createProductSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type DeliveryDetailsFormData = z.infer<typeof deliveryDetailsSchema>;
export type CreateOrderFormData = z.infer<typeof createOrderSchema>;
export type MpesaPaymentFormData = z.infer<typeof mpesaPaymentSchema>;
export type CreateReviewFormData = z.infer<typeof createReviewSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
