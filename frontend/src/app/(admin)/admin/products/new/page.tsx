'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import apiClient from '@/lib/api';
import { productSchema, ProductFormData } from '@/lib/validations';
import { ROUTES } from '@/constants/routes';
import toast from 'react-hot-toast';

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageURLs, setImageURLs] = useState<string[]>([]);
  const [imageInputValue, setImageInputValue] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      featured: false,
    },
  });

  const handleAddImageURL = () => {
    if (imageInputValue.trim() && imageURLs.length < 5) {
      setImageURLs([...imageURLs, imageInputValue.trim()]);
      setImageInputValue('');
    }
  };

  const handleRemoveImageURL = (index: number) => {
    setImageURLs(imageURLs.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormData) => {
    if (imageURLs.length === 0) {
      toast.error('Please add at least one product image URL');
      return;
    }

    setIsSubmitting(true);
    try {
      const productData = {
        ...data,
        imageURLs,
      };

      await apiClient.post('/products', productData);
      toast.success('Product created successfully');
      router.push(ROUTES.ADMIN_PRODUCTS);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
        <h1 className="text-3xl font-serif font-bold text-text-primary mb-2">Add New Product</h1>
        <p className="text-text-secondary">Create a new product in your inventory</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Product Name *
                  </label>
                  <Input {...register('name')} placeholder="e.g., Red Roses Bouquet" />
                  {errors.name && <p className="text-xs text-error mt-1">{errors.name.message}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Description *
                  </label>
                  <textarea
                    {...register('description')}
                    rows={4}
                    placeholder="Describe your product in detail..."
                    className="w-full px-3 py-2 border border-primary/30 rounded-md focus:ring-2 focus:ring-primary text-sm"
                  />
                  {errors.description && (
                    <p className="text-xs text-error mt-1">{errors.description.message}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Category *
                  </label>
                  <Input {...register('category')} placeholder="e.g., bouquets, arrangements" />
                  {errors.category && (
                    <p className="text-xs text-error mt-1">{errors.category.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Inventory */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Price (KES) *
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register('price', { valueAsNumber: true })}
                      placeholder="0.00"
                    />
                    {errors.price && (
                      <p className="text-xs text-error mt-1">{errors.price.message}</p>
                    )}
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Stock Quantity *
                    </label>
                    <Input
                      type="number"
                      {...register('stock', { valueAsNumber: true })}
                      placeholder="0"
                    />
                    {errors.stock && (
                      <p className="text-xs text-error mt-1">{errors.stock.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Images */}
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Image URLs (Max 5)
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={imageInputValue}
                      onChange={(e) => setImageInputValue(e.target.value)}
                      placeholder="Enter image URL..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddImageURL();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={handleAddImageURL}
                      disabled={imageURLs.length >= 5 || !imageInputValue.trim()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">
                    Enter Cloudinary or public image URLs
                  </p>
                </div>

                {/* Image Preview */}
                {imageURLs.length > 0 && (
                  <div className="space-y-2">
                    {imageURLs.map((url, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-background rounded-lg border border-primary/10"
                      >
                        <span className="text-xs text-text-secondary font-mono flex-1 truncate">
                          {url}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveImageURL(index)}
                          className="text-error hover:text-error"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Product Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    {...register('featured')}
                    className="w-4 h-4 text-primary border-primary/30 rounded focus:ring-2 focus:ring-primary"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-text-primary">
                    Featured Product
                  </label>
                </div>
                <p className="text-xs text-text-secondary">
                  Featured products will be displayed on the homepage
                </p>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="p-6 space-y-3">
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? 'Creating...' : 'Create Product'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="w-full"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
