/**
 * Analytics related TypeScript types (Admin)
 */

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueGrowth: number;
  ordersGrowth: number;
  customersGrowth: number;
  productsGrowth: number;
}

export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  productId: string;
  name: string;
  imageURL: string;
  sales: number;
  revenue: number;
}

export interface RecentOrder {
  orderId: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

export interface AnalyticsData {
  stats: DashboardStats;
  salesData: SalesData[];
  topProducts: TopProduct[];
  recentOrders: RecentOrder[];
}
