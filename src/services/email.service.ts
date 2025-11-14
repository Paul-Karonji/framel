import { sendEmail } from '../config/email';
import { Order, OrderItem } from '../types';
import moment from 'moment';

type OrderStatus = Order['orderStatus'];

/**
 * Email Notification Service
 * Handles all email notifications for the e-commerce platform
 */
class EmailService {
  private readonly siteUrl: string;
  private readonly siteName: string;
  private readonly supportEmail: string;

  constructor() {
    this.siteUrl = process.env.SITE_URL || 'https://framel.co.ke';
    this.siteName = 'Framel Flowers';
    this.supportEmail = process.env.SUPPORT_EMAIL || 'support@framel.co.ke';
  }

  /**
   * Generate email header HTML
   */
  private getEmailHeader(): string {
    return `
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🌸 ${this.siteName}</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Beautiful Flowers Delivered Fresh</p>
      </div>
    `;
  }

  /**
   * Generate email footer HTML
   */
  private getEmailFooter(): string {
    return `
      <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 3px solid #667eea;">
        <p style="color: #6c757d; margin: 0 0 10px 0; font-size: 14px;">
          Need help? Contact us at <a href="mailto:${this.supportEmail}" style="color: #667eea;">${this.supportEmail}</a>
        </p>
        <p style="color: #6c757d; margin: 0; font-size: 12px;">
          &copy; ${new Date().getFullYear()} ${this.siteName}. All rights reserved.
        </p>
        <p style="color: #6c757d; margin: 10px 0 0 0; font-size: 12px;">
          <a href="${this.siteUrl}" style="color: #667eea; text-decoration: none;">Visit Our Website</a>
        </p>
      </div>
    `;
  }

