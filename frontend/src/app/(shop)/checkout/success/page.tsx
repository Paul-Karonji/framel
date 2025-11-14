'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import confetti from 'canvas-confetti';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#E89FAE', '#A8C3A6', '#D9B26F'],
    });
  }, []);

  if (!orderId) {
    router.push(ROUTES.PRODUCTS);
    return null;
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="border-success/20">
            <CardContent className="p-8 text-center">
              {/* Success Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle className="h-12 w-12 text-success" />
                </div>
              </div>

              {/* Success Message */}
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-text-primary mb-3">
                Order Placed Successfully!
              </h1>

              <p className="text-lg text-text-secondary mb-6">
                Thank you for your order. We&apos;ll start preparing your beautiful flowers right away.
              </p>

              {/* Order ID */}
              <div className="bg-background rounded-lg p-4 mb-6">
                <p className="text-sm text-text-secondary mb-1">Order ID</p>
                <p className="text-xl font-semibold text-primary">{orderId}</p>
              </div>

              {/* Info */}
              <div className="bg-primary/5 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-text-primary mb-3">What&apos;s Next?</h3>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="text-success mt-0.5">✓</span>
                    <span>You&apos;ll receive a confirmation email shortly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success mt-0.5">✓</span>
                    <span>An M-Pesa prompt will be sent to your phone for payment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success mt-0.5">✓</span>
                    <span>Once payment is confirmed, we&apos;ll prepare your order</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success mt-0.5">✓</span>
                    <span>You can track your order status in your dashboard</span>
                  </li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={ROUTES.ORDERS}>
                  <Button size="lg" className="w-full sm:w-auto">
                    View Order
                  </Button>
                </Link>
                <Link href={ROUTES.PRODUCTS}>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
