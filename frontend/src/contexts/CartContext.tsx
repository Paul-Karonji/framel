'use client';

/**
 * Shopping Cart Context
 * Manages cart state for both authenticated and guest users
 */

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { Cart, CartItem, Product } from '@/types';
import apiClient, { getErrorMessage } from '@/lib/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import { APP_CONFIG } from '@/constants/config';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  itemCount: number;
  addToCart: (product: Product, quantity: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'framel_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  // Calculate item count
  const itemCount = (cart?.items || []).reduce((total, item) => total + item.quantity, 0);

  // Load cart from localStorage (for guest users)
  const loadLocalCart = (): CartItem[] => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  // Save cart to localStorage
  const saveLocalCart = (items: CartItem[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  };

  // Calculate cart totals
  const calculateTotals = (items: CartItem[]): Cart => {
    const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    const deliveryFee = APP_CONFIG.DELIVERY_FEE;
    const total = subtotal + deliveryFee;

    return {
      items,
      subtotal,
      deliveryFee,
      total,
    };
  };

  // Fetch cart from backend (for authenticated users)
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/cart');
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      // If error, load local cart
      const localItems = loadLocalCart();
      setCart(calculateTotals(localItems));
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh cart
  const refreshCart = useCallback(async () => {
    if (isAuthenticated) {
      await fetchCart();
    } else {
      const localItems = loadLocalCart();
      setCart(calculateTotals(localItems));
    }
  }, [isAuthenticated, fetchCart]);

  // Load cart on mount and when auth changes
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // Add to cart
  const addToCart = async (product: Product, quantity: number) => {
    try {
      setLoading(true);

      if (isAuthenticated) {
        // Add via API
        const response = await apiClient.post('/cart/add', {
          productId: product.id,
          quantity,
        });
        setCart(response.data);
        toast.success(`${product.name} added to cart`);
      } else {
        // Add to local cart
        const localItems = loadLocalCart();
        const existingIndex = localItems.findIndex((item) => item.product.id === product.id);

        if (existingIndex >= 0) {
          localItems[existingIndex].quantity += quantity;
        } else {
          localItems.push({ product, quantity });
        }

        saveLocalCart(localItems);
        setCart(calculateTotals(localItems));
        toast.success(`${product.name} added to cart`);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update quantity
  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      setLoading(true);

      if (quantity <= 0) {
        await removeFromCart(productId);
        return;
      }

      if (isAuthenticated) {
        // Update via API
        const response = await apiClient.put('/cart/update', {
          productId,
          quantity,
        });
        setCart(response.data);
      } else {
        // Update local cart
        const localItems = loadLocalCart();
        const index = localItems.findIndex((item) => item.product.id === productId);

        if (index >= 0) {
          localItems[index].quantity = quantity;
          saveLocalCart(localItems);
          setCart(calculateTotals(localItems));
        }
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Remove from cart
  const removeFromCart = async (productId: string) => {
    try {
      setLoading(true);

      if (isAuthenticated) {
        // Remove via API
        const response = await apiClient.delete(`/cart/remove/${productId}`);
        setCart(response.data);
        toast.success('Item removed from cart');
      } else {
        // Remove from local cart
        const localItems = loadLocalCart();
        const filtered = localItems.filter((item) => item.product.id !== productId);
        saveLocalCart(filtered);
        setCart(calculateTotals(filtered));
        toast.success('Item removed from cart');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      setLoading(true);

      if (isAuthenticated) {
        // Clear via API
        await apiClient.delete('/cart/clear');
        setCart({ items: [], subtotal: 0, deliveryFee: APP_CONFIG.DELIVERY_FEE, total: 0 });
      } else {
        // Clear local cart
        localStorage.removeItem(CART_STORAGE_KEY);
        setCart({ items: [], subtotal: 0, deliveryFee: APP_CONFIG.DELIVERY_FEE, total: 0 });
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: CartContextType = {
    cart,
    loading,
    itemCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
