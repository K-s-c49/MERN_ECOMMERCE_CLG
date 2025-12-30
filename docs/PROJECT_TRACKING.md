# Project Tracking Report

Last updated: 2025-12-30

## Overview
- Backend: Express + MongoDB (Mongoose), JWT auth, products, users, and orders modules.
- Error handling: centralized error middleware with duplicate key guard.
- Auth: cookie-based JWT via `sendToken`, protected routes with role-based access.

## Recent Fixes
### 2025-12-30
- Implemented complete order management system with controllers, models, and routes.
- Created `createorder` endpoint for users to place orders with shipping info, payment details, and order items.
- Built `getSingleOrder` with user population to fetch detailed order information.
- Added `allmyOrders` for users to view their order history.
- Implemented admin `getAllOrders` endpoint with total revenue calculation.
- Created `updateOrderStatus` admin controller with automatic stock adjustment on delivery.
- Fixed `updateQuantity` helper function - replaced undefined `next()` with proper error throwing.
- Corrected product existence validation logic in stock update helper.

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
- Orders: `POST /api/v1/order/new` (auth), `GET /api/v1/order/:id` (auth), `GET /api/v1/orders/me` (auth), `GET /api/v1/admin/orders` (admin), `PUT /api/v1/admin/order/:id` (admin)

## Test Steps (Manual)
- Orders:
	- Create: `POST /api/v1/order/new` with order details (auth) → returns new order with 201 status.
	- Get Single: `GET /api/v1/order/:id` (auth) → returns order with populated user info.
	- My Orders: `GET /api/v1/orders/me` (auth) → returns all user's orders.
	- All Orders (Admin): `GET /api/v1/admin/orders` (admin) → returns all orders with total revenue.
	- Update Status (Admin): `PUT /api/v1/admin/order/:id` with `{ status: "Delivered" }` (admin) → updates status, reduces stock, sets deliveredAt.
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
- Order management fully integrated with automatic inventory tracking.
- Stock updates occur only when order status changes to "Delivered" to prevent premature deductions.
- Forgot/reset email sending currently disabled (utility stubbed). If needed, wire SMTP and enable email send.
- Consider hiding `password` field in user responses explicitly (select projection) to reduce leakage risk.
- Add basic tests for auth, products, and orders to guard flows.