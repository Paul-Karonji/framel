'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import apiClient from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import toast from 'react-hot-toast';

interface DashboardStats {
  revenue: {
    total: number;
    today: number;
    growth: number;
  };
  orders: {
    total: number;
    pending: number;
    growth: number;
  };
  users: {
    total: number;
    new: number;
    growth: number;
  };
  products: {
    total: number;
    lowStock: number;
  };
}

interface RecentOrder {
  id: string;
  orderId: string;
  total: number;
  status: string;
  customerName: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          apiClient.get('/admin/dashboard/stats'),
          apiClient.get('/admin/orders/recent?limit=5'),
        ]);

        setStats(statsRes.data);
        setRecentOrders(ordersRes.data.orders || []);
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-text-primary mb-2">Dashboard</h1>
        <p className="text-text-secondary">Welcome back! Here&apos;s your business overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              {stats?.revenue.growth !== undefined && (
                <div
                  className={`flex items-center gap-1 text-xs font-medium ${
                    stats.revenue.growth >= 0 ? 'text-success' : 'text-error'
                  }`}
                >
                  {stats.revenue.growth >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {Math.abs(stats.revenue.growth)}%
                </div>
              )}
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-text-primary">
                {formatPrice(stats?.revenue.total || 0)}
              </p>
              <p className="text-xs text-text-secondary mt-2">
                Today: {formatPrice(stats?.revenue.today || 0)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Orders Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-secondary" />
              </div>
              {stats?.orders.growth !== undefined && (
                <div
                  className={`flex items-center gap-1 text-xs font-medium ${
                    stats.orders.growth >= 0 ? 'text-success' : 'text-error'
                  }`}
                >
                  {stats.orders.growth >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {Math.abs(stats.orders.growth)}%
                </div>
              )}
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-1">Total Orders</p>
              <p className="text-2xl font-bold text-text-primary">{stats?.orders.total || 0}</p>
              <p className="text-xs text-text-secondary mt-2">
                Pending: {stats?.orders.pending || 0}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Users Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-accent" />
              </div>
              {stats?.users.growth !== undefined && (
                <div
                  className={`flex items-center gap-1 text-xs font-medium ${
                    stats.users.growth >= 0 ? 'text-success' : 'text-error'
                  }`}
                >
                  {stats.users.growth >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {Math.abs(stats.users.growth)}%
                </div>
              )}
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-1">Total Users</p>
              <p className="text-2xl font-bold text-text-primary">{stats?.users.total || 0}</p>
              <p className="text-xs text-text-secondary mt-2">New: {stats?.users.new || 0}</p>
            </div>
          </CardContent>
        </Card>

        {/* Products Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
              {(stats?.products?.lowStock ?? 0) > 0 && (
                <Badge variant="outline" className="text-error border-error">
                  {stats?.products?.lowStock} Low
                </Badge>
              )}
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-1">Total Products</p>
              <p className="text-2xl font-bold text-text-primary">{stats?.products?.total || 0}</p>
              <p className="text-xs text-text-secondary mt-2">
                Active: {(stats?.products?.total || 0) - (stats?.products?.lowStock || 0)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Link href={ROUTES.ADMIN_ORDERS}>
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-center text-text-secondary py-8">No recent orders</p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border border-primary/10 rounded-lg hover:bg-background transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-semibold text-text-primary">{order.orderId}</p>
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      </div>
                      <p className="text-sm text-text-secondary">{order.customerName}</p>
                      <p className="text-xs text-text-secondary mt-1">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{formatPrice(order.total)}</p>
                      <Link href={ROUTES.ADMIN_ORDER_DETAIL(order.id)}>
                        <Button variant="ghost" size="sm" className="mt-2">
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

        {/* Alerts & Quick Actions */}
        <div className="space-y-6">
          {/* Low Stock Alert */}
          {(stats?.products?.lowStock ?? 0) > 0 && (
            <Card className="border-error/20">
              <CardHeader>
                <CardTitle className="text-error flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Low Stock Alert
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-secondary mb-4">
                  {stats?.products?.lowStock} products are running low on stock
                </p>
                <Link href={ROUTES.ADMIN_PRODUCTS}>
                  <Button variant="outline" size="sm" className="w-full">
                    Manage Inventory
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={ROUTES.ADMIN_PRODUCT_NEW}>
                <Button variant="outline" className="w-full justify-start">
                  <Package className="h-4 w-4 mr-2" />
                  Add New Product
                </Button>
              </Link>
              <Link href={ROUTES.ADMIN_ORDERS}>
                <Button variant="outline" className="w-full justify-start">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  View All Orders
                </Button>
              </Link>
              <Link href={ROUTES.ADMIN_ANALYTICS}>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
