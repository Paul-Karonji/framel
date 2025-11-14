# 🌸 Framel Backend API

Express.js + TypeScript backend for Framel Online Flower Shop with Firebase, M-Pesa, and Cloudinary integrations.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Firebase Admin SDK credentials
- M-Pesa Daraja API credentials (sandbox or production)
- Cloudinary account
- Gmail account with app password (for SMTP)

## 🔧 Environment Setup

The `.env` file is already configured with all credentials. No setup needed!

**Configured Services:**
- ✅ Firebase Admin SDK
- ✅ M-Pesa Daraja API (Sandbox)
- ✅ Cloudinary
- ✅ Gmail SMTP

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/                  # API configurations
│   │   ├── firebase.ts          # Firebase Admin SDK
│   │   ├── mpesa.ts             # M-Pesa integration
│   │   ├── cloudinary.ts        # Image service
│   │   ├── email.ts             # Email service
│   │   ├── swagger.ts           # Swagger/OpenAPI docs
│   │   └── logger.ts            # Winston logger
│   ├── middleware/              # Express middleware
│   │   ├── auth.ts              # Authentication
│   │   ├── errorHandler.ts      # Error handling
│   │   └── validation.ts        # Request validation
│   ├── routes/                  # API routes
│   │   ├── auth.routes.ts       # Auth endpoints
│   │   ├── product.routes.ts    # Product endpoints
│   │   ├── category.routes.ts   # Category endpoints
│   │   ├── cart.routes.ts       # Cart endpoints
│   │   ├── order.routes.ts      # Order endpoints
│   │   ├── payment.routes.ts    # Payment endpoints
│   │   ├── review.routes.ts     # Review endpoints
│   │   ├── wishlist.routes.ts   # Wishlist endpoints
│   │   └── admin.routes.ts      # Admin endpoints
│   ├── controllers/             # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── product.controller.ts
│   │   ├── category.controller.ts
│   │   ├── cart.controller.ts
│   │   ├── order.controller.ts
│   │   ├── payment.controller.ts
│   │   ├── review.controller.ts
│   │   ├── wishlist.controller.ts
│   │   └── admin.controller.ts
│   ├── services/                # Business logic
│   │   ├── auth.service.ts
│   │   ├── product.service.ts
│   │   ├── category.service.ts
│   │   ├── cart.service.ts
│   │   ├── order.service.ts
│   │   ├── payment.service.ts
│   │   ├── review.service.ts
│   │   ├── wishlist.service.ts
│   │   ├── analytics.service.ts
│   │   └── email.service.ts
│   ├── types/                   # TypeScript types
│   │   └── index.ts
│   ├── app.ts                   # Express app setup
│   └── server.ts                # Server entry point
├── tests/                       # Test files
│   ├── setup.ts                 # Jest setup & mocks
│   └── services/                # Service tests
│       ├── auth.service.test.ts
│       ├── product.service.test.ts
│       ├── order.service.test.ts
│       └── cart.service.test.ts
├── logs/                        # Winston log files
│   ├── error.log                # Error logs
│   ├── combined.log             # All logs
│   └── http.log                 # HTTP request logs
├── jest.config.js               # Jest configuration
├── .env                         # Environment variables
├── .gitignore                  # Git ignore rules
├── package.json
├── tsconfig.json
└── README.md
```

## 📡 API Endpoints

### Health & Info

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api` | API information |

### Authentication (`/api/auth`)

#### Public Endpoints

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | `{ email, password, name, phone }` |
| POST | `/api/auth/reset-password` | Send password reset email | `{ email }` |

#### Protected Endpoints (Requires Auth Token)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/auth/profile` | Get user profile | User |
| PUT | `/api/auth/profile` | Update profile | User |
| DELETE | `/api/auth/account` | Delete account | User |
| POST | `/api/auth/verify-email` | Send verification email | User |
| GET | `/api/auth/check-admin` | Check admin status | User |

#### Admin Endpoints (Requires Admin Token)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/auth/users/:uid` | Get user by ID | Admin |
| PUT | `/api/auth/users/:uid/role` | Set user role | Admin |

