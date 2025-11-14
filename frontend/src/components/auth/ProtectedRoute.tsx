'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ROUTES } from '@/constants/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, loading, refreshUser } = useAuth();
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refresh user data when checking admin access to ensure role is up-to-date
  useEffect(() => {
    const checkAccess = async () => {
      if (!loading && isAuthenticated && requireAdmin) {
        setIsRefreshing(true);
        try {
          // Refresh user data to get the latest role from backend
          await refreshUser();
        } catch (error) {
          console.error('Error refreshing user data:', error);
        } finally {
          setIsRefreshing(false);
        }
      }
    };

    checkAccess();
  }, [loading, isAuthenticated, requireAdmin]);

  useEffect(() => {
    if (!loading && !isRefreshing) {
      if (!isAuthenticated) {
        router.push(ROUTES.LOGIN);
      } else if (requireAdmin && !isAdmin) {
        router.push(ROUTES.HOME);
      }
    }
  }, [isAuthenticated, isAdmin, loading, isRefreshing, requireAdmin, router]);

  if (loading || isRefreshing) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated || (requireAdmin && !isAdmin)) {
    return null;
  }

  return <>{children}</>;
}
