# Deployment Guide - Dawwar

## Environment Variables (.env)
| Variable | Usage | Example |
| :--- | :--- | :--- |
| `API_BASE_URL` | Frontend connection to backend | `https://api.dawwar.com` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Auth token signing | (long random string) |
| `REDIS_URL` | Socket & Cache support | `redis://host:6379` |
| `PAYMOB_API_KEY` | Payment integration | (from dashboard) |
| `FIREBASE_SENDER_ID` | FCM Push support | (from firebase console) |

## Platform Setup

### 1. Backend (Node.js)
- Build: `pnpm build` (inside `/backend`).
- Migrate: `pnpm migration:run`.
- Start: `pnpm start:prod`.

### 2. Android (React Native)
- Configure `google-services.json` in `apps/customer/android/app`.
- Build APK: `cd android && ./gradlew assembleRelease`.
- New Architecture enabled by default in 0.84.

### 3. iOS (React Native)
- Configure `GoogleService-Info.plist` in Xcode.
- Install pods: `cd ios && pod install`.
- Production Build: Archive via Xcode using valid Provisioning Profiles.

## Production Checklist
- [ ] Verify SSL certificates.
- [ ] Set `USE_MOCK_API=false`.
- [ ] Configure S3 bucket for file uploads.
- [ ] Disable `console.log` via the `logger` utility.
- [ ] Ensure PGID/PID isolation in PM2 (if using Node process manager).
