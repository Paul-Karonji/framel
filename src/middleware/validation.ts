import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { ApiResponse } from '../types';

/**
 * Generic validation middleware
 */
export const validate = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        const response: ApiResponse = {
          success: false,
          error: 'Validation failed',
          message: 'Please check your input and try again',
          data: { errors },
        };

        return res.status(400).json(response);
      }

      return next(error);
    }
  };
};

// ============================================
// VALIDATION SCHEMAS
// ============================================

// Auth schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z
    .string()
    .regex(/^(\+254|254|0)[71]\d{8}$/, 'Phone number must be a valid Kenyan mobile number (e.g., 0712345678, 0712345678, +254712345678)')
    .transform((val) => {
      // Normalize phone number to international format
      if (val.startsWith('0')) {
        return '+254' + val.substring(1);
      } else if (val.startsWith('254') && !val.startsWith('+')) {
        return '+' + val;
      }
      return val;
    }),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// Product schemas
export const createProductSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  category: z.enum(['roses', 'bouquets', 'occasions', 'corporate']),
  stock: z.number().int().nonnegative('Stock must be a non-negative integer'),
  imageURLs: z.array(z.string().url()).optional(),
  featured: z.boolean().optional(),
  colors: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export const updateProductSchema = createProductSchema.partial();

// Order schemas
export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1, 'Product ID is required'),
        quantity: z.number().int().positive('Quantity must be positive'),
      })
    )
    .min(1, 'At least one item is required'),
  deliveryAddress: z.object({
    fullName: z.string().min(2, 'Full name is required'),
    phone: z.string().regex(/^(\+254|254|0)[71]\d{8}$/, 'Invalid Kenyan mobile number'),
    address: z.string().min(5, 'Address is required'),
    city: z.string().min(2, 'City is required'),
    additionalInfo: z.string().optional(),
  }),
  deliveryDate: z.string().datetime('Invalid date format'),
  paymentMethod: z.enum(['mpesa']),
});

// Payment schemas
export const initiatePaymentSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  phone: z.string().regex(/^(\+254|254|0)[71]\d{8}$/, 'Invalid Kenyan mobile number (e.g., 0712345678, +254712345678)'),
  amount: z.number().positive('Amount must be positive'),
});

// Cart schemas
export const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().positive('Quantity must be positive'),
});

export const updateCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().nonnegative('Quantity must be non-negative'),
});
