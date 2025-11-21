import { db } from '../config/firebase';
import { uploadImage, deleteImage } from '../config/cloudinary';
import { Product, CreateProductRequest, UpdateProductRequest, PaginatedResponse } from '../types';
import { AppError } from '../middleware/errorHandler';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * Product Service
 * Handles all product-related business logic
 */
class ProductService {
  private collection = db.collection('products');

  /**
   * Create a new product
   */
  async createProduct(data: CreateProductRequest): Promise<Product> {
    try {
      const productData = {
        ...data,
        imageURLs: data.imageURLs || [],
        featured: data.featured || false,
        colors: data.colors || [],
        tags: data.tags || [],
        rating: 0,
        reviewCount: 0,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      const docRef = await this.collection.add(productData);
      const doc = await docRef.get();

      return { id: doc.id, ...doc.data() } as Product;
    } catch (error) {
      console.error('Create product error:', error);
      throw new AppError('Failed to create product', 500);
    }
  }

  /**
   * Get all products with filters, search, and pagination
   */
  async getAllProducts(options: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    featured?: boolean;
    inStock?: boolean;
    sortBy?: 'price' | 'date' | 'rating';
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<PaginatedResponse<Product>> {
    try {
      const {
        page = 1,
        limit = 20,
        category,
        search,
        minPrice,
        maxPrice,
        featured,
        inStock,
        sortBy = 'date',
        sortOrder = 'desc',
      } = options;

      // Fetch ALL products from Firestore (no where clauses to avoid index issues)
      const snapshot = await this.collection.get();
      console.log('🔍 Firestore snapshot size:', snapshot.size);
      console.log('🔍 Document IDs:', snapshot.docs.map(doc => doc.id));

      let products = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];

      console.log('🔍 Products after mapping:', products.length, products.map(p => ({ id: p.id, name: p.name, featured: p.featured })));

      // Filter in memory to avoid Firestore index requirements

      // Filter by category
      if (category) {
        products = products.filter(p => p.category === category);
      }

      // Filter by featured
      if (featured !== undefined) {
        products = products.filter(p => p.featured === featured);
      }

      // Filter by stock
      if (inStock) {
        products = products.filter(p => p.stock > 0);
      }

      // Filter by price range
      if (minPrice !== undefined) {
        products = products.filter(p => p.price >= minPrice);
      }
      if (maxPrice !== undefined) {
        products = products.filter(p => p.price <= maxPrice);
      }

      // Sort in memory
      const sortField = sortBy === 'date' ? 'createdAt' : sortBy === 'rating' ? 'rating' : 'price';
      products.sort((a: any, b: any) => {
        const aVal = sortField === 'createdAt' ? a[sortField]?._seconds || 0 : a[sortField] || 0;
        const bVal = sortField === 'createdAt' ? b[sortField]?._seconds || 0 : b[sortField] || 0;
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      });

      // Client-side search (Firestore doesn't support full-text search)
      if (search) {
        const searchLower = search.toLowerCase();
        products = products.filter(
          (p) =>
            p.name.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower) ||
            p.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
        );
      }

      const total = products.length;
      const pages = Math.ceil(total / limit);

      // Apply pagination in memory
      const offset = (page - 1) * limit;
      const paginatedProducts = products.slice(offset, offset + limit);

      return {
        data: paginatedProducts,
        total,
        page,
        pages,
        limit,
      };
    } catch (error) {
      console.error('Get products error:', error);
      throw new AppError('Failed to fetch products', 500);
    }
  }

  /**
   * Get product by ID
   */
  async getProductById(id: string): Promise<Product> {
    try {
      const doc = await this.collection.doc(id).get();

      if (!doc.exists) {
        throw new AppError('Product not found', 404);
      }

      return { id: doc.id, ...doc.data() } as Product;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      console.error('Get product error:', error);
      throw new AppError('Failed to fetch product', 500);
    }
  }

