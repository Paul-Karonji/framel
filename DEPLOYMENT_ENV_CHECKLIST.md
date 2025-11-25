# Environment Variables Deployment Checklist

Based on your working local setup, here's what you need for deployment.

---

## ✅ Backend Environment Variables (for Render/Railway)

Since your backend is working locally, you have these values in your `.env` file. You'll need to copy them to your deployment platform:

### Required Variables:

```env
# Server Configuration
NODE_ENV=production
PORT=10000

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"

# M-Pesa Configuration
MPESA_ENVIRONMENT=sandbox
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_SHORTCODE=your_shortcode
MPESA_PASSKEY=your_passkey
MPESA_CALLBACK_URL=https://your-backend-url.onrender.com/api/payments/mpesa/callback

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS Configuration
CORS_ORIGIN=https://framel.vercel.app

# Email Configuration (Optional but recommended)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=Framel Flowers <noreply@framel.co.ke>

# Site Configuration
SITE_URL=https://framel.vercel.app
SUPPORT_EMAIL=support@framel.co.ke

# Rate Limiting (Optional)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 📝 How to Get These Values:

**From Your Local `.env` File:**
1. Open `c:\Users\WAKE FRANSISCA\Documents\Career path\WIK\Framel\backend\.env`
2. Copy all the values you have there
3. You'll paste them into Render/Railway when deploying

**Important Notes:**
- ✅ You already have Firebase credentials (I see the service account JSON file)
- ✅ You already have M-Pesa credentials (working locally)
- ✅ You already have Cloudinary credentials (working locally)
- ⚠️ Update `CORS_ORIGIN` to your Vercel URL after deployment
- ⚠️ Update `MPESA_CALLBACK_URL` to your backend URL after deployment
- ⚠️ Update `SITE_URL` to your Vercel URL

---

## ✅ Frontend Environment Variables (for Vercel)

These are the variables your Next.js frontend needs:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api

# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 📝 How to Get These Values:

**From Your Local Frontend `.env.local` File:**
1. Open `c:\Users\WAKE FRANSISCA\Documents\Career path\WIK\Framel\frontend\.env.local`
2. Copy the Firebase configuration values
3. You'll paste them into Vercel when deploying

**For API URL:**
- After deploying backend to Render, you'll get a URL like: `https://framel-backend.onrender.com`
- Add `/api` at the end: `https://framel-backend.onrender.com/api`

---

## 🚀 Deployment Strategy

Since everything is working locally, here's the recommended deployment order:

### Option 1: Deploy Backend First (Recommended)
1. ✅ Deploy backend to Render
2. ✅ Get backend URL (e.g., `https://framel-backend.onrender.com`)
3. ✅ Deploy frontend to Vercel with correct `NEXT_PUBLIC_API_URL`
4. ✅ Update backend `CORS_ORIGIN` with Vercel URL
5. ✅ Test everything

### Option 2: Deploy Both Simultaneously
1. ✅ Deploy backend to Render
2. ✅ Deploy frontend to Vercel (use placeholder API URL)
3. ✅ Update frontend `NEXT_PUBLIC_API_URL` in Vercel
4. ✅ Update backend `CORS_ORIGIN` in Render
5. ✅ Redeploy both to apply changes

---

## 📋 Quick Deployment Checklist

### Before Deploying:
- [x] Backend working locally
- [x] Frontend working locally
- [x] All credentials in local `.env` files
- [ ] GitHub repository up to date
- [ ] `.env` files NOT committed to Git (check `.gitignore`)

### Backend Deployment (Render):
- [ ] Create Render account
- [ ] Connect GitHub repository
- [ ] Create new Web Service
- [ ] Set Root Directory to `backend`
- [ ] Set Build Command: `npm install && npm run build`
- [ ] Set Start Command: `npm start`
- [ ] Copy all environment variables from local `.env`
- [ ] Set `NODE_ENV=production`
- [ ] Set `PORT=10000`
- [ ] Deploy
- [ ] Copy backend URL

### Frontend Deployment (Vercel):
- [ ] Create Vercel account
- [ ] Connect GitHub repository
- [ ] Import project
- [ ] Set Root Directory to `frontend`
- [ ] Copy Firebase env vars from local `.env.local`
- [ ] Set `NEXT_PUBLIC_API_URL` with backend URL
- [ ] Deploy
- [ ] Copy frontend URL

### Post-Deployment:
- [ ] Update backend `CORS_ORIGIN` with Vercel URL
- [ ] Update backend `SITE_URL` with Vercel URL
- [ ] Update backend `MPESA_CALLBACK_URL` with backend URL
- [ ] Redeploy backend with updated variables
- [ ] Test user registration
- [ ] Test login/logout
- [ ] Test product browsing
- [ ] Test cart functionality
- [ ] Test checkout
- [ ] Test M-Pesa payment

---

## 🔍 Where Are Your Local Environment Files?

**Backend:**
- `.env` → `c:\Users\WAKE FRANSISCA\Documents\Career path\WIK\Framel\backend\.env`
- Firebase Service Account → `c:\Users\WAKE FRANSISCA\Documents\Career path\WIK\Framel\backend\framel-production-firebase-adminsdk-fbsvc-3a2d706deb.json`

**Frontend:**
- `.env.local` → `c:\Users\WAKE FRANSISCA\Documents\Career path\WIK\Framel\frontend\.env.local`

---

## ⚠️ Important Security Notes

> **DO NOT commit these files to Git:**
> - `.env`
> - `.env.local`
> - `.env.production`
> - `*.json` (Firebase service account files)

> **When copying to deployment platforms:**
> - Copy values one by one or use bulk paste
> - Double-check all values are correct
> - For `FIREBASE_PRIVATE_KEY`, keep the quotes and `\n` characters
> - Test in sandbox/development mode first

---

## 🎯 Next Steps

**Ready to deploy?**

1. **First, let's verify your local env files are complete:**
   - Check backend `.env` has all required variables
   - Check frontend `.env.local` has Firebase config

2. **Then choose deployment order:**
   - Backend first (recommended) or both together

3. **I'll guide you through each step!**

Would you like me to:
- A) Help you deploy backend to Render first?
- B) Help you deploy frontend to Vercel first?
- C) Show you how to deploy both together?
