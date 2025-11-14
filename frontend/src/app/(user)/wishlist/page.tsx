'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/common/EmptyState';
import apiClient from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import toast from 'react-hot-toast';

interface WishlistItem {
  product: Product;
  addedAt: string;
}

export default function WishlistPage() {
  const { addToCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const response = await apiClient.get('/wishlist');
      setWishlistItems(response.data.items || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await apiClient.delete(`/wishlist/items/${productId}`);
      setWishlistItems((prev) => prev.filter((item) => item.product.id !== productId));
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove from wishlist');
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product, 1);
      await handleRemoveFromWishlist(product.id);
    } catch (error) {
      // Error handled in context
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-text-secondary">Loading wishlist...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-text-primary mb-2">My Wishlist</h1>
          <p className="text-text-secondary">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
      </div>

      {/* Wishlist Items */}
      {wishlistItems.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save your favorite products here for later"
          action={{
            label: 'Start Shopping',
            onClick: () => (window.location.href = ROUTES.PRODUCTS),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map(({ product }) => (
            <Card key={product.id} className="group hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                {/* Product Image */}
                <Link href={ROUTES.PRODUCT_DETAIL(product.id)}>
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
                    <Image
                      src={product.imageURLs[0] || '/images/placeholder.png'}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                </Link>

                {/* Product Info */}
                <div className="space-y-3">
                  <Link href={ROUTES.PRODUCT_DETAIL(product.id)}>
                    <h3 className="font-semibold text-text-primary group-hover:text-primary transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                    {product.stock > 0 ? (
                      <span className="text-xs text-success">In Stock</span>
                    ) : (
                      <span className="text-xs text-error">Out of Stock</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0}
                      className="flex-1"
                      size="sm"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveFromWishlist(product.id)}
                      className="text-error hover:text-error hover:bg-error/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
