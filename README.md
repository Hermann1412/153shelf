# 📚 153Shelf — Full Stack eCommerce Bookstore

> A complete eCommerce web application built with the **MERN Stack**
> (MongoDB · Express · React · Node.js) featuring real-world features,
> clean code, and modern tools.

**Author:** Hermann N'zi Ngenda
**Stack:** MERN | **Payments:** Stripe | **Auth:** JWT

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Scripts](#-scripts)

---

## 🛠 Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React.js, React Router, Axios     |
| Backend    | Node.js, Express.js               |
| Database   | MongoDB, Mongoose                 |
| Auth       | JWT, Cookie Parser                |
| Payments   | Stripe, Stripe Webhooks           |
| Validation | Validator.js                      |
| Dev Tools  | Nodemon, Postman                  |

---

## ✨ Features

### 🔧 Frontend (React.js)

- **React Hooks** — `useState`, `useEffect`, `useLocation`, `useContext`
- **React Router** — Dynamic routing and nested routes
- **Pagination** — Load products efficiently with pagination
- **Reusable Components** — Clean and modular UI architecture
- **State Management** — Local and shared state handling
- **Form Handling & Validation** — Manage user inputs and errors
- **Protected Routes** — Hide pages based on authentication status
- **Admin Dashboard** — Manage users, products, and orders
- **Search & Filtering** — Search products by name and category
- **Loading & Toast Alerts** — User feedback with loaders and messages
- **Responsive Design** — Mobile-first UI

### ⚙️ Backend (Node.js + Express)

- **REST APIs** — CRUD operations for products, users, orders, and carts
- **Data Validation** — Validate all inputs with `validator`
- **Authentication** — JWT-based login and register flow
- **Authorization** — Middleware to protect routes and roles (admin/user)
- **Controllers & Routes** — Organized and scalable code structure
- **CORS Setup** — Handle cross-origin requests
- **Cookie Parser** — Manage JWTs and sessions
- **Error Handling** — Centralized and consistent error responses

### 🗄 Database (MongoDB + Mongoose)

- **Schema Design** — Models for users, products, orders, and carts
- **Relationships** — Use `.populate()` for linked data
- **CRUD with Mongoose** — Create, read, update & delete records
- **Query Filters** — Search and filter products

### 💳 Payments (Stripe)

- **Stripe Integration** — Accept payments securely
- **Stripe Webhooks** — Handle payment success and failure events
- **Checkout Flow** — End-to-end payment with cart and order management

---

## 📁 Project Structure

```
153Shelf/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification
│   │   └── adminMiddleware.js    # Role-based access
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Cart.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   └── userRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ProductCard.jsx
    │   │   ├── Pagination.jsx
    │   │   └── Toast.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── ProductDetail.jsx
    │   │   ├── Cart.jsx
    │   │   ├── Checkout.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── admin/
    │   │       ├── Dashboard.jsx
    │   │       ├── ManageProducts.jsx
    │   │       ├── ManageOrders.jsx
    │   │       └── ManageUsers.jsx
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.x
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- Stripe account ([stripe.com](https://stripe.com))

### 1. Clone the repository

```bash
git clone https://github.com/your-username/153Shelf.git
cd 153Shelf
```

### 2. Setup the Backend

```bash
cd backend
npm install
```

### 3. Setup the Frontend

```bash
cd ../frontend
npm install
```

### 4. Configure environment variables

Create `.env` files in both `backend/` and `frontend/` — see [Environment Variables](#-environment-variables) below.

### 5. Run the application

```bash
# Terminal 1 — Backend (runs on port 5000)
cd backend
npx nodemon server.js

# Terminal 2 — Frontend (runs on port 5173)
cd frontend
npm run dev
```

---

## 🔐 Environment Variables

### `backend/.env`

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/153shelf
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

STRIPE_SECRET_KEY=sk_test_your_stripe_secret
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### `frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint             | Description              | Access  |
|--------|----------------------|--------------------------|---------|
| POST   | `/api/auth/register` | Register a new user      | Public  |
| POST   | `/api/auth/login`    | Login and receive JWT    | Public  |
| POST   | `/api/auth/logout`   | Clear auth cookie        | Private |

### Products
| Method | Endpoint               | Description                    | Access  |
|--------|------------------------|--------------------------------|---------|
| GET    | `/api/products`        | Get all products (+ filters)   | Public  |
| GET    | `/api/products/:id`    | Get single product             | Public  |
| POST   | `/api/products`        | Create a product               | Admin   |
| PUT    | `/api/products/:id`    | Update a product               | Admin   |
| DELETE | `/api/products/:id`    | Delete a product               | Admin   |

### Orders
| Method | Endpoint               | Description                    | Access  |
|--------|------------------------|--------------------------------|---------|
| POST   | `/api/orders`          | Create a new order             | Private |
| GET    | `/api/orders/mine`     | Get logged-in user's orders    | Private |
| GET    | `/api/orders`          | Get all orders                 | Admin   |
| PUT    | `/api/orders/:id`      | Update order status            | Admin   |

### Users
| Method | Endpoint               | Description                    | Access  |
|--------|------------------------|--------------------------------|---------|
| GET    | `/api/users/profile`   | Get current user profile       | Private |
| PUT    | `/api/users/profile`   | Update profile                 | Private |
| GET    | `/api/users`           | Get all users                  | Admin   |
| DELETE | `/api/users/:id`       | Delete a user                  | Admin   |

### Payments
| Method | Endpoint                      | Description                   | Access  |
|--------|-------------------------------|-------------------------------|---------|
| POST   | `/api/payments/create-intent` | Create Stripe payment intent  | Private |
| POST   | `/api/payments/webhook`       | Handle Stripe webhook events  | Public  |

---

## 📜 Scripts

### Backend

```bash
npm run dev       # Start with nodemon (development)
npm start         # Start without nodemon (production)
```

### Frontend

```bash
npm run dev       # Start Vite dev server
npm run build     # Build for production
npm run preview   # Preview production build
```

---

## 🧪 Testing APIs with Postman

1. Import the collection from `/backend/postman/153Shelf.postman_collection.json`
2. Set environment variable `base_url = http://localhost:5000`
3. Run auth requests first to get JWT token
4. Token is automatically stored in cookie for subsequent requests

---

## 🌐 Deployment

| Service    | Platform                  |
|------------|---------------------------|
| Frontend   | Vercel / Netlify          |
| Backend    | Render / Railway / Heroku |
| Database   | MongoDB Atlas             |
| Payments   | Stripe (live keys)        |

---

## 📌 Best Practices Applied

- ✅ Folder structure follows separation of concerns
- ✅ Reusable logic extracted into hooks and utilities
- ✅ Centralized error handling on both frontend and backend
- ✅ Environment variables for all secrets — never hardcoded
- ✅ Mobile-first responsive design
- ✅ Role-based access control (user / admin)
- ✅ Consistent API response format

---

## 📖 About the Name

> **153Shelf** — inspired by John 21:11, where 153 fish were caught in a
> net that did not break. A bookstore where knowledge is abundant
> and the shelf never runs out.

---

*Built with purpose by **Hermann N'zi Ngenda***
