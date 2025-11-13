import { Request, Response } from 'express';
import categoryService from '../services/category.service';
import { ApiResponse } from '../types';
import { asyncHandler } from '../middleware/errorHandler';

/**
 * Category Controller
 * Handles HTTP requests for category endpoints
 */
class CategoryController {
  /**
   * Create new category
   * POST /api/categories
   */
  createCategory = asyncHandler(async (req: Request, res: Response) => {
    const { name, description, imageURL, order } = req.body;

    const category = await categoryService.createCategory({
      name,
      description,
      imageURL,
      order,
    });

    const response: ApiResponse = {
      success: true,
      message: 'Category created successfully',
      data: { category },
    };

    return res.status(201).json(response);
  });

  /**
   * Get all categories
   * GET /api/categories
   */
  getAllCategories = asyncHandler(async (_req: Request, res: Response) => {
    const categories = await categoryService.getAllCategories();

    const response: ApiResponse = {
      success: true,
      data: { categories, count: categories.length },
    };

    return res.json(response);
  });

  /**
   * Get categories with product count
   * GET /api/categories/with-count
   */
  getCategoriesWithCount = asyncHandler(async (_req: Request, res: Response) => {
    const categories = await categoryService.getCategoriesWithProductCount();

    const response: ApiResponse = {
      success: true,
      data: { categories, count: categories.length },
    };

    return res.json(response);
  });

  /**
   * Get category by ID
   * GET /api/categories/:id
   */
  getCategoryById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const category = await categoryService.getCategoryById(id);

    const response: ApiResponse = {
      success: true,
      data: { category },
    };

    return res.json(response);
  });

  /**
   * Get category by slug
   * GET /api/categories/slug/:slug
   */
  getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;

    const category = await categoryService.getCategoryBySlug(slug);

    const response: ApiResponse = {
      success: true,
      data: { category },
    };

    return res.json(response);
  });

  /**
   * Update category
   * PUT /api/categories/:id
   */
  updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;

    const category = await categoryService.updateCategory(id, updates);

    const response: ApiResponse = {
      success: true,
      message: 'Category updated successfully',
      data: { category },
    };

    return res.json(response);
  });

  /**
   * Delete category
   * DELETE /api/categories/:id
   */
  deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    await categoryService.deleteCategory(id);

    const response: ApiResponse = {
      success: true,
      message: 'Category deleted successfully',
    };

    return res.json(response);
  });
}

export default new CategoryController();