### Products (`/api/products`)

#### Public Endpoints

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| GET | `/api/products` | Get all products | `page`, `limit`, `category`, `search`, `minPrice`, `maxPrice`, `featured`, `inStock`, `sortBy`, `sortOrder` |
| GET | `/api/products/featured` | Get featured products | `limit` |
| GET | `/api/products/category/:category` | Get products by category | - |
| GET | `/api/products/:id` | Get product by ID | - |

#### Admin Endpoints (Requires Admin Token)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/products` | Create new product | Admin |
| PUT | `/api/products/:id` | Update product | Admin |
| DELETE | `/api/products/:id` | Delete product | Admin |
| POST | `/api/products/:id/images` | Upload product images | Admin |
| PATCH | `/api/products/:id/featured` | Toggle featured status | Admin |
| PATCH | `/api/products/:id/stock` | Update stock | Admin |

### Categories (`/api/categories`)

#### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |
| GET | `/api/categories/with-count` | Get categories with product count |
| GET | `/api/categories/slug/:slug` | Get category by slug |
| GET | `/api/categories/:id` | Get category by ID |

#### Admin Endpoints (Requires Admin Token)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/categories` | Create new category | Admin |
| PUT | `/api/categories/:id` | Update category | Admin |
| DELETE | `/api/categories/:id` | Delete category | Admin |

### Shopping Cart (`/api/cart`)

#### Cart Operations (Optional Auth)
Supports both authenticated users and guest carts. Guest users should pass `guestId` in request body or query.

| Method | Endpoint | Description | Body/Query |
|--------|----------|-------------|------------|
| GET | `/api/cart` | Get cart with totals | `?guestId=<uuid>` (optional) |
| POST | `/api/cart/items` | Add item to cart | `{ productId, quantity, guestId? }` |
| PUT | `/api/cart/items/:productId` | Update item quantity | `{ quantity, guestId? }` |
| DELETE | `/api/cart/items/:productId` | Remove item from cart | `?guestId=<uuid>` (optional) |
| DELETE | `/api/cart` | Clear cart | `?guestId=<uuid>` (optional) |
| GET | `/api/cart/validate` | Validate cart (check stock/prices) | `?guestId=<uuid>` (optional) |

#### Authenticated Cart Operations

| Method | Endpoint | Description | Auth | Body |
|--------|----------|-------------|------|------|
| POST | `/api/cart/sync` | Sync guest cart to user cart | User | `{ guestId }` |

### Orders (`/api/orders`)

#### User Order Operations (Requires Auth)

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/orders` | Create order from cart | `{ items, deliveryAddress, deliveryDate, paymentMethod }` |
| GET | `/api/orders/user/me` | Get my orders | Query: `page`, `limit`, `status` |
| GET | `/api/orders/:id` | Get order by ID | - |
| GET | `/api/orders/order/:orderId` | Get order by order ID (FRM-xxx) | - |
| POST | `/api/orders/:id/cancel` | Cancel unpaid order | - |

#### Admin Order Operations (Requires Admin)

| Method | Endpoint | Description | Body/Query |
|--------|----------|-------------|------------|
| GET | `/api/orders` | Get all orders | Query: `page`, `limit`, `status`, `paymentStatus` |
| GET | `/api/orders/stats` | Get order statistics | - |
| PATCH | `/api/orders/:id/status` | Update order status | `{ status }` |

### Payments (`/api/payment`)

#### M-Pesa Payment Operations (Requires Auth)

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/payment/mpesa/initiate` | Initiate M-Pesa STK Push | `{ orderId, phone, amount }` |
| GET | `/api/payment/mpesa/status/:checkoutRequestId` | Query payment status | - |

#### M-Pesa Callbacks (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payment/mpesa/callback` | M-Pesa payment callback (automated) |

