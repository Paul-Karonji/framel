import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Framel - Fresh Flowers Delivered',
  description:
    'Order beautiful, fresh flowers online. Perfect for any occasion. Fast delivery across Kenya.',
  keywords: ['flowers', 'bouquets', 'roses', 'delivery', 'Kenya', 'gifts', 'occasions'],
  authors: [{ name: 'Framel' }],
  openGraph: {
    title: 'Framel - Fresh Flowers Delivered',
    description: 'Order beautiful, fresh flowers online. Perfect for any occasion.',
    type: 'website',
    locale: 'en_KE',
    siteName: 'Framel',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#FFFFFF',
                  color: '#3A3A3A',
                  border: '1px solid #E89FAE',
                },
                success: {
                  iconTheme: {
                    primary: '#7BAE7F',
                    secondary: '#FFFFFF',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#E57373',
                    secondary: '#FFFFFF',
                  },
                },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
