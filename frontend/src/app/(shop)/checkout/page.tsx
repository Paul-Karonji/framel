'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, MapPin, Phone, User, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice } from '@/lib/utils';
import { deliveryDetailsSchema, DeliveryDetailsFormData } from '@/lib/validations';
import { ROUTES } from '@/constants/routes';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeliveryDetailsFormData>({
    resolver: zodResolver(deliveryDetailsSchema),
    defaultValues: {
      recipientName: user?.displayName || '',
      phone: user?.phone || '',
    },
  });

  const onSubmit = async (data: DeliveryDetailsFormData) => {
    if (!cart || cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsProcessing(true);

    try {
      // Create order
      const orderResponse = await apiClient.post('/orders', {
        deliveryDetails: data,
      });

      const order = orderResponse.data;

      // Clear cart
      await clearCart();

      toast.success('Order placed successfully!');

      // Redirect to order success page
      router.push(`${ROUTES.CHECKOUT_SUCCESS}?orderId=${order.orderId}`);
    } catch (error: any) {
      console.error('Error creating order:', error);
      toast.error(error.response?.data?.message || 'Failed to create order');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">Your cart is empty</h2>
        <Button onClick={() => router.push(ROUTES.PRODUCTS)}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-text-primary mb-8">
          Checkout
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Delivery Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Recipient Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                        <Input
                          {...register('recipientName')}
                          className="pl-10"
                          placeholder="Full name"
                        />
                      </div>
                      {errors.recipientName && (
                        <p className="text-xs text-error mt-1">{errors.recipientName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                        <Input
                          {...register('phone')}
                          className="pl-10"
                          placeholder="254700000000"
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-xs text-error mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Street Address *
                    </label>
                    <Input {...register('street')} placeholder="Building, Floor, Apartment" />
                    {errors.street && (
                      <p className="text-xs text-error mt-1">{errors.street.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        City *
                      </label>
                      <Input {...register('city')} placeholder="Nairobi" />
                      {errors.city && (
                        <p className="text-xs text-error mt-1">{errors.city.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        County *
                      </label>
                      <Input {...register('county')} placeholder="Nairobi County" />
                      {errors.county && (
                        <p className="text-xs text-error mt-1">{errors.county.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Delivery Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                      <Input
                        {...register('deliveryDate')}
                        type="date"
                        className="pl-10"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    {errors.deliveryDate && (
                      <p className="text-xs text-error mt-1">{errors.deliveryDate.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Special Instructions (Optional)
                    </label>
                    <textarea
                      {...register('specialInstructions')}
                      className="w-full border border-primary/30 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                      rows={3}
                      placeholder="Any special requests or delivery instructions..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-secondary/10 rounded-lg p-4 border border-secondary/20">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">📱</div>
                      <div>
                        <p className="font-semibold text-text-primary">M-Pesa Payment</p>
                        <p className="text-sm text-text-secondary">
                          You will receive an M-Pesa prompt on your phone after placing the order
                        </p>
                      </div>
                    </div>
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
                  {/* Items */}
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {cart.items.map((item) => (
                      <div key={item.product.id} className="flex gap-3 text-sm">
                        <div className="flex-1">
                          <p className="font-medium text-text-primary line-clamp-1">
                            {item.product.name}
                          </p>
                          <p className="text-text-secondary">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-text-primary">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Subtotal</span>
                      <span className="font-medium text-text-primary">
                        {formatPrice(cart.subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Delivery Fee</span>
                      <span className="font-medium text-text-primary">
                        {formatPrice(cart.deliveryFee)}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between">
                    <span className="font-semibold text-text-primary">Total</span>
                    <span className="font-bold text-xl text-primary">
                      {formatPrice(cart.total)}
                    </span>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </Button>

                  <p className="text-xs text-text-secondary text-center">
                    By placing your order, you agree to our terms and conditions
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
