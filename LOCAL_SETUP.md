# Local Full Stack Environment Guide

## 1. Environment Variables (.env Examples)

### Backend (`backend/.env`)
```env
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=dawwar

# OTP Dev Mode (Uses 1111 for all OTP requests)
OTP_SANDBOX=true
OTP_SANDBOX_CODE=1111
OTP_EXPIRES_SECONDS=120

# Mock Uploads (AWS Keys left empty will fallback to local /uploads directory automatically)
AWS_BUCKET_NAME=dawwar-uploads
UPLOAD_PUBLIC_BASE_URL=http://127.0.0.1:3000

# Paymob Dev Mode (Leave empty to simulate wallet/payout webhooks automatically)
PAYMOB_API_KEY=
PAYMOB_INTEGRATION_ID=
PAYMOB_HMAC_SECRET=
```

### Mobile Apps (`apps/*/ .env.development`)
```env
# Do NOT hardcode 10.0.2.2 here. The app dynamically determines the URL based on Platform/Env.
# To override for a PHYSICAL device, uncomment and use your LAN IP (e.g., 192.168.1.100).
# LOCAL_IP=192.168.1.100

USE_MOCK_API=false
```

### Admin Dashboard (`apps/admin/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

---

## 2. Startup Commands

### Backend Startup
Make sure Redis and Postgres are running (you can use `docker-compose up -d`).
```bash
cd backend
npm install
npm run dev
```

### Admin Startup
```bash
cd apps/admin
pnpm install
pnpm dev
```

### Mobile Startup
```bash
# Customer
cd apps/customer
npm install
npm run start # Start Metro
npm run android # Or npm run ios

# Driver
cd apps/driver
npm install
npm run start
npm run android

# Merchant
cd apps/merchant
npm install
npm run start
npm run android
```

---

## 3. Physical Device Setup Instructions

If you want to run the mobile apps on a physical device, `localhost` or `10.0.2.2` will not work.

1. Find your computer's local IP address (e.g., `192.168.1.5`).
   - Mac: `ipconfig getifaddr en0`
   - Linux: `hostname -I`
2. Create or modify `.env.development` in `apps/customer/`, `apps/driver/`, and `apps/merchant/` to include:
   ```env
   LOCAL_IP=192.168.1.5
   ```
3. The API client (`client.ts`) and Socket manager (`socket.ts`) are now programmed to read `LOCAL_IP` dynamically.
4. Restart your Metro bundler with cache cleared (`npm run start -- --reset-cache`).
5. Ensure your phone and computer are on the exact same WiFi network.
6. Install the app on your physical device (`npm run android` / `npm run ios`).

---

## 4. Local Development Fallbacks Overview

- **OTP Bypass:** Setting `OTP_SANDBOX=true` stops real SMS requests. OTP is always `1111` in dev.
- **Paymob Simulation:** Without Paymob API keys, the backend fakes wallet recharge webhooks automatically 1 second after requested, and marks payouts as `success`.
- **Upload Simulation:** Without S3 credentials in dev mode, the backend routes presigned URL `PUT` requests to a mock `upload/local-presigned` endpoint, and saves the binary streams locally into `/uploads`. A static server serves them at `http://localhost:3000/uploads/`.
- **Intelligent Networking:** The mobile API clients check `Platform.OS`. iOS uses `localhost`, Android uses `10.0.2.2`, and physical devices use `LOCAL_IP`.