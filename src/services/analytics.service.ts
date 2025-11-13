import { db } from '../config/firebase';
import { Order, Product, User } from '../types';
import { AppError } from '../middleware/errorHandler';
import moment from 'moment';

/**
 * Analytics Service
 * Provides business analytics and insights for admin dashboard
 */
class AnalyticsService {
  /**
   * Get dashboard overview statistics
   */
  async getDashboardStats(): Promise<{
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    totalProducts: number;
    pendingOrders: number;
    lowStockProducts: number;
    revenueGrowth: number;
    ordersGrowth: number;
  }> {
    try {
      const [orders, users, products] = await Promise.all([
        db.collection('orders').get(),
        db.collection('users').get(),
        db.collection('products').get(),
      ]);

      const orderDocs = orders.docs.map((doc) => doc.data() as Order);
      const productDocs = products.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Product);

      // Calculate total revenue from completed payments
      const totalRevenue = orderDocs
        .filter((o) => o.paymentStatus === 'completed')
        .reduce((sum, o) => sum + o.total, 0);

      // Count pending orders
      const pendingOrders = orderDocs.filter(
        (o) => o.orderStatus === 'processing' || o.orderStatus === 'confirmed'
      ).length;

      // Count low stock products (stock < 10)
      const lowStockProducts = productDocs.filter((p) => p.stock < 10).length;

      // Calculate growth (compare last 30 days vs previous 30 days)
      const now = moment();
      const last30Days = now.clone().subtract(30, 'days');
      const previous60To30Days = now.clone().subtract(60, 'days');

      const recentOrders = orderDocs.filter((o) => {
        const createdAt = o.createdAt.toDate();
        return moment(createdAt).isAfter(last30Days);
      });

      const previousOrders = orderDocs.filter((o) => {
        const createdAt = o.createdAt.toDate();
        return moment(createdAt).isBetween(previous60To30Days, last30Days);
      });

      const recentRevenue = recentOrders
        .filter((o) => o.paymentStatus === 'completed')
        .reduce((sum, o) => sum + o.total, 0);

      const previousRevenue = previousOrders
        .filter((o) => o.paymentStatus === 'completed')
        .reduce((sum, o) => sum + o.total, 0);

      const revenueGrowth = previousRevenue > 0
        ? ((recentRevenue - previousRevenue) / previousRevenue) * 100
        : 0;

      const ordersGrowth = previousOrders.length > 0
        ? ((recentOrders.length - previousOrders.length) / previousOrders.length) * 100
        : 0;

      return {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders: orderDocs.length,
        totalUsers: users.size,
        totalProducts: productDocs.length,
        pendingOrders,
        lowStockProducts,
        revenueGrowth: Math.round(revenueGrowth * 100) / 100,
        ordersGrowth: Math.round(ordersGrowth * 100) / 100,
      };
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      throw new AppError('Failed to fetch dashboard statistics', 500);
    }
  }

  /**
   * Get sales analytics by period
   */
  async getSalesAnalytics(
    period: 'day' | 'week' | 'month' | 'year',
    limit: number = 30
  ): Promise<Array<{ date: string; revenue: number; orders: number }>> {
    try {
      const orders = await db.collection('orders').get();
      const orderDocs = orders.docs.map((doc) => doc.data() as Order);

      // Filter completed payments only
      const completedOrders = orderDocs.filter((o) => o.paymentStatus === 'completed');

      // Group by period
      const salesMap = new Map<string, { revenue: number; orders: number }>();

      completedOrders.forEach((order) => {
        const date = moment(order.createdAt.toDate());
        let key: string;

        switch (period) {
          case 'day':
            key = date.format('YYYY-MM-DD');
            break;
          case 'week':
            key = date.startOf('week').format('YYYY-MM-DD');
            break;
          case 'month':
            key = date.format('YYYY-MM');
            break;
          case 'year':
            key = date.format('YYYY');
            break;
        }

        const current = salesMap.get(key) || { revenue: 0, orders: 0 };
        salesMap.set(key, {
          revenue: current.revenue + order.total,
          orders: current.orders + 1,
        });
      });

      // Convert to array and sort
      const salesData = Array.from(salesMap.entries())
        .map(([date, data]) => ({
          date,
          revenue: Math.round(data.revenue * 100) / 100,
          orders: data.orders,
        }))
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, limit);

      return salesData;
    } catch (error) {
      console.error('Get sales analytics error:', error);
      throw new AppError('Failed to fetch sales analytics', 500);
    }
  }

  /**
   * Get top selling products
   */
  async getTopProducts(limit: number = 10): Promise<
    Array<{
      productId: string;
      productName: string;
      totalSold: number;
      revenue: number;
    }>
  > {
    try {
      const orders = await db.collection('orders').get();
      const orderDocs = orders.docs.map((doc) => doc.data() as Order);

      // Only count completed orders
      const completedOrders = orderDocs.filter((o) => o.paymentStatus === 'completed');

      // Count products sold
      const productStats = new Map<string, { name: string; quantity: number; revenue: number }>();

      completedOrders.forEach((order) => {
        order.items.forEach((item) => {
          const current = productStats.get(item.productId) || {
            name: item.name,
            quantity: 0,
            revenue: 0,
          };
          productStats.set(item.productId, {
            name: item.name,
            quantity: current.quantity + item.quantity,
            revenue: current.revenue + item.price * item.quantity,
          });
        });
      });

      // Convert to array and sort by quantity sold
      const topProducts = Array.from(productStats.entries())
        .map(([productId, data]) => ({
          productId,
          productName: data.name,
          totalSold: data.quantity,
          revenue: Math.round(data.revenue * 100) / 100,
        }))
        .sort((a, b) => b.totalSold - a.totalSold)
        .slice(0, limit);

      return topProducts;
    } catch (error) {
      console.error('Get top products error:', error);
      throw new AppError('Failed to fetch top products', 500);
    }
  }

  /**
   * Get low stock products
   */
  async getLowStockProducts(threshold: number = 10): Promise<
    Array<{
      id: string;
      name: string;
      stock: number;
      category: string;
    }>
  > {
    try {
      const products = await db
        .collection('products')
        .where('stock', '<=', threshold)
        .get();

      return products.docs.map((doc) => {
        const data = doc.data() as Product;
        return {
          id: doc.id,
          name: data.name,
          stock: data.stock,
          category: data.category,
        };
      });
    } catch (error) {
      console.error('Get low stock products error:', error);
      throw new AppError('Failed to fetch low stock products', 500);
    }
  }

  /**
   * Get recent orders
   */
  async getRecentOrders(limit: number = 10): Promise<Order[]> {
    try {
      const snapshot = await db
        .collection('orders')
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];
    } catch (error) {
      console.error('Get recent orders error:', error);
      throw new AppError('Failed to fetch recent orders', 500);
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<{
    totalUsers: number;
    newUsersThisMonth: number;
    activeUsers: number; // Users with at least one order
    topCustomers: Array<{
      userId: string;
      email: string;
      totalOrders: number;
      totalSpent: number;
    }>;
  }> {
    try {
      const [users, orders] = await Promise.all([
        db.collection('users').get(),
        db.collection('orders').get(),
      ]);

      const userDocs = users.docs.map((doc) => ({ uid: doc.id, ...doc.data() } as User));
      const orderDocs = orders.docs.map((doc) => doc.data() as Order);

      // Count new users this month
      const startOfMonth = moment().startOf('month');
      const newUsersThisMonth = userDocs.filter((u) => {
        const createdAt = u.createdAt.toDate();
        return moment(createdAt).isAfter(startOfMonth);
      }).length;

      // Count active users (with at least one order)
      const usersWithOrders = new Set(orderDocs.map((o) => o.userId).filter(Boolean));
      const activeUsers = usersWithOrders.size;

      // Get top customers
      const customerStats = new Map<string, { email: string; orders: number; spent: number }>();

      orderDocs
        .filter((o) => o.userId && o.paymentStatus === 'completed')
        .forEach((order) => {
          const current = customerStats.get(order.userId!) || {
            email: '',
            orders: 0,
            spent: 0,
          };
          const user = userDocs.find((u) => u.uid === order.userId);
          customerStats.set(order.userId!, {
            email: user?.email || 'Unknown',
            orders: current.orders + 1,
            spent: current.spent + order.total,
          });
        });

      const topCustomers = Array.from(customerStats.entries())
        .map(([userId, data]) => ({
          userId,
          email: data.email,
          totalOrders: data.orders,
          totalSpent: Math.round(data.spent * 100) / 100,
        }))
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, 10);

      return {
        totalUsers: userDocs.length,
        newUsersThisMonth,
        activeUsers,
        topCustomers,
      };
    } catch (error) {
      console.error('Get user stats error:', error);
      throw new AppError('Failed to fetch user statistics', 500);
    }
  }

  /**
   * Get revenue by category
   */
  async getRevenueByCategory(): Promise<
    Array<{
      category: string;
      revenue: number;
      orderCount: number;
    }>
  > {
    try {
      const orders = await db.collection('orders').get();
      const orderDocs = orders.docs.map((doc) => doc.data() as Order);

      // Only count completed orders
      const completedOrders = orderDocs.filter((o) => o.paymentStatus === 'completed');

      // Get category for each product
      const categoryStats = new Map<string, { revenue: number; orders: Set<string> }>();

      for (const order of completedOrders) {
        for (const item of order.items) {
          try {
            const productDoc = await db.collection('products').doc(item.productId).get();
            if (productDoc.exists) {
              const product = productDoc.data() as Product;
              const category = product.category;
              const current = categoryStats.get(category) || {
                revenue: 0,
                orders: new Set<string>(),
              };
              current.revenue += item.price * item.quantity;
              current.orders.add(order.id!);
              categoryStats.set(category, current);
            }
          } catch (error) {
            // Skip if product not found
            continue;
          }
        }
      }

      return Array.from(categoryStats.entries())
        .map(([category, data]) => ({
          category,
          revenue: Math.round(data.revenue * 100) / 100,
          orderCount: data.orders.size,
        }))
        .sort((a, b) => b.revenue - a.revenue);
    } catch (error) {
      console.error('Get revenue by category error:', error);
      throw new AppError('Failed to fetch revenue by category', 500);
    }
  }
}

export default new AnalyticsService();
