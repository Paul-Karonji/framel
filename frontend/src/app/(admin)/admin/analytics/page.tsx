'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Calendar,
  Award,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import apiClient from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface SalesData {
  period: string;
  revenue: number;
  orders: number;
}

interface TopProduct {
  productId: string;
  name: string;
  totalQuantity: number;
  totalRevenue: number;
}

interface CategoryRevenue {
  category: string;
  revenue: number;
  orders: number;
}

interface TopCustomer {
  userId: string;
  name: string;
  totalSpent: number;
  orderCount: number;
}

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [categoryRevenue, setCategoryRevenue] = useState<CategoryRevenue[]>([]);
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const [salesRes, productsRes, categoryRes, customersRes] = await Promise.all([
        apiClient.get(`/admin/analytics/sales?period=${period}&limit=10`),
        apiClient.get('/admin/analytics/top-products?limit=5'),
        apiClient.get('/admin/analytics/revenue-by-category'),
        apiClient.get('/admin/analytics/users'),
      ]);

      setSalesData(salesRes.data.sales || []);
      setTopProducts(productsRes.data.topProducts || []);
      setCategoryRevenue(categoryRes.data.categories || []);
      setTopCustomers(customersRes.data.topCustomers || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = salesData.reduce((sum, item) => sum + item.orders, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-text-primary mb-2">
            Analytics & Reports
          </h1>
          <p className="text-text-secondary">Business insights and performance metrics</p>
        </div>

        {/* Period Selector */}
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="border border-primary/30 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-primary"
        >
          <option value="day">Daily</option>
          <option value="week">Weekly</option>
          <option value="month">Monthly</option>
          <option value="year">Yearly</option>
        </select>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-text-primary">{formatPrice(totalRevenue)}</p>
              <p className="text-xs text-text-secondary mt-2">
                {salesData.length} {period}s
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-secondary" />
              </div>
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-1">Total Orders</p>
              <p className="text-2xl font-bold text-text-primary">{totalOrders}</p>
              <p className="text-xs text-text-secondary mt-2">
                {salesData.length} {period}s
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-1">Avg Order Value</p>
              <p className="text-2xl font-bold text-text-primary">
                {formatPrice(averageOrderValue)}
              </p>
              <p className="text-xs text-text-secondary mt-2">Per order</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-1">Top Customers</p>
              <p className="text-2xl font-bold text-text-primary">{topCustomers.length}</p>
              <p className="text-xs text-text-secondary mt-2">Active buyers</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Sales Trend ({period}ly)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {salesData.length === 0 ? (
              <p className="text-center text-text-secondary py-8">No sales data available</p>
            ) : (
              <div className="space-y-3">
                {salesData.slice(0, 7).map((item, index) => {
                  const maxRevenue = Math.max(...salesData.map((s) => s.revenue));
                  const percentage = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;

                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-text-secondary">{item.period}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-text-secondary">{item.orders} orders</span>
                          <span className="font-semibold text-text-primary">
                            {formatPrice(item.revenue)}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-background rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Revenue by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-secondary" />
              Revenue by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            {categoryRevenue.length === 0 ? (
              <p className="text-center text-text-secondary py-8">No category data available</p>
            ) : (
              <div className="space-y-3">
                {categoryRevenue.map((item, index) => {
                  const maxRevenue = Math.max(...categoryRevenue.map((c) => c.revenue));
                  const percentage = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;

                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-text-secondary capitalize">{item.category}</span>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-xs">
                            {item.orders} orders
                          </Badge>
                          <span className="font-semibold text-text-primary">
                            {formatPrice(item.revenue)}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-background rounded-full h-2">
                        <div
                          className="bg-secondary h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-accent" />
              Top Selling Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <p className="text-center text-text-secondary py-8">No product data available</p>
            ) : (
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div
                    key={product.productId}
                    className="flex items-center justify-between p-3 bg-background rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-accent">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{product.name}</p>
                        <p className="text-xs text-text-secondary">
                          {product.totalQuantity} units sold
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-primary">
                      {formatPrice(product.totalRevenue)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Top Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topCustomers.length === 0 ? (
              <p className="text-center text-text-secondary py-8">No customer data available</p>
            ) : (
              <div className="space-y-4">
                {topCustomers.map((customer, index) => (
                  <div
                    key={customer.userId}
                    className="flex items-center justify-between p-3 bg-background rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{customer.name}</p>
                        <p className="text-xs text-text-secondary">
                          {customer.orderCount} orders
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-primary">
                      {formatPrice(customer.totalSpent)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
