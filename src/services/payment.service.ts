import axios from 'axios';
import {
  generateAccessToken,
  generatePassword,
  formatPhoneNumber,
  getBaseUrl,
  mpesaConfig,
} from '../config/mpesa';
import { AppError } from '../middleware/errorHandler';
import orderService from './order.service';
import { MpesaCallbackData } from '../types';

/**
 * Payment Service
 * Handles M-Pesa payment integration
 */
class PaymentService {
  /**
   * Initiate M-Pesa STK Push
   */
  async initiateSTKPush(
    orderId: string,
    phone: string,
    amount: number
  ): Promise<{
    merchantRequestId: string;
    checkoutRequestId: string;
    responseCode: string;
    responseDescription: string;
    customerMessage: string;
  }> {
    try {
      // Get order to verify
      const order = await orderService.getOrderById(orderId);

      if (order.paymentStatus === 'completed') {
        throw new AppError('Order already paid', 400);
      }

      // Verify amount matches order total
      if (Math.abs(amount - order.total) > 0.01) {
        throw new AppError('Payment amount does not match order total', 400);
      }

      // Format phone number
      const formattedPhone = formatPhoneNumber(phone);

      // Generate access token
      const accessToken = await generateAccessToken();

      // Generate password and timestamp
      const { password, timestamp } = generatePassword();

      // Prepare STK Push request
      const stkPushData = {
        BusinessShortCode: mpesaConfig.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(amount), // M-Pesa requires integer
        PartyA: formattedPhone,
        PartyB: mpesaConfig.shortcode,
        PhoneNumber: formattedPhone,
        CallBackURL: mpesaConfig.callbackUrl,
        AccountReference: order.orderId,
        TransactionDesc: `Payment for order ${order.orderId}`,
      };

      // Make STK Push request
      const response = await axios.post(
        `${getBaseUrl()}/mpesa/stkpush/v1/processrequest`,
        stkPushData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data;

      if (data.ResponseCode !== '0') {
        throw new AppError(
          data.ResponseDescription || 'STK Push failed',
          400
        );
      }

      // Store payment tracking details in order
      await orderService.updateOrderPaymentTracking(
        orderId,
        data.MerchantRequestID,
        data.CheckoutRequestID
      );

      return {
        merchantRequestId: data.MerchantRequestID,
        checkoutRequestId: data.CheckoutRequestID,
        responseCode: data.ResponseCode,
        responseDescription: data.ResponseDescription,
        customerMessage: data.CustomerMessage,
      };
    } catch (error: any) {
      if (error instanceof AppError) throw error;

      console.error('STK Push error:', error.response?.data || error.message);

      if (error.response?.data?.errorMessage) {
        throw new AppError(error.response.data.errorMessage, 400);
      }

      throw new AppError('Failed to initiate payment', 500);
    }
  }

  /**
   * Handle M-Pesa callback
   */
  async handleCallback(callbackData: MpesaCallbackData): Promise<void> {
    try {
      const { stkCallback } = callbackData.Body;
      const { ResultCode, ResultDesc, CallbackMetadata } = stkCallback;

      console.log('M-Pesa Callback received:', {
        ResultCode,
        ResultDesc,
        MerchantRequestID: stkCallback.MerchantRequestID,
        CheckoutRequestID: stkCallback.CheckoutRequestID,
      });

      // Extract payment details from callback metadata
      let mpesaReceiptNumber: string | undefined;
      let amount: number | undefined;
      let phoneNumber: string | undefined;
      let transactionDate: string | undefined;

      if (CallbackMetadata && ResultCode === 0) {
        const items = CallbackMetadata.Item;

        mpesaReceiptNumber = items.find((item) => item.Name === 'MpesaReceiptNumber')
          ?.Value as string;
        amount = items.find((item) => item.Name === 'Amount')?.Value as number;
        phoneNumber = items.find((item) => item.Name === 'PhoneNumber')?.Value as string;
        transactionDate = items.find((item) => item.Name === 'TransactionDate')
          ?.Value as string;
      }

      // ResultCode 0 means success
      if (ResultCode === 0) {
        console.log('✅ Payment successful:', {
          mpesaReceiptNumber,
          amount,
          phoneNumber,
          transactionDate,
        });

        // Find order by checkout request ID
        if (stkCallback.CheckoutRequestID) {
          try {
            const order = await orderService.getOrderByCheckoutRequestId(
              stkCallback.CheckoutRequestID
            );

            if (order) {
              // Update order payment status
              await orderService.updatePaymentStatus(
                order.id,
                'completed',
                mpesaReceiptNumber
              );
              console.log(`Order ${order.orderId} payment completed successfully`);
            }
          } catch (error) {
            console.error('Error updating order after payment:', error);
          }
        }
      } else {
        console.log('❌ Payment failed:', ResultDesc);
        
        // Find order and mark payment as failed
        if (stkCallback.CheckoutRequestID) {
          try {
            const order = await orderService.getOrderByCheckoutRequestId(
              stkCallback.CheckoutRequestID
            );

            if (order) {
              await orderService.updatePaymentStatus(order.id, 'failed');
              console.log(`Order ${order.orderId} payment marked as failed`);
            }
          } catch (error) {
            console.error('Error updating order after failed payment:', error);
          }
        }
      }
    } catch (error) {
      console.error('Callback handling error:', error);
      // Don't throw error - we don't want to send error response to M-Pesa
    }
  }

  /**
   * Query STK Push status
   */
  async querySTKPushStatus(checkoutRequestId: string): Promise<{
    responseCode: string;
    responseDescription: string;
    resultCode?: string;
    resultDesc?: string;
  }> {
    try {
      // Generate access token
      const accessToken = await generateAccessToken();

      // Generate password and timestamp
      const { password, timestamp } = generatePassword();

      // Prepare query request
      const queryData = {
        BusinessShortCode: mpesaConfig.shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      };

      // Make query request
      const response = await axios.post(
        `${getBaseUrl()}/mpesa/stkpushquery/v1/query`,
        queryData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data;

      return {
        responseCode: data.ResponseCode,
        responseDescription: data.ResponseDescription,
        resultCode: data.ResultCode,
        resultDesc: data.ResultDesc,
      };
    } catch (error: any) {
      console.error('Query STK Push error:', error.response?.data || error.message);

      if (error.response?.data?.errorMessage) {
        throw new AppError(error.response.data.errorMessage, 400);
      }

      throw new AppError('Failed to query payment status', 500);
    }
  }

  /**
   * Verify payment and update order
   */
  async verifyAndUpdateOrder(
    orderId: string,
    mpesaReceiptNumber: string
  ): Promise<void> {
    try {
      // Update order payment status
      await orderService.updatePaymentStatus(
        orderId,
        'completed',
        mpesaReceiptNumber
      );

      console.log(`Order ${orderId} payment verified and updated`);
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      console.error('Verify and update order error:', error);
      throw new AppError('Failed to verify payment', 500);
    }
  }
}

export default new PaymentService();
