import { Router } from 'express';
import productController from '../controllers/product.controller';
import { verifyAuth, requireAdmin } from '../middleware/auth';
import { validate, createProductSchema, updateProductSchema } from '../middleware/validation';

const router = Router();

/**
 * Product Routes
 * Base path: /api/products
 */

// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================

/**
 * Get all products with filters and pagination
 * GET /api/products
 * Query params: page, limit, category, search, minPrice, maxPrice, featured, inStock, sortBy, sortOrder
 */
router.get('/', productController.getAllProducts);

/**
 * Get featured products
 * GET /api/products/featured
 * Query params: limit (default: 10)
 */
router.get('/featured', productController.getFeaturedProducts);

/**
 * Get products by category
 * GET /api/products/category/:category
 */
router.get('/category/:category', productController.getProductsByCategory);

/**
 * Get product by ID
 * GET /api/products/:id
 */
router.get('/:id', productController.getProductById);

// ============================================
// ADMIN ROUTES (Authentication + Admin required)
// ============================================

/**
 * Create new product
 * POST /api/products
 * Headers: Authorization: Bearer <token>
 * Body: { name, description, price, category, stock, imageURLs?, featured?, colors?, tags? }
 */
router.post(
  '/',
  verifyAuth,
  requireAdmin,
  validate(createProductSchema),
  productController.createProduct
);

/**
 * Update product
 * PUT /api/products/:id
 * Headers: Authorization: Bearer <token>
 * Body: Partial<Product>
 */
router.put(
  '/:id',
  verifyAuth,
  requireAdmin,
  validate(updateProductSchema),
  productController.updateProduct
);

/**
 * Delete product
 * DELETE /api/products/:id
 * Headers: Authorization: Bearer <token>
 */
router.delete('/:id', verifyAuth, requireAdmin, productController.deleteProduct);

/**
 * Upload product images
 * POST /api/products/:id/images
 * Headers: Authorization: Bearer <token>
 * Body: { images: string[] } - Array of base64 encoded images
 */
router.post('/:id/images', verifyAuth, requireAdmin, productController.uploadImages);

/**
 * Toggle featured status
 * PATCH /api/products/:id/featured
 * Headers: Authorization: Bearer <token>
 */
router.patch('/:id/featured', verifyAuth, requireAdmin, productController.toggleFeatured);

/**
 * Update stock
 * PATCH /api/products/:id/stock
 * Headers: Authorization: Bearer <token>
 * Body: { quantity: number }
 */
router.patch('/:id/stock', verifyAuth, requireAdmin, productController.updateStock);

export default router;