#### Admin Payment Operations (Requires Admin)

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/payment/verify` | Manually verify payment | `{ orderId, mpesaReceiptNumber }` |

### Reviews (`/api/reviews`)

#### Public Review Operations

| Method | Endpoint | Description | Query |
|--------|----------|-------------|-------|
| GET | `/api/reviews/product/:productId` | Get product reviews | `page`, `limit`, `sortBy`, `sortOrder` |
| GET | `/api/reviews/product/:productId/stats` | Get review statistics | - |
| GET | `/api/reviews/:id` | Get review by ID | - |

#### User Review Operations (Requires Auth)

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/reviews` | Create review | `{ productId, rating, comment, images? }` |
| GET | `/api/reviews/user/me` | Get my reviews | Query: `page`, `limit` |
| GET | `/api/reviews/check/:productId` | Check if reviewed | - |
| PUT | `/api/reviews/:id` | Update review | `{ rating?, comment?, images? }` |
| DELETE | `/api/reviews/:id` | Delete review | - |

#### Admin Review Operations (Requires Admin)

| Method | Endpoint | Description | Query |
|--------|----------|-------------|-------|
| GET | `/api/reviews` | Get all reviews | `page`, `limit`, `productId`, `minRating`, `maxRating` |

### Wishlist (`/api/wishlist`)

#### Wishlist Operations (Requires Auth)

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/api/wishlist` | Get wishlist with products | - |
| GET | `/api/wishlist/count` | Get wishlist item count | - |
| GET | `/api/wishlist/check/:productId` | Check if in wishlist | - |
| POST | `/api/wishlist/items` | Add to wishlist | `{ productId }` |
| DELETE | `/api/wishlist/items/:productId` | Remove from wishlist | - |
| DELETE | `/api/wishlist` | Clear wishlist | - |
| POST | `/api/wishlist/move-to-cart` | Move items to cart | `{ productIds: string[] }` |

### Admin Dashboard & Analytics (`/api/admin`)

**All admin endpoints require admin authentication**

#### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard/stats` | Get dashboard overview (revenue, orders, users, growth) |

#### Analytics

| Method | Endpoint | Description | Query |
|--------|----------|-------------|-------|
| GET | `/api/admin/analytics/sales` | Get sales analytics by period | `period` (day/week/month/year), `limit` |
| GET | `/api/admin/analytics/top-products` | Get top selling products | `limit` |
| GET | `/api/admin/analytics/users` | Get user statistics & top customers | - |
| GET | `/api/admin/analytics/revenue-by-category` | Get revenue breakdown by category | - |

#### Inventory Management

| Method | Endpoint | Description | Query |
|--------|----------|-------------|-------|
| GET | `/api/admin/inventory/low-stock` | Get low stock products | `threshold` (default: 10) |

#### Order Management

| Method | Endpoint | Description | Query |
|--------|----------|-------------|-------|
| GET | `/api/admin/orders/recent` | Get recent orders | `limit` (default: 10) |

## 🔐 Authentication

### Getting Started

1. **Register a new user:**
   ```bash
   POST /api/auth/register
   {
     "email": "user@example.com",
     "password": "SecurePass123",
     "name": "John Doe",
     "phone": "254712345678"
   }
   ```

2. **Login with Firebase Client SDK** (frontend):
   ```typescript
   import { signInWithEmailAndPassword } from 'firebase/auth';
   const userCredential = await signInWithEmailAndPassword(auth, email, password);
   const idToken = await userCredential.user.getIdToken();
   ```

3. **Use token in requests:**
   ```bash
   Authorization: Bearer <idToken>
   ```

### Token Verification

All protected routes verify Firebase ID tokens automatically.

## 🛠️ Development Scripts

```bash
npm run dev       # Start with hot reload
npm run build     # Build TypeScript
npm start         # Start production server
npm test          # Run tests
npm run lint      # Lint code
npm run format    # Format with Prettier
```

## 🔒 Security Features

- ✅ Helmet.js for security headers
- ✅ CORS configuration
- ✅ Rate limiting (100 req/15min)
- ✅ Input validation with Zod
- ✅ Firebase token verification
- ✅ Role-based access control

## 📧 Email Templates

