# 153Shelf — Digital Bookstore

> A full-stack MERN web application where the admin uploads books and
> any registered user can browse and read them online — completely free.

**Author:** Hermann N'zi Ngenda  
**Stack:** MongoDB · Express · React (TypeScript) · Node.js  
**Auth:** JWT (httpOnly cookies)  
**Deployment:** Vercel (frontend) · Render (backend) · MongoDB Atlas

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Admin Setup](#admin-setup)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)

---

## Features

### For Users
- Browse all available books with search and category filters
- View book details (cover, author, description, pages)
- Register / log in to unlock reading access
- Read books directly in the browser (no download required)
- Personal library showing all available titles

### For Admin
- Upload books with cover image and PDF file
- Edit or delete any book
- Manage registered users
- View order/access history
- Secure admin panel — credentials stored in `.env` only, never in code

### Platform
- PDF streaming — served securely through authenticated API endpoint
- PDFs are never exposed as static files
- Role-based access control (user / admin)
- JWT stored in httpOnly cookies — XSS-safe
- Cross-domain cookie support for Vercel + Render deployment
- Fully responsive design

---

## Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | React 18, TypeScript, Vite, React Router v6     |
| Backend   | Node.js, Express.js                             |
| Database  | MongoDB Atlas, Mongoose                         |
| Auth      | JWT, httpOnly cookies, bcrypt                   |
| Uploads   | Multer (cover images + PDF files)               |
| UI        | Custom CSS, react-hot-toast                     |
| Dev Tools | Nodemon, TypeScript compiler                    |

---

## Project Structure

```
153Shelf/
├── backend/
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js       # register, login, logout
│   │   ├── productController.js    # CRUD + PDF streaming
│   │   ├── orderController.js      # order tracking
│   │   └── userController.js       # user management
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT cookie verification
│   │   ├── adminMiddleware.js      # role-based access
│   │   └── upload.js               # multer (covers + PDFs)
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   └── userRoutes.js
│   ├── scripts/
│   │   └── createAdmin.js          # one-time admin account setup
│   ├── uploads/
│   │   ├── covers/                 # public cover images
│   │   └── pdfs/                   # private — never exposed as static
│   ├── .env                        # secrets (gitignored)
│   ├── .env.example                # template
│   ├── render.yaml                 # Render deployment config
│   └── server.js
│
└── frontend/
    └── react/
        ├── src/
        │   ├── api/
        │   │   └── axios.ts         # Axios instance with credentials
        │   ├── components/
        │   │   ├── Navbar.tsx
        │   │   ├── ProductCard.tsx
        │   │   ├── Pagination.tsx
        │   │   └── ProtectedRoute.tsx
        │   ├── context/
        │   │   └── AuthContext.tsx
        │   ├── lib/
        │   │   └── config.ts        # API_URL, MEDIA_URL
        │   ├── pages/
        │   │   ├── Home.tsx
        │   │   ├── ProductDetail.tsx
        │   │   ├── Library.tsx      # user's reading list
        │   │   ├── Reader.tsx       # in-browser PDF viewer
        │   │   ├── Login.tsx
        │   │   ├── Register.tsx
        │   │   └── admin/
        │   │       ├── Dashboard.tsx
        │   │       ├── ManageProducts.tsx
        │   │       ├── ManageOrders.tsx
        │   │       └── ManageUsers.tsx
        │   ├── types/
        │   │   └── index.ts
        │   ├── App.tsx
        │   └── main.tsx
        ├── .env                     # secrets (gitignored)
        ├── .env.example             # template
        ├── vercel.json              # Vercel SPA routing
        └── package.json
```

---

## Getting Started

### Prerequisites

- Node.js >= 18.x
- MongoDB Atlas account — [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/153Shelf.git
cd 153Shelf
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../frontend/react
npm install
```

### 4. Set up environment variables

```bash
# Backend
cp backend/.env.example backend/.env
# Fill in your values (see Environment Variables section)

# Frontend
cp frontend/react/.env.example frontend/react/.env
# Fill in VITE_API_URL if needed (defaults to localhost:5000)
```

### 5. Run the application

```bash
# Terminal 1 — Backend (port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend/react
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Environment Variables

### `backend/.env`

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/153shelf

JWT_SECRET=your_long_random_secret_here
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173

NODE_ENV=development

# Admin account (used by scripts/createAdmin.js)
ADMIN_NAME=Your Name
ADMIN_EMAIL=your@email.com
ADMIN_PASSWORD=your_secure_password
```

### `frontend/react/.env`

```env
# Leave empty for local dev (Vite proxy handles it)
# Set this only for production:
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## Admin Setup

The admin account is created via a one-time script — credentials are never hardcoded in the source.

1. Fill in `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` in `backend/.env`
2. Make sure the backend is running and MongoDB is connected
3. Run:

```bash
cd backend
node scripts/createAdmin.js
```

4. Log in at `/login` with those credentials — the Admin link appears in the navbar automatically

---

## API Endpoints

### Auth
| Method | Endpoint             | Description           | Access  |
|--------|----------------------|-----------------------|---------|
| POST   | `/api/auth/register` | Register a new user   | Public  |
| POST   | `/api/auth/login`    | Login, sets JWT cookie | Public  |
| POST   | `/api/auth/logout`   | Clear auth cookie     | Private |
| GET    | `/api/auth/profile`  | Get current user      | Private |

### Books (Products)
| Method | Endpoint                  | Description                         | Access  |
|--------|---------------------------|-------------------------------------|---------|
| GET    | `/api/products`           | List all books (search, filter, page) | Public |
| GET    | `/api/products/:id`       | Get single book (no PDF path)       | Public  |
| GET    | `/api/products/:id/read`  | Stream PDF (authenticated users only) | Private |
| POST   | `/api/products`           | Upload new book (cover + PDF)       | Admin   |
| PUT    | `/api/products/:id`       | Update book                         | Admin   |
| DELETE | `/api/products/:id`       | Delete book                         | Admin   |

### Users
| Method | Endpoint             | Description           | Access  |
|--------|----------------------|-----------------------|---------|
| GET    | `/api/users`         | List all users        | Admin   |
| DELETE | `/api/users/:id`     | Delete a user         | Admin   |
| GET    | `/api/users/profile` | Get own profile       | Private |
| PUT    | `/api/users/profile` | Update own profile    | Private |

### Orders
| Method | Endpoint           | Description           | Access  |
|--------|--------------------|-----------------------|---------|
| GET    | `/api/orders`      | Get all orders        | Admin   |
| PUT    | `/api/orders/:id`  | Update order status   | Admin   |

---

## Deployment

### Backend → Render

1. Push code to GitHub
2. New Web Service → connect repo → set root to `backend/`
3. Build: `npm install` · Start: `npm start`
4. Add env vars in the Render dashboard (see `.env.example`)
5. After first deploy, open the **Shell** tab and run:
   ```bash
   node scripts/createAdmin.js
   ```

### Frontend → Vercel

1. New Project → import repo → set root to `frontend/react`
2. Add environment variable:
   ```
   VITE_API_URL = https://your-render-service.onrender.com/api
   ```
3. Deploy — `vercel.json` handles SPA routing automatically

> **Note:** Render free tier uses ephemeral storage — uploaded PDFs and cover
> images are wiped on redeploy. For persistent file storage in production,
> integrate Cloudinary or AWS S3.

---

## About the Name

> **153Shelf** — inspired by John 21:11, where 153 fish were caught in a
> net that did not break. A bookstore where knowledge is abundant
> and the shelf never runs out.

---

*Built with purpose by **Hermann N'zi Ngenda***
