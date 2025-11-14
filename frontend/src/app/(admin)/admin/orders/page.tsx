'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Eye, Package } from 'lucide-react';
import { Order } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import apiClient from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import toast from 'react-hot-toast';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.deliveryDetails.recipientName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Payment filter
    if (paymentFilter !== 'all') {
      filtered = filtered.filter((order) => order.paymentStatus === paymentFilter);
    }

    setFilteredOrders(filtered);
  }, [searchQuery, statusFilter, paymentFilter, orders]);

  const fetchOrders = async () => {
    try {
      const response = await apiClient.get('/orders?limit=100');
      setOrders(response.data.orders || []);
      setFilteredOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await apiClient.patch(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? { ...order, status: newStatus as Order['status'] } : order))
      );
      toast.success('Order status updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update order status');
    }
  };

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

  const getPaymentStatusColor = (status: string) => {
    return status === 'completed' ? 'bg-success/10 text-success' : 'bg-accent/10 text-accent';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-text-primary mb-2">Orders Management</h1>
        <p className="text-text-secondary">View and manage all customer orders</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <Input
                placeholder="Search by order ID or customer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-primary/30 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="processing">Processing</option>
              <option value="confirmed">Confirmed</option>
              <option value="dispatched">Dispatched</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Payment Filter */}
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="border border-primary/30 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Payments</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <p className="text-sm text-text-secondary">
        Showing {filteredOrders.length} of {orders.length} orders
      </p>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background border-b border-primary/10">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-text-primary">
                    Order ID
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-text-primary">
                    Customer
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-text-primary">Date</th>
                  <th className="text-left p-4 text-sm font-semibold text-text-primary">Total</th>
                  <th className="text-left p-4 text-sm font-semibold text-text-primary">Status</th>
                  <th className="text-left p-4 text-sm font-semibold text-text-primary">
                    Payment
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-text-primary">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-text-secondary">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-primary/10 hover:bg-background/50">
                      <td className="p-4">
                        <span className="font-semibold text-text-primary">{order.orderId}</span>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-text-primary">
                            {order.deliveryDetails.recipientName}
                          </p>
                          <p className="text-xs text-text-secondary">
                            {order.deliveryDetails.city}, {order.deliveryDetails.county}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-text-primary">
                          {formatDate(order.createdAt)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-primary">{formatPrice(order.total)}</span>
                      </td>
                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className={`text-xs px-2 py-1 rounded border-0 font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          <option value="processing">Processing</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="dispatched">Dispatched</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                          {order.paymentStatus}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Link href={ROUTES.ADMIN_ORDER_DETAIL(order.id)}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
