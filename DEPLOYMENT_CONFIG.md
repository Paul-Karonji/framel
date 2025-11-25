# 🚀 Framel Deployment Configuration

**IMPORTANT: This file contains your actual credentials. Keep it secure and DO NOT commit to Git!**

---

## 📦 VERCEL (Frontend) Environment Variables

Copy and paste these into Vercel's Environment Variables section:

```env
NEXT_PUBLIC_APP_NAME=Framel
NEXT_PUBLIC_APP_URL=https://framel.vercel.app
NEXT_PUBLIC_API_URL=https://YOUR-BACKEND-URL.onrender.com/api

NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCmCdkoBSIdibY6aCl8fDT2fyr2_PxsIJU
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=framel-production.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=framel-production
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=framel-production.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=157748127455
NEXT_PUBLIC_FIREBASE_APP_ID=1:157748127455:web:54bbef6f496fe98e74ab6a
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-LBZ5H26S6K

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=deiw3mdvi
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=framel_products

NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_PWA=false
```

### 📝 Vercel Deployment Steps:

1. **Go to [vercel.com/new](https://vercel.com/new)**
2. **Import your GitHub repository** (Framel)
3. **Configure Project:**
   - **Root Directory**: `frontend` ⚠️ IMPORTANT!
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

4. **Add Environment Variables:**
   - Click "Environment Variables"
   - Click "Paste .env" button
   - Paste the entire block above
   - ⚠️ **Update `NEXT_PUBLIC_API_URL`** after deploying backend

5. **Click Deploy**

---

## 🔧 RENDER (Backend) Environment Variables

Copy and paste these into Render's Environment Variables section:

```env
NODE_ENV=production
PORT=10000
CORS_ORIGIN=https://framel.vercel.app

FIREBASE_PROJECT_ID=framel-production
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@framel-production.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCmYbctrL42QT1x\nyuwsLDs8G9/BWPV+/DC9XxQoO1a3t+D/avRGRGWXgENww4Sc8usM66BbGyVegzsI\nLD4AK9Zf6E6gpu8c+NkjuAdFZ80o+Qc8tZM2aH9RT5Tu+MZkoeARaCJFu0CK1\nNpS\nCVRp1w0FKFfevYkdbGM789X4ap4HfSVn/+KFY3RKmnTCBqQq310/d7B+Ge692MY+\nt+Kt1DzOcTZzy/fAc3nF3vBRqOAtthIXkK0379D0ccHBb+p65vW62udxAACUgAox\nTTjTt3Tv1ilNj4bSVBuUpir9Jnt92WlBy0TNO2jpeN1Xz6fDuMlvhDpbbsUm8HBN\nKzBgLIGxAgMBAAECggEABlY7ohL70Z+7s90wghmE8\nZahhd1hHZf2GF9tnCn99QYd\nHPDSRlotwQexEPqSQNLr5zR2bPyLajO2/c3AO+FTGXxaK53jlPX1JBa8ne+Z+88e\n7/FhV5XCuytYYZ8zbrr6CHUFJggxU/EypCQCfjTNwMGziw0OoQKIg+kXCqrn/D8V\nAUUhJvrHwVRIZLm2V8XB8FwUotxJLUi3k+kgAlfJSB2cxDhLYEMafomJrDpeoB6Z\nl8F/yqM0DAk2kJPrIONyB\nd0Kbj20W3borZRjy6ZxssadqLOzWwXjrn1+WvTezJd1\nNKrnNS0eBspXUireQgN2n5Lzr9go+FIBf8loW1KaowKBgQDhr3HwUwZj7wlD7OZY\n5WbDQ1VBhW3hM8d3L0McOeorM/Rklts+rZBNgY6vKdG6gA7a57SVbhHNHOk8SX0+\nnWU3lzRn9W62tu6l/dSj95Wgn8gUMW2ZFDPflYs53R5cahZmhzWgbe9VzZZqwfe/\nD\n9+jrG6qFBKOZg2YsmQuZ69sbwKBgQC8uwTudBQRLDJgxJdpnq2dnSMxFNPdpyM+\nKhn3BlkXLiudQqWb/1WZk96j2wL2OMieGBKzxWOlQWD/CYH2lwciKwRUN+FFXqBG\n2MVbKi4OMSbUTzvvAHPdKuvKazntxwCHVYhrL5b1Sj0uO5HQzm3O58ssft+NS3vZ\nSLEf4MRD3wKBgB6PDRSHiXP6p/yElWQwG8wQz/iBQrGdu0K\nOKb4msWiMLml4a9N+\n2O1Fv7ZEKVvhfyFxAmjBcLOfWI2LPeQ+l7gBR11URFuFRadASYyyN5Z6TDM/xiFW\nNPfvXdzF7hiBXOshH8fLWv75SYbHIO7EDXoyHQH2mdSiSPEGJr6J150NAoGAbkWH\nuBuyreX4+XlkTp4cKv9pVIAq2lORz/yhdygKXfToHtaWFPO3fChd6bdJn7vF3DmM\nk+U9N41fsyRG/2F3FYu019Bemz2\nSwFJf3chjaH9nhJ1XE2pcSFmPs5G7IycnM+vR\n7W688U0TOjQsGqjCmCXvHGx1CgWUs3w5obqeclkCgYAd1WNPxOTXU6P+AIlim21D\nrDnRM8EqFNcBoAO876Hn5uKlZoRiXNOs3ISXkIeSbhzomV91WpHLYsFwILiVOvre\n5hQPtlCUgxTzLv0tTgEK2zJoU+B1CB03mCMup2+Ci/Xz8v7JyYJavddBLSnGB9JA\nQ4MXdTZ\nmxwH1dG76mV6YTw==\n-----END PRIVATE KEY-----\n"

MPESA_ENVIRONMENT=sandbox
MPESA_CONSUMER_KEY=WRiDwVk7qDENnH462QTJVvuB4lWp1yWBO5QGjvAjPCaH4qWf
MPESA_CONSUMER_SECRET=wmN1YdE0yawbiEgA40kQHTsMmuggXRSTzVkv6ywnc4HjAFYdJv5iMRyogEEXDDUa
MPESA_SHORTCODE=174379
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
MPESA_CALLBACK_URL=https://YOUR-BACKEND-URL.onrender.com/api/payment/callback

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=karonjipaul.w@gmail.com
SMTP_PASS=nexevogrnimxfjay
EMAIL_FROM=Framel Flowers <noreply@framel.co.ke>

CLOUDINARY_CLOUD_NAME=deiw3mdvi
CLOUDINARY_API_KEY=766843892945545
CLOUDINARY_API_SECRET=Wsi765ofTHLYFFwdK3SioicL-Hg

JWT_SECRET=framel_super_secret_key_change_in_production_2024
SESSION_SECRET=framel_session_secret_key_2024

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp

LOG_LEVEL=info
```

### 📝 Render Deployment Steps:

1. **Go to [dashboard.render.com](https://dashboard.render.com)**
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository** (Framel)
4. **Configure Service:**
   - **Name**: `framel-backend` (or your choice)
   - **Root Directory**: `backend` ⚠️ IMPORTANT!
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main` or `master`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or paid if needed)

5. **Add Environment Variables:**
   - Scroll to "Environment Variables"
   - Click "Add from .env"
   - Paste the entire block above
   - ⚠️ **Update `CORS_ORIGIN`** with your Vercel URL after frontend deployment
   - ⚠️ **Update `MPESA_CALLBACK_URL`** with your Render URL

6. **Click "Create Web Service"**

7. **After deployment, copy your backend URL** (e.g., `https://framel-backend.onrender.com`)

---

## 🔄 Post-Deployment Updates

After both deployments are complete, you need to update these URLs:

### Update Vercel (Frontend):
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `NEXT_PUBLIC_API_URL` to: `https://YOUR-BACKEND-URL.onrender.com/api`
3. Click "Save"
4. Redeploy (Deployments → Latest → "Redeploy")

### Update Render (Backend):
1. Go to Render Dashboard → Your Service → Environment
2. Update `CORS_ORIGIN` to: `https://YOUR-FRONTEND-URL.vercel.app`
3. Update `MPESA_CALLBACK_URL` to: `https://YOUR-BACKEND-URL.onrender.com/api/payment/callback`
4. Click "Save Changes" (will auto-redeploy)

---

## ✅ Deployment Checklist

### Pre-Deployment:
- [x] All environment variables extracted
- [ ] GitHub repository is up to date
- [ ] `.env` files are in `.gitignore`
- [ ] Code is tested locally

### Deploy Backend (Render):
- [ ] Create Render account
- [ ] Create new Web Service
- [ ] Set root directory to `backend`
- [ ] Set build command: `npm install && npm run build`
- [ ] Set start command: `npm start`
- [ ] Paste all backend environment variables
- [ ] Deploy
- [ ] Wait for deployment to complete (~5-10 minutes)
- [ ] Copy backend URL
- [ ] Test health endpoint: `https://YOUR-URL.onrender.com/health`

### Deploy Frontend (Vercel):
- [ ] Create Vercel account
- [ ] Import GitHub repository
- [ ] Set root directory to `frontend`
- [ ] Paste all frontend environment variables
- [ ] Update `NEXT_PUBLIC_API_URL` with backend URL
- [ ] Deploy
- [ ] Wait for deployment to complete (~2-5 minutes)
- [ ] Copy frontend URL
- [ ] Test homepage loads

### Post-Deployment:
- [ ] Update Render `CORS_ORIGIN` with Vercel URL
- [ ] Update Render `MPESA_CALLBACK_URL` with backend URL
- [ ] Update Vercel `NEXT_PUBLIC_APP_URL` with Vercel URL
- [ ] Redeploy both services
- [ ] Test user registration
- [ ] Test login/logout
- [ ] Test product browsing
- [ ] Test cart functionality
- [ ] Test checkout flow
- [ ] Test M-Pesa payment
- [ ] Test admin dashboard

---

## 🎯 Quick Start - Deploy Now!

### Option 1: Deploy Backend First (Recommended)

1. **Deploy to Render:**
   - Go to [dashboard.render.com/select-repo](https://dashboard.render.com/select-repo)
   - Follow Render deployment steps above
   - Copy your backend URL

2. **Deploy to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Follow Vercel deployment steps above
   - Use the backend URL you just got

3. **Update CORS:**
   - Go back to Render
   - Update `CORS_ORIGIN` with your Vercel URL
   - Service will auto-redeploy

### Option 2: Deploy Frontend First

1. **Deploy to Vercel:**
   - Use placeholder API URL: `https://placeholder.com/api`
   - Deploy frontend

2. **Deploy to Render:**
   - Use your Vercel URL for `CORS_ORIGIN`
   - Deploy backend

3. **Update Frontend:**
   - Update `NEXT_PUBLIC_API_URL` in Vercel
   - Redeploy

---

## 🔐 Security Notes

> [!CAUTION]
> **This file contains sensitive credentials!**
> - Keep this file secure
> - DO NOT commit to Git
> - DO NOT share publicly
> - Consider adding to `.gitignore`

> [!WARNING]
> **Production Security Recommendations:**
> - Change `JWT_SECRET` and `SESSION_SECRET` to stronger values
> - Use production M-Pesa credentials (not sandbox)
> - Enable Firebase security rules
> - Set up proper CORS policies
> - Enable rate limiting
> - Use environment-specific secrets

---

## 📞 Support Links

- **Vercel Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard)
- **Render Dashboard**: [dashboard.render.com](https://dashboard.render.com)
- **Firebase Console**: [console.firebase.google.com](https://console.firebase.google.com)
- **Cloudinary Console**: [cloudinary.com/console](https://cloudinary.com/console)
- **M-Pesa Daraja**: [developer.safaricom.co.ke](https://developer.safaricom.co.ke)

---

## 🐛 Troubleshooting

### Build Fails on Render:
- Check build logs in Render dashboard
- Verify `backend` is set as root directory
- Ensure all environment variables are set

### Build Fails on Vercel:
- Check build logs in Vercel dashboard
- Verify `frontend` is set as root directory
- Ensure all `NEXT_PUBLIC_*` variables are set

### CORS Errors:
- Verify `CORS_ORIGIN` in backend matches your Vercel URL exactly
- Check for trailing slashes
- Redeploy backend after updating

### API Connection Errors:
- Verify `NEXT_PUBLIC_API_URL` ends with `/api`
- Check backend is running and accessible
- Test backend health endpoint

### Firebase Errors:
- Verify all Firebase variables are correct
- Check Firebase console for errors
- Ensure private key has proper line breaks (`\n`)

---

## ✨ You're Ready to Deploy!

Everything is configured and ready. Choose your deployment order and follow the steps above.

**Recommended order:**
1. Deploy Backend to Render (get backend URL)
2. Deploy Frontend to Vercel (use backend URL)
3. Update CORS in backend
4. Test everything!

Good luck! 🚀
