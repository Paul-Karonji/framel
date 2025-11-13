import { Request, Response } from 'express';
import analyticsService from '../services/analytics.service';
import { ApiResponse } from '../types';
import { asyncHandler } from '../middleware/errorHandler';

/**
 * Admin Controller
 * Handles HTTP requests for admin dashboard and analytics endpoints
 */
class AdminController {
  /**
   * Get dashboard overview statistics
   * GET /api/admin/dashboard/stats
   */
  getDashboardStats = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await analyticsService.getDashboardStats();

    const response: ApiResponse = {
      success: true,
      data: stats,
    };

    return res.json(response);
  });

  /**
   * Get sales analytics
   * GET /api/admin/analytics/sales
   */
  getSalesAnalytics = asyncHandler(async (req: Request, res: Response) => {
    const { period, limit } = req.query;

    const validPeriods = ['day', 'week', 'month', 'year'];
    const selectedPeriod = period && validPeriods.includes(period as string)
      ? (period as 'day' | 'week' | 'month' | 'year')
      : 'day';

    const limitNum = limit ? parseInt(limit as string) : 30;

    const analytics = await analyticsService.getSalesAnalytics(selectedPeriod, limitNum);

    const response: ApiResponse = {
      success: true,
      data: {
        period: selectedPeriod,
        analytics,
      },
    };

    return res.json(response);
  });

  /**
   * Get top selling products
   * GET /api/admin/analytics/top-products
   */
  getTopProducts = asyncHandler(async (req: Request, res: Response) => {
    const { limit } = req.query;
    const limitNum = limit ? parseInt(limit as string) : 10;

    const products = await analyticsService.getTopProducts(limitNum);

    const response: ApiResponse = {
      success: true,
      data: {
        products,
        count: products.length,
      },
    };

    return res.json(response);
  });

  /**
   * Get low stock products
   * GET /api/admin/inventory/low-stock
   */
  getLowStockProducts = asyncHandler(async (req: Request, res: Response) => {
    const { threshold } = req.query;
    const thresholdNum = threshold ? parseInt(threshold as string) : 10;

    const products = await analyticsService.getLowStockProducts(thresholdNum);

    const response: ApiResponse = {
      success: true,
      data: {
        products,
        count: products.length,
        threshold: thresholdNum,
      },
    };

    return res.json(response);
  });

  /**
   * Get recent orders
   * GET /api/admin/orders/recent
   */
  getRecentOrders = asyncHandler(async (req: Request, res: Response) => {
    const { limit } = req.query;
    const limitNum = limit ? parseInt(limit as string) : 10;

    const orders = await analyticsService.getRecentOrders(limitNum);

    const response: ApiResponse = {
      success: true,
      data: {
        orders,
        count: orders.length,
      },
    };

    return res.json(response);
  });

  /**
   * Get user statistics
   * GET /api/admin/analytics/users
   */
  getUserStats = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await analyticsService.getUserStats();

    const response: ApiResponse = {
      success: true,
      data: stats,
    };

    return res.json(response);
  });

  /**
   * Get revenue by category
   * GET /api/admin/analytics/revenue-by-category
   */
  getRevenueByCategory = asyncHandler(async (_req: Request, res: Response) => {
    const data = await analyticsService.getRevenueByCategory();

    const response: ApiResponse = {
      success: true,
      data: {
        categories: data,
        count: data.length,
      },
    };

    return res.json(response);
  });
}

export default new AdminController();
