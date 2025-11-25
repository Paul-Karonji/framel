# Framel - Environment Variables Quick Reference

This document contains all the environment variables you'll need for deploying Framel.

---

## 🎯 Frontend (Vercel) Environment Variables

Copy and paste these into Vercel's environment variables section:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

### Where to Get These Values:

#### Firebase Configuration
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click ⚙️ (Settings) → **Project Settings**
4. Scroll to **Your apps** → Select your web app (or create one)
5. Copy the values from the `firebaseConfig` object:

```javascript
const firebaseConfig = {
  apiKey: "...",              // → NEXT_PUBLIC_FIREBASE_API_KEY
  authDomain: "...",          // → NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  projectId: "...",           // → NEXT_PUBLIC_FIREBASE_PROJECT_ID
  storageBucket: "...",       // → NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "...",   // → NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  appId: "..."                // → NEXT_PUBLIC_FIREBASE_APP_ID
};
```

#### Backend API URL
- If using **Render**: `https://your-app-name.onrender.com/api`
- If using **Railway**: `https://your-app-name.up.railway.app/api`
- If using **Heroku**: `https://your-app-name.herokuapp.com/api`

> **Important**: Don't forget the `/api` at the end!

---

## 🔧 Backend (Render/Railway) Environment Variables

```env
NODE_ENV=production
PORT=10000

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com

# M-Pesa Configuration
MPESA_CONSUMER_KEY=your_mpesa_consumer_key
MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
MPESA_PASSKEY=your_mpesa_passkey
MPESA_SHORTCODE=your_mpesa_shortcode

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# CORS Configuration
CORS_ORIGIN=https://framel.vercel.app
```

### Where to Get These Values:

#### Firebase Admin SDK
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click ⚙️ → **Project Settings** → **Service Accounts**
3. Click **Generate New Private Key**
4. Download the JSON file
5. Extract values:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep the quotes and `\n` characters)
   - `client_email` → `FIREBASE_CLIENT_EMAIL`

#### M-Pesa Credentials
1. Go to [Safaricom Daraja Portal](https://developer.safaricom.co.ke/)
2. Log in to your account
3. Go to **My Apps**
4. Select your app or create a new one
5. Copy:
   - Consumer Key → `MPESA_CONSUMER_KEY`
   - Consumer Secret → `MPESA_CONSUMER_SECRET`
6. For Lipa Na M-Pesa Online:
   - Business Short Code → `MPESA_SHORTCODE`
   - Passkey → `MPESA_PASSKEY`

#### Cloudinary Configuration
1. Go to [Cloudinary Console](https://cloudinary.com/console)
2. Log in to your account
3. From the Dashboard, copy:
   - Cloud Name → `CLOUDINARY_CLOUD_NAME`
   - API Key → `CLOUDINARY_API_KEY`
   - API Secret → `CLOUDINARY_API_SECRET`

#### CORS Origin
- Set this to your Vercel deployment URL
- Example: `https://framel.vercel.app`
- You can add multiple origins separated by commas if needed

---

## 📋 Deployment Checklist

### Before Deploying:

- [ ] Firebase project created and configured
- [ ] Firebase web app registered
- [ ] Firebase Admin SDK service account key downloaded
- [ ] M-Pesa app created on Daraja portal
- [ ] Cloudinary account created
- [ ] All credentials collected and ready

### Vercel Deployment:

- [ ] Vercel account created
- [ ] GitHub repository connected
- [ ] Root directory set to `frontend`
- [ ] All frontend environment variables added
- [ ] Deployment successful
- [ ] Application loads without errors

### Backend Deployment (Render):

- [ ] Render account created
- [ ] GitHub repository connected
- [ ] All backend environment variables added
- [ ] Build command: `npm install && npm run build`
- [ ] Start command: `npm start`
- [ ] Deployment successful
- [ ] Health endpoint accessible

### Post-Deployment:

- [ ] Update `CORS_ORIGIN` in backend with Vercel URL
- [ ] Update `NEXT_PUBLIC_API_URL` in Vercel with backend URL
- [ ] Test user registration
- [ ] Test login/logout
- [ ] Test product browsing
- [ ] Test cart functionality
- [ ] Test checkout flow
- [ ] Test M-Pesa payment

---

## 🚨 Important Security Notes

> **Never commit these files to Git:**
> - `.env`
> - `.env.local`
> - `.env.production`
> - Firebase service account JSON files

> **Environment Variable Rules:**
> - Frontend variables MUST start with `NEXT_PUBLIC_`
> - Backend secrets should NEVER be in frontend
> - Keep Firebase private key secure
> - Rotate API keys regularly

---

## 🔗 Useful Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Render Dashboard](https://dashboard.render.com/)
- [Firebase Console](https://console.firebase.google.com/)
- [Safaricom Daraja Portal](https://developer.safaricom.co.ke/)
- [Cloudinary Console](https://cloudinary.com/console)

---

## 📞 Need Help?

If you're missing any credentials or need help setting up:
1. Check the main deployment guide: `VERCEL_DEPLOYMENT_GUIDE.md`
2. Review Firebase documentation
3. Check M-Pesa integration guide
4. Verify all services are properly configured
