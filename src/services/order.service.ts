import { db } from '../config/firebase';
import { Order, OrderItem, CreateOrderRequest } from '../types';
import { AppError } from '../middleware/errorHandler';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import cartService from './cart.service';
import productService from './product.service';
import moment from 'moment';

/**
 * Order Service
 * Handles all order-related business logic
 */
class OrderService {
  private collection = db.collection('orders');

  /**
   * Generate unique order ID
   * Format: FRM-YYYYMMDD-XXXX
   */
  private async generateOrderId(): Promise<string> {
    const today = moment().format('YYYYMMDD');
    const prefix = `FRM-${today}`;

    // Get today's orders count
    const todayStart = moment().startOf('day').toDate();
    const todayEnd = moment().endOf('day').toDate();

    const snapshot = await this.collection
      .where('createdAt', '>=', Timestamp.fromDate(todayStart))
      .where('createdAt', '<=', Timestamp.fromDate(todayEnd))
      .get();

    const orderCount = snapshot.size + 1;
    const orderNumber = orderCount.toString().padStart(4, '0');

    return `${prefix}-${orderNumber}`;
  }

  /**
   * Create order from cart
   */
  async createOrder(
    userId: string,
    orderData: CreateOrderRequest
  ): Promise<Order> {
    try {
      // Get user's cart
      const cartData = await cartService.getCart(userId);

      if (!cartData.cart.items || cartData.cart.items.length === 0) {
        throw new AppError('Cart is empty', 400);
      }

      // Validate cart
      const validation = await cartService.validateCart(userId);
      if (!validation.valid) {
        throw new AppError(
          `Cart validation failed: ${validation.issues.map((i) => i.issue).join(', ')}`,
          400
        );
      }

      // Build order items with product details
      const orderItems: OrderItem[] = await Promise.all(
        cartData.cart.items.map(async (item) => {
          const product = await productService.getProductById(item.productId);
          return {
            productId: item.productId,
            name: product.name,
            price: product.price,
            quantity: item.quantity,
            imageURL: product.imageURLs[0] || '',
          };
        })
      );

      // Generate order ID
      const orderId = await this.generateOrderId();

      // Parse delivery date
      const deliveryDate = Timestamp.fromDate(new Date(orderData.deliveryDate));

      // Create order
      const order: Omit<Order, 'id'> = {
        orderId,
        userId,
        items: orderItems,
        subtotal: cartData.subtotal,
        deliveryFee: cartData.deliveryFee,
        total: cartData.total,
        deliveryAddress: {
          id: '',
          ...orderData.deliveryAddress,
          isDefault: false,
        },
        deliveryDate,
        paymentMethod: orderData.paymentMethod,
        paymentStatus: 'pending',
        orderStatus: 'processing',
        createdAt: FieldValue.serverTimestamp() as any,
        updatedAt: FieldValue.serverTimestamp() as any,
      };

      const docRef = await this.collection.add(order);

      // Reduce product stock
      for (const item of orderItems) {
        const product = await productService.getProductById(item.productId);
        const newStock = product.stock - item.quantity;
        await productService.updateStock(item.productId, newStock);
      }

      // Clear cart after successful order
      await cartService.clearCart(userId);

      const doc = await docRef.get();
      return { id: doc.id, ...doc.data() } as Order;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      console.error('Create order error:', error);
      throw new AppError('Failed to create order', 500);
    }
  }

  /**
   * Get order by ID
   */
  async getOrderById(orderId: string, userId?: string): Promise<Order> {
    try {
      const doc = await this.collection.doc(orderId).get();

      if (!doc.exists) {
        throw new AppError('Order not found', 404);
      }

      const order = { id: doc.id, ...doc.data() } as Order;

      // Verify ownership if userId provided
      if (userId && order.userId !== userId) {
        throw new AppError('Unauthorized to view this order', 403);
      }

      return order;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      console.error('Get order error:', error);
      throw new AppError('Failed to fetch order', 500);
    }
  }

  /**
   * Get order by order ID (FRM-YYYYMMDD-XXXX)
   */
  async getOrderByOrderId(orderId: string, userId?: string): Promise<Order> {
    try {
      const snapshot = await this.collection.where('orderId', '==', orderId).limit(1).get();

      if (snapshot.empty) {
        throw new AppError('Order not found', 404);
      }

      const doc = snapshot.docs[0];
      const order = { id: doc.id, ...doc.data() } as Order;

      // Verify ownership if userId provided
      if (userId && order.userId !== userId) {
        throw new AppError('Unauthorized to view this order', 403);
      }

      return order;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      console.error('Get order by orderId error:', error);
      throw new AppError('Failed to fetch order', 500);
    }
  }

