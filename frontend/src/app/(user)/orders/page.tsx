'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, Search, RefreshCw } from 'lucide-react';
import { Order } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/common/EmptyState';
import apiClient from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import { formatPrice, formatDate } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import toast from 'react-hot-toast';

export default function OrdersPage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [reorderingId, setReorderingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiClient.get('/orders/user/me');
        const orderData = response.data.orders || response.data || [];
        setOrders(orderData);
        setFilteredOrders(orderData);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((order) => order.status === filterStatus);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.items.some((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    setFilteredOrders(filtered);
  }, [searchQuery, filterStatus, orders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-success/10 text-success';
      case 'cancelled':
        return 'bg-error/10 text-error';
      case 'dispatched':
        return 'bg-accent/10 text-accent';
      case 'confirmed':
        return 'bg-secondary/10 text-secondary';
      default:
        return 'bg-primary/10 text-primary';
    }
  };

  const handleReorder = async (order: Order) => {
    setReorderingId(order.id);
    try {
      let addedCount = 0;
      let skippedCount = 0;

      // Fetch current product details and add to cart
      for (const item of order.items) {
        try {
          // Fetch product to check current stock and details
          const response = await apiClient.get(`/products/${item.productId}`);
          const product = response.data;

          if (product.stock > 0) {
            // Add to cart with original quantity or available stock, whichever is less
            const quantity = Math.min(item.quantity, product.stock);
            await addToCart(product, quantity);
            addedCount++;
          } else {
            skippedCount++;
          }
        } catch (error) {
          console.error(`Error adding product ${item.productId}:`, error);
          skippedCount++;
        }
      }

      if (addedCount > 0) {
        toast.success(`${addedCount} item(s) added to cart`);
        if (skippedCount > 0) {
          toast.error(`${skippedCount} item(s) out of stock`);
        }
        router.push(ROUTES.CART);
      } else {
        toast.error('All items are out of stock');
      }
    } catch (error) {
      toast.error('Failed to reorder items');
    } finally {
      setReorderingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-text-secondary">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-text-primary mb-2">My Orders</h1>
        <p className="text-text-secondary">Track and manage your orders</p>
      </div>

      {orders.length > 0 && (
        <>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <Input
                placeholder="Search by order ID or product name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-primary/30 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Orders</option>
              <option value="processing">Processing</option>
              <option value="confirmed">Confirmed</option>
              <option value="dispatched">Dispatched</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Results Count */}
          <p className="text-sm text-text-secondary">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
        </>
      )}

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={Package}
          title={searchQuery || filterStatus !== 'all' ? 'No orders found' : 'No orders yet'}
          description={
            searchQuery || filterStatus !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Start shopping to see your orders here'
          }
          action={
            !searchQuery && filterStatus === 'all'
              ? {
                label: 'Start Shopping',
                onClick: () => (window.location.href = ROUTES.PRODUCTS),
              }
              : undefined
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-text-primary">{order.orderId}</h3>
                      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      {order.paymentStatus === 'pending' && (
                        <Badge variant="outline" className="text-xs">
                          Payment Pending
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-1 text-sm text-text-secondary">
                      <p>
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </p>
                      <p>Ordered on {formatDate(order.createdAt)}</p>
                      <p>
                        Deliver to: {order.deliveryDetails.city}, {order.deliveryDetails.county}
                      </p>
                    </div>

                    {/* Product Thumbnails */}
                    <div className="flex gap-2 mt-3">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div
                          key={idx}
                          className="text-xs bg-background px-2 py-1 rounded border border-primary/10"
                        >
                          {item.name}
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="text-xs bg-background px-2 py-1 rounded border border-primary/10">
                          +{order.items.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Total & Actions */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4">
                    <div className="text-right">
                      <p className="text-sm text-text-secondary mb-1">Total Amount</p>
                      <p className="text-xl font-bold text-primary">{formatPrice(order.total)}</p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Link href={ROUTES.ORDER_DETAIL(order.id)}>
                        <Button variant="outline" className="w-full">View Details</Button>
                      </Link>
                      <Button
                        onClick={() => handleReorder(order)}
                        disabled={reorderingId === order.id}
                        size="sm"
                        variant="default"
                        className="w-full"
                      >
                        <RefreshCw className={`h-4 w-4 mr-2 ${reorderingId === order.id ? 'animate-spin' : ''}`} />
                        {reorderingId === order.id ? 'Reordering...' : 'Reorder'}
                      </Button>
                    </div>
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