The backend includes beautiful HTML email templates for:
- Welcome emails
- Password reset
- Email verification

## 💳 M-Pesa Integration

Currently configured for **sandbox mode**:
- Shortcode: 174379
- Any Kenyan phone number works
- Any PIN succeeds

For production:
1. Update `MPESA_ENVIRONMENT` to `production`
2. Update credentials with production keys
3. Update callback URL

## 🖼️ Image Upload (Cloudinary)

```typescript
import { uploadImage, deleteImage } from './config/cloudinary';

// Upload image
const result = await uploadImage(imageBuffer, 'products');
console.log(result.url); // Cloudinary URL

// Delete image
await deleteImage(result.publicId);
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm run test:watch
```

## 📊 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "message": "User-friendly message"
}
```

## 🐛 Debugging

Development mode includes:
- Morgan HTTP logging
- Detailed error messages
- Source maps
- Stack traces

## 🚀 Deployment

### Render.com

1. Push code to GitHub
2. Create new Web Service
3. Connect repository
4. Set build command: `npm install && npm run build`
5. Set start command: `npm start`
6. Add environment variables from `.env`
7. Deploy

### Environment Variables for Production

Update these for production:
- `NODE_ENV=production`
- `CORS_ORIGIN` (your frontend URL)
- `JWT_SECRET` (generate new secret)
- `SESSION_SECRET` (generate new secret)
- `MPESA_ENVIRONMENT=production`
- Update M-Pesa credentials

## 🆘 Troubleshooting

### Server won't start
```bash
# Check Node version
node --version  # Should be 18+

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Firebase connection error
- Verify `FIREBASE_PRIVATE_KEY` formatting in `.env`
- Ensure newlines (`\n`) are preserved
- Check Firebase project ID

### Email not sending
- Remove spaces from Gmail app password
- Verify 2FA is enabled on Gmail
- Generate new app password if needed

### TypeScript errors
```bash
# Clean build
rm -rf dist
npm run build
```

## 📚 Next Steps

### Phase 3: Product & Category Management ✅ COMPLETE
- [x] Product CRUD endpoints
- [x] Category management (CRUD + product count)
- [x] Product search & filters (category, price, featured, stock)
- [x] Image upload integration (Cloudinary)
- [x] Stock management
- [x] Featured products toggle
- [x] Sorting and pagination

### Phase 4: Shopping Cart ✅ COMPLETE
- [x] Cart service with full business logic
- [x] Cart CRUD operations (add, update, remove, clear)
- [x] Guest cart support
- [x] Cart synchronization (guest → user on login)
- [x] Stock validation
- [x] Price calculation (subtotal, delivery fee, total)
- [x] Cart validation (check stock & price changes)
- [x] Cart routes & controller (API endpoints)
- [x] Support for both authenticated and guest users

### Phase 5: Orders & Payments ✅ COMPLETE
- [x] Order service with business logic
- [x] Order creation from cart with validation
- [x] Order ID generation (FRM-YYYYMMDD-XXXX format)
- [x] Stock management (reduce on order, restore on cancel)
- [x] M-Pesa STK Push integration
- [x] Payment callbacks & verification
- [x] Order status management (processing → delivered)
- [x] Order tracking & history
- [x] Order statistics for admin
- [x] **Email notifications (order confirmation, status updates)** - Completed in Phase 8

### Phase 6: Reviews & Wishlist ✅ COMPLETE
- [x] Product reviews & ratings
- [x] Review CRUD operations
- [x] Automatic rating calculation & product updates
- [x] Review statistics (average, distribution)
- [x] Review moderation (admin can delete any review)
- [x] Wishlist CRUD operations
- [x] Wishlist with full product details
- [x] Move wishlist items to cart
- [x] Check if product reviewed/wishlisted

### Phase 7: Admin Dashboard & Analytics ✅ COMPLETE
- [x] Dashboard overview statistics (revenue, orders, users, growth)
- [x] Sales analytics by period (day, week, month, year)
- [x] Top selling products analysis
- [x] User statistics & top customers
- [x] Revenue breakdown by category
- [x] Low stock products alerts
- [x] Recent orders dashboard
- [ ] **Advanced user management (ban/unban)** - TODO Phase 7.1
- [ ] **Export reports to CSV/PDF** - TODO Phase 7.1

