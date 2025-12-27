# Project Tracking Report

Last updated: 2025-12-27

## Overview
- Backend: Express + MongoDB (Mongoose), JWT auth, products and users modules.
- Error handling: centralized error middleware with duplicate key guard.
- Auth: cookie-based JWT via `sendToken`, protected routes with role-based access.

## Recent Fixes
- Fixed ESM import paths and extensions in routes/controllers.
- Corrected `User` model import path in user controller.
- Added robust password hashing (bcryptjs) with proper `isModified` guard.
- Fixed duplicate key error handling (MongoDB code 11000) messaging.
- Standardized auth middleware to use `req.user` consistently.
- Simplified product controller by removing redundant try/catch (using async handler).
- Corrected `requestPasswordReset` to build proper reset URLs and return success when email sending is disabled.

## Key Endpoints
- Auth: `POST /api/v1/register`, `POST /api/v1/login`, `POST /api/v1/logout`
- Products: `GET /api/v1/products`, `POST /api/v1/products` (admin), `GET/PUT/DELETE /api/v1/product/:id`

## How to Run
1) Configure DB in `backend/config/config.env`
2) Install and start:
```
npm install
npm start
```

## Notes / Next Steps
- Forgot/reset email sending currently disabled (utility stubbed). If needed, wire SMTP and enable email send.
- Consider hiding `password` field in user responses explicitly (select projection) to reduce leakage risk.
- Add basic tests for auth and products to guard flows.