# 🌸 Framel Frontend - Complete Documentation

**Version:** 1.0  
**Date:** November 13, 2025  
**Framework:** Next.js 14 with App Router  
**Status:** Ready to Build

---

## 📋 Table of Contents

1. [Frontend Overview](#1-frontend-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Setup & Installation](#4-setup--installation)
5. [Configuration Files](#5-configuration-files)
6. [Design System](#6-design-system)
7. [Core Features](#7-core-features)
8. [Page Structure](#8-page-structure)
9. [Component Architecture](#9-component-architecture)
10. [State Management](#10-state-management)
11. [API Integration](#11-api-integration)
12. [Authentication Flow](#12-authentication-flow)
13. [Routing & Navigation](#13-routing--navigation)
14. [Forms & Validation](#14-forms--validation)
15. [Image Handling](#15-image-handling)
16. [Payment Integration](#16-payment-integration)
17. [Deployment](#17-deployment)

---

## 1. Frontend Overview

### Purpose
The Framel frontend is a modern, responsive e-commerce web application built with Next.js 14, providing customers with a seamless flower shopping experience and admins with powerful management tools.

### Key Objectives
- **Fast Performance**: Server-side rendering and optimization
- **Great UX**: Intuitive navigation and smooth interactions
- **Mobile-First**: Fully responsive design
- **Accessible**: WCAG 2.1 compliant
- **SEO-Friendly**: Optimized for search engines

### User Types
1. **Guest Users**: Browse and purchase without registration
2. **Registered Users**: Full features with order history
3. **Admin Users**: Access to admin dashboard

---

## 2. Technology Stack

### Core Framework
```yaml
Framework: Next.js 14.2+
  - App Router (not Pages Router)
  - Server Components by default
  - Client Components when needed
  - API Routes for BFF layer

Language: TypeScript 5.3+
  - Strict mode enabled
  - Full type safety
```

### Styling
```yaml
Primary: Tailwind CSS 3.4+
  - Utility-first approach
  - Custom color palette
  - Responsive design utilities

UI Components: shadcn/ui
  - Radix UI primitives
  - Fully customizable
  - Accessible by default

Icons: Lucide React
  - Modern icon library
  - Tree-shakeable
```

### State Management
```yaml
Global State: React Context API
  - AuthContext (user authentication)
  - CartContext (shopping cart)
  - ThemeContext (optional dark mode)

Server State: TanStack Query (React Query)
  - Data fetching and caching
  - Automatic refetching
  - Optimistic updates
```

### Forms & Validation
```yaml
Forms: React Hook Form
  - Performance optimized
  - Easy validation
  - TypeScript support

Validation: Zod
  - Schema validation
  - Type inference
  - Error messages
```

### HTTP Client
```yaml
Client: Axios
  - Interceptors for auth
  - Error handling
  - Request/response transformation
```

### Additional Libraries
```yaml
Date Handling: date-fns
Image Optimization: Next.js Image
Notifications: react-hot-toast
Loading States: Next.js loading.tsx
Error Handling: error.tsx boundaries
```

---

## 3. Project Structure

### Complete Frontend Directory Structure

```
frontend/
├── public/
│   ├── images/
│   │   ├── logo.svg
│   │   ├── hero-banner.jpg
│   │   └── placeholder.png
│   ├── favicon.ico
│   └── robots.txt
│
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth group (no layout)
│   │   │   ├── login/
│   │   │   │   ├── page.tsx
│   │   │   │   └── loading.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── forgot-password/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (shop)/                   # Shop layout
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx              # Home page
│   │   │   ├── products/
│   │   │   │   ├── page.tsx          # Products list
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx      # Product details
│   │   │   │   └── category/
│   │   │   │       └── [slug]/
│   │   │   │           └── page.tsx
│   │   │   ├── cart/
│   │   │   │   └── page.tsx
│   │   │   ├── checkout/
│   │   │   │   ├── page.tsx
│   │   │   │   └── success/
│   │   │   │       └── page.tsx
│   │   │   └── about/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (user)/                   # User dashboard layout
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── wishlist/
│   │   │   │   └── page.tsx
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   │   └── addresses/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (admin)/                  # Admin dashboard layout
│   │   │   ├── layout.tsx
│   │   │   ├── admin/
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── products/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── edit/
│   │   │   │   │           └── page.tsx
│   │   │   │   ├── orders/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── customers/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   └── analytics/
│   │   │   │       └── page.tsx
│   │   │
│   │   ├── api/                      # API Routes (BFF layer)
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   └── webhook/
│   │   │       └── route.ts
│   │   │
│   │   ├── layout.tsx                # Root layout
│   │   ├── loading.tsx               # Root loading
│   │   ├── error.tsx                 # Root error
│   │   ├── not-found.tsx             # 404 page
│   │   └── globals.css               # Global styles
│   │
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── select.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   └── Sidebar.tsx
│   │   │
│   │   ├── product/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductDetails.tsx
│   │   │   ├── ProductFilters.tsx
│   │   │   ├── ProductSearch.tsx
│   │   │   └── ProductImageGallery.tsx
│   │   │
│   │   ├── cart/
│   │   │   ├── CartItem.tsx
│   │   │   ├── CartSummary.tsx
│   │   │   ├── MiniCart.tsx
│   │   │   └── CartButton.tsx
│   │   │
│   │   ├── checkout/
│   │   │   ├── CheckoutForm.tsx
│   │   │   ├── DeliveryForm.tsx
│   │   │   ├── PaymentSection.tsx
│   │   │   ├── OrderSummary.tsx
│   │   │   └── DeliveryDatePicker.tsx
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── ForgotPasswordForm.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   │
│   │   ├── user/
│   │   │   ├── OrderCard.tsx
│   │   │   ├── OrderList.tsx
│   │   │   ├── OrderTracking.tsx
│   │   │   ├── WishlistItem.tsx
│   │   │   ├── ProfileForm.tsx
│   │   │   └── AddressForm.tsx
│   │   │
│   │   ├── admin/
│   │   │   ├── ProductForm.tsx
│   │   │   ├── ProductTable.tsx
│   │   │   ├── OrderTable.tsx
│   │   │   ├── CustomerTable.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   ├── SalesChart.tsx
│   │   │   └── ImageUpload.tsx
│   │   │
│   │   └── common/
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorMessage.tsx
│   │       ├── EmptyState.tsx
│   │       ├── Pagination.tsx
│   │       └── SearchBar.tsx
│   │
│   ├── lib/
│   │   ├── firebase.ts               # Firebase client config
│   │   ├── api.ts                    # API client (axios)
│   │   ├── utils.ts                  # Utility functions
│   │   ├── cn.ts                     # Class name utility
│   │   └── validations.ts            # Zod schemas
│   │
│   ├── contexts/
│   │   ├── AuthContext.tsx           # Authentication state
│   │   ├── CartContext.tsx           # Shopping cart state
│   │   └── ThemeContext.tsx          # Theme state (optional)
│   │
│   ├── hooks/
│   │   ├── useAuth.ts                # Auth hook
│   │   ├── useCart.ts                # Cart hook
│   │   ├── useProducts.ts            # Products data hook
│   │   ├── useOrders.ts              # Orders data hook
│   │   ├── useDebounce.ts            # Debounce hook
│   │   └── useLocalStorage.ts        # LocalStorage hook
│   │
│   ├── types/
│   │   ├── product.ts                # Product types
│   │   ├── user.ts                   # User types
│   │   ├── order.ts                  # Order types
│   │   ├── cart.ts                   # Cart types
│   │   └── index.ts                  # Barrel export
│   │
│   ├── styles/
│   │   ├── colors.ts                 # Color palette
│   │   └── fonts.ts                  # Font configuration
│   │
│   └── constants/
│       ├── routes.ts                 # Route constants
│       ├── api-endpoints.ts          # API endpoints
│       └── config.ts                 # App configuration
│
├── .env.local                        # Environment variables
├── .env.example                      # Environment template
├── .eslintrc.json                    # ESLint configuration
├── .prettierrc                       # Prettier configuration
├── next.config.js                    # Next.js configuration
├── tailwind.config.ts                # Tailwind configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies
├── postcss.config.js                 # PostCSS configuration
└── README.md                         # Frontend documentation
```

---

## 4. Setup & Installation

### Prerequisites
```bash
Node.js: >= 18.0.0
npm: >= 9.0.0
```

### Step 1: Create Next.js Project

```bash
# Navigate to framel root
cd framel

# Create Next.js app
npx create-next-app@latest frontend --typescript --tailwind --app --src-dir --import-alias "@/*"
```

**During setup, answer:**
```
✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like to use `src/` directory? … Yes
✔ Would you like to use App Router? … Yes
✔ Would you like to customize the default import alias? … Yes (@/*)
```

### Step 2: Install Core Dependencies

```bash
cd frontend

# UI Components (shadcn/ui)
npx shadcn-ui@latest init

# During shadcn init:
# Style: Default
# Base color: Slate
# CSS variables: Yes

# Install shadcn components (we'll install as needed)
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add select
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add form
npx shadcn-ui@latest add label
npx shadcn-ui@latest add separator

# State Management & Data Fetching
npm install @tanstack/react-query axios

# Firebase Client SDK
npm install firebase

# Forms & Validation
npm install react-hook-form @hookform/resolvers zod

# Utilities
npm install date-fns clsx tailwind-merge
npm install lucide-react

# Notifications
npm install react-hot-toast

# Image Optimization (built into Next.js)
# Already available

# Development Dependencies
npm install -D @types/node
```

### Step 3: Environment Variables

Create `/frontend/.env.local`:

```env
# App Configuration
NEXT_PUBLIC_APP_NAME=Framel
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=framel-production.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=framel-production
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=framel-production.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Cloudinary (for direct uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=deiw3mdvi
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=framel_products

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_PWA=false
```

### Step 4: Folder Structure

```bash
# Create folder structure
mkdir -p src/{components/{ui,layout,product,cart,checkout,auth,user,admin,common},lib,contexts,hooks,types,styles,constants}
mkdir -p src/app/{(auth)/{login,register,forgot-password},(shop)/{products,cart,checkout},(user)/{dashboard,orders,wishlist,profile},(admin)/admin/{dashboard,products,orders,customers,analytics}}
mkdir -p public/images
```

### Step 5: Start Development Server

```bash
npm run dev
# Frontend will start on http://localhost:3000
```

---

## 5. Configuration Files

### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/deiw3mdvi/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

module.exports = nextConfig;
```

### tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Framel Color Palette
        primary: {
          DEFAULT: '#E89FAE', // Blush Pink
          light: '#F5C5D0',
          dark: '#D67B8C',
        },
        secondary: {
          DEFAULT: '#A8C3A6', // Sage Green
          light: '#C5D8C3',
          dark: '#8AA888',
        },
        accent: {
          DEFAULT: '#D9B26F', // Gold
          light: '#E5C68E',
          dark: '#C39E55',
        },
        background: {
          DEFAULT: '#FFF9F5', // Ivory White
          paper: '#FFFFFF',
        },
        text: {
          primary: '#3A3A3A', // Charcoal Gray
          secondary: '#6B6B6B',
        },
        error: '#E57373', // Soft Red
        success: '#7BAE7F', // Muted Green
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\""
  }
}
```

---

## 6. Design System

### Color Palette (Framel Brand Colors)

```typescript
// src/styles/colors.ts
export const colors = {
  // Primary - Blush Pink
  primary: {
    main: '#E89FAE',
    light: '#F5C5D0',
    dark: '#D67B8C',
  },
  
  // Secondary - Sage Green
  secondary: {
    main: '#A8C3A6',
    light: '#C5D8C3',
    dark: '#8AA888',
  },
  
  // Accent - Gold
  accent: {
    main: '#D9B26F',
    light: '#E5C68E',
    dark: '#C39E55',
  },
  
  // Background
  background: {
    main: '#FFF9F5', // Ivory White
    paper: '#FFFFFF',
  },
  
  // Text
  text: {
    primary: '#3A3A3A', // Charcoal Gray
    secondary: '#6B6B6B',
  },
  
  // Status
  status: {
    error: '#E57373', // Soft Red
    success: '#7BAE7F', // Muted Green
    warning: '#FFB74D',
    info: '#64B5F6',
  },
} as const;
```

### Typography

```typescript
// Font sizes (Tailwind classes)
const typography = {
  display: 'text-5xl md:text-6xl font-serif',
  h1: 'text-4xl md:text-5xl font-serif',
  h2: 'text-3xl md:text-4xl font-serif',
  h3: 'text-2xl md:text-3xl font-sans',
  h4: 'text-xl md:text-2xl font-sans',
  body: 'text-base font-sans',
  small: 'text-sm font-sans',
  tiny: 'text-xs font-sans',
};
```

### Spacing

```typescript
// Consistent spacing values
const spacing = {
  xs: '0.5rem',   // 8px
  sm: '0.75rem',  // 12px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
  '3xl': '4rem',  // 64px
};
```

### Component Styles

```typescript
// Button variants
const buttonStyles = {
  primary: 'bg-primary hover:bg-primary-dark text-white',
  secondary: 'bg-secondary hover:bg-secondary-dark text-white',
  outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
  ghost: 'text-primary hover:bg-primary/10',
};
```

---

## 7. Core Features

### Feature Overview

```
┌─────────────────────────────────────────────┐
│           FRAMEL FRONTEND FEATURES           │
├─────────────────────────────────────────────┤
│                                             │
│  PUBLIC FEATURES (No Auth Required)        │
│  ├─ Home Page with featured products       │
│  ├─ Product browsing & search              │
│  ├─ Product details                        │
│  ├─ Shopping cart (guest)                  │
│  ├─ Checkout (guest)                       │
│  └─ Mpesa payment                          │
│                                             │
│  USER FEATURES (Auth Required)             │
│  ├─ User registration                      │
│  ├─ User login                             │
│  ├─ Dashboard                              │
│  ├─ Order history                          │
│  ├─ Order tracking                         │
│  ├─ Wishlist                               │
│  ├─ Profile management                     │
│  └─ Address management                     │
│                                             │
│  ADMIN FEATURES (Admin Role)               │
│  ├─ Admin dashboard                        │
│  ├─ Product management (CRUD)              │
│  ├─ Order management                       │
│  ├─ Customer management                    │
│  └─ Analytics & reports                    │
│                                             │
└─────────────────────────────────────────────┘
```

### Feature Priority

**Phase 1: MVP (Weeks 1-2)**
1. ✅ Home page
2. ✅ Product listing
3. ✅ Product details
4. ✅ Shopping cart
5. ✅ Basic checkout

**Phase 2: Core Features (Weeks 3-4)**
6. ✅ User authentication
7. ✅ User dashboard
8. ✅ Order history
9. ✅ Mpesa payment integration

**Phase 3: Advanced (Weeks 5-6)**
10. ✅ Wishlist
11. ✅ Profile management
12. ✅ Order tracking
13. ✅ Product search & filters

**Phase 4: Admin (Weeks 7-8)**
14. ✅ Admin dashboard
15. ✅ Product management
16. ✅ Order management
17. ✅ Analytics

---

**(Continued in next part...)**

This is Part 1 of the comprehensive frontend documentation. Would you like me to continue with:
- Part 2: Page Structure, Components, and State Management?
- Part 3: API Integration, Authentication, and Forms?
- Part 4: Payment Flow, Deployment, and Best Practices?

Or would you prefer all parts in separate, focused documents?
