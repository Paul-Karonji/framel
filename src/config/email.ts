import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

// Create transporter
const createTransporter = (): Transporter => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS?.replace(/\s/g, ''), // Remove spaces from app password
    },
  });
};

export const transporter = createTransporter();

// Verify connection
transporter.verify((error, _success) => {
  if (error) {
    console.error('❌ Email transporter error:', error);
  } else {
    console.log('✅ Email transporter ready');
  }
});

// Email template wrapper
export const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<void> => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Framel Flowers <noreply@framel.co.ke>',
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};

export default transporter;