### Phase 8: Enhancements & Production ✅ COMPLETE
- [x] **Email Notifications System**
  - [x] Order confirmation emails with beautiful HTML templates
  - [x] Order status update emails (processing, confirmed, dispatched, delivered, cancelled)
  - [x] Payment confirmation emails
  - [x] Order cancellation emails with refund information
  - [x] Responsive email design with brand styling
- [x] **Unit & Integration Tests (Jest)**
  - [x] Jest configuration with ts-jest
  - [x] Test setup with Firebase, Cloudinary, Nodemailer mocks
  - [x] Auth service tests (validation, roles, errors)
  - [x] Product service tests (validation, search, ratings)
  - [x] Order service tests (ID generation, calculations, status)
  - [x] Cart service tests (calculations, items, guest cart)
- [x] **API Documentation (Swagger/OpenAPI)**
  - [x] Swagger UI setup at `/api-docs`
  - [x] Complete API schema definitions
  - [x] Authentication documentation
  - [x] All endpoints documented with examples
- [x] **Logging & Monitoring (Winston)**
  - [x] Winston logger with multiple transports
  - [x] Log levels (error, warn, info, http, debug)
  - [x] File logging (error.log, combined.log, http.log)
  - [x] Colored console output
  - [x] Integrated with Morgan for HTTP requests
- [ ] Performance optimization (Future)
- [ ] Caching layer (Redis) (Future)
- [ ] File upload via multipart/form-data (Multer) (Future)
- [ ] Database backups (Future)
- [ ] CI/CD pipeline (Future)

## 📞 Support

For issues or questions:
1. Check error logs in console
2. Review documentation in `/docs`
3. Verify environment variables
4. Check Firebase, M-Pesa, Cloudinary dashboards

---

## 📊 Current Project Status

**Phase 1: Foundation** ✅ **COMPLETE**
- Express + TypeScript setup
- Firebase, M-Pesa, Cloudinary, Email integrations
- Security middleware & error handling

**Phase 2: Authentication** ✅ **COMPLETE**
- User registration & authentication
- Role-based access control (customer/admin)
- Profile management

**Phase 3: Product & Category Management** ✅ **COMPLETE**
- Full product CRUD with search, filters, pagination
- Category management system
- Image upload integration

**Phase 4: Shopping Cart** ✅ **COMPLETE**
- Full cart service with guest support
- Complete API endpoints for cart operations
- Cart validation and synchronization

**Phase 5: Orders & Payments** ✅ **COMPLETE**
- Order management system with unique IDs
- M-Pesa STK Push payment integration
- Order tracking and status management
- Payment callbacks and verification

**Phase 6: Reviews & Wishlist** ✅ **COMPLETE**
- Product reviews and ratings system
- Wishlist management
- Automatic product rating updates
- Review statistics and moderation

**Phase 7: Admin Dashboard & Analytics** ✅ **COMPLETE**
- Comprehensive business analytics
- Sales reports and revenue tracking
- Top products and customer insights
- Inventory management alerts

**Phase 8: Enhancements & Production** ✅ **COMPLETE**
- ✅ Email Notifications System
  - Order confirmation, status updates, payment confirmation, cancellation emails
  - Beautiful HTML templates with responsive design
- ✅ Unit & Integration Tests (Jest)
  - 4 test suites covering Auth, Products, Orders, Cart
  - Comprehensive validation and calculation tests
- ✅ API Documentation (Swagger/OpenAPI)
  - Interactive API docs at /api-docs
  - Complete schema definitions for all endpoints
- ✅ Logging & Monitoring (Winston)
  - Multi-level logging with file and console transports
  - Integrated HTTP request logging

---

**Current Focus:** All 8 development phases complete! Ready for production deployment. 🎉

🌸 Happy coding!
