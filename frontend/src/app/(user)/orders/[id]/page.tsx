'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Package, MapPin, CreditCard, Phone, Mail } from 'lucide-react';
import { Order } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import apiClient from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await apiClient.get(`/orders/${params.id}`);
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching order:', error);
        toast.error('Order not found');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchOrder();
    }
  }, [params.id]);

  const handleCancelOrder = async () => {
    if (!order || !confirm('Are you sure you want to cancel this order?')) return;

    setCancelling(true);
    try {
      await apiClient.post(`/orders/${order.id}/cancel`);
      toast.success('Order cancelled successfully');
      setOrder({ ...order, status: 'cancelled' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-success/10 text-success border-success/20';
      case 'cancelled':
        return 'bg-error/10 text-error border-error/20';
      case 'dispatched':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'confirmed':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">Order Not Found</h2>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const canCancel =
    order.status === 'processing' &&
    order.paymentStatus === 'pending';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          <h1 className="text-3xl font-serif font-bold text-text-primary mb-2">
            Order Details
          </h1>
          <p className="text-text-secondary">Order ID: {order.orderId}</p>
        </div>

        {canCancel && (
          <Button variant="outline" onClick={handleCancelOrder} disabled={cancelling} className="text-error hover:text-error">
            {cancelling ? 'Cancelling...' : 'Cancel Order'}
          </Button>
        )}
      </div>

      {/* Status Banner */}
      <Card className={getStatusColor(order.status)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="h-6 w-6" />
              <div>
                <h3 className="font-semibold capitalize">Order {order.status}</h3>
                <p className="text-sm opacity-80">
                  {order.status === 'delivered'
                    ? 'Your order has been delivered'
                    : order.status === 'cancelled'
                    ? 'This order was cancelled'
                    : 'Your order is being processed'}
                </p>
              </div>
            </div>
            <Badge variant={order.paymentStatus === 'completed' ? 'default' : 'outline'}>
              Payment: {order.paymentStatus}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4 pb-4 border-b border-primary/10 last:border-0 last:pb-0">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="h-8 w-8 text-text-secondary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-text-primary mb-1">{item.name}</h4>
                    <p className="text-sm text-text-secondary">
                      Quantity: {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-text-primary">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Delivery Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-text-secondary mb-1">Recipient</p>
                <p className="font-medium text-text-primary">
                  {order.deliveryDetails.recipientName}
                </p>
              </div>
              <div>
                <p className="text-sm text-text-secondary mb-1">Phone</p>
                <p className="font-medium text-text-primary">{order.deliveryDetails.phone}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary mb-1">Delivery Address</p>
                <p className="font-medium text-text-primary">
                  {order.deliveryDetails.street}
                  <br />
                  {order.deliveryDetails.city}, {order.deliveryDetails.county}
                </p>
              </div>
              <div>
                <p className="text-sm text-text-secondary mb-1">Delivery Date</p>
                <p className="font-medium text-text-primary">
                  {formatDate(order.deliveryDetails.deliveryDate)}
                </p>
              </div>
              {order.deliveryDetails.specialInstructions && (
                <div>
                  <p className="text-sm text-text-secondary mb-1">Special Instructions</p>
                  <p className="font-medium text-text-primary">
                    {order.deliveryDetails.specialInstructions}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Subtotal</span>
                  <span className="font-medium text-text-primary">
                    {formatPrice(order.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Delivery Fee</span>
                  <span className="font-medium text-text-primary">
                    {formatPrice(order.deliveryFee)}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between">
                <span className="font-semibold text-text-primary">Total</span>
                <span className="font-bold text-xl text-primary">{formatPrice(order.total)}</span>
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-text-secondary">
                  <CreditCard className="h-4 w-4" />
                  <span>Payment Method: M-Pesa</span>
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  <Package className="h-4 w-4" />
                  <span>Order Date: {formatDate(order.createdAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help Card */}
          <Card className="border-primary/20">
            <CardContent className="p-6">
              <h3 className="font-semibold text-text-primary mb-3">Need Help?</h3>
              <p className="text-sm text-text-secondary mb-4">
                Contact us if you have any questions about your order
              </p>
              <div className="space-y-2 text-sm">
                <a
                  href="mailto:hello@framel.co.ke"
                  className="flex items-center gap-2 text-primary hover:text-primary-dark"
                >
                  <Mail className="h-4 w-4" />
                  hello@framel.co.ke
                </a>
                <a
                  href="tel:+254700000000"
                  className="flex items-center gap-2 text-primary hover:text-primary-dark"
                >
                  <Phone className="h-4 w-4" />
                  +254 700 000 000
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
