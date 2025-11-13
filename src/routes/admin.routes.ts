import { Router } from 'express';
import adminController from '../controllers/admin.controller';
import { verifyAuth, requireAdmin } from '../middleware/auth';

const router = Router();

/**
 * Admin Routes
 * Base path: /api/admin
 *
 * All routes require admin authentication
 */

// Apply admin authentication to all routes
router.use(verifyAuth, requireAdmin);

// ============================================
// DASHBOARD
// ============================================

/**
 * Get dashboard overview statistics
 * GET /api/admin/dashboard/stats
 *
 * Returns:
 * - Total revenue, orders, users, products
 * - Pending orders count
 * - Low stock products count
 * - Revenue & orders growth (%)
 */
router.get('/dashboard/stats', adminController.getDashboardStats);

// ============================================
// ANALYTICS
// ============================================

/**
 * Get sales analytics by period
 * GET /api/admin/analytics/sales
 * Query: period (day|week|month|year), limit (default: 30)
 *
 * Returns sales data grouped by selected period
 */
router.get('/analytics/sales', adminController.getSalesAnalytics);

/**
 * Get top selling products
 * GET /api/admin/analytics/top-products
 * Query: limit (default: 10)
 *
 * Returns products sorted by total quantity sold
 */
router.get('/analytics/top-products', adminController.getTopProducts);

/**
 * Get user statistics
 * GET /api/admin/analytics/users
 *
 * Returns:
 * - Total users count
 * - New users this month
 * - Active users (with orders)
 * - Top customers by spending
 */
router.get('/analytics/users', adminController.getUserStats);

/**
 * Get revenue by category
 * GET /api/admin/analytics/revenue-by-category
 *
 * Returns revenue breakdown by product category
 */
router.get('/analytics/revenue-by-category', adminController.getRevenueByCategory);

// ============================================
// INVENTORY MANAGEMENT
// ============================================

/**
 * Get low stock products
 * GET /api/admin/inventory/low-stock
 * Query: threshold (default: 10)
 *
 * Returns products with stock below threshold
 */
router.get('/inventory/low-stock', adminController.getLowStockProducts);

// ============================================
// ORDER MANAGEMENT
// ============================================

/**
 * Get recent orders
 * GET /api/admin/orders/recent
 * Query: limit (default: 10)
 *
 * Returns most recent orders
 */
router.get('/orders/recent', adminController.getRecentOrders);

export default router;