  /**
   * Generate order items HTML table
   */
  private getOrderItemsTable(items: OrderItem[]): string {
    const rows = items
      .map(
        (item) => `
        <tr>
          <td style="padding: 15px; border-bottom: 1px solid #e9ecef;">
            <strong>${item.name}</strong>
          </td>
          <td style="padding: 15px; border-bottom: 1px solid #e9ecef; text-align: center;">
            ${item.quantity}
          </td>
          <td style="padding: 15px; border-bottom: 1px solid #e9ecef; text-align: right;">
            KES ${item.price.toLocaleString()}
          </td>
          <td style="padding: 15px; border-bottom: 1px solid #e9ecef; text-align: right;">
            <strong>KES ${(item.price * item.quantity).toLocaleString()}</strong>
          </td>
        </tr>
      `
      )
      .join('');

    return `
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background: #f8f9fa;">
            <th style="padding: 15px; text-align: left; border-bottom: 2px solid #dee2e6;">Product</th>
            <th style="padding: 15px; text-align: center; border-bottom: 2px solid #dee2e6;">Qty</th>
            <th style="padding: 15px; text-align: right; border-bottom: 2px solid #dee2e6;">Price</th>
            <th style="padding: 15px; text-align: right; border-bottom: 2px solid #dee2e6;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;
  }

  /**
   * Get order status badge color
   */
  private getStatusColor(status: OrderStatus): string {
    const colors: Record<OrderStatus, string> = {
      processing: '#0dcaf0',
      confirmed: '#17a2b8',
      dispatched: '#0d6efd',
      delivered: '#198754',
      cancelled: '#dc3545',
    };
    return colors[status] || '#6c757d';
  }

  /**
   * Get order status display text
   */
  private getStatusText(status: OrderStatus): string {
    const texts: Record<OrderStatus, string> = {
      processing: 'Processing',
      confirmed: 'Confirmed',
      dispatched: 'Dispatched',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    };
    return texts[status] || status;
  }

  /**
   * Send order confirmation email
   */
  async sendOrderConfirmationEmail(order: Order, userEmail: string): Promise<void> {
    const subject = `Order Confirmation - ${order.orderId}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">

          ${this.getEmailHeader()}

          <div style="padding: 40px 30px;">
            <h2 style="color: #333; margin: 0 0 20px 0;">Thank You for Your Order! 🎉</h2>

            <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0;">
              Hi <strong>${order.deliveryAddress.fullName}</strong>,
            </p>

            <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0;">
              We've received your order and will process it shortly. You'll receive another email when your order ships.
            </p>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <table style="width: 100%;">
                <tr>
                  <td style="padding: 5px 0;">
                    <strong style="color: #333;">Order Number:</strong>
                  </td>
                  <td style="padding: 5px 0; text-align: right;">
                    <span style="color: #667eea; font-weight: bold;">${order.orderId}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;">
                    <strong style="color: #333;">Order Date:</strong>
                  </td>
                  <td style="padding: 5px 0; text-align: right;">
                    ${moment(order.createdAt.toDate()).format('MMM DD, YYYY [at] hh:mm A')}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;">
                    <strong style="color: #333;">Status:</strong>
                  </td>
                  <td style="padding: 5px 0; text-align: right;">
                    <span style="background: ${this.getStatusColor(order.orderStatus)}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold;">
                      ${this.getStatusText(order.orderStatus)}
                    </span>
                  </td>
                </tr>
              </table>
            </div>

            <h3 style="color: #333; margin: 30px 0 15px 0;">Order Details</h3>
            ${this.getOrderItemsTable(order.items)}

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <table style="width: 100%;">
                <tr>
                  <td style="padding: 5px 0;"><strong style="color: #333;">Subtotal:</strong></td>
                  <td style="padding: 5px 0; text-align: right;">KES ${order.subtotal.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;"><strong style="color: #333;">Shipping:</strong></td>
                  <td style="padding: 5px 0; text-align: right;">KES ${order.deliveryFee.toLocaleString()}</td>
                </tr>
                <tr style="border-top: 2px solid #dee2e6;">
                  <td style="padding: 15px 0 5px 0;"><strong style="color: #333; font-size: 18px;">Total:</strong></td>
                  <td style="padding: 15px 0 5px 0; text-align: right;">
                    <strong style="color: #667eea; font-size: 20px;">KES ${order.total.toLocaleString()}</strong>
                  </td>
                </tr>
              </table>
            </div>

            <h3 style="color: #333; margin: 30px 0 15px 0;">Delivery Address</h3>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; line-height: 1.6; color: #666;">
              <strong style="color: #333;">${order.deliveryAddress.fullName}</strong><br>
              ${order.deliveryAddress.address}<br>
              ${order.deliveryAddress.city}<br>
              Phone: ${order.deliveryAddress.phone}
              ${order.deliveryAddress.additionalInfo ? `<br>${order.deliveryAddress.additionalInfo}` : ''}
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${this.siteUrl}/orders/${order.orderId}"
                 style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Track Your Order
              </a>
            </div>
          </div>

          ${this.getEmailFooter()}

        </div>
      </body>
      </html>
    `;

    await sendEmail(userEmail, subject, html);
  }

  /**
   * Send order status update email
   */
  async sendOrderStatusUpdateEmail(
    order: Order,
    userEmail: string,
    previousStatus: OrderStatus
  ): Promise<void> {
    const subject = `Order ${this.getStatusText(order.orderStatus)} - ${order.orderId}`;

    let statusMessage = '';
    let statusIcon = '';

    switch (order.orderStatus) {
      case 'processing':
        statusMessage =
          "Great news! We're processing your order and preparing it for shipment.";
        statusIcon = '📦';
        break;
      case 'dispatched':
        statusMessage =
          'Your order is on its way! Your beautiful flowers have been dispatched and will arrive soon.';
        statusIcon = '🚚';
        break;
      case 'delivered':
        statusMessage =
          'Your order has been delivered! We hope you love your flowers. Thank you for choosing Framel.';
        statusIcon = '✅';
        break;
      case 'cancelled':
        statusMessage =
          'Your order has been cancelled. If you have any questions, please contact our support team.';
        statusIcon = '❌';
        break;
      default:
        statusMessage = `Your order status has been updated to ${this.getStatusText(order.orderStatus)}.`;
        statusIcon = '📋';
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">

          ${this.getEmailHeader()}

          <div style="padding: 40px 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="font-size: 60px; margin-bottom: 20px;">${statusIcon}</div>
              <h2 style="color: #333; margin: 0;">Order Status Update</h2>
            </div>

            <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0;">
              Hi <strong>${order.deliveryAddress.fullName}</strong>,
            </p>

            <div style="background: ${this.getStatusColor(order.orderStatus)}; color: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <p style="margin: 0; font-size: 18px; font-weight: bold;">
                ${statusMessage}
              </p>
            </div>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <table style="width: 100%;">
                <tr>
                  <td style="padding: 5px 0;">
                    <strong style="color: #333;">Order Number:</strong>
                  </td>
                  <td style="padding: 5px 0; text-align: right;">
                    <span style="color: #667eea; font-weight: bold;">${order.orderId}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;">
                    <strong style="color: #333;">Previous Status:</strong>
                  </td>
                  <td style="padding: 5px 0; text-align: right;">
                    <span style="background: ${this.getStatusColor(previousStatus)}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px;">
                      ${this.getStatusText(previousStatus)}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;">
                    <strong style="color: #333;">Current Status:</strong>
                  </td>
                  <td style="padding: 5px 0; text-align: right;">
                    <span style="background: ${this.getStatusColor(order.orderStatus)}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold;">
                      ${this.getStatusText(order.orderStatus)}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;">
                    <strong style="color: #333;">Updated:</strong>
                  </td>
                  <td style="padding: 5px 0; text-align: right;">
                    ${moment().format('MMM DD, YYYY [at] hh:mm A')}
                  </td>
                </tr>
              </table>
            </div>

            ${
              order.orderStatus === 'dispatched'
                ? `
            <div style="background: #d1ecf1; padding: 20px; border-radius: 8px; border-left: 4px solid #0dcaf0; margin: 20px 0;">
              <p style="color: #0c5460; margin: 0; font-size: 16px;">
                Your order has been dispatched and is on its way to you. You will receive it on or before your scheduled delivery date.
              </p>
            </div>
            `
                : ''
            }

            <h3 style="color: #333; margin: 30px 0 15px 0;">Order Summary</h3>
            ${this.getOrderItemsTable(order.items)}

            <div style="text-align: center; margin: 30px 0;">
              <a href="${this.siteUrl}/orders/${order.orderId}"
                 style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                View Order Details
              </a>
            </div>
          </div>

          ${this.getEmailFooter()}

        </div>
      </body>
      </html>
    `;

    await sendEmail(userEmail, subject, html);
  }

  /**
   * Send payment confirmation email
   */
  async sendPaymentConfirmationEmail(
    order: Order,
    userEmail: string,
    transactionId: string
  ): Promise<void> {
    const subject = `Payment Received - ${order.orderId}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">

          ${this.getEmailHeader()}

          <div style="padding: 40px 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="font-size: 60px; margin-bottom: 20px;">💳</div>
              <h2 style="color: #333; margin: 0;">Payment Confirmed!</h2>
            </div>

            <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0;">
              Hi <strong>${order.deliveryAddress.fullName}</strong>,
            </p>

            <div style="background: #d4edda; color: #155724; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin: 20px 0; text-align: center;">
              <p style="margin: 0; font-size: 18px; font-weight: bold;">
                We've successfully received your payment of KES ${order.total.toLocaleString()}
              </p>
            </div>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <table style="width: 100%;">
                <tr>
                  <td style="padding: 5px 0;">
                    <strong style="color: #333;">Order Number:</strong>
                  </td>
                  <td style="padding: 5px 0; text-align: right;">
                    <span style="color: #667eea; font-weight: bold;">${order.orderId}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;">
                    <strong style="color: #333;">Transaction ID:</strong>
                  </td>
                  <td style="padding: 5px 0; text-align: right;">
                    ${transactionId}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;">
                    <strong style="color: #333;">Payment Date:</strong>
                  </td>
                  <td style="padding: 5px 0; text-align: right;">
                    ${moment().format('MMM DD, YYYY [at] hh:mm A')}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;">
                    <strong style="color: #333;">Amount Paid:</strong>
                  </td>
                  <td style="padding: 5px 0; text-align: right;">
                    <strong style="color: #28a745; font-size: 18px;">KES ${order.total.toLocaleString()}</strong>
                  </td>
                </tr>
              </table>
            </div>

            <p style="color: #666; line-height: 1.6; margin: 20px 0;">
              Your order is now being processed and will be shipped soon. You'll receive another email with tracking information once your order ships.
            </p>

            <h3 style="color: #333; margin: 30px 0 15px 0;">Order Summary</h3>
            ${this.getOrderItemsTable(order.items)}

            <div style="text-align: center; margin: 30px 0;">
              <a href="${this.siteUrl}/orders/${order.orderId}"
                 style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Track Your Order
              </a>
            </div>
          </div>

          ${this.getEmailFooter()}

        </div>
      </body>
      </html>
    `;

    await sendEmail(userEmail, subject, html);
  }

  /**
   * Send order cancellation email
   */
  async sendOrderCancellationEmail(
    order: Order,
    userEmail: string,
    reason?: string
  ): Promise<void> {
    const subject = `Order Cancelled - ${order.orderId}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">

          ${this.getEmailHeader()}

          <div style="padding: 40px 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="font-size: 60px; margin-bottom: 20px;">❌</div>
              <h2 style="color: #333; margin: 0;">Order Cancelled</h2>
            </div>

            <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0;">
              Hi <strong>${order.deliveryAddress.fullName}</strong>,
            </p>

            <div style="background: #f8d7da; color: #721c24; padding: 20px; border-radius: 8px; border-left: 4px solid #dc3545; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold;">
                Your order ${order.orderId} has been cancelled.
              </p>
              ${
                reason
                  ? `<p style="margin: 0; font-size: 14px;">Reason: ${reason}</p>`
                  : ''
              }
            </div>

            ${
              order.paymentStatus === 'completed'
                ? `
            <div style="background: #d1ecf1; padding: 20px; border-radius: 8px; border-left: 4px solid #0dcaf0; margin: 20px 0;">
              <p style="color: #0c5460; margin: 0;">
                <strong>Refund Information:</strong><br>
                Your payment of KES ${order.total.toLocaleString()} will be refunded within 5-7 business days to your original payment method.
              </p>
            </div>
            `
                : ''
            }

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <table style="width: 100%;">
                <tr>
                  <td style="padding: 5px 0;">
                    <strong style="color: #333;">Order Number:</strong>
                  </td>
                  <td style="padding: 5px 0; text-align: right;">
                    <span style="color: #667eea; font-weight: bold;">${order.orderId}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 5px 0;">
                    <strong style="color: #333;">Cancellation Date:</strong>
                  </td>
                  <td style="padding: 5px 0; text-align: right;">
                    ${moment().format('MMM DD, YYYY [at] hh:mm A')}
                  </td>
                </tr>
              </table>
            </div>

            <p style="color: #666; line-height: 1.6; margin: 20px 0;">
              If you have any questions or concerns about this cancellation, please don't hesitate to contact our support team.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${this.siteUrl}/products"
                 style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Continue Shopping
              </a>
            </div>
          </div>

          ${this.getEmailFooter()}

        </div>
      </body>
      </html>
    `;

    await sendEmail(userEmail, subject, html);
  }
}

export default new EmailService();
