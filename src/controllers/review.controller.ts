import { Request, Response } from 'express';
import reviewService from '../services/review.service';
import { ApiResponse, AuthenticatedRequest } from '../types';
import { asyncHandler } from '../middleware/errorHandler';

/**
 * Review Controller
 * Handles HTTP requests for review endpoints
 */
class ReviewController {
  /**
   * Create review
   * POST /api/reviews
   */
  createReview = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Please login to create a review',
      } as ApiResponse);
    }

    const { productId, rating, comment, images } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request',
        message: 'Product ID, rating, and comment are required',
      } as ApiResponse);
    }

    const review = await reviewService.createReview(
      user.uid,
      user.email, // Using email as userName for now
      productId,
      rating,
      comment,
      images
    );

    const response: ApiResponse = {
      success: true,
      message: 'Review created successfully',
      data: { review },
    };

    return res.status(201).json(response);
  });

  /**
   * Get product reviews
   * GET /api/reviews/product/:productId
   */
  getProductReviews = asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params;
    const { page, limit, sortBy, sortOrder } = req.query;

    const options = {
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      sortBy: sortBy as 'date' | 'rating',
      sortOrder: sortOrder as 'asc' | 'desc',
    };

    const reviews = await reviewService.getProductReviews(productId, options);

    const response: ApiResponse = {
      success: true,
      data: { reviews, count: reviews.length },
    };

    return res.json(response);
  });

  /**
   * Get product review statistics
   * GET /api/reviews/product/:productId/stats
   */
  getProductReviewStats = asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params;

    const stats = await reviewService.getProductReviewStats(productId);

    const response: ApiResponse = {
      success: true,
      data: stats,
    };

    return res.json(response);
  });

  /**
   * Get user's reviews
   * GET /api/reviews/user/me
   */
  getUserReviews = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Please login to view reviews',
      } as ApiResponse);
    }

    const { page, limit } = req.query;

    const options = {
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
    };

    const reviews = await reviewService.getUserReviews(user.uid, options);

    const response: ApiResponse = {
      success: true,
      data: { reviews, count: reviews.length },
    };

    return res.json(response);
  });

  /**
   * Get review by ID
   * GET /api/reviews/:id
   */
  getReviewById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const review = await reviewService.getReviewById(id);

    const response: ApiResponse = {
      success: true,
      data: { review },
    };

    return res.json(response);
  });

  /**
   * Update review
   * PUT /api/reviews/:id
   */
  updateReview = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Please login to update review',
      } as ApiResponse);
    }

    const { id } = req.params;
    const { rating, comment, images } = req.body;

    const review = await reviewService.updateReview(id, user.uid, {
      rating,
      comment,
      images,
    });

    const response: ApiResponse = {
      success: true,
      message: 'Review updated successfully',
      data: { review },
    };

    return res.json(response);
  });

  /**
   * Delete review
   * DELETE /api/reviews/:id
   */
  deleteReview = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Please login to delete review',
      } as ApiResponse);
    }

    const { id } = req.params;
    const isAdmin = user.role === 'admin';

    await reviewService.deleteReview(id, user.uid, isAdmin);

    const response: ApiResponse = {
      success: true,
      message: 'Review deleted successfully',
    };

    return res.json(response);
  });

  /**
   * Get all reviews (admin)
   * GET /api/reviews
   */
  getAllReviews = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, productId, minRating, maxRating } = req.query;

    const options = {
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      productId: productId as string,
      minRating: minRating ? parseInt(minRating as string) : undefined,
      maxRating: maxRating ? parseInt(maxRating as string) : undefined,
    };

    const result = await reviewService.getAllReviews(options);

    const response: ApiResponse = {
      success: true,
      data: result,
    };

    return res.json(response);
  });

  /**
   * Check if user reviewed product
   * GET /api/reviews/check/:productId
   */
  checkUserReview = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Please login to check review status',
      } as ApiResponse);
    }

    const { productId } = req.params;

    const hasReviewed = await reviewService.hasUserReviewedProduct(
      user.uid,
      productId
    );

    const response: ApiResponse = {
      success: true,
      data: { hasReviewed },
    };

    return res.json(response);
  });
}

export default new ReviewController();
