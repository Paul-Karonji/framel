'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Truck, Shield, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Product } from '@/types';
import apiClient from '@/lib/api';
import { ROUTES } from '@/constants/routes';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await apiClient.get('/products/featured');
        const productsData = response.data?.data?.data || response.data?.data || response.data?.products || [];
        setFeaturedProducts(productsData);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-text-primary">
                Fresh flowers delivered daily
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif font-bold text-text-primary mb-6 leading-tight">
              Fresh Flowers
              <br />
              <span className="text-primary">Delivered with Love</span>
            </h1>

            <p className="text-xl text-text-secondary mb-8 max-w-2xl">
              Discover our stunning collection of hand-picked flowers, perfect for every occasion.
              Express delivery across Nairobi.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={ROUTES.PRODUCTS}>
                <Button size="lg" className="w-full sm:w-auto">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href={ROUTES.ABOUT}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-y border-primary/10 bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-1">Fast Delivery</h3>
                <p className="text-sm text-text-secondary">
                  Same-day delivery available across Nairobi
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <Heart className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-1">Fresh Quality</h3>
                <p className="text-sm text-text-secondary">
                  Hand-picked flowers guaranteed fresh for 7+ days
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-1">Secure Payment</h3>
                <p className="text-sm text-text-secondary">
                  Safe & secure M-Pesa payment integration
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-text-primary mb-2">
                Featured Collection
              </h2>
              <p className="text-text-secondary">
                Our most popular and beautiful arrangements
              </p>
            </div>
            <Link href={ROUTES.PRODUCTS}>
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <ProductGrid products={featuredProducts} loading={loading} />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-text-primary mb-8 text-center">
            Shop by Occasion
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: 'Roses', slug: 'roses', emoji: '🌹' },
              { name: 'Bouquets', slug: 'bouquets', emoji: '💐' },
              { name: 'Occasions', slug: 'occasions', emoji: '🎉' },
              { name: 'Plants', slug: 'plants', emoji: '🌿' },
              { name: 'Gifts', slug: 'gifts', emoji: '🎁' },
            ].map((category) => (
              <Link
                key={category.slug}
                href={ROUTES.CATEGORY(category.slug)}
                className="group"
              >
                <div className="bg-background rounded-lg p-6 text-center hover:shadow-md transition-shadow border border-primary/10">
                  <div className="text-4xl mb-2">{category.emoji}</div>
                  <h3 className="font-semibold text-text-primary group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/20 to-secondary/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-text-primary mb-4">
            Make Someone&apos;s Day Special
          </h2>
          <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
            Send beautiful flowers to your loved ones. Browse our collection and order now
            for same-day delivery.
          </p>
          <Link href={ROUTES.PRODUCTS}>
            <Button size="lg">
              Start Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
