/**
 * Payment related TypeScript types
 */

export interface MpesaPaymentData {
  orderId: string;
  phoneNumber: string;
  amount: number;
}

export interface MpesaPaymentResponse {
  success: boolean;
  message: string;
  checkoutRequestId?: string;
  merchantRequestId?: string;
}

export interface MpesaStatusResponse {
  success: boolean;
  resultCode: string;
  resultDesc: string;
  paid: boolean;
}

export interface PaymentVerificationData {
  orderId: string;
  transactionId: string;
}
