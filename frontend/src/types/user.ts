/**
 * User related TypeScript types
 */

export interface User {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  role: UserRole;
  photoURL?: string;
  addresses?: Address[];
  createdAt: string;
  updatedAt?: string;
}

export type UserRole = 'customer' | 'admin';

export interface Address {
  id: string;
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  county: string;
  isDefault: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  displayName: string;
  phone: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  displayName?: string;
  phone?: string;
  photoURL?: string;
}

export interface ResetPasswordData {
  email: string;
}
