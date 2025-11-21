'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Heart, User, MapPin, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { ROUTES } from '@/constants/routes';

const navigation = [
  {
    name: 'Dashboard',
    href: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    name: 'My Orders',
    href: ROUTES.ORDERS,
    icon: ShoppingBag,
  },
  {
    name: 'Wishlist',
    href: ROUTES.WISHLIST,
    icon: Heart,
  },
  {
    name: 'Profile',
    href: ROUTES.PROFILE,
    icon: User,
  },
  {
    name: 'Addresses',
    href: ROUTES.ADDRESSES,
    icon: MapPin,
  },
];

export function UserSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const { wishlistCount } = useWishlist();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-primary/10 p-6">
      {/* User Info */}
      <div className="mb-6 pb-6 border-b border-primary/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">{user?.displayName}</h3>
            <p className="text-sm text-text-secondary">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const showBadge = item.href === ROUTES.WISHLIST && wishlistCount > 0;

          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:bg-primary/5 hover:text-primary'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
                {showBadge && (
                  <Badge
                    variant="default"
                    className={cn(
                      'ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs',
                      isActive ? 'bg-white text-primary' : ''
                    )}
                  >
                    {wishlistCount}
                  </Badge>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="mt-6 pt-6 border-t border-primary/10">
        <Button variant="ghost" className="w-full justify-start text-error hover:text-error hover:bg-error/10" onClick={logout}>
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
}
