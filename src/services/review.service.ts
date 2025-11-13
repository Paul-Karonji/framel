import { db } from '../config/firebase';
import { Review } from '../types';
import { AppError } from '../middleware/errorHandler';
import { FieldValue } from 'firebase-admin/firestore';
import productService from './product.service';

/**
 * Review Service
 * Handles all review-related business logic
 */
class ReviewService {
  private collection = db.collection('reviews');

  /**
   * Create a review
   */
  async createReview(
    userId: string,
    userName: string,
    productId: string,
    rating: number,
    comment: string,
    images?: string[]
  ): Promise<Review> {
    try {
      // Verify product exists
      await productService.getProductById(productId);

      // Check if user already reviewed this product
      const existingReview = await this.collection
        .where('userId', '==', userId)
        .where('productId', '==', productId)
        .limit(1)
        .get();

      if (!existingReview.empty) {
        throw new AppError('You have already reviewed this product', 400);
      }

      // Validate rating
      if (rating < 1 || rating > 5) {
        throw new AppError('Rating must be between 1 and 5', 400);
      }

      const reviewData = {
        userId,
        userName,
        productId,
        rating,
        comment,
        images: images || [],
        createdAt: FieldValue.serverTimestamp(),
      };

      const docRef = await this.collection.add(reviewData);
      const doc = await docRef.get();

      // Update product rating
      await this.updateProductRating(productId);

      return { id: doc.id, ...doc.data() } as Review;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      console.error('Create review error:', error);
      throw new AppError('Failed to create review', 500);
    }
  }

