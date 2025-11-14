# 🌸 Framel - Quick Reference Card

## 🚀 Quick Start Commands

```bash
# Start Backend
cd framel/backend
npm install
npm run dev
# → http://localhost:5000

# Start Frontend (when ready)
cd framel/frontend
npm install
npm run dev
# → http://localhost:3000
```

## 🔑 Your Credentials (Backend .env is configured)

### Cloudinary
```
Cloud Name: deiw3mdvi
```

### Mpesa (Sandbox)
```
Shortcode: 174379
Test any Kenyan phone + any PIN
```

### Firebase
```
Project: framel-production
```

## 📡 API Endpoints (Current)

```
GET  /health              - Health check
GET  /api                 - API info
```

## 📁 Important Files

```
framel/
├── DELIVERY_SUMMARY.md         ← Read this first!
├── SETUP_GUIDE.md              ← Setup instructions
├── README.md                   ← Project overview
├── backend/
│   ├── .env                    ← All credentials here
│   ├── README.md               ← Backend docs
│   └── src/
│       ├── config/             ← API configurations
│       ├── app.ts              ← Express app
│       └── server.ts           ← Entry point
└── docs/
    └── DEVELOPMENT_GUIDE.md    ← Complete guide (500+ lines)
```

## 🧪 Test Your Setup

```bash
# 1. Install
cd backend && npm install

# 2. Start server
npm run dev

# 3. Test health check
curl http://localhost:5000/health

# 4. Check logs for:
✅ Firebase Admin initialized
✅ Email transporter ready
✅ Cloudinary configured
🚀 Server Running on Port 5000
```

## 📚 Documentation

1. **DELIVERY_SUMMARY.md** - What's been delivered
2. **SETUP_GUIDE.md** - How to set up
3. **DEVELOPMENT_GUIDE.md** - Complete build guide
4. **backend/README.md** - Backend specific docs

## 🔧 npm Scripts (Backend)

```bash
npm run dev      # Development with hot reload
npm run build    # Build TypeScript
npm start        # Production server
npm test         # Run tests
npm run lint     # Lint code
```

## 🎯 Development Phases

- ✅ **Phase 1:** Backend setup (DONE)
- 🔄 **Phase 2:** Frontend setup (NEXT)
- 📋 **Phase 3:** Authentication
- 📋 **Phase 4:** Product catalog
- 📋 **Phase 5:** Shopping cart
- 📋 **Phase 6:** Payments
- 📋 **Phase 7:** Admin dashboard

## 🆘 Quick Troubleshooting

### Server won't start
```bash
# Check Node version (need 18+)
node --version

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Firebase error
- Check `.env` file formatting
- Ensure private key has `\n` preserved

### Email not sending
- Remove spaces from app password
- Verify Gmail 2FA enabled

### Port 5000 in use
```bash
# Change in .env
PORT=5001
```

## 📞 Need Help?

1. Check logs for errors
2. Read DELIVERY_SUMMARY.md
3. Check DEVELOPMENT_GUIDE.md
4. Verify .env file

## 🎉 You're Ready!

All APIs configured and tested:
- ✅ Firebase (Database & Auth)
- ✅ Mpesa (Payments)
- ✅ Cloudinary (Images)
- ✅ Gmail (Emails)

**Start building!** 🚀
