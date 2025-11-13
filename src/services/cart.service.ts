import { db } from '../config/firebase';
import { Cart, CartItem, Product } from '../types';
import { AppError } from '../middleware/errorHandler';
import { FieldValue } from 'firebase-admin/firestore';
import productService from './product.service';

/**
 * Cart Service
 * Handles all cart-related business logic
 */
class CartService {
  private collection = db.collection('cart');
  private productsCollection = db.collection('products');

  /**
   * Get cart by user ID (or guest ID)
   */
  async getCart(userId: string): Promise<{
    cart: Cart;
    subtotal: number;
    deliveryFee: number;
    total: number;
    itemCount: number;
  }> {
    try {
      const doc = await this.collection.doc(userId).get();

      if (!doc.exists) {
        // Return empty cart
        return {
          cart: {
            userId,
            items: [],
            updatedAt: FieldValue.serverTimestamp() as any,
          },
          subtotal: 0,
          deliveryFee: 0,
          total: 0,
          itemCount: 0,
        };
      }

      const cart = doc.data() as Cart;

      // Fetch full product details for each cart item
      const itemsWithProducts = await Promise.all(
        cart.items.map(async (item) => {
          try {
            const product = await productService.getProductById(item.productId);
            return {
              ...item,
              product,
            };
          } catch (error) {
            // Product might have been deleted
            return null;
          }
        })
      );

      // Filter out null items (deleted products)
      const validItems = itemsWithProducts.filter((item) => item !== null);

      // Calculate totals
      const subtotal = validItems.reduce((sum, item) => sum + item!.price * item!.quantity, 0);
      const deliveryFee = subtotal > 0 ? 500 : 0; // Fixed delivery fee of 500 KES
      const total = subtotal + deliveryFee;
      const itemCount = validItems.reduce((sum, item) => sum + item!.quantity, 0);

      return {
        cart: {
          ...cart,
          items: cart.items,
        },
        subtotal,
        deliveryFee,
        total,
        itemCount,
      };
    } catch (error) {
      console.error('Get cart error:', error);
      throw new AppError('Failed to fetch cart', 500);
    }
  }

