import { Router } from 'express';
import paymentController from '../controllers/payment.controller';
import { verifyAuth, requireAdmin } from '../middleware/auth';

const router = Router();

/**
 * Payment Routes
 * Base path: /api/payment
 */

// ============================================
// AUTHENTICATED USER ROUTES
// ============================================

/**
 * Initiate M-Pesa STK Push payment
 * POST /api/payment/mpesa/initiate
 * Body: { orderId: string, phone: string, amount: number }
 *
 * Auth: Required (User/Admin)
 *
 * Example:
 * {
 *   "orderId": "doc-id-or-order-id",
 *   "phone": "254712345678",
 *   "amount": 2500
 * }
 */
router.post('/mpesa/initiate', verifyAuth, paymentController.initiatePayment);

/**
 * Query M-Pesa payment status
 * GET /api/payment/mpesa/status/:checkoutRequestId
 *
 * Auth: Required (User/Admin)
 */
router.get('/mpesa/status/:checkoutRequestId', verifyAuth, paymentController.queryPaymentStatus);

// ============================================
// PUBLIC ROUTES (M-Pesa Callbacks)
// ============================================

/**
 * M-Pesa callback URL
 * POST /api/payment/mpesa/callback
 *
 * Auth: None (M-Pesa sends this)
 *
 * This endpoint receives payment confirmation from M-Pesa
 * and updates the order payment status automatically.
 */
router.post('/mpesa/callback', paymentController.mpesaCallback);

// ============================================
// ADMIN ROUTES
// ============================================

/**
 * Manually verify payment and update order
 * POST /api/payment/verify
 * Body: { orderId: string, mpesaReceiptNumber: string }
 *
 * Auth: Required (Admin)
 *
 * Use this to manually mark an order as paid
 */
router.post('/verify', verifyAuth, requireAdmin, paymentController.verifyPayment);

export default router;
