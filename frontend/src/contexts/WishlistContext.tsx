'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/types';
import apiClient from '@/lib/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface WishlistItem {
    product: Product;
    addedAt: string;
}

interface WishlistContextType {
    wishlistItems: WishlistItem[];
    wishlistCount: number;
    isInWishlist: (productId: string) => boolean;
    addToWishlist: (product: Product) => Promise<void>;
    removeFromWishlist: (productId: string) => Promise<void>;
    clearWishlist: () => Promise<void>;
    moveToCart: (productIds: string[]) => Promise<void>;
    loading: boolean;
    refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch wishlist when user logs in
    useEffect(() => {
        if (user) {
            fetchWishlist();
        } else {
            // Clear wishlist when user logs out
            setWishlistItems([]);
        }
    }, [user]);

    const fetchWishlist = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const response = await apiClient.get('/wishlist');
            setWishlistItems(response.data.items || []);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToWishlist = async (product: Product) => {
        if (!user) {
            toast.error('Please login to add items to wishlist');
            return;
        }

        try {
            await apiClient.post('/wishlist/items', { productId: product.id });

            // Add to local state
            setWishlistItems((prev) => [
                ...prev,
                {
                    product,
                    addedAt: new Date().toISOString(),
                },
            ]);

            toast.success('Added to wishlist');
        } catch (error: any) {
            const message = error.response?.data?.error || 'Failed to add to wishlist';
            toast.error(message);
            throw error;
        }
    };

    const removeFromWishlist = async (productId: string) => {
        if (!user) return;

        try {
            await apiClient.delete(`/wishlist/items/${productId}`);

            // Remove from local state
            setWishlistItems((prev) => prev.filter((item) => item.product.id !== productId));

            toast.success('Removed from wishlist');
        } catch (error) {
            toast.error('Failed to remove from wishlist');
            throw error;
        }
    };

    const clearWishlist = async () => {
        if (!user) return;

        try {
            await apiClient.delete('/wishlist');
            setWishlistItems([]);
            toast.success('Wishlist cleared');
        } catch (error) {
            toast.error('Failed to clear wishlist');
            throw error;
        }
    };

    const moveToCart = async (productIds: string[]) => {
        if (!user) return;

        try {
            const response = await apiClient.post('/wishlist/move-to-cart', { productIds });

            const { movedItems, failedItems } = response.data;

            // Remove moved items from wishlist
            setWishlistItems((prev) =>
                prev.filter((item) => !movedItems.includes(item.product.id))
            );

            if (movedItems.length > 0) {
                toast.success(`${movedItems.length} item(s) moved to cart`);
            }

            if (failedItems.length > 0) {
                toast.error(`${failedItems.length} item(s) out of stock`);
            }
        } catch (error) {
            toast.error('Failed to move items to cart');
            throw error;
        }
    };

    const isInWishlist = (productId: string): boolean => {
        return wishlistItems.some((item) => item.product.id === productId);
    };

    const refreshWishlist = async () => {
        await fetchWishlist();
    };

    const value: WishlistContextType = {
        wishlistItems,
        wishlistCount: wishlistItems.length,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        moveToCart,
        loading,
        refreshWishlist,
    };

    return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
