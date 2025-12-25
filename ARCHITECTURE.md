# MERN E-Commerce Architecture

## System Overview
This document outlines the architecture and technical design of the MERN E-Commerce application.

## Tech Stack

### Frontend
- **Framework:** React.js
- **State Management:** Redux Toolkit / Context API
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **UI Framework:** Material-UI / Bootstrap / Tailwind CSS (TBD)
- **Form Handling:** Formik / React Hook Form
- **Build Tool:** Create React App / Vite

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcrypt
- **File Upload:** Multer
- **Validation:** express-validator / Joi
- **API Documentation:** Swagger (optional)

### DevOps & Tools
- **Version Control:** Git & GitHub
- **Code Quality:** ESLint, Prettier
- **Testing:** Jest, React Testing Library, Supertest
- **Deployment (Backend):** Heroku / Railway / Render
- **Deployment (Frontend):** Netlify / Vercel
- **Database Hosting:** MongoDB Atlas
- **Payment Gateway:** Stripe / Razorpay
- **Email Service:** SendGrid / NodeMailer
- **Image Hosting:** Cloudinary (optional)

## System Architecture

### High-Level Architecture
```
┌─────────────┐       HTTP/HTTPS        ┌──────────────┐
│   React     │ ◄──────────────────────► │   Express    │
│  Frontend   │      REST API            │   Backend    │
└─────────────┘                          └──────────────┘
                                                │
                                                │
                                                ▼
                                         ┌──────────────┐
                                         │   MongoDB    │
                                         │   Database   │
                                         └──────────────┘
```

### Component Architecture

#### Frontend Components
```
src/
├── components/
│   ├── common/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   ├── Loader.jsx
│   │   └── ErrorMessage.jsx
│   ├── product/
│   │   ├── ProductCard.jsx
│   │   ├── ProductList.jsx
│   │   ├── ProductDetails.jsx
│   │   └── ProductFilter.jsx
│   ├── cart/
│   │   ├── CartItem.jsx
│   │   └── CartSummary.jsx
│   ├── user/
│   │   ├── LoginForm.jsx
│   │   ├── RegisterForm.jsx
│   │   └── ProfileForm.jsx
│   └── admin/
│       ├── AdminSidebar.jsx
│       ├── ProductManager.jsx
│       └── OrderManager.jsx
├── pages/
│   ├── HomePage.jsx
│   ├── ProductPage.jsx
│   ├── CartPage.jsx
│   ├── CheckoutPage.jsx
│   ├── OrderHistoryPage.jsx
│   ├── LoginPage.jsx
│   └── AdminDashboard.jsx
├── context/ (or redux/)
│   ├── AuthContext.jsx
│   ├── CartContext.jsx
│   └── ProductContext.jsx
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── productService.js
│   └── orderService.js
└── utils/
    ├── helpers.js
    └── constants.js
```

#### Backend Structure
```
backend/
├── config/
│   ├── db.js              # Database connection
│   └── config.js          # Configuration settings
├── models/
│   ├── User.js            # User schema
│   ├── Product.js         # Product schema
│   ├── Order.js           # Order schema
│   └── Category.js        # Category schema
├── controllers/
│   ├── authController.js  # Authentication logic
│   ├── userController.js  # User operations
│   ├── productController.js
│   ├── orderController.js
│   └── adminController.js
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   └── adminRoutes.js
├── middleware/
│   ├── authMiddleware.js  # JWT verification
│   ├── adminMiddleware.js # Admin authorization
│   ├── errorMiddleware.js # Error handling
│   └── uploadMiddleware.js # File uploads
├── utils/
│   ├── generateToken.js
│   ├── sendEmail.js
│   └── helpers.js
└── server.js              # Entry point
```

## Database Schema

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (default: 'user', enum: ['user', 'admin']),
  phone: String,
  addresses: [{
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Product Schema
```javascript
{
  name: String (required),
  description: String (required),
  price: Number (required),
  category: ObjectId (ref: 'Category'),
  images: [String],
  stock: Number (default: 0),
  rating: Number (default: 0),
  numReviews: Number (default: 0),
  reviews: [{
    user: ObjectId (ref: 'User'),
    rating: Number,
    comment: String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Order Schema
```javascript
{
  user: ObjectId (ref: 'User', required),
  orderItems: [{
    product: ObjectId (ref: 'Product'),
    name: String,
    quantity: Number,
    price: Number,
    image: String
  }],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentMethod: String,
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String
  },
  itemsPrice: Number,
  taxPrice: Number,
  shippingPrice: Number,
  totalPrice: Number,
  isPaid: Boolean (default: false),
  paidAt: Date,
  isDelivered: Boolean (default: false),
  deliveredAt: Date,
  orderStatus: String (enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  createdAt: Date,
  updatedAt: Date
}
```

### Category Schema
```javascript
{
  name: String (required, unique),
  description: String,
  image: String,
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password

### User Routes
- `GET /api/users/profile` - Get user profile (Protected)
- `PUT /api/users/profile` - Update user profile (Protected)
- `GET /api/users/:id` - Get user by ID (Admin)
- `GET /api/users` - Get all users (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)

### Product Routes
- `GET /api/products` - Get all products (with pagination, search, filter)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `POST /api/products/:id/reviews` - Add product review (Protected)

### Order Routes
- `POST /api/orders` - Create new order (Protected)
- `GET /api/orders` - Get all orders (Admin)
- `GET /api/orders/myorders` - Get user's orders (Protected)
- `GET /api/orders/:id` - Get order by ID (Protected)
- `PUT /api/orders/:id/pay` - Update order to paid (Protected)
- `PUT /api/orders/:id/deliver` - Update order to delivered (Admin)
- `DELETE /api/orders/:id` - Cancel order (Protected/Admin)

### Admin Routes
- `GET /api/admin/dashboard` - Get dashboard statistics (Admin)
- `GET /api/admin/sales` - Get sales data (Admin)

## Security Measures

### Authentication & Authorization
- JWT tokens for stateless authentication
- HTTP-only cookies for token storage
- Role-based access control (user, admin)
- Password hashing with bcrypt (salt rounds: 10)

### Data Protection
- Input validation and sanitization
- MongoDB injection prevention
- XSS protection (helmet.js)
- CORS configuration
- Rate limiting on API endpoints
- HTTPS in production

### Best Practices
- Environment variables for sensitive data
- Secure password requirements
- Token expiration handling
- Error messages without sensitive info
- Regular dependency updates

## Performance Optimization

### Frontend
- Code splitting and lazy loading
- Image optimization
- Caching strategies
- Minimize bundle size
- Use production builds

### Backend
- Database indexing
- Query optimization
- Pagination for large datasets
- Caching with Redis (optional)
- Compression middleware

## Error Handling

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

### Error Response Format
```javascript
{
  success: false,
  error: {
    message: "Error message",
    statusCode: 400,
    stack: "..." // Only in development
  }
}
```

## Future Enhancements

- Real-time notifications (Socket.io)
- Advanced search with Elasticsearch
- Product recommendations
- Inventory management
- Multi-language support
- Mobile app (React Native)
- Progressive Web App (PWA)
- Email notifications
- Social media integration
- Analytics dashboard

## Development Phases

Refer to `PROJECT_ROADMAP.md` for detailed development phases and milestones.

---

Last Updated: December 25, 2025
