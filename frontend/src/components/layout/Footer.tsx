import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ROUTES } from '@/constants/routes';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-primary/10 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href={ROUTES.HOME} className="flex items-center space-x-2">
              <span className="text-2xl font-serif font-bold text-primary">Framel</span>
              <span className="text-2xl">🌸</span>
            </Link>
            <p className="text-sm text-text-secondary max-w-xs">
              Fresh flowers delivered with love. Perfect for any occasion, bringing beauty and joy to your doorstep.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={ROUTES.PRODUCTS} className="text-text-secondary hover:text-primary transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href={ROUTES.CATEGORY('roses')} className="text-text-secondary hover:text-primary transition-colors">
                  Roses
                </Link>
              </li>
              <li>
                <Link href={ROUTES.CATEGORY('bouquets')} className="text-text-secondary hover:text-primary transition-colors">
                  Bouquets
                </Link>
              </li>
              <li>
                <Link href={ROUTES.CATEGORY('occasions')} className="text-text-secondary hover:text-primary transition-colors">
                  Special Occasions
                </Link>
              </li>
              <li>
                <Link href={ROUTES.CATEGORY('plants')} className="text-text-secondary hover:text-primary transition-colors">
                  Plants & Gifts
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service Column */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={ROUTES.ABOUT} className="text-text-secondary hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-text-secondary hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-text-secondary hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-text-secondary hover:text-primary transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-text-secondary hover:text-primary transition-colors">
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-text-secondary">
                  Nairobi, Kenya
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <a
                  href="tel:+254700000000"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  +254 700 000 000
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <a
                  href="mailto:hello@framel.co.ke"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  hello@framel.co.ke
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-text-secondary text-center md:text-left">
            © {currentYear} Framel. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link href="/privacy" className="text-text-secondary hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-text-secondary hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
