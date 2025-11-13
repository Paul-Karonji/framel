import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

// Custom error class
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('❌ Error:', err);

  // Default error
  let statusCode = 500;
  let message = 'Internal server error';
  let isOperational = false;

  // Handle known errors
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  }

  // Firebase errors
  if (err.name === 'FirebaseError') {
    statusCode = 400;
    message = err.message;
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Invalid or expired token';
  }

  const response: ApiResponse = {
    success: false,
    error: message,
    message: isOperational ? message : 'An error occurred processing your request',
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.data = {
      stack: err.stack,
      name: err.name,
    };
  }

  res.status(statusCode).json(response);
};

// Async error wrapper
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 handler
export const notFoundHandler = (req: Request, res: Response) => {
  const response: ApiResponse = {
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.path}`,
  };
  res.status(404).json(response);
};
