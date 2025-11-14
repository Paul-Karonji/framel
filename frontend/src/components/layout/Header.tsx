'use client';

import Link from 'next/link';
import { ShoppingCart, User, Heart, Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { ROUTES } from '@/constants/routes';
import { Badge } from '@/components/ui/badge';

export function Header() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={ROUTES.HOME} className="flex items-center space-x-2">
            <div className="flex items-center">
              <span className="text-2xl font-serif font-bold text-primary">Framel</span>
              <span className="ml-1 text-2xl">🌸</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href={ROUTES.HOME}
              className="text-sm font-medium text-text-primary hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              href={ROUTES.PRODUCTS}
              className="text-sm font-medium text-text-primary hover:text-primary transition-colors"
            >
              Shop
            </Link>
            <Link
              href={ROUTES.ABOUT}
              className="text-sm font-medium text-text-primary hover:text-primary transition-colors"
            >
              About
            </Link>
            {isAdmin && (
              <Link
                href={ROUTES.ADMIN_DASHBOARD}
                className="text-sm font-medium text-accent hover:text-accent-dark transition-colors"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search (Desktop) */}
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>

            {/* Wishlist */}
            {isAuthenticated && (
              <Link href={ROUTES.WISHLIST}>
                <Button variant="ghost" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* Cart */}
            <Link href={ROUTES.CART} className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge
                    variant="default"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Account */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-2">
                <Link href={ROUTES.DASHBOARD}>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link href={ROUTES.LOGIN}>
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href={ROUTES.REGISTER}>
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Category bar (Desktop) */}
        <div className="hidden md:flex h-12 items-center space-x-6 border-t border-primary/5">
          <Link
            href={ROUTES.CATEGORY('roses')}
            className="text-sm text-text-secondary hover:text-primary transition-colors"
          >
            Roses
          </Link>
          <Link
            href={ROUTES.CATEGORY('bouquets')}
            className="text-sm text-text-secondary hover:text-primary transition-colors"
          >
            Bouquets
          </Link>
          <Link
            href={ROUTES.CATEGORY('occasions')}
            className="text-sm text-text-secondary hover:text-primary transition-colors"
          >
            Special Occasions
          </Link>
          <Link
            href={ROUTES.CATEGORY('plants')}
            className="text-sm text-text-secondary hover:text-primary transition-colors"
          >
            Plants
          </Link>
          <Link
            href={ROUTES.CATEGORY('gifts')}
            className="text-sm text-text-secondary hover:text-primary transition-colors"
          >
            Gifts
          </Link>
        </div>
      </div>
    </header>
  );
}
