import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { verifyAuth, requireAdmin } from '../middleware/auth';
import {
  validate,
  registerSchema,
  resetPasswordSchema,
} from '../middleware/validation';

const router = Router();

/**
 * Authentication Routes
 * Base path: /api/auth
 */

// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================

/**
 * Register new user
 * POST /api/auth/register
 * Body: { email, password, name, phone }
 */
router.post('/register', validate(registerSchema), authController.register);

/**
 * Send password reset email
 * POST /api/auth/reset-password
 * Body: { email }
 */
router.post(
  '/reset-password',
  validate(resetPasswordSchema),
  authController.resetPassword
);

// ============================================
// PROTECTED ROUTES (Authentication required)
// ============================================

/**
 * Get current user profile
 * GET /api/auth/profile
 * Headers: Authorization: Bearer <token>
 */
router.get('/profile', verifyAuth, authController.getProfile);

/**
 * Update user profile
 * PUT /api/auth/profile
 * Headers: Authorization: Bearer <token>
 * Body: { name?, phone?, preferences?, addresses? }
 */
router.put('/profile', verifyAuth, authController.updateProfile);

/**
 * Delete user account
 * DELETE /api/auth/account
 * Headers: Authorization: Bearer <token>
 */
router.delete('/account', verifyAuth, authController.deleteAccount);

/**
 * Send email verification
 * POST /api/auth/verify-email
 * Headers: Authorization: Bearer <token>
 */
router.post('/verify-email', verifyAuth, authController.sendEmailVerification);

/**
 * Check if user is admin
 * GET /api/auth/check-admin
 * Headers: Authorization: Bearer <token>
 */
router.get('/check-admin', verifyAuth, authController.checkAdmin);

// ============================================
// ADMIN ROUTES (Admin authentication required)
// ============================================

/**
 * Get user by ID
 * GET /api/auth/users/:uid
 * Headers: Authorization: Bearer <token>
 */
router.get('/users/:uid', verifyAuth, requireAdmin, authController.getUserById);

/**
 * Set user role
 * PUT /api/auth/users/:uid/role
 * Headers: Authorization: Bearer <token>
 * Body: { role: 'customer' | 'admin' }
 */
router.put('/users/:uid/role', verifyAuth, requireAdmin, authController.setUserRole);

export default router;
