# Firebase Production Checklist

Since your database and authentication are already working, here are the specific steps to ensure your app is ready for **live production traffic**.

## 1. Add Authorized Domains (CRITICAL)

Your deployed Vercel app will fail to log users in if the domain isn't authorized.

1.  Go to **Authentication** > **Settings** > **Authorized Domains**.
2.  Click **Add Domain**.
3.  Add your Vercel domain (e.g., `framel.vercel.app`).
4.  Add your custom domain if you have one (e.g., `framel.co.ke`).

## 2. Lock Down Security Rules

In development, it's common to have "Test Mode" rules (`allow read, write: if true;`). **This is dangerous for production.**

1.  Go to **Firestore Database** > **Rules**.
2.  Ensure your rules restrict access based on user ID. Use the rules below to secure your data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper: Check if user is logged in
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper: Check if user owns the data
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // 🔒 Users: Only owner can read/write their own profile
    match /users/{userId} {
      allow read, update: if isOwner(userId);
      allow create: if isAuthenticated();
    }
    
    // 🌍 Products: Public read, Admin write (handled by backend)
    match /products/{productId} {
      allow read: if true;
      allow write: if false; 
    }
    
    // 🔒 Orders: Users read own orders, Backend handles updates
    match /orders/{orderId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAuthenticated();
      allow update, delete: if false;
    }
    
    // 🛒 Cart: Owner full access
    match /cart/{userId} {
      allow read, write: if isOwner(userId);
    }
  }
}
```

## 3. Check Quotas (Spark vs. Blaze)

-   **Spark Plan (Free):** Generous limits, but if you expect high traffic or many Cloudinary uploads (which uses outbound networking), keep an eye on usage.
-   **Blaze Plan (Pay as you go):** Required if you use Firebase Cloud Functions (not currently used in your project) or exceed free limits.
-   **Action:** Go to **Usage and Billing** in the console to monitor your current usage.

## 4. Customize Email Templates (Optional)

When users reset passwords, they receive an email from Firebase.

1.  Go to **Authentication** > **Templates**.
2.  Edit the **Password reset** and **Email address verification** templates.
3.  Add your "Framel" branding and ensure the "Sender name" is correct.

## 5. Indexes

If your "All Products" page filters (e.g., "Price: Low to High" + "Category: Roses") stop working in production, you are missing a composite index.

-   **Check:** Open your browser console (F12) while filtering.
-   **Fix:** If you see a Firebase error with a link, click it to automatically create the required index.
