import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import configurations (to initialize them)
import './config/firebase';
import './config/email';
import './config/cloudinary';
import { setupSwagger } from './config/swagger';
import { stream } from './config/logger';

// Import types
import { ApiResponse } from './types';

// Import middleware
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Create Express app
const app: Application = express();

// ============================================
// MIDDLEWARE
// ============================================

// Security headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  })
);

// Request logging with Winston
app.use(
  morgan(
    process.env.NODE_ENV === 'development' ? 'dev' : 'combined',
    { stream }
  )
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// ============================================
// HEALTH CHECK
// ============================================

app.get('/health', (_req: Request, res: Response) => {
  const response: ApiResponse = {
    success: true,
    message: 'Server is healthy',
    data: {
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
    },
  };
  res.json(response);
});

// ============================================
// API INFO
// ============================================

app.get('/api', (_req: Request, res: Response) => {
  const response: ApiResponse = {
    success: true,
    message: '🌸 Welcome to Framel API',
    data: {
      version: '1.0.0',
      documentation: '/api-docs',
      endpoints: {
        health: '/health',
        auth: '/api/auth',
        products: '/api/products',
        categories: '/api/categories',
        orders: '/api/orders',
        cart: '/api/cart',
        payment: '/api/payment',
        admin: '/api/admin',
        reviews: '/api/reviews',
        wishlist: '/api/wishlist',
      },
    },
  };
  res.json(response);
});

// ============================================
// API DOCUMENTATION
// ============================================

setupSwagger(app);

// ============================================
// API ROUTES
// ============================================

// Import routes
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import cartRoutes from './routes/cart.routes';
import orderRoutes from './routes/order.routes';
import paymentRoutes from './routes/payment.routes';
import reviewRoutes from './routes/review.routes';
import wishlistRoutes from './routes/wishlist.routes';
import adminRoutes from './routes/admin.routes';

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/admin', adminRoutes);

// ============================================
// ERROR HANDLERS
// ============================================

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;

 
