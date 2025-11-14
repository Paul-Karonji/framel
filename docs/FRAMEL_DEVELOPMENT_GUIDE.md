# 🌸 Framel Development Guide

**Complete Build Documentation for Online Flower Shop**

Version: 1.0  
Last Updated: November 13, 2025

---

## 📑 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Phase-by-Phase Implementation](#phase-by-phase-implementation)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Authentication Flow](#authentication-flow)
8. [Payment Integration](#payment-integration)
9. [Deployment Strategy](#deployment-strategy)
10. [Testing Strategy](#testing-strategy)
11. [Security Considerations](#security-considerations)
12. [Environment Variables](#environment-variables)

---

## 1. Project Overview

### Purpose
Framel is a full-stack e-commerce platform for ordering flowers online with integrated Mpesa payments, user personalization, and comprehensive admin management.

### Key Features
- **Customer Portal**: Browse, search, cart, checkout with Mpesa
- **User Management**: Guest and registered user flows
- **Admin Dashboard**: Product, order, and inventory management
- **Real-time Updates**: Order tracking and status updates
- **Personalization**: Wishlists, order history, preferences

### User Roles
1. **Guest Users**: Browse and purchase without account
2. **Registered Users**: Full features with persistent data
3. **Admin Users**: Management and analytics access

---

## 2. Technology Stack

### Frontend
```
Framework: Next.js 14+ (App Router)
Language: TypeScript
Styling: Tailwind CSS
State Management: Context API + React Query
UI Components: shadcn/ui
Form Handling: React Hook Form + Zod
HTTP Client: Axios
```

### Backend
```
Runtime: Node.js 18+
Framework: Express.js
Language: TypeScript
Authentication: Firebase Admin SDK
Payment: Mpesa Daraja API
Email: Nodemailer
Validation: Zod
```

### Database & Services
```
Database: Firebase Firestore
Authentication: Firebase Auth
File Storage: Firebase Storage
Hosting: Vercel (Frontend) + Render (Backend)
```

### Development Tools
```
Version Control: Git
Package Manager: npm/yarn
Code Formatting: Prettier
Linting: ESLint
Testing: Jest + React Testing Library
API Testing: Postman/Thunder Client
```

---

## 3. Project Structure

### Root Structure
```
framel/
├── frontend/                 # Next.js application
├── backend/                  # Express.js API
├── docs/                     # Documentation
├── shared/                   # Shared types/utilities
├── .gitignore
├── README.md
└── package.json
```

### Frontend Structure (`/frontend`)
```
frontend/
├── public/
│   ├── images/              # Static images
│   └── favicon.ico
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (shop)/
│   │   │   ├── products/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   └── order-success/
│   │   ├── (user)/
│   │   │   ├── dashboard/
│   │   │   ├── orders/
│   │   │   ├── wishlist/
│   │   │   └── profile/
│   │   ├── (admin)/
│   │   │   ├── dashboard/
│   │   │   ├── products/
│   │   │   ├── orders/
│   │   │   └── customers/
│   │   ├── layout.tsx
│   │   ├── page.tsx          # Home page
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/              # shadcn components
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navbar.tsx
│   │   ├── product/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductDetails.tsx
│   │   │   └── ProductFilters.tsx
│   │   ├── cart/
│   │   │   ├── CartItem.tsx
│   │   │   ├── CartSummary.tsx
│   │   │   └── MiniCart.tsx
│   │   ├── checkout/
│   │   │   ├── CheckoutForm.tsx
│   │   │   ├── PaymentSection.tsx
│   │   │   └── DeliveryForm.tsx
│   │   └── admin/
│   │       ├── ProductForm.tsx
│   │       ├── OrderTable.tsx
│   │       └── StatsCard.tsx
│   ├── lib/
│   │   ├── firebase.ts       # Firebase config
│   │   ├── api.ts            # API client
│   │   └── utils.ts          # Utility functions
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   ├── useProducts.ts
│   │   └── useOrders.ts
│   ├── types/
│   │   ├── product.ts
│   │   ├── user.ts
│   │   ├── order.ts
│   │   └── cart.ts
│   └── styles/
│       └── colors.ts         # Design system colors
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### Backend Structure (`/backend`)
```
backend/
├── src/
│   ├── config/
│   │   ├── firebase.ts       # Firebase Admin setup
│   │   ├── mpesa.ts          # Mpesa configuration
│   │   └── database.ts       # Firestore setup
│   ├── middleware/
│   │   ├── auth.ts           # JWT/Firebase auth middleware
│   │   ├── validation.ts     # Request validation
│   │   ├── errorHandler.ts   # Global error handler
│   │   └── rateLimiter.ts    # Rate limiting
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── products.routes.ts
│   │   ├── orders.routes.ts
│   │   ├── cart.routes.ts
│   │   ├── users.routes.ts
│   │   ├── payment.routes.ts
│   │   └── admin.routes.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── products.controller.ts
│   │   ├── orders.controller.ts
│   │   ├── cart.controller.ts
│   │   ├── users.controller.ts
│   │   ├── payment.controller.ts
│   │   └── admin.controller.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── product.service.ts
│   │   ├── order.service.ts
│   │   ├── cart.service.ts
│   │   ├── user.service.ts
│   │   ├── payment.service.ts
│   │   ├── email.service.ts
│   │   └── notification.service.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Product.ts
│   │   ├── Order.ts
│   │   └── Cart.ts
│   ├── utils/
│   │   ├── validators.ts
│   │   ├── helpers.ts
│   │   └── constants.ts
│   ├── types/
│   │   └── index.ts
│   ├── app.ts                # Express app setup
│   └── server.ts             # Server entry point
├── tests/
│   ├── unit/
│   └── integration/
├── .env
├── .env.example
├── tsconfig.json
└── package.json
```

---

## 4. Phase-by-Phase Implementation

### 🎯 Phase 1: Project Setup & Configuration (Days 1-2)

#### 1.1 Initialize Projects
```bash
# Create root directory
mkdir framel && cd framel

# Initialize frontend
npx create-next-app@latest frontend --typescript --tailwind --app
cd frontend
npm install axios react-hook-form zod @hookform/resolvers
npm install firebase
npm install @radix-ui/react-* # shadcn components

# Initialize backend
cd ../
mkdir backend && cd backend
npm init -y
npm install express cors dotenv
npm install firebase-admin
npm install -D typescript @types/express @types/node ts-node nodemon
npx tsc --init
```

#### 1.2 Firebase Setup
1. Create Firebase project at console.firebase.google.com
2. Enable Firestore Database
3. Enable Authentication (Email/Password, Google)
4. Enable Storage
5. Download service account key for backend
6. Get web config for frontend

#### 1.3 Environment Configuration

**Frontend `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Backend `.env`:**
```env
PORT=5000
NODE_ENV=development

# Firebase Admin
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY=your_private_key

# Mpesa Daraja API
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_SHORTCODE=your_shortcode
MPESA_PASSKEY=your_passkey
MPESA_CALLBACK_URL=https://your-backend-url.com/api/payment/callback

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Security
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=http://localhost:3000
```

#### 1.4 Create Base Configuration Files

**Backend `src/app.ts`:**
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default app;
```

---

### 🎯 Phase 2: Authentication System (Days 3-4)

#### 2.1 Frontend Authentication

**Tasks:**
- [ ] Set up Firebase config
- [ ] Create AuthContext
- [ ] Build login page
- [ ] Build registration page
- [ ] Implement password reset
- [ ] Add Google sign-in
- [ ] Protected route wrapper

**Key Files:**
- `src/lib/firebase.ts`
- `src/contexts/AuthContext.tsx`
- `src/hooks/useAuth.ts`
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/register/page.tsx`

#### 2.2 Backend Authentication

**Tasks:**
- [ ] Firebase Admin SDK setup
- [ ] Auth middleware
- [ ] Token verification
- [ ] User role management
- [ ] Session handling

**Key Files:**
- `src/config/firebase.ts`
- `src/middleware/auth.ts`
- `src/controllers/auth.controller.ts`
- `src/services/auth.service.ts`

#### 2.3 User Roles Implementation

**Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Products collection
    match /products/{productId} {
      allow read: if true; // Public
      allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Orders collection
    match /orders/{orderId} {
      allow read: if request.auth.uid == resource.data.userId || 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow create: if request.auth != null;
      allow update: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

---

### 🎯 Phase 3: Product Catalog (Days 5-7)

#### 3.1 Database Setup

**Firestore Collections Structure:**

**Products Collection:**
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'roses' | 'bouquets' | 'occasions' | 'corporate';
  stock: number;
  imageURLs: string[];
  featured: boolean;
  colors: string[];
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### 3.2 Frontend Product Features

**Tasks:**
- [ ] Product grid component
- [ ] Product card component
- [ ] Product details page
- [ ] Search functionality
- [ ] Filter by category/price/color
- [ ] Sort options
- [ ] Pagination
- [ ] Image gallery
- [ ] Related products

**Key Components:**
- `ProductGrid.tsx`
- `ProductCard.tsx`
- `ProductDetails.tsx`
- `ProductFilters.tsx`
- `SearchBar.tsx`

#### 3.3 Backend Product API

**Endpoints:**
```
GET    /api/products              # List all products
GET    /api/products/:id          # Get single product
GET    /api/products/featured     # Get featured products
GET    /api/products/search       # Search products
POST   /api/products              # Create product (Admin)
PUT    /api/products/:id          # Update product (Admin)
DELETE /api/products/:id          # Delete product (Admin)
GET    /api/categories            # List categories
```

**Key Files:**
- `src/routes/products.routes.ts`
- `src/controllers/products.controller.ts`
- `src/services/product.service.ts`

---

### 🎯 Phase 4: Shopping Cart (Days 8-9)

#### 4.1 Cart Logic

**Guest Cart:** LocalStorage
```typescript
interface GuestCartItem {
  productId: string;
  quantity: number;
  addedAt: Date;
}
```

**User Cart:** Firestore
```typescript
interface UserCart {
  userId: string;
  items: CartItem[];
  updatedAt: Timestamp;
}

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  addedAt: Timestamp;
}
```

#### 4.2 Frontend Cart Features

**Tasks:**
- [ ] Cart context with localStorage sync
- [ ] Add to cart functionality
- [ ] Cart page with item list
- [ ] Update quantity
- [ ] Remove items
- [ ] Cart summary (subtotal, total)
- [ ] Mini cart dropdown
- [ ] Cart persistence for logged-in users

**Key Components:**
- `CartContext.tsx`
- `CartItem.tsx`
- `CartSummary.tsx`
- `MiniCart.tsx`

#### 4.3 Backend Cart API

**Endpoints:**
```
GET    /api/cart                  # Get user cart
POST   /api/cart/add              # Add item to cart
PUT    /api/cart/update           # Update quantity
DELETE /api/cart/remove/:id       # Remove item
DELETE /api/cart/clear             # Clear cart
POST   /api/cart/merge            # Merge guest cart with user cart
```

---

### 🎯 Phase 5: Checkout & Orders (Days 10-12)

#### 5.1 Checkout Flow

**Steps:**
1. Cart review
2. Delivery details form
3. Delivery date selection
4. Payment method (Mpesa)
5. Order confirmation

#### 5.2 Order Schema

```typescript
interface Order {
  id: string;
  orderId: string; // Custom format: FRM-20251113-0001
  userId?: string; // Optional for guest orders
  guestId?: string; // For guest tracking
  
  // Items
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  
  // Delivery
  deliveryAddress: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    additionalInfo?: string;
  };
  deliveryDate: Timestamp;
  
  // Payment
  paymentMethod: 'mpesa';
  paymentStatus: 'pending' | 'completed' | 'failed';
  mpesaReceiptNumber?: string;
  
  // Status
  orderStatus: 'processing' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled';
  
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageURL: string;
}
```

#### 5.3 Frontend Checkout

**Tasks:**
- [ ] Checkout form with validation
- [ ] Delivery address form
- [ ] Date picker for delivery
- [ ] Order summary display
- [ ] Payment initiation
- [ ] Order success page
- [ ] Order confirmation email

**Key Files:**
- `src/app/(shop)/checkout/page.tsx`
- `src/components/checkout/CheckoutForm.tsx`
- `src/components/checkout/DeliveryForm.tsx`

#### 5.4 Backend Orders API

**Endpoints:**
```
POST   /api/orders/create         # Create new order
GET    /api/orders/:id            # Get order details
GET    /api/orders/user/:userId   # Get user orders
PUT    /api/orders/:id/status     # Update order status (Admin)
GET    /api/orders                # List all orders (Admin)
```

---

### 🎯 Phase 6: Mpesa Payment Integration (Days 13-15)

#### 6.1 Mpesa Daraja API Setup

**Authentication Flow:**
```typescript
// Get access token
POST https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials
Authorization: Basic Base64(ConsumerKey:ConsumerSecret)

// Response
{
  "access_token": "token_here",
  "expires_in": "3599"
}
```

#### 6.2 STK Push Implementation

**Backend Service:**
```typescript
// src/services/payment.service.ts
class PaymentService {
  async initiateMpesaPayment(orderId: string, phone: string, amount: number) {
    // 1. Get access token
    // 2. Generate timestamp and password
    // 3. Send STK push request
    // 4. Return transaction ID
  }
  
  async handleCallback(callbackData: any) {
    // 1. Verify callback authenticity
    // 2. Extract payment details
    // 3. Update order in Firestore
    // 4. Send confirmation email/SMS
  }
}
```

**STK Push Request:**
```typescript
POST https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest

{
  "BusinessShortCode": "174379",
  "Password": "base64_encoded_password",
  "Timestamp": "20231113143000",
  "TransactionType": "CustomerPayBillOnline",
  "Amount": "1500",
  "PartyA": "254712345678",
  "PartyB": "174379",
  "PhoneNumber": "254712345678",
  "CallBackURL": "https://your-backend.com/api/payment/callback",
  "AccountReference": "FRM-20251113-0001",
  "TransactionDesc": "Framel Flower Order"
}
```

#### 6.3 Payment Flow

```
User → Clicks "Pay with Mpesa"
Frontend → POST /api/payment/initiate { orderId, phone, amount }
Backend → Calls Mpesa STK Push API
Mpesa → Sends push to user phone
User → Enters PIN on phone
Mpesa → Calls callback URL
Backend → Updates order status
Backend → Sends confirmation
Frontend → Shows success page
```

#### 6.4 Backend Payment API

**Endpoints:**
```
POST   /api/payment/initiate      # Start Mpesa payment
POST   /api/payment/callback      # Mpesa callback handler
GET    /api/payment/status/:id    # Check payment status
POST   /api/payment/verify        # Manual verification
```

**Key Files:**
- `src/config/mpesa.ts`
- `src/services/payment.service.ts`
- `src/controllers/payment.controller.ts`
- `src/routes/payment.routes.ts`

---

### 🎯 Phase 7: User Dashboard (Days 16-17)

#### 7.1 User Features

**Dashboard Components:**
- [ ] Profile overview
- [ ] Order history with status
- [ ] Delivery addresses management
- [ ] Wishlist
- [ ] Account settings
- [ ] Password change

**Key Pages:**
- `src/app/(user)/dashboard/page.tsx`
- `src/app/(user)/orders/page.tsx`
- `src/app/(user)/wishlist/page.tsx`
- `src/app/(user)/profile/page.tsx`

#### 7.2 Wishlist Feature

**Firestore Structure:**
```typescript
interface Wishlist {
  userId: string;
  items: WishlistItem[];
  updatedAt: Timestamp;
}

interface WishlistItem {
  productId: string;
  addedAt: Timestamp;
}
```

**API Endpoints:**
```
GET    /api/wishlist              # Get user wishlist
POST   /api/wishlist/add          # Add to wishlist
DELETE /api/wishlist/remove/:id   # Remove from wishlist
```

---

### 🎯 Phase 8: Admin Dashboard (Days 18-21)

#### 8.1 Admin Authentication

**Role Check Middleware:**
```typescript
export const requireAdmin = async (req, res, next) => {
  const userId = req.user.uid;
  const userDoc = await db.collection('users').doc(userId).get();
  
  if (userDoc.data()?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  next();
};
```

#### 8.2 Admin Features

**Dashboard Overview:**
- [ ] Sales statistics (daily, weekly, monthly)
- [ ] Recent orders
- [ ] Low stock alerts
- [ ] Revenue charts
- [ ] Top selling products

**Product Management:**
- [ ] Add new product with images
- [ ] Edit product details
- [ ] Update stock levels
- [ ] Delete products
- [ ] Bulk actions

**Order Management:**
- [ ] View all orders with filters
- [ ] Update order status
- [ ] View order details
- [ ] Print invoices
- [ ] Export orders to CSV

**Customer Management:**
- [ ] View customer list
- [ ] Customer details and order history
- [ ] Contact customers

**Analytics:**
- [ ] Sales reports
- [ ] Product performance
- [ ] Customer insights
- [ ] Revenue trends

#### 8.3 Admin Pages

```
src/app/(admin)/
├── dashboard/page.tsx          # Overview
├── products/
│   ├── page.tsx               # Product list
│   ├── new/page.tsx           # Add product
│   └── [id]/edit/page.tsx     # Edit product
├── orders/
│   ├── page.tsx               # Order list
│   └── [id]/page.tsx          # Order details
├── customers/
│   ├── page.tsx               # Customer list
│   └── [id]/page.tsx          # Customer details
└── analytics/page.tsx         # Reports
```

#### 8.4 Admin API Endpoints

```
# Dashboard
GET    /api/admin/stats           # Dashboard statistics
GET    /api/admin/recent-orders   # Recent orders

# Products
GET    /api/admin/products        # List products with pagination
POST   /api/admin/products        # Create product
PUT    /api/admin/products/:id    # Update product
DELETE /api/admin/products/:id    # Delete product
POST   /api/admin/products/bulk   # Bulk operations

# Orders
GET    /api/admin/orders          # List all orders
PUT    /api/admin/orders/:id      # Update order
GET    /api/admin/orders/export   # Export to CSV

# Customers
GET    /api/admin/customers       # List customers
GET    /api/admin/customers/:id   # Customer details

# Analytics
GET    /api/admin/analytics/sales       # Sales data
GET    /api/admin/analytics/products    # Product performance
GET    /api/admin/analytics/revenue     # Revenue trends
```

---

### 🎯 Phase 9: Additional Features (Days 22-24)

#### 9.1 Real-time Order Tracking

**Implementation:**
```typescript
// Firestore listener for order updates
useEffect(() => {
  if (!orderId) return;
  
  const unsubscribe = onSnapshot(
    doc(db, 'orders', orderId),
    (doc) => {
      if (doc.exists()) {
        setOrder(doc.data());
      }
    }
  );
  
  return () => unsubscribe();
}, [orderId]);
```

#### 9.2 Email Notifications

**Email Service:**
```typescript
// src/services/email.service.ts
class EmailService {
  async sendOrderConfirmation(order: Order) {}
  async sendPaymentConfirmation(order: Order) {}
  async sendDeliveryUpdate(order: Order) {}
  async sendPasswordReset(email: string, link: string) {}
}
```

**Email Templates:**
- Order confirmation
- Payment confirmation
- Delivery notification
- Password reset
- Welcome email

#### 9.3 Search Optimization

**Algolia Integration (Optional):**
```typescript
// Better search experience
import algoliasearch from 'algoliasearch';

const client = algoliasearch('APP_ID', 'API_KEY');
const index = client.initIndex('products');

// Search products
const results = await index.search(query, {
  filters: 'category:roses',
  hitsPerPage: 20
});
```

#### 9.4 Image Upload

**Firebase Storage Integration:**
```typescript
// Upload product images
const uploadImage = async (file: File): Promise<string> => {
  const storage = getStorage();
  const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
  
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  
  return downloadURL;
};
```

---

### 🎯 Phase 10: Testing (Days 25-27)

#### 10.1 Unit Testing

**Frontend Tests (Jest + React Testing Library):**
```typescript
// __tests__/components/ProductCard.test.tsx
describe('ProductCard', () => {
  it('renders product information correctly', () => {});
  it('handles add to cart action', () => {});
  it('displays out of stock message', () => {});
});
```

**Backend Tests (Jest):**
```typescript
// __tests__/services/product.service.test.ts
describe('ProductService', () => {
  it('creates a new product', async () => {});
  it('retrieves product by id', async () => {});
  it('updates product stock', async () => {});
});
```

#### 10.2 Integration Testing

**API Tests:**
```typescript
describe('Products API', () => {
  test('GET /api/products returns product list', async () => {
    const response = await request(app).get('/api/products');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('products');
  });
});
```

#### 10.3 E2E Testing (Cypress)

**Test Scenarios:**
- [ ] User registration and login
- [ ] Browse and search products
- [ ] Add items to cart
- [ ] Complete checkout process
- [ ] Admin login and product creation
- [ ] Order status update

---

### 🎯 Phase 11: UI/UX Polish (Days 28-29)

#### 11.1 Design System Implementation

**Color Tokens:**
```typescript
// src/styles/colors.ts
export const colors = {
  primary: {
    main: '#E89FAE',      // Blush Pink
    light: '#F5C5D0',
    dark: '#D67B8C',
  },
  secondary: {
    main: '#A8C3A6',      // Sage Green
    light: '#C5D8C3',
    dark: '#8AA888',
  },
  accent: {
    main: '#D9B26F',      // Gold
    light: '#E5C68E',
    dark: '#C39E55',
  },
  background: {
    main: '#FFF9F5',      // Ivory White
    paper: '#FFFFFF',
  },
  text: {
    primary: '#3A3A3A',   // Charcoal Gray
    secondary: '#6B6B6B',
  },
  status: {
    error: '#E57373',     // Soft Red
    success: '#7BAE7F',   // Muted Green
    warning: '#FFB74D',
    info: '#64B5F6',
  },
};
```

**Typography:**
```typescript
// Tailwind config
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      fontSize: {
        'display': ['3.5rem', { lineHeight: '1.2' }],
        'h1': ['2.5rem', { lineHeight: '1.3' }],
        'h2': ['2rem', { lineHeight: '1.4' }],
        'h3': ['1.5rem', { lineHeight: '1.5' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'small': ['0.875rem', { lineHeight: '1.5' }],
      },
    },
  },
};
```

#### 11.2 Responsive Design

**Breakpoints:**
```typescript
// Mobile: < 640px
// Tablet: 640px - 1024px
// Desktop: > 1024px
```

#### 11.3 Accessibility

**WCAG 2.1 Compliance:**
- [ ] Keyboard navigation
- [ ] ARIA labels
- [ ] Color contrast ratios
- [ ] Focus indicators
- [ ] Screen reader support
- [ ] Alt text for images

#### 11.4 Performance Optimization

**Frontend:**
- [ ] Image optimization (Next.js Image)
- [ ] Code splitting
- [ ] Lazy loading
- [ ] Caching strategies
- [ ] Bundle size optimization

**Backend:**
- [ ] Database query optimization
- [ ] API response caching
- [ ] Compression middleware
- [ ] Rate limiting

---

### 🎯 Phase 12: Deployment (Days 30-31)

#### 12.1 Frontend Deployment (Vercel)

**Steps:**
1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy

**Vercel Configuration:**
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

#### 12.2 Backend Deployment (Render)

**Steps:**
1. Create new Web Service on Render
2. Connect GitHub repository
3. Configure build command: `npm install && npm run build`
4. Start command: `npm start`
5. Add environment variables

**render.yaml:**
```yaml
services:
  - type: web
    name: framel-api
    env: node
    plan: free
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
```

#### 12.3 Domain Configuration

**Custom Domain Setup:**
1. Purchase domain (e.g., framel.co.ke)
2. Configure DNS records
3. Add to Vercel
4. Enable SSL

**DNS Records:**
```
Type  Name  Value
A     @     76.76.21.21
CNAME www   cname.vercel-dns.com
```

#### 12.4 Firebase Production Setup

**Security Rules:**
- Update Firestore security rules
- Configure CORS for Storage
- Set up backup schedules
- Enable monitoring

**Production Checklist:**
- [ ] Environment variables set
- [ ] API keys secured
- [ ] Database indexed
- [ ] Security rules reviewed
- [ ] Backup strategy in place
- [ ] Monitoring enabled

---

## 5. Database Schema

### Complete Firestore Structure

```typescript
// Root Collections

// 1. users
{
  userId: {
    uid: string,
    email: string,
    name: string,
    phone: string,
    role: 'customer' | 'admin',
    addresses: Address[],
    preferences: {
      notifications: boolean,
      newsletter: boolean,
    },
    createdAt: Timestamp,
    updatedAt: Timestamp
  }
}

// 2. products
{
  productId: {
    id: string,
    name: string,
    description: string,
    price: number,
    category: string,
    stock: number,
    imageURLs: string[],
    featured: boolean,
    colors: string[],
    tags: string[],
    rating: number,
    reviewCount: number,
    createdAt: Timestamp,
    updatedAt: Timestamp
  }
}

// 3. orders
{
  orderId: {
    id: string,
    orderId: string,
    userId?: string,
    guestId?: string,
    items: OrderItem[],
    subtotal: number,
    deliveryFee: number,
    total: number,
    deliveryAddress: Address,
    deliveryDate: Timestamp,
    paymentMethod: 'mpesa',
    paymentStatus: 'pending' | 'completed' | 'failed',
    mpesaReceiptNumber?: string,
    orderStatus: 'processing' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled',
    createdAt: Timestamp,
    updatedAt: Timestamp
  }
}

// 4. cart
{
  userId: {
    userId: string,
    items: CartItem[],
    updatedAt: Timestamp
  }
}

// 5. wishlists
{
  userId: {
    userId: string,
    items: WishlistItem[],
    updatedAt: Timestamp
  }
}

// 6. reviews
{
  reviewId: {
    id: string,
    productId: string,
    userId: string,
    userName: string,
    rating: number,
    comment: string,
    images?: string[],
    createdAt: Timestamp
  }
}

// 7. categories
{
  categoryId: {
    id: string,
    name: string,
    slug: string,
    description: string,
    imageURL: string,
    order: number
  }
}
```

### Database Indexes

**Required Firestore Indexes:**

```javascript
// Orders collection
orders - userId (ASC) + createdAt (DESC)
orders - orderStatus (ASC) + createdAt (DESC)
orders - paymentStatus (ASC) + createdAt (DESC)

// Products collection
products - category (ASC) + featured (DESC)
products - category (ASC) + price (ASC)
products - featured (DESC) + createdAt (DESC)

// Reviews collection
reviews - productId (ASC) + createdAt (DESC)
reviews - userId (ASC) + createdAt (DESC)
```

---

## 6. API Endpoints

### Complete API Reference

#### Authentication Endpoints

```
POST   /api/auth/register
Body: { email, password, name, phone }
Response: { user, token }

POST   /api/auth/login
Body: { email, password }
Response: { user, token }

POST   /api/auth/logout
Headers: { Authorization: Bearer <token> }
Response: { message }

POST   /api/auth/reset-password
Body: { email }
Response: { message }

POST   /api/auth/verify-token
Headers: { Authorization: Bearer <token> }
Response: { user }
```

#### Product Endpoints

```
GET    /api/products
Query: ?page=1&limit=20&category=roses&sort=price_asc
Response: { products: Product[], total, page, pages }

GET    /api/products/:id
Response: { product: Product }

GET    /api/products/featured
Response: { products: Product[] }

GET    /api/products/search
Query: ?q=roses&category=all
Response: { products: Product[] }

POST   /api/products [Admin]
Body: { name, description, price, category, stock, imageURLs }
Response: { product: Product }

PUT    /api/products/:id [Admin]
Body: { name?, description?, price?, stock? }
Response: { product: Product }

DELETE /api/products/:id [Admin]
Response: { message }
```

#### Cart Endpoints

```
GET    /api/cart
Headers: { Authorization: Bearer <token> }
Response: { cart: Cart }

POST   /api/cart/add
Body: { productId, quantity }
Response: { cart: Cart }

PUT    /api/cart/update
Body: { productId, quantity }
Response: { cart: Cart }

DELETE /api/cart/remove/:productId
Response: { cart: Cart }

DELETE /api/cart/clear
Response: { message }

POST   /api/cart/merge
Body: { guestCart: CartItem[] }
Response: { cart: Cart }
```

#### Order Endpoints

```
POST   /api/orders/create
Body: { items, deliveryAddress, deliveryDate, paymentMethod }
Response: { order: Order }

GET    /api/orders/:id
Response: { order: Order }

GET    /api/orders/user/:userId
Response: { orders: Order[] }

GET    /api/orders/track/:orderId
Response: { order: Order }

PUT    /api/orders/:id/status [Admin]
Body: { status }
Response: { order: Order }
```

#### Payment Endpoints

```
POST   /api/payment/initiate
Body: { orderId, phone, amount }
Response: { transactionId, message }

POST   /api/payment/callback
Body: { mpesa callback data }
Response: { message }

GET    /api/payment/status/:transactionId
Response: { status, order }
```

#### Wishlist Endpoints

```
GET    /api/wishlist
Response: { wishlist: Wishlist }

POST   /api/wishlist/add
Body: { productId }
Response: { wishlist: Wishlist }

DELETE /api/wishlist/remove/:productId
Response: { wishlist: Wishlist }
```

#### Admin Endpoints

```
GET    /api/admin/stats
Response: { sales, orders, customers, revenue }

GET    /api/admin/orders
Query: ?status=processing&page=1
Response: { orders: Order[], total }

GET    /api/admin/customers
Response: { customers: User[] }

GET    /api/admin/analytics/sales
Query: ?period=weekly
Response: { data: SalesData[] }
```

---

## 7. Authentication Flow

### User Authentication

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ 1. User enters credentials
       ▼
┌─────────────────────┐
│  Firebase Auth SDK  │
└──────┬──────────────┘
       │ 2. Validates credentials
       ▼
┌─────────────────────┐
│  Firebase Auth      │
│  (Cloud)            │
└──────┬──────────────┘
       │ 3. Returns ID token
       ▼
┌─────────────────────┐
│  Frontend           │
│  (Stores token)     │
└──────┬──────────────┘
       │ 4. Sends token with API requests
       ▼
┌─────────────────────┐
│  Backend API        │
│  (Verifies token)   │
└──────┬──────────────┘
       │ 5. Checks user role in Firestore
       ▼
┌─────────────────────┐
│  Firestore          │
│  users collection   │
└─────────────────────┘
```

### Token Verification Middleware

```typescript
// src/middleware/auth.ts
export const verifyAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    // Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Get user role from Firestore
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: userDoc.data()?.role || 'customer'
    };
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

---

## 8. Payment Integration

### Mpesa STK Push Flow

```
┌──────────┐
│  User    │
│  (Phone) │
└────┬─────┘
     │
     │ 1. Initiates checkout
     ▼
┌─────────────┐
│  Frontend   │
└──────┬──────┘
       │ 2. POST /api/payment/initiate
       ▼
┌─────────────────────┐
│  Backend API        │
│  PaymentController  │
└──────┬──────────────┘
       │ 3. Generate password & timestamp
       ▼
┌─────────────────────┐
│  Mpesa API          │
│  (STK Push)         │
└──────┬──────────────┘
       │ 4. Sends push to phone
       ▼
┌──────────────┐
│  User Phone  │
│  (Enter PIN) │
└──────┬───────┘
       │ 5. Payment confirmation
       ▼
┌─────────────────────┐
│  Mpesa              │
│  (Processes)        │
└──────┬──────────────┘
       │ 6. Callback to backend
       ▼
┌─────────────────────┐
│  Backend            │
│  /payment/callback  │
└──────┬──────────────┘
       │ 7. Updates order in Firestore
       ▼
┌─────────────┐
│  Firestore  │
│  orders     │
└──────┬──────┘
       │ 8. Real-time listener
       ▼
┌─────────────┐
│  Frontend   │
│  (Success!) │
└─────────────┘
```

### Mpesa Implementation Details

**Generate Password:**
```typescript
const generatePassword = () => {
  const timestamp = moment().format('YYYYMMDDHHmmss');
  const password = Buffer.from(
    `${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`
  ).toString('base64');
  
  return { password, timestamp };
};
```

**STK Push Request:**
```typescript
const initiateStkPush = async (phone: string, amount: number, accountRef: string) => {
  const { password, timestamp } = generatePassword();
  
  const response = await axios.post(
    'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
    {
      BusinessShortCode: MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phone,
      PartyB: MPESA_SHORTCODE,
      PhoneNumber: phone,
      CallBackURL: `${BACKEND_URL}/api/payment/callback`,
      AccountReference: accountRef,
      TransactionDesc: 'Framel Flower Order'
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );
  
  return response.data;
};
```

**Callback Handler:**
```typescript
export const handleCallback = async (req, res) => {
  const { Body } = req.body;
  
  if (Body.stkCallback.ResultCode === 0) {
    // Payment successful
    const orderId = Body.stkCallback.CallbackMetadata.Item
      .find(item => item.Name === 'AccountReference')?.Value;
    
    const receiptNumber = Body.stkCallback.CallbackMetadata.Item
      .find(item => item.Name === 'MpesaReceiptNumber')?.Value;
    
    // Update order
    await db.collection('orders').doc(orderId).update({
      paymentStatus: 'completed',
      mpesaReceiptNumber: receiptNumber,
      orderStatus: 'confirmed',
      updatedAt: FieldValue.serverTimestamp()
    });
    
    // Send confirmation email
    await emailService.sendPaymentConfirmation(orderId);
  } else {
    // Payment failed
    await db.collection('orders').doc(orderId).update({
      paymentStatus: 'failed',
      updatedAt: FieldValue.serverTimestamp()
    });
  }
  
  res.json({ ResultCode: 0, ResultDesc: 'Success' });
};
```

---

## 9. Deployment Strategy

### Production Checklist

#### Pre-Deployment

- [ ] **Code Review**
  - All features tested
  - No console.log statements
  - Error handling implemented
  - Security vulnerabilities checked

- [ ] **Environment Configuration**
  - Production Firebase project created
  - All API keys secured
  - Environment variables set
  - CORS configured for production domains

- [ ] **Database**
  - Security rules reviewed and updated
  - Indexes created for performance
  - Backup strategy implemented
  - Test data removed

- [ ] **Testing**
  - Unit tests passing
  - Integration tests passing
  - E2E tests completed
  - Performance testing done

#### Deployment Steps

**1. Firebase Setup**
```bash
# Initialize Firebase
firebase login
firebase init

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Firestore indexes
firebase deploy --only firestore:indexes

# Deploy Storage rules
firebase deploy --only storage
```

**2. Backend Deployment (Render)**
```bash
# Push to GitHub
git push origin main

# On Render dashboard:
# - Create new Web Service
# - Connect GitHub repo
# - Set environment variables
# - Deploy
```

**3. Frontend Deployment (Vercel)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod

# Or via GitHub integration:
# - Connect repo to Vercel
# - Configure build settings
# - Deploy automatically on push
```

#### Post-Deployment

- [ ] **Verification**
  - All pages load correctly
  - Authentication works
  - Payments process successfully
  - Admin panel accessible
  - Email notifications sent

- [ ] **Monitoring**
  - Set up error tracking (Sentry)
  - Configure uptime monitoring
  - Enable Firebase Analytics
  - Set up performance monitoring

- [ ] **Documentation**
  - Update API documentation
  - Document deployment process
  - Create user guides
  - Admin manual prepared

---

## 10. Testing Strategy

### Test Coverage Goals

```
Unit Tests:        > 80%
Integration Tests: > 70%
E2E Tests:         Critical paths
```

### Testing Structure

```
tests/
├── unit/
│   ├── components/
│   ├── services/
│   ├── utils/
│   └── hooks/
├── integration/
│   ├── api/
│   └── database/
└── e2e/
    ├── user-flows/
    └── admin-flows/
```

### Key Test Scenarios

#### Unit Tests

**Frontend Components:**
```typescript
// ProductCard.test.tsx
describe('ProductCard', () => {
  it('displays product information', () => {});
  it('handles out of stock products', () => {});
  it('triggers add to cart correctly', () => {});
});

// CartContext.test.tsx
describe('CartContext', () => {
  it('adds items to cart', () => {});
  it('updates quantity', () => {});
  it('calculates total correctly', () => {});
});
```

**Backend Services:**
```typescript
// product.service.test.ts
describe('ProductService', () => {
  it('creates product successfully', async () => {});
  it('retrieves product by ID', async () => {});
  it('handles invalid product ID', async () => {});
});
```

#### Integration Tests

```typescript
// orders.integration.test.ts
describe('Order Flow', () => {
  it('creates order and updates inventory', async () => {
    // Test full order creation flow
  });
  
  it('handles payment callback correctly', async () => {
    // Test Mpesa callback processing
  });
});
```

#### E2E Tests

```typescript
// cypress/e2e/checkout.cy.ts
describe('Checkout Flow', () => {
  it('completes full purchase flow', () => {
    cy.visit('/');
    cy.get('[data-testid="product-card"]').first().click();
    cy.get('[data-testid="add-to-cart"]').click();
    cy.get('[data-testid="cart-icon"]').click();
    cy.get('[data-testid="checkout-btn"]').click();
    // ... continue flow
  });
});
```

---

## 11. Security Considerations

### Frontend Security

**1. XSS Prevention**
```typescript
// Use React's built-in escaping
// Avoid dangerouslySetInnerHTML
// Sanitize user input with DOMPurify
import DOMPurify from 'dompurify';

const cleanHTML = DOMPurify.sanitize(userInput);
```

**2. CSRF Protection**
```typescript
// Use Firebase Auth tokens
// Validate tokens on backend
// SameSite cookies
```

**3. Secure Storage**
```typescript
// Never store sensitive data in localStorage
// Use httpOnly cookies for tokens
// Implement token rotation
```

### Backend Security

**1. Input Validation**
```typescript
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(3).max(100),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
});

export const validateProduct = (req, res, next) => {
  try {
    productSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ error: error.errors });
  }
};
```

**2. Rate Limiting**
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

**3. SQL Injection Prevention**
```typescript
// Firestore is NoSQL but still validate
// Use parameterized queries
// Never concatenate user input into queries
```

**4. Authentication Security**
```typescript
// Verify Firebase tokens on every request
// Implement role-based access control
// Use secure session management
// Implement logout on all devices
```

**5. API Security**
```typescript
// Use HTTPS only
// Implement CORS properly
// Validate content-type
// Limit payload size
app.use(express.json({ limit: '10mb' }));
```

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }
    
    // Products collection
    match /products/{productId} {
      allow read: if true; // Public
      allow write: if isAdmin();
    }
    
    // Orders collection
    match /orders/{orderId} {
      allow read: if isOwner(resource.data.userId) || isAdmin();
      allow create: if isAuthenticated();
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }
    
    // Cart collection
    match /cart/{userId} {
      allow read, write: if isOwner(userId);
    }
    
    // Wishlists collection
    match /wishlists/{userId} {
      allow read, write: if isOwner(userId);
    }
    
    // Reviews collection
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if isAuthenticated();
      allow update, delete: if isOwner(resource.data.userId) || isAdmin();
    }
  }
}
```

---

## 12. Environment Variables

### Frontend (.env.local)

```env
# App Configuration
NEXT_PUBLIC_APP_NAME=Framel
NEXT_PUBLIC_APP_URL=https://framel.co.ke
NEXT_PUBLIC_API_URL=https://api.framel.co.ke/api

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=framel-prod.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=framel-prod
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=framel-prod.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABC123

# Analytics (Optional)
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
```

### Backend (.env)

```env
# Server Configuration
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://framel.co.ke

# Firebase Admin SDK
FIREBASE_PROJECT_ID=framel-prod
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@framel-prod.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Mpesa Daraja API (Production)
MPESA_ENVIRONMENT=production
MPESA_CONSUMER_KEY=your_production_consumer_key
MPESA_CONSUMER_SECRET=your_production_consumer_secret
MPESA_SHORTCODE=123456
MPESA_PASSKEY=your_production_passkey
MPESA_CALLBACK_URL=https://api.framel.co.ke/api/payment/callback

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@framel.co.ke
SMTP_PASS=your_app_password
EMAIL_FROM=Framel Flowers <noreply@framel.co.ke>

# Security
JWT_SECRET=your_super_secret_jwt_key_change_in_production
SESSION_SECRET=your_session_secret_key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log

# Monitoring (Optional)
SENTRY_DSN=https://your-sentry-dsn
```

---

## 📊 Development Timeline

### Estimated Timeline: 31 Days

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| Phase 1: Setup | 2 days | Project structure, configs |
| Phase 2: Authentication | 2 days | Login, register, roles |
| Phase 3: Products | 3 days | CRUD, filters, search |
| Phase 4: Cart | 2 days | Add/remove, sync |
| Phase 5: Checkout | 3 days | Forms, validation |
| Phase 6: Payments | 3 days | Mpesa integration |
| Phase 7: User Dashboard | 2 days | Profile, orders, wishlist |
| Phase 8: Admin Panel | 4 days | Full admin features |
| Phase 9: Additional | 3 days | Notifications, tracking |
| Phase 10: Testing | 3 days | Unit, integration, E2E |
| Phase 11: Polish | 2 days | UI/UX improvements |
| Phase 12: Deployment | 2 days | Production launch |

---

## 🚀 Quick Start Commands

### Initial Setup
```bash
# Clone repository
git clone <repo-url>
cd framel

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values

# Start development servers
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Development Workflow
```bash
# Create new feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: your feature description"

# Push and create PR
git push origin feature/your-feature-name
```

### Testing
```bash
# Run frontend tests
cd frontend
npm test

# Run backend tests
cd backend
npm test

# Run E2E tests
cd frontend
npm run test:e2e
```

### Deployment
```bash
# Deploy to production
git push origin main

# Vercel will auto-deploy frontend
# Render will auto-deploy backend

# Deploy Firebase rules
firebase deploy --only firestore:rules,firestore:indexes
```

---

## 📚 Additional Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Mpesa Daraja API](https://developer.safaricom.co.ke/)
- [Express.js Guide](https://expressjs.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [Figma](https://www.figma.com/) - Design
- [VS Code](https://code.visualstudio.com/) - IDE
- [GitHub](https://github.com/) - Version control

### Community
- Stack Overflow
- Firebase Community
- Next.js Discord
- GitHub Discussions

---

## 🎯 Success Metrics

### Technical Metrics
- Page load time < 3 seconds
- API response time < 500ms
- 99.9% uptime
- Zero security vulnerabilities
- 80%+ test coverage

### Business Metrics
- User registration rate
- Conversion rate (cart to order)
- Average order value
- Customer retention
- Payment success rate

---

## 📝 Notes

### Development Best Practices
1. Write clean, readable code
2. Follow TypeScript best practices
3. Document complex logic
4. Write tests for critical paths
5. Use meaningful commit messages
6. Review code before merging
7. Keep dependencies updated
8. Monitor performance
9. Handle errors gracefully
10. Prioritize security

### Common Pitfalls to Avoid
- ❌ Hardcoding API keys
- ❌ Ignoring error handling
- ❌ Not validating user input
- ❌ Poor database query optimization
- ❌ Neglecting mobile responsiveness
- ❌ Skipping tests
- ❌ Not implementing rate limiting
- ❌ Weak security rules

---

## 🎊 Conclusion

This comprehensive guide provides everything needed to build Framel from scratch. Follow the phases sequentially, test thoroughly, and maintain code quality throughout development.

**Ready to build something amazing! 🌸**

---

*Document Version: 1.0*  
*Last Updated: November 13, 2025*  
*Maintained by: Development Team*
