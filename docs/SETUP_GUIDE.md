# 🌸 Framel Project - Complete Setup Guide

## ✅ All Credentials Configured!

Your Framel project is ready with all API credentials pre-configured.

## 📦 What's Been Created

### ✅ Backend (Complete)
- Express.js + TypeScript setup
- Firebase Admin SDK configured
- Mpesa Daraja API integrated
- Cloudinary for images
- Gmail SMTP for emails
- All dependencies listed
- Environment variables set

### 🔄 Frontend (Next Step)
- Will be created with Next.js 14
- TypeScript + Tailwind CSS
- All configurations ready

## 🚀 Quick Start

### Step 1: Initialize Backend

```bash
cd backend
npm install
npm run dev
```

Backend will start on: `http://localhost:5000`

### Step 2: Initialize Frontend (Coming Next)

```bash
cd frontend
npm install
npm run dev
```

Frontend will start on: `http://localhost:3000`

## 🔑 Configured Credentials

### ✅ Cloudinary
```
Cloud Name: deiw3mdvi
API Key: 766843892945545
API Secret: Wsi765ofTHLYFFwdK3SioicL-Hg
```

### ✅ Mpesa Daraja (Sandbox)
```
Environment: Sandbox (Testing)
Consumer Key: WRiDwVk7qDENnH462QTJVvuB4lWp1yWBO5QGjvAjPCaH4qWf
Consumer Secret: wmN1YdE0yawbiEgA40kQHTsMmuggXRSTzVkv6ywnc4HjAFYdJv5iMRyogEEXDDUa
Shortcode: 174379
Passkey: bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
```

**Testing Info:**
- Any Kenyan phone number works
- Any 4-digit PIN works
- All payments succeed in sandbox

### ✅ Gmail SMTP
```
App Password: nexe vogr nimx fjay
App Name: Framel Backend
```

### ✅ Firebase
```
Project ID: framel-production
Service Account: Configured with private key
```

## 📁 Project Structure

```
framel/
├── backend/                    ✅ COMPLETE
│   ├── src/
│   │   ├── config/            ✅ All APIs configured
│   │   │   ├── firebase.ts
│   │   │   ├── mpesa.ts
│   │   │   ├── cloudinary.ts
│   │   │   └── email.ts
│   │   ├── app.ts             ✅ Express setup
│   │   └── server.ts          ✅ Server entry
│   ├── .env                   ✅ All credentials set
│   ├── package.json           ✅ All dependencies
│   └── tsconfig.json          ✅ TypeScript config
│
├── frontend/                   🔄 TO BE CREATED
│   └── (Next.js structure)
│
├── docs/                       📚 Documentation
│   └── DEVELOPMENT_GUIDE.md
│
└── README.md                   📖 Main README
```

## 🧪 Testing Your Setup

### Test Backend

```bash
cd backend

# Install dependencies
npm install

# Start server
npm run dev
```

Visit: `http://localhost:5000/health`

Should return:
```json
{
  "status": "OK",
  "timestamp": "2025-11-13T...",
  "environment": "development"
}
```

### Test Firebase Connection

Backend will log:
```
✅ Firebase Admin initialized successfully
```

### Test Email Service

Backend will log:
```
✅ Email transporter ready
```

### Test Cloudinary

Backend will log:
```
✅ Cloudinary configured successfully
```

## 📋 Development Checklist

### Backend ✅
- [x] Project structure created
- [x] Dependencies configured
- [x] Environment variables set
- [x] Firebase Admin SDK configured
- [x] Mpesa API configured
- [x] Cloudinary configured
- [x] Email service configured
- [x] TypeScript setup
- [x] Express app created
- [x] Basic middleware added

### Frontend (Next)
- [ ] Next.js project initialized
- [ ] Tailwind CSS configured
- [ ] Firebase client SDK setup
- [ ] API client configured
- [ ] Components structure
- [ ] Authentication pages
- [ ] Product pages
- [ ] Cart functionality
- [ ] Checkout flow

### Features (After Setup)
- [ ] User authentication
- [ ] Product catalog
- [ ] Shopping cart
- [ ] Checkout process
- [ ] Mpesa payments
- [ ] Order management
- [ ] Admin dashboard
- [ ] Email notifications

## 🎯 Next Steps

### 1. Test Backend Setup (5 minutes)
```bash
cd backend
npm install
npm run dev
```

### 2. Create Frontend (Will do next)
- Initialize Next.js
- Configure all settings
- Create initial pages

### 3. Start Building Features
- Authentication system
- Product catalog
- Shopping cart
- Payment integration

## 🔧 Environment Variables

All set in `/backend/.env`:

✅ Server configuration
✅ Firebase credentials
✅ Mpesa API keys
✅ Cloudinary config
✅ Email SMTP settings
✅ Security keys

## 📚 Documentation Available

1. **Main README**: `/README.md`
2. **Development Guide**: `/docs/DEVELOPMENT_GUIDE.md` (500+ lines)
3. **Backend README**: `/backend/README.md`
4. **API Documentation**: Coming soon
5. **Database Schema**: In Development Guide

## 🆘 Common Issues & Solutions

### Issue: npm install fails
**Solution**: Make sure Node.js 18+ is installed
```bash
node --version  # Should be 18+
```

### Issue: Firebase connection error
**Solution**: Check the private key formatting in `.env`
- Ensure `\n` are preserved
- No extra quotes around the key

### Issue: Email not sending
**Solution**: 
- Remove spaces from app password
- Check Gmail 2FA is enabled
- Verify app password is correct

### Issue: Mpesa callback not working
**Solution**: In development, use ngrok or localtunnel for public URL

## 🎉 You're All Set!

All APIs configured and ready to go:
- ✅ Firebase (Database & Auth)
- ✅ Mpesa (Payments)
- ✅ Cloudinary (Images)
- ✅ Gmail (Emails)

**Time to start building!** 🚀

---

## 📞 Need Help?

- Check the Development Guide
- Review Backend README
- Test each service individually
- Check logs for specific errors

**Everything is configured - you're ready to code!** 🌸
