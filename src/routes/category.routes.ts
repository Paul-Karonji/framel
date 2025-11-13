import { Router } from 'express';
import categoryController from '../controllers/category.controller';
import { verifyAuth, requireAdmin } from '../middleware/auth';

const router = Router();

/**
 * Category Routes
 * Base path: /api/categories
 */

// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================

/**
 * Get all categories
 * GET /api/categories
 */
router.get('/', categoryController.getAllCategories);

/**
 * Get categories with product count
 * GET /api/categories/with-count
 */
router.get('/with-count', categoryController.getCategoriesWithCount);

/**
 * Get category by slug
 * GET /api/categories/slug/:slug
 */
router.get('/slug/:slug', categoryController.getCategoryBySlug);

/**
 * Get category by ID
 * GET /api/categories/:id
 */
router.get('/:id', categoryController.getCategoryById);

// ============================================
// ADMIN ROUTES (Authentication + Admin required)
// ============================================

/**
 * Create new category
 * POST /api/categories
 * Headers: Authorization: Bearer <token>
 * Body: { name, description, imageURL?, order? }
 */
router.post('/', verifyAuth, requireAdmin, categoryController.createCategory);

/**
 * Update category
 * PUT /api/categories/:id
 * Headers: Authorization: Bearer <token>
 * Body: Partial<Category>
 */
router.put('/:id', verifyAuth, requireAdmin, categoryController.updateCategory);

/**
 * Delete category
 * DELETE /api/categories/:id
 * Headers: Authorization: Bearer <token>
 */
router.delete('/:id', verifyAuth, requireAdmin, categoryController.deleteCategory);

export default router;
