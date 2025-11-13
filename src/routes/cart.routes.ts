import { Router } from 'express';
import cartController from '../controllers/cart.controller';
import { optionalAuth, verifyAuth } from '../middleware/auth';

const router = Router();

/**
 * Cart Routes
 * Base path: /api/cart
 *
 * Supports both authenticated users and guest carts
 * - Authenticated users: Use Authorization header
 * - Guest users: Pass guestId in request body/query
 */

// ============================================
// CART OPERATIONS (Optional Auth)
// ============================================

/**
 * Get cart
 * GET /api/cart
 *
 * Auth: Optional
 * - Authenticated: Returns user's cart
 * - Guest: Pass ?guestId=<uuid> query parameter
 */
router.get('/', optionalAuth, cartController.getCart);

/**
 * Add item to cart
 * POST /api/cart/items
 * Body: { productId: string, quantity: number, guestId?: string }
 *
 * Auth: Optional
 * - Authenticated: Uses user's uid
 * - Guest: Pass guestId in body
 */
router.post('/items', optionalAuth, cartController.addToCart);

/**
 * Update cart item quantity
 * PUT /api/cart/items/:productId
 * Body: { quantity: number, guestId?: string }
 *
 * Auth: Optional
 * Note: Setting quantity to 0 will remove the item
 */
router.put('/items/:productId', optionalAuth, cartController.updateCartItem);

/**
 * Remove item from cart
 * DELETE /api/cart/items/:productId
 *
 * Auth: Optional
 * - Authenticated: Uses user's uid
 * - Guest: Pass ?guestId=<uuid> query parameter
 */
router.delete('/items/:productId', optionalAuth, cartController.removeFromCart);

/**
 * Clear cart
 * DELETE /api/cart
 *
 * Auth: Optional
 * - Authenticated: Clears user's cart
 * - Guest: Pass ?guestId=<uuid> query parameter
 */
router.delete('/', optionalAuth, cartController.clearCart);

/**
 * Validate cart (check stock and prices)
 * GET /api/cart/validate
 *
 * Auth: Optional
 * Returns validation result with any issues found
 */
router.get('/validate', optionalAuth, cartController.validateCart);

// ============================================
// AUTHENTICATED CART OPERATIONS
// ============================================

/**
 * Sync guest cart to user cart
 * POST /api/cart/sync
 * Body: { guestId: string }
 *
 * Auth: Required
 * Use this when a guest user logs in to merge their guest cart
 */
router.post('/sync', verifyAuth, cartController.syncGuestCart);

export default router;
