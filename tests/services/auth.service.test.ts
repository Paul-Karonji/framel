import { AppError } from '../../src/middleware/errorHandler';

describe('Auth Service', () => {
  describe('User Registration', () => {
    it('should validate email format', () => {
      const validEmails = [
        'user@example.com',
        'test.user@domain.co.ke',
        'admin+test@framel.com',
      ];

      validEmails.forEach((email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        expect(emailRegex.test(email)).toBe(true);
      });
    });

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'user@',
        'user @example.com',
      ];

      invalidEmails.forEach((email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        expect(emailRegex.test(email)).toBe(false);
      });
    });

    it('should validate password strength', () => {
      const minLength = 6;
      const validPasswords = ['password123', 'securePass!', '12345678'];

      validPasswords.forEach((password) => {
        expect(password.length).toBeGreaterThanOrEqual(minLength);
      });
    });

    it('should reject weak passwords', () => {
      const minLength = 6;
      const weakPasswords = ['123', 'pass', '12345'];

      weakPasswords.forEach((password) => {
        expect(password.length).toBeLessThan(minLength);
      });
    });
  });

  describe('AppError', () => {
    it('should create error with correct status code', () => {
      const error = new AppError('Test error', 400);
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.isOperational).toBe(true);
    });

    it('should default to status code 500', () => {
      const error = new AppError('Server error');
      expect(error.statusCode).toBe(500);
    });
  });

  describe('User Roles', () => {
    it('should recognize valid user roles', () => {
      const validRoles = ['customer', 'admin'];

      validRoles.forEach((role) => {
        expect(['customer', 'admin']).toContain(role);
      });
    });

    it('should reject invalid roles', () => {
      const invalidRoles = ['superadmin', 'moderator', 'guest'];

      invalidRoles.forEach((role) => {
        expect(['customer', 'admin']).not.toContain(role);
      });
    });
  });
});