  /**
   * Update product rating average
   */
  private async updateProductRating(productId: string): Promise<void> {
    try {
      const reviews = await this.getProductReviews(productId);
      const productsCollection = db.collection('products');

      if (reviews.length === 0) {
        await productsCollection.doc(productId).update({
          rating: 0,
          reviewCount: 0,
          updatedAt: FieldValue.serverTimestamp(),
        });
        return;
      }

      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / reviews.length;

      await productsCollection.doc(productId).update({
        rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        reviewCount: reviews.length,
        updatedAt: FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error('Update product rating error:', error);
      // Don't throw error - this is a background task
    }
  }

  /**
   * Get product reviews
   */
  async getProductReviews(
    productId: string,
    options: {
      page?: number;
      limit?: number;
      sortBy?: 'date' | 'rating';
      sortOrder?: 'asc' | 'desc';
    } = {}
  ): Promise<Review[]> {
    try {
      const { page = 1, limit = 20, sortBy = 'date', sortOrder = 'desc' } = options;

      let query: any = this.collection.where('productId', '==', productId);

      // Sorting
      const sortField = sortBy === 'date' ? 'createdAt' : 'rating';
      query = query.orderBy(sortField, sortOrder);

      // Pagination
      const offset = (page - 1) * limit;
      query = query.limit(limit).offset(offset);

      const snapshot = await query.get();
      return snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      })) as Review[];
    } catch (error) {
      console.error('Get product reviews error:', error);
      throw new AppError('Failed to fetch reviews', 500);
    }
  }

  /**
   * Get review by ID
   */
  async getReviewById(reviewId: string): Promise<Review> {
    try {
      const doc = await this.collection.doc(reviewId).get();

      if (!doc.exists) {
        throw new AppError('Review not found', 404);
      }

      return { id: doc.id, ...doc.data() } as Review;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      console.error('Get review error:', error);
      throw new AppError('Failed to fetch review', 500);
    }
  }

  /**
   * Get user's reviews
   */
  async getUserReviews(
    userId: string,
    options: {
      page?: number;
      limit?: number;
    } = {}
  ): Promise<Review[]> {
    try {
      const { page = 1, limit = 20 } = options;

      let query: any = this.collection.where('userId', '==', userId);
      query = query.orderBy('createdAt', 'desc');

      const offset = (page - 1) * limit;
      query = query.limit(limit).offset(offset);

      const snapshot = await query.get();
      return snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      })) as Review[];
    } catch (error) {
      console.error('Get user reviews error:', error);
      throw new AppError('Failed to fetch user reviews', 500);
    }
  }

  /**
   * Update review
   */
  async updateReview(
    reviewId: string,
    userId: string,
    updates: {
      rating?: number;
      comment?: string;
      images?: string[];
    }
  ): Promise<Review> {
    try {
      const review = await this.getReviewById(reviewId);

      // Verify ownership
      if (review.userId !== userId) {
        throw new AppError('Unauthorized to update this review', 403);
      }

      // Validate rating if provided
      if (updates.rating && (updates.rating < 1 || updates.rating > 5)) {
        throw new AppError('Rating must be between 1 and 5', 400);
      }

      await this.collection.doc(reviewId).update(updates);

      // Update product rating if rating changed
      if (updates.rating) {
        await this.updateProductRating(review.productId);
      }

      const updatedDoc = await this.collection.doc(reviewId).get();
      return { id: updatedDoc.id, ...updatedDoc.data() } as Review;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      console.error('Update review error:', error);
      throw new AppError('Failed to update review', 500);
    }
  }

  /**
   * Delete review
   */
  async deleteReview(reviewId: string, userId: string, isAdmin = false): Promise<void> {
    try {
      const review = await this.getReviewById(reviewId);

      // Verify ownership (unless admin)
      if (!isAdmin && review.userId !== userId) {
        throw new AppError('Unauthorized to delete this review', 403);
      }

      await this.collection.doc(reviewId).delete();

      // Update product rating
      await this.updateProductRating(review.productId);
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      console.error('Delete review error:', error);
      throw new AppError('Failed to delete review', 500);
    }
  }

  /**
   * Get all reviews (admin)
   */
  async getAllReviews(options: {
    page?: number;
    limit?: number;
    productId?: string;
    minRating?: number;
    maxRating?: number;
  } = {}): Promise<{
    reviews: Review[];
    total: number;
    page: number;
    pages: number;
  }> {
    try {
      const { page = 1, limit = 50, productId, minRating, maxRating } = options;

      let query: any = this.collection;

      if (productId) {
        query = query.where('productId', '==', productId);
      }

      if (minRating) {
        query = query.where('rating', '>=', minRating);
      }

      if (maxRating) {
        query = query.where('rating', '<=', maxRating);
      }

      // Get total count
      const totalSnapshot = await query.get();
      const total = totalSnapshot.size;

      // Apply pagination and sorting
      query = query.orderBy('createdAt', 'desc');
      const offset = (page - 1) * limit;
      query = query.limit(limit).offset(offset);

      const snapshot = await query.get();
      const reviews = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      })) as Review[];

      const pages = Math.ceil(total / limit);

      return { reviews, total, page, pages };
    } catch (error) {
      console.error('Get all reviews error:', error);
      throw new AppError('Failed to fetch reviews', 500);
    }
  }

  /**
   * Check if user has reviewed a product
   */
  async hasUserReviewedProduct(userId: string, productId: string): Promise<boolean> {
    try {
      const snapshot = await this.collection
        .where('userId', '==', userId)
        .where('productId', '==', productId)
        .limit(1)
        .get();

      return !snapshot.empty;
    } catch (error) {
      console.error('Check user review error:', error);
      return false;
    }
  }

  /**
   * Get review statistics for a product
   */
  async getProductReviewStats(productId: string): Promise<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
    };
  }> {
    try {
      const reviews = await this.collection.where('productId', '==', productId).get();

      if (reviews.empty) {
        return {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        };
      }

      const reviewData = reviews.docs.map((doc) => doc.data() as Review);
      const totalReviews = reviewData.length;
      const totalRating = reviewData.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = Math.round((totalRating / totalReviews) * 10) / 10;

      const ratingDistribution = {
        1: reviewData.filter((r) => r.rating === 1).length,
        2: reviewData.filter((r) => r.rating === 2).length,
        3: reviewData.filter((r) => r.rating === 3).length,
        4: reviewData.filter((r) => r.rating === 4).length,
        5: reviewData.filter((r) => r.rating === 5).length,
      };

      return {
        averageRating,
        totalReviews,
        ratingDistribution,
      };
    } catch (error) {
      console.error('Get product review stats error:', error);
      throw new AppError('Failed to fetch review statistics', 500);
    }
  }
}

export default new ReviewService();
