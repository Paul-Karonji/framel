import { Request, Response } from 'express';
import paymentService from '../services/payment.service';
import { ApiResponse, AuthenticatedRequest, MpesaCallbackData } from '../types';
import { asyncHandler } from '../middleware/errorHandler';

/**
 * Payment Controller
 * Handles HTTP requests for payment endpoints
 */
class PaymentController {
  /**
   * Initiate M-Pesa payment
   * POST /api/payment/mpesa/initiate
   */
  initiatePayment = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Please login to make a payment',
      } as ApiResponse);
    }

    const { orderId, phone, amount } = req.body;

    if (!orderId || !phone || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request',
        message: 'Order ID, phone number, and amount are required',
      } as ApiResponse);
    }

    const result = await paymentService.initiateSTKPush(orderId, phone, amount);

    const response: ApiResponse = {
      success: true,
      message: 'Payment initiated successfully. Please enter your M-Pesa PIN.',
      data: result,
    };

    return res.json(response);
  });

  /**
   * M-Pesa callback
   * POST /api/payment/mpesa/callback
   */
  mpesaCallback = asyncHandler(async (req: Request, res: Response) => {
    const callbackData: MpesaCallbackData = req.body;

    console.log('📞 M-Pesa Callback received:', JSON.stringify(callbackData, null, 2));

    // Process callback asynchronously
    paymentService.handleCallback(callbackData).catch((error) => {
      console.error('Error handling M-Pesa callback:', error);
    });

    // Always respond with success to M-Pesa
    return res.json({
      ResultCode: 0,
      ResultDesc: 'Success',
    });
  });

  /**
   * Query payment status
   * GET /api/payment/mpesa/status/:checkoutRequestId
   */
  queryPaymentStatus = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).user;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Please login to check payment status',
      } as ApiResponse);
    }

    const { checkoutRequestId } = req.params;

    const result = await paymentService.querySTKPushStatus(checkoutRequestId);

    const response: ApiResponse = {
      success: true,
      data: result,
    };

    return res.json(response);
  });

  /**
   * Verify payment and update order
   * POST /api/payment/verify
   */
  verifyPayment = asyncHandler(async (req: Request, res: Response) => {
    const { orderId, mpesaReceiptNumber } = req.body;

    if (!orderId || !mpesaReceiptNumber) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request',
        message: 'Order ID and M-Pesa receipt number are required',
      } as ApiResponse);
    }

    await paymentService.verifyAndUpdateOrder(orderId, mpesaReceiptNumber);

    const response: ApiResponse = {
      success: true,
      message: 'Payment verified and order updated successfully',
    };

    return res.json(response);
  });
}

export default new PaymentController();