  /**
   * Add item to cart
   */
  async addToCart(userId: string, productId: string, quantity: number): Promise<Cart> {
    try {
      // Validate product exists and has stock
      const product = await productService.getProductById(productId);

      if (product.stock < quantity) {
        throw new AppError(`Only ${product.stock} items available in stock`, 400);
      }

      const docRef = this.collection.doc(userId);
      const doc = await docRef.get();

      if (!doc.exists) {
        // Create new cart
        const newCart: Cart = {
          userId,
          items: [
            {
              productId,
              quantity,
              price: product.price,
              addedAt: FieldValue.serverTimestamp() as any,
            },
          ],
          updatedAt: FieldValue.serverTimestamp() as any,
        };

        await docRef.set(newCart);
        return newCart;
      }

      // Update existing cart
      const cart = doc.data() as Cart;
      const existingItemIndex = cart.items.findIndex((item) => item.productId === productId);

      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const newQuantity = cart.items[existingItemIndex].quantity + quantity;

        if (product.stock < newQuantity) {
          throw new AppError(`Only ${product.stock} items available in stock`, 400);
        }

        cart.items[existingItemIndex].quantity = newQuantity;
        cart.items[existingItemIndex].price = product.price; // Update to latest price
      } else {
        // Add new item
        cart.items.push({
          productId,
          quantity,
          price: product.price,
          addedAt: FieldValue.serverTimestamp() as any,
        });
      }

      await docRef.update({
        items: cart.items,
        updatedAt: FieldValue.serverTimestamp(),
      });

      return cart;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      console.error('Add to cart error:', error);
      throw new AppError('Failed to add item to cart', 500);
    }
  }

  /**
   * Update cart item quantity
   */
  async updateCartItem(userId: string, productId: string, quantity: number): Promise<Cart> {
    try {
      if (quantity < 0) {
        throw new AppError('Quantity cannot be negative', 400);
      }

      const docRef = this.collection.doc(userId);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new AppError('Cart not found', 404);
      }

      const cart = doc.data() as Cart;
      const itemIndex = cart.items.findIndex((item) => item.productId === productId);

      if (itemIndex < 0) {
        throw new AppError('Item not found in cart', 404);
      }

      if (quantity === 0) {
        // Remove item if quantity is 0
        cart.items.splice(itemIndex, 1);
      } else {
        // Validate stock
        const product = await productService.getProductById(productId);

        if (product.stock < quantity) {
          throw new AppError(`Only ${product.stock} items available in stock`, 400);
        }

        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].price = product.price; // Update to latest price
      }

      await docRef.update({
        items: cart.items,
        updatedAt: FieldValue.serverTimestamp(),
      });

      return cart;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      console.error('Update cart item error:', error);
      throw new AppError('Failed to update cart item', 500);
    }
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(userId: string, productId: string): Promise<Cart> {
    try {
      const docRef = this.collection.doc(userId);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new AppError('Cart not found', 404);
      }

      const cart = doc.data() as Cart;
      const itemIndex = cart.items.findIndex((item) => item.productId === productId);

      if (itemIndex < 0) {
        throw new AppError('Item not found in cart', 404);
      }

      cart.items.splice(itemIndex, 1);

      await docRef.update({
        items: cart.items,
        updatedAt: FieldValue.serverTimestamp(),
      });

      return cart;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      console.error('Remove from cart error:', error);
      throw new AppError('Failed to remove item from cart', 500);
    }
  }

  /**
   * Clear cart
   */
  async clearCart(userId: string): Promise<void> {
    try {
      const docRef = this.collection.doc(userId);
      const doc = await docRef.get();

      if (!doc.exists) {
        return; // Cart doesn't exist, nothing to clear
      }

      await docRef.update({
        items: [],
        updatedAt: FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error('Clear cart error:', error);
      throw new AppError('Failed to clear cart', 500);
    }
  }

  /**
   * Sync guest cart to user cart (when user logs in)
   */
  async syncGuestCart(guestId: string, userId: string): Promise<Cart> {
    try {
      const guestDoc = await this.collection.doc(guestId).get();

      if (!guestDoc.exists) {
        // No guest cart to sync
        const userDoc = await this.collection.doc(userId).get();
        if (!userDoc.exists) {
          return {
            userId,
            items: [],
            updatedAt: FieldValue.serverTimestamp() as any,
          };
        }
        return userDoc.data() as Cart;
      }

      const guestCart = guestDoc.data() as Cart;
      const userDoc = await this.collection.doc(userId).get();

      if (!userDoc.exists) {
        // Create user cart from guest cart
        const newCart: Cart = {
          userId,
          items: guestCart.items,
          updatedAt: FieldValue.serverTimestamp() as any,
        };

        await this.collection.doc(userId).set(newCart);

        // Delete guest cart
        await this.collection.doc(guestId).delete();

        return newCart;
      }

      // Merge guest cart into existing user cart
      const userCart = userDoc.data() as Cart;

      for (const guestItem of guestCart.items) {
        const existingItemIndex = userCart.items.findIndex(
          (item) => item.productId === guestItem.productId
        );

        if (existingItemIndex >= 0) {
          // Combine quantities
          userCart.items[existingItemIndex].quantity += guestItem.quantity;
        } else {
          // Add new item
          userCart.items.push(guestItem);
        }
      }

      await this.collection.doc(userId).update({
        items: userCart.items,
        updatedAt: FieldValue.serverTimestamp(),
      });

      // Delete guest cart
      await this.collection.doc(guestId).delete();

      return userCart;
    } catch (error) {
      console.error('Sync guest cart error:', error);
      throw new AppError('Failed to sync cart', 500);
    }
  }

  /**
   * Validate cart items (check stock and prices)
   */
  async validateCart(userId: string): Promise<{
    valid: boolean;
    issues: Array<{ productId: string; issue: string }>;
  }> {
    try {
      const doc = await this.collection.doc(userId).get();

      if (!doc.exists) {
        return { valid: true, issues: [] };
      }

      const cart = doc.data() as Cart;
      const issues: Array<{ productId: string; issue: string }> = [];

      for (const item of cart.items) {
        try {
          const product = await productService.getProductById(item.productId);

          // Check stock
          if (product.stock < item.quantity) {
            issues.push({
              productId: item.productId,
              issue: `Only ${product.stock} items available (you have ${item.quantity} in cart)`,
            });
          }

          // Check if price changed
          if (product.price !== item.price) {
            issues.push({
              productId: item.productId,
              issue: `Price changed from ${item.price} to ${product.price}`,
            });
          }
        } catch (error) {
          issues.push({
            productId: item.productId,
            issue: 'Product no longer available',
          });
        }
      }

      return {
        valid: issues.length === 0,
        issues,
      };
    } catch (error) {
      console.error('Validate cart error:', error);
      throw new AppError('Failed to validate cart', 500);
    }
  }
}

export default new CartService();
