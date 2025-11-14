'use client';

import { useEffect, useState, useRef } from 'react';
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
  const [isChecking, setIsChecking] = useState(false);
  const hasRefreshed = useRef(false);

  // Check access and refresh user data if needed
  useEffect(() => {
    const checkAccess = async () => {
      // Wait for initial auth check to complete
      if (loading) return;

      // If requiring admin access and we haven't refreshed yet, refresh user data
      if (requireAdmin && isAuthenticated && !hasRefreshed.current) {
        setIsChecking(true);
        console.log('[ProtectedRoute] Refreshing user data for admin check...');
        try {
          await refreshUser();
          console.log('[ProtectedRoute] User data refreshed successfully');
        } catch (error) {
          console.error('[ProtectedRoute] Error refreshing user data:', error);
        } finally {
          hasRefreshed.current = true;
          setIsChecking(false);
        }
        return;
      }

      // Now check access after refresh is complete
      if (!isChecking) {
        if (!isAuthenticated) {
          console.log('[ProtectedRoute] Not authenticated, redirecting to login');
          router.push(ROUTES.LOGIN);
        } else if (requireAdmin && !isAdmin) {
          console.log('[ProtectedRoute] Not admin, redirecting to home. isAdmin:', isAdmin);
          router.push(ROUTES.HOME);
        } else {
          console.log('[ProtectedRoute] Access granted. isAuthenticated:', isAuthenticated, 'isAdmin:', isAdmin);
        }
      }
    };

    checkAccess();
  }, [loading, isAuthenticated, isAdmin, requireAdmin, isChecking, refreshUser, router]);

  if (loading || isChecking) {
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
