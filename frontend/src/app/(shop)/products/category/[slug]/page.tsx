'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Product, ProductFilters } from '@/types';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import apiClient from '@/lib/api';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ProductFilters>({
    category: slug,
  });

  // Get display name for category
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();

        // Always filter by category
        params.append('category', slug);

        if (searchQuery) params.append('search', searchQuery);
        if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
        if (filters.sortBy) params.append('sortBy', filters.sortBy);

        // Add cache buster to prevent 304 issues with stale data
        params.append('_t', Date.now().toString());

        const response = await apiClient.get(`/products?${params.toString()}`);
        console.log('📦 Frontend received products:', response.data);

        const productsData = response.data?.data?.data || response.data?.data?.products || response.data?.products || [];
        console.log('📦 Parsed products:', productsData.length, productsData);

        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(debounce);
  }, [slug, searchQuery, filters]);

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-text-primary mb-2">{categoryName}</h1>
          <p className="text-text-secondary">
            Browse our collection of {categoryName.toLowerCase()}
          </p>
        </div>

        {/* Filters & Search */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <Input
              placeholder={`Search ${categoryName.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Sort & Filter */}
          <div className="flex items-center gap-4">
            <select
              className="border border-primary/30 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
              value={filters.sortBy || ''}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))
              }
            >
              <option value="">Sort by</option>
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>

            <Button variant="outline" size="sm">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Products Count */}
        {!loading && (
          <p className="text-sm text-text-secondary mb-4">
            Showing {products.length} {products.length === 1 ? 'product' : 'products'}
          </p>
        )}

        {/* Products Grid */}
        <ProductGrid products={products} loading={loading} />
      </div>
    </div>
  );
}
