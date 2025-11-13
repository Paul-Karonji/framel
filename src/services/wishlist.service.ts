import { db } from '../config/firebase';
import { Wishlist } from '../types';
import { AppError } from '../middleware/errorHandler';
import { FieldValue } from 'firebase-admin/firestore';
import productService from './product.service';

/**
 * Wishlist Service
 * Handles all wishlist-related business logic
 */
class WishlistService {
  private collection = db.collection('wishlists');

  /**
   * Get user's wishlist
   */
  async getWishlist(userId: string): Promise<{
    wishlist: Wishlist;
    products: any[];
  }> {
    try {
      const doc = await this.collection.doc(userId).get();

      if (!doc.exists) {
        // Return empty wishlist
        return {
          wishlist: {
            userId,
            items: [],
            updatedAt: FieldValue.serverTimestamp() as any,
          },
          products: [],
        };
      }

      const wishlist = doc.data() as Wishlist;

      // Fetch full product details for each wishlist item
      const productsWithDetails = await Promise.all(
        wishlist.items.map(async (item) => {
          try {
            const product = await productService.getProductById(item.productId);
            return {
              ...product,
              addedAt: item.addedAt,
            };
          } catch (error) {
            // Product might have been deleted
            return null;
          }
        })
      );

      // Filter out null items (deleted products)
      const validProducts = productsWithDetails.filter((p) => p !== null);

      return {
        wishlist,
        products: validProducts,
      };
    } catch (error) {
      console.error('Get wishlist error:', error);
      throw new AppError('Failed to fetch wishlist', 500);
    }
  }

  /**
   * Add item to wishlist
   */
  async addToWishlist(userId: string, productId: string): Promise<Wishlist> {
    try {
      // Verify product exists
      await productService.getProductById(productId);

      const docRef = this.collection.doc(userId);
      const doc = await docRef.get();

      if (!doc.exists) {
        // Create new wishlist
        const newWishlist: Wishlist = {
          userId,
          items: [
            {
              productId,
              addedAt: FieldValue.serverTimestamp() as any,
            },
          ],
          updatedAt: FieldValue.serverTimestamp() as any,
        };

        await docRef.set(newWishlist);
        return newWishlist;
      }

      // Update existing wishlist
      const wishlist = doc.data() as Wishlist;

      // Check if item already exists
      const existingItem = wishlist.items.find((item) => item.productId === productId);

      if (existingItem) {
        throw new AppError('Product already in wishlist', 400);
      }

      // Add new item
      wishlist.items.push({
        productId,
        addedAt: FieldValue.serverTimestamp() as any,
      });

      await docRef.update({
        items: wishlist.items,
        updatedAt: FieldValue.serverTimestamp(),
      });

      return wishlist;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      console.error('Add to wishlist error:', error);
      throw new AppError('Failed to add item to wishlist', 500);
    }
  }

  /**
   * Remove item from wishlist
   */
  async removeFromWishlist(userId: string, productId: string): Promise<Wishlist> {
    try {
      const docRef = this.collection.doc(userId);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new AppError('Wishlist not found', 404);
      }

      const wishlist = doc.data() as Wishlist;
      const itemIndex = wishlist.items.findIndex((item) => item.productId === productId);

      if (itemIndex < 0) {
        throw new AppError('Item not found in wishlist', 404);
      }

      wishlist.items.splice(itemIndex, 1);

      await docRef.update({
        items: wishlist.items,
        updatedAt: FieldValue.serverTimestamp(),
      });

      return wishlist;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      console.error('Remove from wishlist error:', error);
      throw new AppError('Failed to remove item from wishlist', 500);
    }
  }

  /**
   * Clear wishlist
   */
  async clearWishlist(userId: string): Promise<void> {
    try {
      const docRef = this.collection.doc(userId);
      const doc = await docRef.get();

      if (!doc.exists) {
        return; // Wishlist doesn't exist, nothing to clear
      }

      await docRef.update({
        items: [],
        updatedAt: FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error('Clear wishlist error:', error);
      throw new AppError('Failed to clear wishlist', 500);
    }
  }

  /**
   * Check if product is in user's wishlist
   */
  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    try {
      const doc = await this.collection.doc(userId).get();

      if (!doc.exists) {
        return false;
      }

      const wishlist = doc.data() as Wishlist;
      return wishlist.items.some((item) => item.productId === productId);
    } catch (error) {
      console.error('Check wishlist error:', error);
      return false;
    }
  }

  /**
   * Get wishlist item count
   */
  async getWishlistCount(userId: string): Promise<number> {
    try {
      const doc = await this.collection.doc(userId).get();

      if (!doc.exists) {
        return 0;
      }

      const wishlist = doc.data() as Wishlist;
      return wishlist.items.length;
    } catch (error) {
      console.error('Get wishlist count error:', error);
      return 0;
    }
  }

  /**
   * Move wishlist items to cart
   */
  async moveToCart(
    userId: string,
    productIds: string[]
  ): Promise<{
    movedItems: string[];
    failedItems: string[];
  }> {
    try {
      const movedItems: string[] = [];
      const failedItems: string[] = [];

      for (const productId of productIds) {
        try {
          // Verify product exists and has stock
          const product = await productService.getProductById(productId);

          if (product.stock > 0) {
            // Remove from wishlist
            await this.removeFromWishlist(userId, productId);
            movedItems.push(productId);
          } else {
            failedItems.push(productId);
          }
        } catch (error) {
          failedItems.push(productId);
        }
      }

      return {
        movedItems,
        failedItems,
      };
    } catch (error) {
      console.error('Move to cart error:', error);
      throw new AppError('Failed to move items to cart', 500);
    }
  }
}

export default new WishlistService();
