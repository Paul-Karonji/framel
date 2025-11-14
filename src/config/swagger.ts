import swaggerJsdoc from 'swagger-jsdoc';
import { Application } from 'express';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Framel Flowers API Documentation',
      version: '1.0.0',
      description:
        'Complete REST API documentation for Framel Online Flower Shop e-commerce platform',
      contact: {
        name: 'Framel Support',
        email: 'support@framel.co.ke',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
      {
        url: 'https://api.framel.co.ke',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your Firebase JWT token',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
            error: {
              type: 'object',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            uid: {
              type: 'string',
              example: 'firebase-uid-123',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com',
            },
            name: {
              type: 'string',
              example: 'John Doe',
            },
            phone: {
              type: 'string',
              example: '+254712345678',
            },
            role: {
              type: 'string',
              enum: ['customer', 'admin'],
              example: 'customer',
            },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'prod-123',
            },
            name: {
              type: 'string',
              example: 'Red Roses Bouquet',
            },
            description: {
              type: 'string',
              example: 'Beautiful fresh red roses',
            },
            price: {
              type: 'number',
              example: 2500,
            },
            category: {
              type: 'string',
              example: 'roses',
            },
            stock: {
              type: 'number',
              example: 50,
            },
            imageURLs: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['https://example.com/image1.jpg'],
            },
            featured: {
              type: 'boolean',
              example: true,
            },
            rating: {
              type: 'number',
              example: 4.5,
            },
            reviewCount: {
              type: 'number',
              example: 25,
            },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'ord-123',
            },
            orderId: {
              type: 'string',
              example: 'FRM-20251114-0001',
            },
            userId: {
              type: 'string',
              example: 'user-123',
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  productId: { type: 'string' },
                  name: { type: 'string' },
                  price: { type: 'number' },
                  quantity: { type: 'number' },
                  imageURL: { type: 'string' },
                },
              },
            },
            subtotal: {
              type: 'number',
              example: 5000,
            },
            deliveryFee: {
              type: 'number',
              example: 300,
            },
            total: {
              type: 'number',
              example: 5300,
            },
            orderStatus: {
              type: 'string',
              enum: ['processing', 'confirmed', 'dispatched', 'delivered', 'cancelled'],
              example: 'processing',
            },
            paymentStatus: {
              type: 'string',
              enum: ['pending', 'completed', 'failed'],
              example: 'pending',
            },
            paymentMethod: {
              type: 'string',
              example: 'mpesa',
            },
          },
        },
        Cart: {
          type: 'object',
          properties: {
            userId: {
              type: 'string',
              example: 'user-123',
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  productId: { type: 'string' },
                  quantity: { type: 'number' },
                  price: { type: 'number' },
                },
              },
            },
            subtotal: {
              type: 'number',
              example: 5000,
            },
            deliveryFee: {
              type: 'number',
              example: 300,
            },
            total: {
              type: 'number',
              example: 5300,
            },
          },
        },
        Review: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'review-123',
            },
            productId: {
              type: 'string',
              example: 'prod-123',
            },
            userId: {
              type: 'string',
              example: 'user-123',
            },
            rating: {
              type: 'number',
              minimum: 1,
              maximum: 5,
              example: 5,
            },
            comment: {
              type: 'string',
              example: 'Great flowers!',
            },
            userName: {
              type: 'string',
              example: 'John Doe',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Auth',
        description: 'Authentication and user management endpoints',
      },
      {
        name: 'Products',
        description: 'Product catalog management',
      },
      {
        name: 'Categories',
        description: 'Product category management',
      },
      {
        name: 'Cart',
        description: 'Shopping cart operations',
      },
      {
        name: 'Orders',
        description: 'Order management and tracking',
      },
      {
        name: 'Payments',
        description: 'M-Pesa payment integration',
      },
      {
        name: 'Reviews',
        description: 'Product reviews and ratings',
      },
      {
        name: 'Wishlist',
        description: 'User wishlist management',
      },
      {
        name: 'Admin',
        description: 'Admin dashboard and analytics',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Path to API docs
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Application): void => {
  // Swagger page
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Framel API Docs',
  }));

  // Docs in JSON format
  app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log('✅ Swagger documentation available at /api-docs');
};

export default swaggerSpec;
