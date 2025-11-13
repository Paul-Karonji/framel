import { Router } from 'express';
import reviewController from '../controllers/review.controller';
import { verifyAuth, requireAdmin } from '../middleware/auth';

const router = Router();

/**
 * Review Routes
 * Base path: /api/reviews
 */

// ============================================
 // PUBLIC ROUTES
// ============================================

/**
 * Get product reviews
 * GET /api/reviews/product/:productId
 * Query: page, limit, sortBy, sortOrder
 */
router.get('/product/:productId', reviewController.getProductReviews);

/**
 * Get product review statistics
 * GET /api/reviews/product/:productId/stats
 */
router.get('/product/:productId/stats', reviewController.getProductReviewStats);

/**
 * Get review by ID
 * GET /api/reviews/:id
 */
router.get('/:id', reviewController.getReviewById);

// ============================================
// AUTHENTICATED USER ROUTES
// ============================================

/**
 * Create review
 * POST /api/reviews
 * Body: { productId, rating, comment, images? }
 *
 * Auth: Required (User/Admin)
 */
router.post('/', verifyAuth, reviewController.createReview);

/**
 * Get user's reviews
 * GET /api/reviews/user/me
 * Query: page, limit
 *
 * Auth: Required (User/Admin)
 */
router.get('/user/me', verifyAuth, reviewController.getUserReviews);

/**
 * Check if user reviewed product
 * GET /api/reviews/check/:productId
 *
 * Auth: Required (User/Admin)
 */
router.get('/check/:productId', verifyAuth, reviewController.checkUserReview);

/**
 * Update review
 * PUT /api/reviews/:id
 * Body: { rating?, comment?, images? }
 *
 * Auth: Required (User can update own, Admin can update any)
 */
router.put('/:id', verifyAuth, reviewController.updateReview);

/**
 * Delete review
 * DELETE /api/reviews/:id
 *
 * Auth: Required (User can delete own, Admin can delete any)
 */
router.delete('/:id', verifyAuth, reviewController.deleteReview);

// ============================================
// ADMIN ROUTES
// ============================================

/**
 * Get all reviews
 * GET /api/reviews
 * Query: page, limit, productId, minRating, maxRating
 *
 * Auth: Required (Admin)
 */
router.get('/', verifyAuth, requireAdmin, reviewController.getAllReviews);

export default router;
