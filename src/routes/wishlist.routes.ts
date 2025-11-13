import { Router } from 'express';
import wishlistController from '../controllers/wishlist.controller';
import { verifyAuth } from '../middleware/auth';

const router = Router();

/**
 * Wishlist Routes
 * Base path: /api/wishlist
 *
 * All wishlist operations require authentication
 */

// ============================================
// AUTHENTICATED USER ROUTES
// ============================================

/**
 * Get user's wishlist with product details
 * GET /api/wishlist
 *
 * Auth: Required (User/Admin)
 */
router.get('/', verifyAuth, wishlistController.getWishlist);

/**
 * Get wishlist item count
 * GET /api/wishlist/count
 *
 * Auth: Required (User/Admin)
 */
router.get('/count', verifyAuth, wishlistController.getWishlistCount);

/**
 * Check if product is in wishlist
 * GET /api/wishlist/check/:productId
 *
 * Auth: Required (User/Admin)
 */
router.get('/check/:productId', verifyAuth, wishlistController.checkWishlist);

/**
 * Add item to wishlist
 * POST /api/wishlist/items
 * Body: { productId: string }
 *
 * Auth: Required (User/Admin)
 */
router.post('/items', verifyAuth, wishlistController.addToWishlist);

/**
 * Remove item from wishlist
 * DELETE /api/wishlist/items/:productId
 *
 * Auth: Required (User/Admin)
 */
router.delete('/items/:productId', verifyAuth, wishlistController.removeFromWishlist);

/**
 * Clear wishlist
 * DELETE /api/wishlist
 *
 * Auth: Required (User/Admin)
 */
router.delete('/', verifyAuth, wishlistController.clearWishlist);

/**
 * Move wishlist items to cart
 * POST /api/wishlist/move-to-cart
 * Body: { productIds: string[] }
 *
 * Auth: Required (User/Admin)
 *
 * Note: This removes items from wishlist and requires
 * the frontend to then add them to cart via cart API
 */
router.post('/move-to-cart', verifyAuth, wishlistController.moveToCart);

export default router;
