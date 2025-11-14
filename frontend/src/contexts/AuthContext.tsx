'use client';

/**
 * Authentication Context
 * Manages user authentication state and provides auth methods
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  updateProfile as firebaseUpdateProfile,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { User } from '@/types';
import apiClient, { getErrorMessage } from '@/lib/api';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: { displayName?: string; phone?: string }) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch user profile from backend
  const fetchUserProfile = async (fbUser: FirebaseUser): Promise<User | null> => {
    try {
      const response = await apiClient.get('/auth/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    console.log('[AuthContext] Refreshing user data...');
    if (firebaseUser) {
      const userData = await fetchUserProfile(firebaseUser);
      console.log('[AuthContext] Fetched user data:', {
        uid: userData?.uid,
        email: userData?.email,
        role: userData?.role
      });
      setUser(userData);
      const newIsAdmin = userData?.role === 'admin';
      console.log('[AuthContext] Setting isAdmin to:', newIsAdmin);
      setIsAdmin(newIsAdmin);
    } else {
      console.log('[AuthContext] No firebaseUser available for refresh');
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);

      if (fbUser) {
        const userData = await fetchUserProfile(fbUser);
        setUser(userData);
        setIsAdmin(userData?.role === 'admin');
      } else {
        setUser(null);
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Register new user
  const register = async (
    email: string,
    password: string,
    name: string,
    phone: string
  ) => {
    try {
      setLoading(true);
      // Register via backend API (creates Firebase user and Firestore document)
      await apiClient.post('/auth/register', {
        email,
        password,
        name,
        phone,
      });

      // Sign in with the new account
      await signInWithEmailAndPassword(auth, email, password);

      toast.success('Account created successfully! Welcome to Framel.');
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Welcome back!');
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setIsAdmin(false);
      toast.success('Logged out successfully');
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      await apiClient.post('/auth/reset-password', { email });
      toast.success('Password reset email sent. Check your inbox.');
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      throw error;
    }
  };

  // Update user profile
  const updateProfile = async (data: { displayName?: string; phone?: string }) => {
    try {
      if (!firebaseUser) throw new Error('No user logged in');

      // Update Firebase profile
      if (data.displayName) {
        await firebaseUpdateProfile(firebaseUser, {
          displayName: data.displayName,
        });
      }

      // Update backend profile
      const response = await apiClient.put('/auth/profile', data);
      setUser(response.data);
      toast.success('Profile updated successfully');
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    firebaseUser,
    loading,
    isAuthenticated: !!user,
    isAdmin,
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
