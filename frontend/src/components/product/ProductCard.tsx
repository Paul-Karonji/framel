'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart } from 'lucide-react';
import { Product } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { ROUTES } from '@/constants/routes';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }

    setIsAdding(true);
    try {
      await addToCart(product, 1);
    } catch (error) {
      // Error is already handled in context with toast
    } finally {
      setIsAdding(false);
    }
  };

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <Link href={ROUTES.PRODUCT_DETAIL(product.id)}>
      <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={product.imageURLs[0] || '/images/placeholder.png'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {product.featured && <Badge variant="default">Featured</Badge>}
            {isOutOfStock && <Badge variant="destructive">Out of Stock</Badge>}
            {isLowStock && <Badge variant="secondary">Low Stock</Badge>}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toast.success('Added to wishlist!');
            }}
            className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
          >
            <Heart className="h-4 w-4 text-primary" />
          </button>
        </div>

        {/* Content */}
        <CardContent className="p-4 flex-1 flex flex-col">
          {/* Category */}
          <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">
            {product.category}
          </p>

          {/* Name */}
          <h3 className="font-semibold text-text-primary group-hover:text-primary transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-text-secondary line-clamp-2 mb-3 flex-1">
            {product.description}
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-primary">{formatPrice(product.price)}</span>
            <span className="text-xs text-text-secondary">
              {product.stock} in stock
            </span>
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdding}
            className="w-full"
            variant={isOutOfStock ? 'outline' : 'default'}
          >
            {isAdding ? (
              'Adding...'
            ) : isOutOfStock ? (
              'Out of Stock'
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
