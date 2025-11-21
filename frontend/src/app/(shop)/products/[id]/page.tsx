'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShoppingCart, Heart, Minus, Plus, ArrowLeft, Star } from 'lucide-react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import apiClient from '@/lib/api';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await apiClient.get(`/products/${params.id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Product not found');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAdding(true);
    try {
      await addToCart(product, quantity);
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!product) return;

    setIsTogglingWishlist(true);
    try {
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product);
      }
    } catch (error) {
      // Error is already handled in context with toast
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">Product Not Found</h2>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            {/* Main Image */}
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
              <Image
                src={product.imageURLs[selectedImage] || '/images/placeholder.png'}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.featured && (
                <Badge className="absolute top-4 left-4">Featured</Badge>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.imageURLs.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.imageURLs.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden ${selectedImage === index ? 'ring-2 ring-primary' : ''
                      }`}
                  >
                    <Image src={url} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Category */}
            <p className="text-sm text-text-secondary uppercase tracking-wide mb-2">
              {product.category}
            </p>

            {/* Name */}
            <h1 className="text-4xl font-serif font-bold text-text-primary mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
              <div className="flex items-center gap-2">
                {isOutOfStock ? (
                  <Badge variant="destructive">Out of Stock</Badge>
                ) : isLowStock ? (
                  <Badge variant="secondary">Only {product.stock} left</Badge>
                ) : (
                  <span className="text-sm text-text-secondary">{product.stock} in stock</span>
                )}
              </div>
            </div>

            {/* Rating (placeholder) */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 fill-accent text-accent" />
                ))}
              </div>
              <span className="text-sm text-text-secondary">(24 reviews)</span>
            </div>

            <Separator className="mb-6" />

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-semibold text-text-primary mb-2">Description</h3>
              <p className="text-text-secondary leading-relaxed">{product.description}</p>
            </div>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-text-primary mb-2">Available Colors</h3>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <Badge key={color} variant="outline">
                      {color}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator className="mb-6" />

            {/* Quantity Selector */}
            <div className="mb-6">
              <h3 className="font-semibold text-text-primary mb-2">Quantity</h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAdding}
                className="flex-1"
                size="lg"
              >
                {isAdding ? (
                  'Adding...'
                ) : isOutOfStock ? (
                  'Out of Stock'
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>

              <Button
                onClick={handleToggleWishlist}
                disabled={isTogglingWishlist}
                variant="outline"
                size="lg"
                aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart
                  className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-primary text-primary' : ''
                    }`}
                />
              </Button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-text-primary">SKU:</span>
                <span className="text-text-secondary">{product.id.slice(0, 8).toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-text-primary">Category:</span>
                <span className="text-text-secondary capitalize">{product.category}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
