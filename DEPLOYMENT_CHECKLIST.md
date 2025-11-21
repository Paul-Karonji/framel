# Framel Deployment Checklist

## Pre-Deployment

- [ ] All code committed to GitHub
- [ ] Environment variables documented
- [ ] Firebase project configured
- [ ] M-Pesa credentials ready
- [ ] Cloudinary account set up

## Backend Deployment (Render)

- [ ] Create Render account
- [ ] Connect GitHub repository
- [ ] Create new Web Service
- [ ] Configure build settings:
  - Build Command: `npm install && npm run build`
  - Start Command: `npm start`
- [ ] Add all environment variables
- [ ] Deploy and test health endpoint
- [ ] Note backend URL: `https://framel-backend.onrender.com`

## Frontend Deployment (Vercel)

- [ ] Create Vercel account
- [ ] Connect GitHub repository
- [ ] Import project (select frontend directory)
- [ ] Add environment variables
- [ ] Update NEXT_PUBLIC_API_URL with backend URL
- [ ] Deploy and test
- [ ] Note frontend URL: `https://framel.vercel.app`

## Post-Deployment

- [ ] Update CORS settings in backend with frontend URL
- [ ] Test user registration and login
- [ ] Test product browsing
- [ ] Test cart functionality
- [ ] Test wishlist
- [ ] Test checkout flow
- [ ] Test M-Pesa payment
- [ ] Test admin dashboard
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring
- [ ] Update Firebase security rules

## Environment Variables to Set

### Render (Backend)
```
NODE_ENV=production
PORT=10000
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
MPESA_CONSUMER_KEY=
MPESA_CONSUMER_SECRET=
MPESA_PASSKEY=
MPESA_SHORTCODE=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CORS_ORIGIN=https://framel.vercel.app
```

### Vercel (Frontend)
```
NEXT_PUBLIC_API_URL=https://framel-backend.onrender.com/api
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Troubleshooting

### Backend not responding
- Check Render logs
- Verify environment variables
- Free tier sleeps after 15min inactivity

### Frontend can't connect to backend
- Verify NEXT_PUBLIC_API_URL is correct
- Check CORS settings
- Check browser console for errors

### Firebase errors
- Verify all Firebase env vars are set
- Check Firebase console for errors
- Verify security rules are configured
