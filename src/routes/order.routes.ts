import { Router } from 'express';
import orderController from '../controllers/order.controller';
import { verifyAuth, requireAdmin } from '../middleware/auth';

const router = Router();

/**
 * Order Routes
 * Base path: /api/orders
 */

// ============================================
// AUTHENTICATED USER ROUTES
// ============================================

/**
 * Create new order from cart
 * POST /api/orders
 * Body: { items, deliveryAddress, deliveryDate, paymentMethod }
 *
 * Auth: Required (User/Admin)
 */
router.post('/', verifyAuth, orderController.createOrder);

/**
 * Get user's orders
 * GET /api/orders/user/me
 * Query: page, limit, status
 *
 * Auth: Required (User/Admin)
 */
router.get('/user/me', verifyAuth, orderController.getUserOrders);

/**
 * Get order by order ID (FRM-YYYYMMDD-XXXX)
 * GET /api/orders/order/:orderId
 *
 * Auth: Required (User can view own, Admin can view all)
 */
router.get('/order/:orderId', verifyAuth, orderController.getOrderByOrderId);

/**
 * Get order by document ID
 * GET /api/orders/:id
 *
 * Auth: Required (User can view own, Admin can view all)
 */
router.get('/:id', verifyAuth, orderController.getOrderById);

/**
 * Cancel order
 * POST /api/orders/:id/cancel
 *
 * Auth: Required (User can cancel own unpaid orders, Admin can cancel any)
 */
router.post('/:id/cancel', verifyAuth, orderController.cancelOrder);

// ============================================
// ADMIN ROUTES
// ============================================

/**
 * Get all orders
 * GET /api/orders
 * Query: page, limit, status, paymentStatus
 *
 * Auth: Required (Admin)
 */
router.get('/', verifyAuth, requireAdmin, orderController.getAllOrders);

/**
 * Get order statistics
 * GET /api/orders/stats
 *
 * Auth: Required (Admin)
 */
router.get('/stats', verifyAuth, requireAdmin, orderController.getOrderStatistics);

/**
 * Update order status
 * PATCH /api/orders/:id/status
 * Body: { status: 'processing' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled' }
 *
 * Auth: Required (Admin)
 */
router.patch('/:id/status', verifyAuth, requireAdmin, orderController.updateOrderStatus);

export default router;
