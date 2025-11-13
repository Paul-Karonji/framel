import { Request, Response } from 'express';
import cartService from '../services/cart.service';
import { ApiResponse, AuthenticatedRequest } from '../types';
import { asyncHandler } from '../middleware/errorHandler';

/**
 * Cart Controller
 * Handles HTTP requests for cart endpoints
 */
class CartController {
  /**
   * Get user's cart
   * GET /api/cart
   */
  getCart = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;
    const userId = user?.uid || req.query.guestId as string;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID or Guest ID required',
        message: 'Please provide authentication or guestId',
      } as ApiResponse);
    }

    const cart = await cartService.getCart(userId);

    const response: ApiResponse = {
      success: true,
      data: cart,
    };

    return res.json(response);
  });

  /**
   * Add item to cart
   * POST /api/cart/items
   */
  addToCart = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;
    const userId = user?.uid || req.body.guestId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID or Guest ID required',
        message: 'Please provide authentication or guestId',
      } as ApiResponse);
    }

    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Please provide productId and quantity',
      } as ApiResponse);
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        error: 'Invalid quantity',
        message: 'Quantity must be at least 1',
      } as ApiResponse);
    }

    const cart = await cartService.addToCart(userId, productId, quantity);

    const response: ApiResponse = {
      success: true,
      message: 'Item added to cart successfully',
      data: { cart },
    };

    return res.status(201).json(response);
  });

  /**
   * Update cart item quantity
   * PUT /api/cart/items/:productId
   */
  updateCartItem = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;
    const userId = user?.uid || req.body.guestId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID or Guest ID required',
        message: 'Please provide authentication or guestId',
      } as ApiResponse);
    }

    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid quantity',
        message: 'Please provide a valid quantity (0 or greater)',
      } as ApiResponse);
    }

    const cart = await cartService.updateCartItem(userId, productId, quantity);

    const response: ApiResponse = {
      success: true,
      message: quantity === 0 ? 'Item removed from cart' : 'Cart updated successfully',
      data: { cart },
    };

    return res.json(response);
  });

  /**
   * Remove item from cart
   * DELETE /api/cart/items/:productId
   */
  removeFromCart = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;
    const userId = user?.uid || req.query.guestId as string;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID or Guest ID required',
        message: 'Please provide authentication or guestId',
      } as ApiResponse);
    }

    const { productId } = req.params;

    const cart = await cartService.removeFromCart(userId, productId);

    const response: ApiResponse = {
      success: true,
      message: 'Item removed from cart successfully',
      data: { cart },
    };

    return res.json(response);
  });

  /**
   * Clear cart
   * DELETE /api/cart
   */
  clearCart = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;
    const userId = user?.uid || req.query.guestId as string;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID or Guest ID required',
        message: 'Please provide authentication or guestId',
      } as ApiResponse);
    }

    await cartService.clearCart(userId);

    const response: ApiResponse = {
      success: true,
      message: 'Cart cleared successfully',
    };

    return res.json(response);
  });

  /**
   * Sync guest cart to user cart (when user logs in)
   * POST /api/cart/sync
   */
  syncGuestCart = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Please login to sync cart',
      } as ApiResponse);
    }

    const { guestId } = req.body;

    if (!guestId) {
      return res.status(400).json({
        success: false,
        error: 'Guest ID required',
        message: 'Please provide guestId to sync',
      } as ApiResponse);
    }

    const cart = await cartService.syncGuestCart(guestId, user.uid);

    const response: ApiResponse = {
      success: true,
      message: 'Cart synced successfully',
      data: { cart },
    };

    return res.json(response);
  });

  /**
   * Validate cart (check stock and prices)
   * GET /api/cart/validate
   */
  validateCart = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;
    const userId = user?.uid || req.query.guestId as string;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID or Guest ID required',
        message: 'Please provide authentication or guestId',
      } as ApiResponse);
    }

    const validation = await cartService.validateCart(userId);

    const response: ApiResponse = {
      success: true,
      data: validation,
    };

    return res.json(response);
  });
}

export default new CartController();
