'use client';

import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CartItem } from '@/components/cart/CartItem';
import { EmptyState } from '@/components/common/EmptyState';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';

export default function CartPage() {
  const { cart, loading } = useCart();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-text-secondary">Loading cart...</p>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Add some beautiful flowers to your cart to get started"
          action={{
            label: 'Continue Shopping',
            onClick: () => (window.location.href = ROUTES.PRODUCTS),
          }}
        />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-text-primary mb-8">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Items ({cart.items.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="divide-y divide-primary/10">
                  {cart.items.map((item) => (
                    <CartItem key={item.product.id} item={item} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Subtotal</span>
                  <span className="font-medium text-text-primary">
                    {formatPrice(cart.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Delivery Fee</span>
                  <span className="font-medium text-text-primary">
                    {formatPrice(cart.deliveryFee)}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span className="font-semibold text-text-primary">Total</span>
                  <span className="font-bold text-xl text-primary">{formatPrice(cart.total)}</span>
                </div>

                <Separator />

                <Link href={ROUTES.CHECKOUT} className="block">
                  <Button className="w-full" size="lg">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>

                <Link href={ROUTES.PRODUCTS}>
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>

                {/* Trust Badges */}
                <div className="pt-4 space-y-2 text-xs text-text-secondary">
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-success"></div>
                    <span>Secure M-Pesa Payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-success"></div>
                    <span>Same-day Delivery Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-success"></div>
                    <span>Fresh Flowers Guaranteed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
