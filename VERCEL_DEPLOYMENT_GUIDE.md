# Vercel Deployment Guide - Framel Frontend

This guide will walk you through deploying your Framel frontend to Vercel step by step.

## Prerequisites

- ✅ GitHub account with your Framel repository
- ✅ Vercel account (free tier is fine)
- ✅ Firebase project configured
- ✅ Backend API URL (if deploying backend separately)

---

## Step 1: Prepare Your Environment Variables

Before deploying, you need to gather all the environment variables. Based on your project, you'll need:

### Required Environment Variables

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

> [!IMPORTANT]
> **Where to find these values:**
> - **Firebase values**: Go to [Firebase Console](https://console.firebase.google.com/) → Your Project → Project Settings → General → Your apps → SDK setup and configuration
> - **API URL**: If deploying backend to Render, it will be `https://your-app-name.onrender.com/api`

### How to Get Your Firebase Config

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create one if you haven't)
3. Click the gear icon ⚙️ → **Project Settings**
4. Scroll down to **Your apps** section
5. If you haven't added a web app, click **Add app** → Web (</>) icon
6. Copy the `firebaseConfig` object values

---

## Step 2: Create a Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click **Sign Up**
3. Choose **Continue with GitHub** (recommended for easy integration)
4. Authorize Vercel to access your GitHub account

---

## Step 3: Import Your Project to Vercel

### Option A: Deploy from Vercel Dashboard (Recommended)

1. **Log in to Vercel Dashboard**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)

2. **Click "Add New..." → Project**
   - You'll see a button in the top right corner

3. **Import Git Repository**
   - You'll see a list of your GitHub repositories
   - Find **Framel** repository
   - Click **Import**

4. **Configure Project Settings**
   
   > [!WARNING]
   > This is critical! Your frontend is in a subdirectory.

   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: Click **Edit** and select `frontend` folder
   - **Build Command**: `npm run build` (default is fine)
   - **Output Directory**: `.next` (default is fine)
   - **Install Command**: `npm install` (default is fine)

5. **Add Environment Variables**
   
   Click **Environment Variables** section and add each variable:
   
   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_API_URL` | Your backend URL + `/api` |
   | `NEXT_PUBLIC_FIREBASE_API_KEY` | From Firebase Console |
   | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | From Firebase Console |
   | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | From Firebase Console |
   | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | From Firebase Console |
   | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | From Firebase Console |
   | `NEXT_PUBLIC_FIREBASE_APP_ID` | From Firebase Console |

   > [!TIP]
   > You can paste all variables at once by clicking "Paste .env" and pasting your environment variables in the format `KEY=value`

6. **Deploy**
   - Click **Deploy**
   - Wait for the build to complete (usually 2-5 minutes)
   - You'll see a success screen with your deployment URL

### Option B: Deploy Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to your frontend directory
cd "c:\Users\WAKE FRANSISCA\Documents\Career path\WIK\Framel\frontend"

# Login to Vercel
vercel login

# Deploy (follow the prompts)
vercel

# For production deployment
vercel --prod
```

---

## Step 4: Verify Your Deployment

1. **Check Build Logs**
   - In Vercel dashboard, click on your deployment
   - Go to **Deployments** tab
   - Click on the latest deployment
   - Check the **Build Logs** for any errors

2. **Test Your Application**
   - Click on the deployment URL (e.g., `https://framel.vercel.app`)
   - Test the following:
     - [ ] Homepage loads correctly
     - [ ] Images and assets load
     - [ ] Navigation works
     - [ ] Firebase authentication (if backend is ready)
     - [ ] API calls work (if backend is deployed)

3. **Check Browser Console**
   - Open Developer Tools (F12)
   - Look for any errors in the Console tab
   - Common issues:
     - CORS errors (backend needs to allow your Vercel domain)
     - Environment variable issues (check if all variables are set)
     - API connection errors (verify `NEXT_PUBLIC_API_URL`)

---

## Step 5: Configure Custom Domain (Optional)

1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Domains**
3. Add your custom domain
4. Follow Vercel's instructions to update your DNS records
5. Wait for DNS propagation (can take up to 48 hours)

---

## Step 6: Set Up Automatic Deployments

Vercel automatically deploys when you push to GitHub:

- **Production**: Pushes to `main` or `master` branch
- **Preview**: Pushes to other branches or pull requests

To configure:
1. Go to **Settings** → **Git**
2. Configure which branch should trigger production deployments
3. Enable/disable automatic deployments for preview branches

---

## Troubleshooting

### Build Fails

**Error: "Cannot find module 'next'"**
- **Solution**: Make sure Root Directory is set to `frontend`

**Error: Environment variables not found**
- **Solution**: Add all required `NEXT_PUBLIC_*` variables in Vercel dashboard

**Error: Build exceeds time limit**
- **Solution**: Check for infinite loops or large dependencies

### Runtime Errors

**CORS Error**
- **Solution**: Update your backend's CORS configuration to include your Vercel domain:
  ```javascript
  // In your backend
  const corsOptions = {
    origin: ['https://framel.vercel.app', 'https://your-custom-domain.com'],
    credentials: true
  };
  ```

**API Connection Failed**
- **Solution**: Verify `NEXT_PUBLIC_API_URL` is correct and includes `/api` at the end
- **Solution**: Make sure your backend is deployed and accessible

**Firebase Errors**
- **Solution**: Double-check all Firebase environment variables
- **Solution**: Verify Firebase project is active and properly configured

### Performance Issues

**Slow Initial Load**
- Enable Vercel Analytics to identify bottlenecks
- Optimize images using Next.js Image component
- Enable caching headers

---

## Post-Deployment Checklist

- [ ] Deployment successful
- [ ] Application loads without errors
- [ ] All pages are accessible
- [ ] Firebase authentication works
- [ ] API calls to backend work
- [ ] Images and assets load correctly
- [ ] Mobile responsive design works
- [ ] Update backend CORS to include Vercel URL
- [ ] Set up custom domain (optional)
- [ ] Enable Vercel Analytics (optional)
- [ ] Configure monitoring/alerts

---

## Important Notes

> [!CAUTION]
> **Security Reminders:**
> - Never commit `.env` files to Git
> - All frontend environment variables must start with `NEXT_PUBLIC_`
> - Backend secrets should NEVER be in frontend environment variables
> - Regularly rotate API keys and secrets

> [!TIP]
> **Pro Tips:**
> - Use Vercel's preview deployments to test changes before production
> - Set up branch protection rules in GitHub
> - Enable Vercel Analytics for performance monitoring
> - Use Vercel's Edge Network for faster global delivery

---

## Next Steps

After deploying to Vercel:

1. **Deploy Backend** (if not already done)
   - Consider Render, Railway, or Heroku
   - Update `NEXT_PUBLIC_API_URL` in Vercel with the backend URL

2. **Update CORS Settings**
   - Add your Vercel URL to backend's allowed origins

3. **Test End-to-End**
   - User registration
   - Login/logout
   - Product browsing
   - Cart functionality
   - Checkout flow
   - M-Pesa payment (if applicable)

4. **Monitor**
   - Set up error tracking (e.g., Sentry)
   - Enable Vercel Analytics
   - Monitor backend logs

---

## Useful Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Firebase Console](https://console.firebase.google.com/)

---

## Need Help?

If you encounter issues:
1. Check Vercel build logs
2. Check browser console for errors
3. Verify all environment variables are set correctly
4. Check that backend is accessible and CORS is configured
5. Review Firebase configuration

**Common Commands:**
```bash
# Redeploy from CLI
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs [deployment-url]

# Remove deployment
vercel rm [deployment-name]
```
