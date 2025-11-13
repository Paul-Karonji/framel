import { Request, Response } from 'express';
import wishlistService from '../services/wishlist.service';
import { ApiResponse, AuthenticatedRequest } from '../types';
import { asyncHandler } from '../middleware/errorHandler';

/**
 * Wishlist Controller
 * Handles HTTP requests for wishlist endpoints
 */
class WishlistController {
  /**
   * Get user's wishlist
   * GET /api/wishlist
   */
  getWishlist = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Please login to view wishlist',
      } as ApiResponse);
    }

    const wishlist = await wishlistService.getWishlist(user.uid);

    const response: ApiResponse = {
      success: true,
      data: wishlist,
    };

    return res.json(response);
  });

  /**
   * Add item to wishlist
   * POST /api/wishlist/items
   */
  addToWishlist = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Please login to add to wishlist',
      } as ApiResponse);
    }

    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request',
        message: 'Product ID is required',
      } as ApiResponse);
    }

    const wishlist = await wishlistService.addToWishlist(user.uid, productId);

    const response: ApiResponse = {
      success: true,
      message: 'Item added to wishlist successfully',
      data: { wishlist },
    };

    return res.status(201).json(response);
  });

  /**
   * Remove item from wishlist
   * DELETE /api/wishlist/items/:productId
   */
  removeFromWishlist = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Please login to remove from wishlist',
      } as ApiResponse);
    }

    const { productId } = req.params;

    const wishlist = await wishlistService.removeFromWishlist(user.uid, productId);

    const response: ApiResponse = {
      success: true,
      message: 'Item removed from wishlist successfully',
      data: { wishlist },
    };

    return res.json(response);
  });

  /**
   * Clear wishlist
   * DELETE /api/wishlist
   */
  clearWishlist = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Please login to clear wishlist',
      } as ApiResponse);
    }

    await wishlistService.clearWishlist(user.uid);

    const response: ApiResponse = {
      success: true,
      message: 'Wishlist cleared successfully',
    };

    return res.json(response);
  });

  /**
   * Check if product is in wishlist
   * GET /api/wishlist/check/:productId
   */
  checkWishlist = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Please login to check wishlist',
      } as ApiResponse);
    }

    const { productId } = req.params;

    const isInWishlist = await wishlistService.isInWishlist(user.uid, productId);

    const response: ApiResponse = {
      success: true,
      data: { isInWishlist },
    };

    return res.json(response);
  });

  /**
   * Get wishlist count
   * GET /api/wishlist/count
   */
  getWishlistCount = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Please login to get wishlist count',
      } as ApiResponse);
    }

    const count = await wishlistService.getWishlistCount(user.uid);

    const response: ApiResponse = {
      success: true,
      data: { count },
    };

    return res.json(response);
  });

  /**
   * Move wishlist items to cart
   * POST /api/wishlist/move-to-cart
   */
  moveToCart = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Please login to move items to cart',
      } as ApiResponse);
    }

    const { productIds } = req.body;

    if (!productIds || !Array.isArray(productIds)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request',
        message: 'Product IDs array is required',
      } as ApiResponse);
    }

    const result = await wishlistService.moveToCart(user.uid, productIds);

    const response: ApiResponse = {
      success: true,
      message: `${result.movedItems.length} items moved to cart`,
      data: result,
    };

    return res.json(response);
  });
}

export default new WishlistController();
