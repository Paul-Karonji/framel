import { auth, db } from '../config/firebase';
import { sendEmail } from '../config/email';
import { User, RegisterRequest } from '../types';
import { AppError } from '../middleware/errorHandler';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * Authentication Service
 * Handles all authentication-related business logic
 */
class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<{ user: User; message: string }> {
    try {
      // Create user in Firebase Auth
      const userRecord = await auth.createUser({
        email: data.email,
        password: data.password,
        displayName: data.name,
      });

      // Create user document in Firestore
      const userData: Omit<User, 'createdAt' | 'updatedAt'> = {
        uid: userRecord.uid,
        email: data.email,
        name: data.name,
        phone: data.phone,
        role: 'customer', // Default role
        preferences: {
          notifications: true,
          newsletter: false,
        },
      };

      await db
        .collection('users')
        .doc(userRecord.uid)
        .set({
          ...userData,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });

      // Send welcome email
      try {
        await this.sendWelcomeEmail(data.email, data.name);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail registration if email fails
      }

      // Get the created user with proper timestamps
      const userDoc = await db.collection('users').doc(userRecord.uid).get();
      const userDataFromDb = userDoc.data();

      // Convert Firestore data to User type
      const returnUser: User = {
        uid: userRecord.uid,
        email: data.email,
        name: data.name,
        phone: data.phone,
        role: 'customer',
        preferences: {
          notifications: true,
          newsletter: false,
        },
        createdAt: userDataFromDb?.createdAt,
        updatedAt: userDataFromDb?.updatedAt,
      };

      return {
        user: returnUser,
        message: 'Registration successful! Welcome to Framel.',
      };
    } catch (error: any) {
      console.error('Registration error:', error);

      if (error.code === 'auth/email-already-exists') {
        throw new AppError('Email already registered', 400);
      }

      if (error.code === 'auth/invalid-email') {
        throw new AppError('Invalid email address', 400);
      }

      if (error.code === 'auth/weak-password') {
        throw new AppError('Password is too weak', 400);
      }

      throw new AppError('Registration failed. Please try again.', 500);
    }
  }

  /**
   * Get user by UID
   */
  async getUserByUid(uid: string): Promise<User> {
    try {
      const userDoc = await db.collection('users').doc(uid).get();

      if (!userDoc.exists) {
        throw new AppError('User not found', 404);
      }

      return userDoc.data() as User;
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateUser(uid: string, updates: Partial<User>): Promise<User> {
    try {
      // Don't allow updating certain fields
      const { uid: _, createdAt, ...allowedUpdates } = updates as any;

      await db
        .collection('users')
        .doc(uid)
        .update({
          ...allowedUpdates,
          updatedAt: FieldValue.serverTimestamp(),
        });

      return await this.getUserByUid(uid);
    } catch (error) {
      console.error('Update user error:', error);
      throw new AppError('Failed to update user', 500);
    }
  }

  /**
   * Delete user account
   */
  async deleteUser(uid: string): Promise<void> {
    try {
      // Delete from Firebase Auth
      await auth.deleteUser(uid);

      // Delete from Firestore
      await db.collection('users').doc(uid).delete();
    } catch (error) {
      console.error('Delete user error:', error);
      throw new AppError('Failed to delete user', 500);
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      // Verify user exists
      const userRecord = await auth.getUserByEmail(email);

      // Generate password reset link
      const resetLink = await auth.generatePasswordResetLink(email, {
        url: `${process.env.CORS_ORIGIN}/reset-password`,
      });

      // Send email
      await sendEmail(
        email,
        'Reset Your Framel Password',
        this.getPasswordResetEmailTemplate(userRecord.displayName || 'Customer', resetLink)
      );
    } catch (error: any) {
      console.error('Password reset error:', error);

      if (error.code === 'auth/user-not-found') {
        // Don't reveal if email exists for security
        return;
      }

      throw new AppError('Failed to send password reset email', 500);
    }
  }

  /**
   * Verify user's email
   */
  async sendEmailVerification(uid: string): Promise<void> {
    try {
      const user = await auth.getUser(uid);
      const verificationLink = await auth.generateEmailVerificationLink(user.email!);

      await sendEmail(
        user.email!,
        'Verify Your Framel Email',
        this.getEmailVerificationTemplate(user.displayName || 'Customer', verificationLink)
      );
    } catch (error) {
      console.error('Email verification error:', error);
      throw new AppError('Failed to send verification email', 500);
    }
  }

  /**
   * Check if user is admin
   */
  async isAdmin(uid: string): Promise<boolean> {
    try {
      const user = await this.getUserByUid(uid);
      return user.role === 'admin';
    } catch (error) {
      return false;
    }
  }

  /**
   * Set user role (admin only)
   */
  async setUserRole(uid: string, role: 'customer' | 'admin'): Promise<User> {
    try {
      await db.collection('users').doc(uid).update({
        role,
        updatedAt: FieldValue.serverTimestamp(),
      });

      return await this.getUserByUid(uid);
    } catch (error) {
      console.error('Set role error:', error);
      throw new AppError('Failed to update user role', 500);
    }
  }

  // ============================================
  // EMAIL TEMPLATES
  // ============================================

  private async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #E89FAE 0%, #A8C3A6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #E89FAE; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌸 Welcome to Framel!</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Thank you for joining Framel! We're excited to help you find the perfect flowers for every occasion.</p>
              <p>With your account, you can:</p>
              <ul>
                <li>Browse our beautiful collection of flowers</li>
                <li>Save your favorite arrangements</li>
                <li>Track your orders in real-time</li>
                <li>Enjoy personalized recommendations</li>
              </ul>
              <p>Start shopping now and make someone's day special!</p>
              <a href="${process.env.CORS_ORIGIN}" class="button">Start Shopping</a>
              <p>Best regards,<br>The Framel Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await sendEmail(email, '🌸 Welcome to Framel - Let\'s Get Started!', html);
  }

  private getPasswordResetEmailTemplate(name: string, resetLink: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #E89FAE 0%, #A8C3A6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #E89FAE; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .warning { color: #d9534f; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔒 Reset Your Password</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>We received a request to reset your password for your Framel account.</p>
              <p>Click the button below to reset your password:</p>
              <a href="${resetLink}" class="button">Reset Password</a>
              <p class="warning">⚠️ This link will expire in 1 hour.</p>
              <p>If you didn't request this, you can safely ignore this email.</p>
              <p>Best regards,<br>The Framel Team</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private getEmailVerificationTemplate(name: string, verificationLink: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #E89FAE 0%, #A8C3A6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #E89FAE; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✉️ Verify Your Email</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Please verify your email address to complete your registration:</p>
              <a href="${verificationLink}" class="button">Verify Email</a>
              <p>Best regards,<br>The Framel Team</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}

export default new AuthService();
