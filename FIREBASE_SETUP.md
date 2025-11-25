# Firebase Configuration Guide

To ensure your Framel application works correctly in production, you need to configure a few things in your Firebase Console.

## 1. Authentication

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Select your project.
3.  Navigate to **Build** > **Authentication**.
4.  Click **Get Started** (if you haven't already).
5.  Go to the **Sign-in method** tab.
6.  Click on **Email/Password**.
7.  **Enable** the "Email/Password" switch.
8.  Click **Save**.

## 2. Firestore Database

1.  Navigate to **Build** > **Firestore Database**.
2.  Click **Create Database**.
3.  Select a location (preferably close to your users, e.g., `eur3` (Europe West) or `us-central1`).
4.  Start in **Production mode**.
5.  Click **Create**.

## 3. Security Rules

To secure your user data and orders, you need to set up Firestore Security Rules.

1.  In the Firestore section, go to the **Rules** tab.
2.  Replace the existing rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user is accessing their own data
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Helper function to check if user is admin (requires custom claim or role check)
    // For simplicity, we'll check the 'role' field on the user document in future, 
    // but for now, we rely on backend validation for critical admin actions.
    
    // Users collection
    match /users/{userId} {
      allow read: if isOwner(userId); // Users can read their own profile
      allow create: if isAuthenticated(); // Authenticated users can create their profile
      allow update: if isOwner(userId); // Users can update their own profile
      allow delete: if false; // Only admin can delete via backend
    }
    
    // Products collection
    match /products/{productId} {
      allow read: if true; // Publicly readable
      allow write: if false; // Only admin can write via backend
    }
    
    // Orders collection
    match /orders/{orderId} {
      allow read: if isAuthenticated() && (resource.data.userId == request.auth.uid); // Users can read their own orders
      allow create: if isAuthenticated(); // Users can create orders
      allow update: if false; // Only backend can update status
      allow delete: if false;
    }
    
    // Cart collection
    match /cart/{userId} {
      allow read, write: if isOwner(userId); // Users have full access to their cart
    }
  }
}
```

3.  Click **Publish**.

## 4. Indexes

Your application uses complex queries that may require composite indexes. If you see an error in your backend logs related to a missing index, Firebase provides a direct link to create it.

**Likely Index Required:**
- **Collection:** `products`
- **Fields:** `category` (Ascending) + `stock` (Ascending)

To create this manually:
1.  Go to the **Indexes** tab in Firestore.
2.  Click **Create Index**.
3.  Collection ID: `products`
4.  Field 1: `category` (Ascending)
5.  Field 2: `stock` (Ascending)
6.  Click **Create**.

## 5. Storage (Optional)

If you decide to use Firebase Storage instead of Cloudinary in the future:
1.  Navigate to **Build** > **Storage**.
2.  Click **Get Started**.
3.  Start in **Production mode**.
4.  Click **Done**.
5.  Update your environment variables to use Firebase Storage bucket.

**Note:** Your current setup uses **Cloudinary** for images, so this step is not strictly necessary unless you change your configuration.
