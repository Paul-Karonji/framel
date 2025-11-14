'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Edit, Trash2, Eye, Package } from 'lucide-react';
import { Product } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import apiClient from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStock, setFilterStock] = useState<string>('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by stock status
    if (filterStock === 'inStock') {
      filtered = filtered.filter((product) => product.stock > 0);
    } else if (filterStock === 'outOfStock') {
      filtered = filtered.filter((product) => product.stock === 0);
    } else if (filterStock === 'lowStock') {
      filtered = filtered.filter((product) => product.stock > 0 && product.stock <= 10);
    }

    setFilteredProducts(filtered);
  }, [searchQuery, filterStock, products]);

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get('/products?limit=100');
      setProducts(response.data.products || []);
      setFilteredProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await apiClient.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success('Product deleted successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  };

  const toggleFeatured = async (product: Product) => {
    try {
      await apiClient.patch(`/products/${product.id}/featured`);
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, featured: !p.featured } : p))
      );
      toast.success(`Product ${!product.featured ? 'featured' : 'unfeatured'} successfully`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update product');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-text-primary mb-2">Products</h1>
          <p className="text-text-secondary">Manage your product inventory</p>
        </div>
        <Link href={ROUTES.ADMIN_PRODUCT_NEW}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <Input
                placeholder="Search products by name or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Stock Filter */}
            <select
              value={filterStock}
              onChange={(e) => setFilterStock(e.target.value)}
              className="border border-primary/30 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Stock Status</option>
              <option value="inStock">In Stock</option>
              <option value="lowStock">Low Stock (≤10)</option>
              <option value="outOfStock">Out of Stock</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background border-b border-primary/10">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-text-primary">Product</th>
                  <th className="text-left p-4 text-sm font-semibold text-text-primary">Category</th>
                  <th className="text-left p-4 text-sm font-semibold text-text-primary">Price</th>
                  <th className="text-left p-4 text-sm font-semibold text-text-primary">Stock</th>
                  <th className="text-left p-4 text-sm font-semibold text-text-primary">Status</th>
                  <th className="text-right p-4 text-sm font-semibold text-text-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-text-secondary">
                      No products found
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-primary/10 hover:bg-background/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {product.imageURLs?.[0] ? (
                              <Image
                                src={product.imageURLs[0]}
                                alt={product.name}
                                width={48}
                                height={48}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="h-6 w-6 text-text-secondary" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-text-primary">{product.name}</p>
                            <p className="text-xs text-text-secondary line-clamp-1">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-text-primary capitalize">
                          {product.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-text-primary">
                          {formatPrice(product.price)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-sm font-medium ${
                            product.stock === 0
                              ? 'text-error'
                              : product.stock <= 10
                              ? 'text-accent'
                              : 'text-success'
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {product.featured && (
                            <Badge variant="default" className="text-xs">
                              Featured
                            </Badge>
                          )}
                          {product.stock === 0 ? (
                            <Badge variant="outline" className="text-xs text-error border-error">
                              Out of Stock
                            </Badge>
                          ) : product.stock <= 10 ? (
                            <Badge variant="outline" className="text-xs text-accent border-accent">
                              Low Stock
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs text-success border-success">
                              In Stock
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={ROUTES.PRODUCT_DETAIL(product.id)} target="_blank">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={ROUTES.ADMIN_PRODUCT_EDIT(product.id)}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFeatured(product)}
                            className={product.featured ? 'text-primary' : 'text-text-secondary'}
                          >
                            ⭐
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            className="text-error hover:text-error"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
