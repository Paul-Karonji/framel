'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Heart, Package, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Order } from '@/types';
import apiClient from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';

export default function DashboardPage() {
  const { user } = useAuth();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    processingOrders: 0,
    wishlistItems: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch recent orders
        const ordersResponse = await apiClient.get('/orders/user/me');
        const orders = ordersResponse.data.orders || ordersResponse.data || [];
        setRecentOrders(orders.slice(0, 5));

        // Calculate stats
        const processingCount = orders.filter((o: Order) =>
          ['processing', 'confirmed', 'dispatched'].includes(o.status)
        ).length;

        setStats({
          totalOrders: orders.length,
          processingOrders: processingCount,
          wishlistItems: 0, // Will be fetched from wishlist endpoint
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-text-primary mb-2">
          Welcome back, {user?.displayName}!
        </h1>
        <p className="text-text-secondary">
          Here&apos;s what&apos;s happening with your orders and wishlist
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-text-primary">{stats.totalOrders}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary mb-1">Active Orders</p>
                <p className="text-3xl font-bold text-text-primary">{stats.processingOrders}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-accent/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary mb-1">Wishlist Items</p>
                <p className="text-3xl font-bold text-text-primary">{stats.wishlistItems}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Heart className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <Link href={ROUTES.ORDERS}>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-text-secondary text-center py-8">Loading orders...</p>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-text-secondary/40 mx-auto mb-3" />
              <p className="text-text-secondary mb-4">No orders yet</p>
              <Link href={ROUTES.PRODUCTS}>
                <Button>Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border border-primary/10 rounded-lg hover:shadow-sm transition-shadow"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-text-primary">{order.orderId}</h4>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          order.status === 'delivered'
                            ? 'bg-success/10 text-success'
                            : order.status === 'cancelled'
                            ? 'bg-error/10 text-error'
                            : 'bg-primary/10 text-primary'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'} •{' '}
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-text-primary mb-2">
                      {formatPrice(order.total)}
                    </p>
                    <Link href={ROUTES.ORDER_DETAIL(order.id)}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-primary/20 hover:shadow-md transition-shadow cursor-pointer">
          <Link href={ROUTES.PRODUCTS}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary mb-1">Continue Shopping</h3>
                  <p className="text-sm text-text-secondary">Discover new flowers and gifts</p>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="border-accent/20 hover:shadow-md transition-shadow cursor-pointer">
          <Link href={ROUTES.WISHLIST}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary mb-1">View Wishlist</h3>
                  <p className="text-sm text-text-secondary">See your saved items</p>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  );
}
