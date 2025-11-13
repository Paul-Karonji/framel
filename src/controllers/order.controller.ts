import { Request, Response } from 'express';
import orderService from '../services/order.service';
import { ApiResponse, AuthenticatedRequest, CreateOrderRequest } from '../types';
import { asyncHandler } from '../middleware/errorHandler';

/**
 * Order Controller
 * Handles HTTP requests for order endpoints
 */
class OrderController {
  /**
   * Create new order from cart
   * POST /api/orders
   */
  createOrder = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Please login to create an order',
      } as ApiResponse);
    }

    const orderData: CreateOrderRequest = req.body;

    // Validate required fields
    if (!orderData.items || orderData.items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request',
        message: 'Order must contain at least one item',
      } as ApiResponse);
    }

    if (!orderData.deliveryAddress) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request',
        message: 'Delivery address is required',
      } as ApiResponse);
    }

    if (!orderData.deliveryDate) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request',
        message: 'Delivery date is required',
      } as ApiResponse);
    }

    const order = await orderService.createOrder(user.uid, orderData);

    const response: ApiResponse = {
      success: true,
      message: 'Order created successfully',
      data: { order },
    };

    return res.status(201).json(response);
  });

  /**
   * Get order by ID
   * GET /api/orders/:id
   */
  getOrderById = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;
    const { id } = req.params;

    // Admin can view any order, users can only view their own
    const userId = user?.role === 'admin' ? undefined : user?.uid;

    const order = await orderService.getOrderById(id, userId);

    const response: ApiResponse = {
      success: true,
      data: { order },
    };

    return res.json(response);
  });

  /**
   * Get order by order ID (FRM-YYYYMMDD-XXXX)
   * GET /api/orders/order/:orderId
   */
  getOrderByOrderId = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;
    const { orderId } = req.params;

    // Admin can view any order, users can only view their own
    const userId = user?.role === 'admin' ? undefined : user?.uid;

    const order = await orderService.getOrderByOrderId(orderId, userId);

    const response: ApiResponse = {
      success: true,
      data: { order },
    };

    return res.json(response);
  });

  /**
   * Get user's orders
   * GET /api/orders/user/me
   */
  getUserOrders = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Please login to view orders',
      } as ApiResponse);
    }

    const { page, limit, status } = req.query;

    const options = {
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      status: status as string,
    };

    const result = await orderService.getUserOrders(user.uid, options);

    const response: ApiResponse = {
      success: true,
      data: result,
    };

    return res.json(response);
  });

  /**
   * Get all orders (admin)
   * GET /api/orders
   */
  getAllOrders = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, status, paymentStatus } = req.query;

    const options = {
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      status: status as string,
      paymentStatus: paymentStatus as string,
    };

    const result = await orderService.getAllOrders(options);

    const response: ApiResponse = {
      success: true,
      data: result,
    };

    return res.json(response);
  });

  /**
   * Update order status
   * PATCH /api/orders/:id/status
   */
  updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request',
        message: 'Status is required',
      } as ApiResponse);
    }

    const validStatuses = ['processing', 'confirmed', 'dispatched', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status',
        message: `Status must be one of: ${validStatuses.join(', ')}`,
      } as ApiResponse);
    }

    const order = await orderService.updateOrderStatus(id, status);

    const response: ApiResponse = {
      success: true,
      message: 'Order status updated successfully',
      data: { order },
    };

    return res.json(response);
  });

  /**
   * Cancel order
   * POST /api/orders/:id/cancel
   */
  cancelOrder = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;
    const { id } = req.params;

    // Admin can cancel any order, users can only cancel their own
    const userId = user?.role === 'admin' ? undefined : user?.uid;

    const order = await orderService.cancelOrder(id, userId);

    const response: ApiResponse = {
      success: true,
      message: 'Order cancelled successfully',
      data: { order },
    };

    return res.json(response);
  });

  /**
   * Get order statistics (admin)
   * GET /api/orders/stats
   */
  getOrderStatistics = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await orderService.getOrderStatistics();

    const response: ApiResponse = {
      success: true,
      data: stats,
    };

    return res.json(response);
  });
}

export default new OrderController();
