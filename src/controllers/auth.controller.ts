import { Request, Response } from 'express';
import authService from '../services/auth.service';
import { ApiResponse, RegisterRequest, AuthenticatedRequest } from '../types';
import { asyncHandler } from '../middleware/errorHandler';

/**
 * Authentication Controller
 * Handles HTTP requests for authentication endpoints
 */
class AuthController {
  /**
   * Register new user
   * POST /api/auth/register
   */
  register = asyncHandler(async (req: Request, res: Response) => {
    const data: RegisterRequest = req.body;

    const result = await authService.register(data);

    const response: ApiResponse = {
      success: true,
      message: result.message,
      data: {
        user: {
          uid: result.user.uid,
          email: result.user.email,
          name: result.user.name,
          phone: result.user.phone,
          role: result.user.role,
        },
      },
    };

    return res.status(201).json(response);
  });

  /**
   * Get current user profile
   * GET /api/auth/profile
   */
  getProfile = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Please login to continue',
      } as ApiResponse);
    }

    const userProfile = await authService.getUserByUid(user.uid);

    const response: ApiResponse = {
      success: true,
      data: { user: userProfile },
    };

    return res.json(response);
  });

  /**
   * Update user profile
   * PUT /api/auth/profile
   */
  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Please login to continue',
      } as ApiResponse);
    }

    const updates = req.body;
    const updatedUser = await authService.updateUser(user.uid, updates);

    const response: ApiResponse = {
      success: true,
      message: 'Profile updated successfully',
      data: { user: updatedUser },
    };

    return res.json(response);
  });

  /**
   * Delete user account
   * DELETE /api/auth/account
   */
  deleteAccount = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Please login to continue',
      } as ApiResponse);
    }

    await authService.deleteUser(user.uid);

    const response: ApiResponse = {
      success: true,
      message: 'Account deleted successfully',
    };

    return res.json(response);
  });

  /**
   * Send password reset email
   * POST /api/auth/reset-password
   */
  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    await authService.sendPasswordResetEmail(email);

    const response: ApiResponse = {
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.',
    };

    return res.json(response);
  });

  /**
   * Send email verification
   * POST /api/auth/verify-email
   */
  sendEmailVerification = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Please login to continue',
      } as ApiResponse);
    }

    await authService.sendEmailVerification(user.uid);

    const response: ApiResponse = {
      success: true,
      message: 'Verification email sent successfully',
    };

    return res.json(response);
  });

  /**
   * Check if user is admin
   * GET /api/auth/check-admin
   */
  checkAdmin = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Please login to continue',
      } as ApiResponse);
    }

    const isAdmin = await authService.isAdmin(user.uid);

    const response: ApiResponse = {
      success: true,
      data: { isAdmin },
    };

    return res.json(response);
  });

  /**
   * Set user role (admin only)
   * PUT /api/auth/users/:uid/role
   */
  setUserRole = asyncHandler(async (req: Request, res: Response) => {
    const { uid } = req.params;
    const { role } = req.body;

    if (!['customer', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role',
        message: 'Role must be either "customer" or "admin"',
      } as ApiResponse);
    }

    const updatedUser = await authService.setUserRole(uid, role);

    const response: ApiResponse = {
      success: true,
      message: 'User role updated successfully',
      data: { user: updatedUser },
    };

    return res.json(response);
  });

  /**
   * Get user by ID (admin only)
   * GET /api/auth/users/:uid
   */
  getUserById = asyncHandler(async (req: Request, res: Response) => {
    const { uid } = req.params;

    const user = await authService.getUserByUid(uid);

    const response: ApiResponse = {
      success: true,
      data: { user },
    };

    return res.json(response);
  });
}

export default new AuthController();