  /**
   * Update product
   */
  async updateProduct(id: string, updates: UpdateProductRequest): Promise<Product> {
    try {
      const docRef = this.collection.doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new AppError('Product not found', 404);
      }

      await docRef.update({
        ...updates,
        updatedAt: FieldValue.serverTimestamp(),
      });

      const updatedDoc = await docRef.get();
      return { id: updatedDoc.id, ...updatedDoc.data() } as Product;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      console.error('Update product error:', error);
      throw new AppError('Failed to update product', 500);
    }
  }

  /**
   * Delete product
   */
  async deleteProduct(id: string): Promise<void> {
    try {
      const doc = await this.collection.doc(id).get();

      if (!doc.exists) {
        throw new AppError('Product not found', 404);
      }

      const product = doc.data() as Product;

      // Delete images from Cloudinary
      if (product.imageURLs && product.imageURLs.length > 0) {
        for (const url of product.imageURLs) {
          try {
            // Extract public ID from Cloudinary URL
            const publicId = this.extractPublicIdFromUrl(url);
            if (publicId) {
              await deleteImage(publicId);
            }
          } catch (error) {
            console.error('Error deleting image:', error);
            // Continue even if image deletion fails
          }
        }
      }

      await this.collection.doc(id).delete();
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      console.error('Delete product error:', error);
      throw new AppError('Failed to delete product', 500);
    }
  }

  /**
   * Upload product images
   */
  async uploadProductImages(id: string, imageBuffers: Buffer[]): Promise<string[]> {
    try {
      const uploadPromises = imageBuffers.map((buffer) =>
        uploadImage(buffer, 'products')
      );

      const results = await Promise.all(uploadPromises);
      const imageURLs = results.map((result) => result.url);

      // Update product with new image URLs
      const docRef = this.collection.doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new AppError('Product not found', 404);
      }

      const currentImages = (doc.data() as Product).imageURLs || [];
      const updatedImages = [...currentImages, ...imageURLs];

      await docRef.update({
        imageURLs: updatedImages,
        updatedAt: FieldValue.serverTimestamp(),
      });

      return imageURLs;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      console.error('Upload images error:', error);
      throw new AppError('Failed to upload images', 500);
    }
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const snapshot = await this.collection
        .where('category', '==', category)
        .where('stock', '>', 0)
        .get();

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
    } catch (error) {
      console.error('Get products by category error:', error);
      throw new AppError('Failed to fetch products', 500);
    }
  }

  /**
   * Toggle featured status
   */
  async toggleFeatured(id: string): Promise<Product> {
    try {
      const doc = await this.collection.doc(id).get();

      if (!doc.exists) {
        throw new AppError('Product not found', 404);
      }

      const product = doc.data() as Product;
      const newFeaturedStatus = !product.featured;

      await this.collection.doc(id).update({
        featured: newFeaturedStatus,
        updatedAt: FieldValue.serverTimestamp(),
      });

      const updatedDoc = await this.collection.doc(id).get();
      return { id: updatedDoc.id, ...updatedDoc.data() } as Product;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      console.error('Toggle featured error:', error);
      throw new AppError('Failed to update product', 500);
    }
  }

  /**
   * Update stock
   */
  async updateStock(id: string, quantity: number): Promise<Product> {
    try {
      const docRef = this.collection.doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new AppError('Product not found', 404);
      }

      await docRef.update({
        stock: quantity,
        updatedAt: FieldValue.serverTimestamp(),
      });

      const updatedDoc = await docRef.get();
      return { id: updatedDoc.id, ...updatedDoc.data() } as Product;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      console.error('Update stock error:', error);
      throw new AppError('Failed to update stock', 500);
    }
  }

  /**
   * Get featured products
   */
  async getFeaturedProducts(limit: number = 10): Promise<Product[]> {
    try {
      // Fetch ALL products from Firestore (no where clauses to avoid index issues)
      const snapshot = await this.collection.get();
      const products = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];

      // Filter by featured and stock in memory
      return products
        .filter((product) => product.featured === true && product.stock > 0)
        .slice(0, limit);
    } catch (error) {
      console.error('Get featured products error:', error);
      throw new AppError('Failed to fetch featured products', 500);
    }
  }

  /**
   * Extract public ID from Cloudinary URL
   */
  private extractPublicIdFromUrl(url: string): string | null {
    try {
      // Extract public ID from Cloudinary URL
      // Format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
      const match = url.match(/\/framel\/[^/]+\/([^.]+)/);
      return match ? `framel/${match[1]}` : null;
    } catch (error) {
      console.error('Error extracting public ID:', error);
      return null;
    }
  }
}

export default new ProductService();