  /**
   * Get user's orders
   */
  async getUserOrders(
    userId: string,
    options: {
      page?: number;
      limit?: number;
      status?: string;
    } = {}
  ): Promise<{
    orders: Order[];
    total: number;
    page: number;
    pages: number;
  }> {
    try {
      const { page = 1, limit = 20, status } = options;

      let query: any = this.collection.where('userId', '==', userId);

      if (status) {
        query = query.where('orderStatus', '==', status);
      }

      // Get total count
      const totalSnapshot = await query.get();
      const total = totalSnapshot.size;

      // Apply pagination and sorting
      query = query.orderBy('createdAt', 'desc');
      const offset = (page - 1) * limit;
      query = query.limit(limit).offset(offset);

      const snapshot = await query.get();
      const orders = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];

      const pages = Math.ceil(total / limit);

      return { orders, total, page, pages };
    } catch (error) {
      console.error('Get user orders error:', error);
      throw new AppError('Failed to fetch orders', 500);
    }
  }

  /**
   * Get all orders (admin)
   */
  async getAllOrders(options: {
    page?: number;
    limit?: number;
    status?: string;
    paymentStatus?: string;
  } = {}): Promise<{
    orders: Order[];
    total: number;
    page: number;
    pages: number;
  }> {
    try {
      const { page = 1, limit = 50, status, paymentStatus } = options;

      let query: any = this.collection;

      if (status) {
        query = query.where('orderStatus', '==', status);
      }

      if (paymentStatus) {
        query = query.where('paymentStatus', '==', paymentStatus);
      }

      // Get total count
      const totalSnapshot = await query.get();
      const total = totalSnapshot.size;

      // Apply pagination and sorting
      query = query.orderBy('createdAt', 'desc');
      const offset = (page - 1) * limit;
      query = query.limit(limit).offset(offset);

      const snapshot = await query.get();
      const orders = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];

      const pages = Math.ceil(total / limit);

      return { orders, total, page, pages };
    } catch (error) {
      console.error('Get all orders error:', error);
      throw new AppError('Failed to fetch orders', 500);
    }
  }

  /**
   * Update order status
   */
  async updateOrderStatus(
    orderId: string,
    status: Order['orderStatus']
  ): Promise<Order> {
    try {
      const docRef = this.collection.doc(orderId);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new AppError('Order not found', 404);
      }

      await docRef.update({
        orderStatus: status,
        updatedAt: FieldValue.serverTimestamp(),
      });

      const updatedDoc = await docRef.get();
      return { id: updatedDoc.id, ...updatedDoc.data() } as Order;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      console.error('Update order status error:', error);
      throw new AppError('Failed to update order status', 500);
    }
  }

  /**
   * Update payment status
   */
  async updatePaymentStatus(
    orderId: string,
    status: Order['paymentStatus'],
    mpesaReceiptNumber?: string
  ): Promise<Order> {
    try {
      const docRef = this.collection.doc(orderId);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new AppError('Order not found', 404);
      }

      const updateData: any = {
        paymentStatus: status,
        updatedAt: FieldValue.serverTimestamp(),
      };

      if (mpesaReceiptNumber) {
        updateData.mpesaReceiptNumber = mpesaReceiptNumber;
      }

      // If payment is completed, update order status to confirmed
      if (status === 'completed') {
        updateData.orderStatus = 'confirmed';
      }

      await docRef.update(updateData);

      const updatedDoc = await docRef.get();
      return { id: updatedDoc.id, ...updatedDoc.data() } as Order;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      console.error('Update payment status error:', error);
      throw new AppError('Failed to update payment status', 500);
    }
  }

  /**
   * Cancel order
   */
  async cancelOrder(orderId: string, userId?: string): Promise<Order> {
    try {
      const order = await this.getOrderById(orderId, userId);

      // Only allow cancellation if order is processing or confirmed
      if (!['processing', 'confirmed'].includes(order.orderStatus)) {
        throw new AppError(
          `Cannot cancel order with status: ${order.orderStatus}`,
          400
        );
      }

      // Only allow cancellation if payment is not completed
      if (order.paymentStatus === 'completed') {
        throw new AppError('Cannot cancel paid order. Please contact support.', 400);
      }

      // Restore product stock
      for (const item of order.items) {
        const product = await productService.getProductById(item.productId);
        const newStock = product.stock + item.quantity;
        await productService.updateStock(item.productId, newStock);
      }

      const docRef = this.collection.doc(orderId);
      await docRef.update({
        orderStatus: 'cancelled',
        updatedAt: FieldValue.serverTimestamp(),
      });

      const updatedDoc = await docRef.get();
      return { id: updatedDoc.id, ...updatedDoc.data() } as Order;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      console.error('Cancel order error:', error);
      throw new AppError('Failed to cancel order', 500);
    }
  }

  /**
   * Get order statistics (admin)
   */
  async getOrderStatistics(): Promise<{
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
  }> {
    try {
      const allOrders = await this.collection.get();
      const orders = allOrders.docs.map((doc) => doc.data()) as Order[];

      const totalOrders = orders.length;
      const totalRevenue = orders
        .filter((o) => o.paymentStatus === 'completed')
        .reduce((sum, o) => sum + o.total, 0);
      const pendingOrders = orders.filter(
        (o) => o.orderStatus === 'processing'
      ).length;
      const completedOrders = orders.filter(
        (o) => o.orderStatus === 'delivered'
      ).length;
      const cancelledOrders = orders.filter(
        (o) => o.orderStatus === 'cancelled'
      ).length;

      return {
        totalOrders,
        totalRevenue,
        pendingOrders,
        completedOrders,
        cancelledOrders,
      };
    } catch (error) {
      console.error('Get order statistics error:', error);
      throw new AppError('Failed to fetch statistics', 500);
    }
  }
}

export default new OrderService();
