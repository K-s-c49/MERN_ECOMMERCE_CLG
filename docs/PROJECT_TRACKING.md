# Project Tracking Report

Last updated: 2025-12-29

## Overview
- Backend: Express + MongoDB (Mongoose), JWT auth, products and users modules.
- Error handling: centralized error middleware with duplicate key guard.
- Auth: cookie-based JWT via `sendToken`, protected routes with role-based access.

## Recent Fixes
### 2025-12-29
- Hardened ObjectId validation across product/user flows to prevent CastErrors and return clean 404s.
- Completed `resetPassword` controller with token hash, expiry check, password update, and JWT response.
- Fixed product reviews: add/update review logic, safe guards when `reviews` is missing, and return updated product.
- Implemented reliable review deletion (existence check, removal, ratings/numOfReviews recompute, save).
- Cleaned `getsingleproduct` to validate id and return product consistently.
- Removed unused import from product routes; routes remain ESM-stable.

## Key Endpoints
- Auth: `POST /api/v1/register`, `POST /api/v1/login`, `POST /api/v1/logout`
- Products: `GET /api/v1/products`, `POST /api/v1/admin/products/create` (admin), `GET/PUT/DELETE /api/v1/admin/product/:id`
- Reviews: `PUT /api/v1/product/review` (auth), `GET /api/v1/product/reviews?id=<productId>`, `DELETE /api/v1/product/reviews?productId=<productId>&id=<reviewId>` (auth)

## Test Steps (Manual)
- Reset password:
	- Request: `POST /api/v1/password/forgot` with `{ email }` → receive reset URL.
	- Reset: `POST /api/v1/password/reset/:token` with `{ password, confirmPassword }` → receives JWT.
- Reviews:
	- Create/Update: `PUT /api/v1/product/review` with `{ rating, comment, productId }` (auth) → returns updated product.
	- List: `GET /api/v1/product/reviews?id=<productId>` → returns `reviews` array.
	- Delete: `DELETE /api/v1/product/reviews?productId=<productId>&id=<reviewId>` (auth) → success message.

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