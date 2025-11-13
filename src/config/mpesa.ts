import axios from 'axios';
import moment from 'moment';

// Mpesa configuration
const MPESA_CONFIG = {
  environment: process.env.MPESA_ENVIRONMENT || 'sandbox',
  consumerKey: process.env.MPESA_CONSUMER_KEY || '',
  consumerSecret: process.env.MPESA_CONSUMER_SECRET || '',
  shortcode: process.env.MPESA_SHORTCODE || '174379',
  passkey: process.env.MPESA_PASSKEY || '',
  callbackUrl: process.env.MPESA_CALLBACK_URL || '',
};

// Base URLs
const BASE_URLS = {
  sandbox: 'https://sandbox.safaricom.co.ke',
  production: 'https://api.safaricom.co.ke',
};

// Get base URL based on environment
export const getBaseUrl = (): string => {
  return BASE_URLS[MPESA_CONFIG.environment as keyof typeof BASE_URLS] || BASE_URLS.sandbox;
};

// Generate OAuth token
export const generateAccessToken = async (): Promise<string> => {
  try {
    const auth = Buffer.from(
      `${MPESA_CONFIG.consumerKey}:${MPESA_CONFIG.consumerSecret}`
    ).toString('base64');

    const response = await axios.get(
      `${getBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    return response.data.access_token;
  } catch (error: any) {
    console.error('Error generating Mpesa access token:', error.response?.data || error.message);
    throw new Error('Failed to generate Mpesa access token');
  }
};

// Generate password for STK push
export const generatePassword = (): { password: string; timestamp: string } => {
  const timestamp = moment().format('YYYYMMDDHHmmss');
  const password = Buffer.from(
    `${MPESA_CONFIG.shortcode}${MPESA_CONFIG.passkey}${timestamp}`
  ).toString('base64');

  return { password, timestamp };
};

// Format phone number (ensure it starts with 254)
export const formatPhoneNumber = (phone: string): string => {
  // Remove any spaces, hyphens, or plus signs
  let formatted = phone.replace(/[\s\-+]/g, '');

  // If starts with 0, replace with 254
  if (formatted.startsWith('0')) {
    formatted = '254' + formatted.substring(1);
  }

  // If doesn't start with 254, add it
  if (!formatted.startsWith('254')) {
    formatted = '254' + formatted;
  }

  return formatted;
};

// Export config
export const mpesaConfig = MPESA_CONFIG;

export default {
  getBaseUrl,
  generateAccessToken,
  generatePassword,
  formatPhoneNumber,
  config: MPESA_CONFIG,
};
