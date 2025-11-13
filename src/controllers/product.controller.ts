import { Request, Response } from 'express';
import productService from '../services/product.service';
import { ApiResponse, CreateProductRequest, UpdateProductRequest } from '../types';
import { asyncHandler } from '../middleware/errorHandler';

/**
 * Product Controller
 * Handles HTTP requests for product endpoints
 */
class ProductController {
  /**
   * Create new product
   * POST /api/products
   */
  createProduct = asyncHandler(async (req: Request, res: Response) => {
    const data: CreateProductRequest = req.body;

    const product = await productService.createProduct(data);

    const response: ApiResponse = {
      success: true,
      message: 'Product created successfully',
      data: { product },
    };

    return res.status(201).json(response);
  });

  /**
   * Get all products with filters
   * GET /api/products
   */
  getAllProducts = asyncHandler(async (req: Request, res: Response) => {
    const {
      page,
      limit,
      category,
      search,
      minPrice,
      maxPrice,
      featured,
      inStock,
      sortBy,
      sortOrder,
    } = req.query;

    const options = {
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      category: category as string,
      search: search as string,
      minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
      featured: featured === 'true',
      inStock: inStock === 'true',
      sortBy: sortBy as 'price' | 'date' | 'rating',
      sortOrder: sortOrder as 'asc' | 'desc',
    };

    const result = await productService.getAllProducts(options);

    const response: ApiResponse = {
      success: true,
      data: result,
    };

    return res.json(response);
  });

  /**
   * Get product by ID
   * GET /api/products/:id
   */
  getProductById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const product = await productService.getProductById(id);

    const response: ApiResponse = {
      success: true,
      data: { product },
    };

    return res.json(response);
  });

  /**
   * Update product
   * PUT /api/products/:id
   */
  updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates: UpdateProductRequest = req.body;

    const product = await productService.updateProduct(id, updates);

    const response: ApiResponse = {
      success: true,
      message: 'Product updated successfully',
      data: { product },
    };

    return res.json(response);
  });

  /**
   * Delete product
   * DELETE /api/products/:id
   */
  deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    await productService.deleteProduct(id);

    const response: ApiResponse = {
      success: true,
      message: 'Product deleted successfully',
    };

    return res.json(response);
  });

  /**
   * Upload product images
   * POST /api/products/:id/images
   */
  uploadImages = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // In a real implementation, you'd use multer middleware to handle file uploads
    // For now, we'll assume images are base64 encoded in the request body
    const { images } = req.body; // Array of base64 strings

    if (!images || !Array.isArray(images)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid images',
        message: 'Please provide an array of base64 encoded images',
      } as ApiResponse);
    }

    // Convert base64 to buffers
    const imageBuffers = images.map((base64: string) =>
      Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ''), 'base64')
    );

    const imageURLs = await productService.uploadProductImages(id, imageBuffers);

    const response: ApiResponse = {
      success: true,
      message: 'Images uploaded successfully',
      data: { imageURLs },
    };

    return res.json(response);
  });

  /**
   * Get products by category
   * GET /api/products/category/:category
   */
  getProductsByCategory = asyncHandler(async (req: Request, res: Response) => {
    const { category } = req.params;

    const products = await productService.getProductsByCategory(category);

    const response: ApiResponse = {
      success: true,
      data: { products, count: products.length },
    };

    return res.json(response);
  });

  /**
   * Toggle featured status
   * PATCH /api/products/:id/featured
   */
  toggleFeatured = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const product = await productService.toggleFeatured(id);

    const response: ApiResponse = {
      success: true,
      message: `Product ${product.featured ? 'featured' : 'unfeatured'} successfully`,
      data: { product },
    };

    return res.json(response);
  });

  /**
   * Update stock
   * PATCH /api/products/:id/stock
   */
  updateStock = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid quantity',
        message: 'Please provide a valid quantity',
      } as ApiResponse);
    }

    const product = await productService.updateStock(id, quantity);

    const response: ApiResponse = {
      success: true,
      message: 'Stock updated successfully',
      data: { product },
    };

    return res.json(response);
  });

  /**
   * Get featured products
   * GET /api/products/featured
   */
  getFeaturedProducts = asyncHandler(async (req: Request, res: Response) => {
    const { limit } = req.query;
    const limitNum = limit ? parseInt(limit as string) : 10;

    const products = await productService.getFeaturedProducts(limitNum);

    const response: ApiResponse = {
      success: true,
      data: { products, count: products.length },
    };

    return res.json(response);
  });
}

export default new ProductController();
