import { db } from '../config/firebase';
import { Category } from '../types';
import { AppError } from '../middleware/errorHandler';

/**
 * Category Service
 * Handles all category-related business logic
 */
class CategoryService {
  private collection = db.collection('categories');
  private productsCollection = db.collection('products');

  /**
   * Create a new category
   */
  async createCategory(data: {
    name: string;
    description: string;
    imageURL?: string;
    order?: number;
  }): Promise<Category> {
    try {
      // Generate slug from name
      const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

      // Check if slug already exists
      const existingSlug = await this.collection.where('slug', '==', slug).get();
      if (!existingSlug.empty) {
        throw new AppError('Category with this name already exists', 400);
      }

      const categoryData = {
        name: data.name,
        slug,
        description: data.description,
        imageURL: data.imageURL || '',
        order: data.order || 0,
      };

      const docRef = await this.collection.add(categoryData);
      const doc = await docRef.get();

      return { id: doc.id, ...doc.data() } as Category;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      console.error('Create category error:', error);
      throw new AppError('Failed to create category', 500);
    }
  }

  /**
   * Get all categories
   */
  async getAllCategories(): Promise<Category[]> {
    try {
      const snapshot = await this.collection.orderBy('order', 'asc').get();

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Category[];
    } catch (error) {
      console.error('Get categories error:', error);
      throw new AppError('Failed to fetch categories', 500);
    }
  }

  /**
   * Get category by ID
   */
  async getCategoryById(id: string): Promise<Category> {
    try {
      const doc = await this.collection.doc(id).get();

      if (!doc.exists) {
        throw new AppError('Category not found', 404);
      }

      return { id: doc.id, ...doc.data() } as Category;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      console.error('Get category error:', error);
      throw new AppError('Failed to fetch category', 500);
    }
  }

  /**
   * Get category by slug
   */
  async getCategoryBySlug(slug: string): Promise<Category> {
    try {
      const snapshot = await this.collection.where('slug', '==', slug).get();

      if (snapshot.empty) {
        throw new AppError('Category not found', 404);
      }

      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as Category;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      console.error('Get category error:', error);
      throw new AppError('Failed to fetch category', 500);
    }
  }

  /**
   * Update category
   */
  async updateCategory(
    id: string,
    updates: Partial<{
      name: string;
      description: string;
      imageURL: string;
      order: number;
    }>
  ): Promise<Category> {
    try {
      const docRef = this.collection.doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new AppError('Category not found', 404);
      }

      // If name is being updated, regenerate slug
      if (updates.name) {
        const newSlug = updates.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

        // Check if new slug already exists (excluding current doc)
        const existingSlug = await this.collection
          .where('slug', '==', newSlug)
          .get();

        if (!existingSlug.empty && existingSlug.docs[0].id !== id) {
          throw new AppError('Category with this name already exists', 400);
        }

        updates = { ...updates, slug: newSlug } as any;
      }

      await docRef.update(updates);

      const updatedDoc = await docRef.get();
      return { id: updatedDoc.id, ...updatedDoc.data() } as Category;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      console.error('Update category error:', error);
      throw new AppError('Failed to update category', 500);
    }
  }

  /**
   * Delete category
   */
  async deleteCategory(id: string): Promise<void> {
    try {
      const doc = await this.collection.doc(id).get();

      if (!doc.exists) {
        throw new AppError('Category not found', 404);
      }

      const category = doc.data() as Category;

      // Check if there are products in this category
      const productsSnapshot = await this.productsCollection
        .where('category', '==', category.slug)
        .limit(1)
        .get();

      if (!productsSnapshot.empty) {
        throw new AppError(
          'Cannot delete category with existing products. Please reassign or delete products first.',
          400
        );
      }

      await this.collection.doc(id).delete();
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      console.error('Delete category error:', error);
      throw new AppError('Failed to delete category', 500);
    }
  }

  /**
   * Get product count for each category
   */
  async getCategoriesWithProductCount(): Promise<Array<Category & { productCount: number }>> {
    try {
      const categories = await this.getAllCategories();

      const categoriesWithCount = await Promise.all(
        categories.map(async (category) => {
          const productsSnapshot = await this.productsCollection
            .where('category', '==', category.slug)
            .get();

          return {
            ...category,
            productCount: productsSnapshot.size,
          };
        })
      );

      return categoriesWithCount;
    } catch (error) {
      console.error('Get categories with count error:', error);
      throw new AppError('Failed to fetch categories', 500);
    }
  }
}

export default new CategoryService();
