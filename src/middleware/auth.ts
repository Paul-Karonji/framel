import { Request, Response, NextFunction } from 'express';
import { auth, db } from '../config/firebase';
import { AuthenticatedRequest, ApiResponse } from '../types';
import { AppError } from './errorHandler';

/**
 * Middleware to verify Firebase ID token
 */
export const verifyAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.split('Bearer ')[1];

    if (!token) {
      throw new AppError('No token provided', 401);
    }

    // Verify Firebase ID token
    const decodedToken = await auth.verifyIdToken(token);

    // Get user role from Firestore
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();

    if (!userDoc.exists) {
      throw new AppError('User not found', 404);
    }

    const userData = userDoc.data();

    // Attach user info to request
    (req as AuthenticatedRequest).user = {
      uid: decodedToken.uid,
      email: decodedToken.email || '',
      role: userData?.role || 'customer',
    };

    return next();
  } catch (error: any) {
    console.error('❌ Auth middleware error:', error);

    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        success: false,
        error: 'Token expired',
        message: 'Your session has expired. Please login again.',
      } as ApiResponse);
    }

    if (error.code === 'auth/argument-error') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
        message: 'Invalid authentication token.',
      } as ApiResponse);
    }

    return next(error);
  }
};

/**
 * Middleware to check if user is admin
 */
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as AuthenticatedRequest).user;

  if (!user || user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Access denied',
      message: 'You do not have permission to access this resource.',
    } as ApiResponse);
  }

  return next();
};

/**
 * Middleware to check if user is customer or admin
 */
export const requireCustomer = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as AuthenticatedRequest).user;

  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Please login to continue.',
    } as ApiResponse);
  }

  return next();
};

/**
 * Optional auth - attaches user if token is valid, but doesn't require it
 */
export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1];

      if (token) {
        const decodedToken = await auth.verifyIdToken(token);
        const userDoc = await db.collection('users').doc(decodedToken.uid).get();

        if (userDoc.exists) {
          const userData = userDoc.data();
          (req as AuthenticatedRequest).user = {
            uid: decodedToken.uid,
            email: decodedToken.email || '',
            role: userData?.role || 'customer',
          };
        }
      }
    }
  } catch (error) {
    // Ignore auth errors for optional auth
    console.log('Optional auth failed, continuing without auth');
  }

  return next();
};
