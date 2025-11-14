/**
 * Order related TypeScript types
 */

export interface Order {
  id: string;
  orderId: string; // Format: FRM-YYYYMMDD-XXXX
  userId: string;
  items: OrderItem[];
  deliveryDetails: DeliveryDetails;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageURL: string;
}

export interface DeliveryDetails {
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  county: string;
  deliveryDate: string;
  specialInstructions?: string;
}

export type OrderStatus = 'processing' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'completed' | 'failed';

export interface CreateOrderData {
  deliveryDetails: DeliveryDetails;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  totalPages: number;
}

export interface UpdateOrderStatusData {
  status: OrderStatus;
}

export interface OrderStats {
  totalOrders: number;
  processingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
}
