# Nexus Backend - RESTful API Service

Backend API service for the **Nexus Social Media Platform**, developed as the Week 3 deliverable for the Full Stack Web Development Internship at CodeAlpha / Yuva Intern.

---

## Features
* **Authentication:** Stateless authentication using JSON Web Tokens (JWT) and `bcryptjs` password hashing.
* **RESTful CRUD Operations:** Full suite of endpoints for users, posts, feed pagination, likes, and comments.
* **Dual-Mode Persistence:** Native support for MongoDB Atlas / local MongoDB with an automatic resilient in-memory fallback for immediate zero-config evaluations.
* **Security & Error Handling:** Centralized error-handling middleware, input sanitization, and CORS headers.
* **Automated Test Suite:** Built-in integration tests covering all critical API routes with `supertest` and Node's test runner.

---

## Directory Structure
```text
backend/
├── config/
│   ├── db.js              # MongoDB Mongoose connection manager
│   └── store.js           # Data store & repository layer
├── controllers/
│   ├── authController.js   # Registration, login & profile retrieval
│   ├── postController.js   # Feed pagination, post creation, deletion, likes
│   ├── userController.js   # Public profiles, suggestions, settings
│   └── commentController.js# Post comments handling
├── middleware/
│   ├── authMiddleware.js   # JWT verification & protected routes
│   └── errorHandler.js     # Centralized HTTP error response handler
├── models/
│   ├── User.js            # User Mongoose schema & methods
│   ├── Post.js            # Post Mongoose schema
│   ├── Comment.js         # Comment Mongoose schema
│   └── Follow.js          # Follow relations schema
├── routes/
│   ├── authRoutes.js      # /api/auth routes
│   ├── postRoutes.js      # /api/posts routes
│   └── userRoutes.js      # /api/users routes
├── tests/
│   └── api.test.js        # Automated API test suite
├── .env.example           # Environment template
├── API_DOCUMENTATION.md   # Comprehensive endpoint specifications
├── package.json
└── server.js              # Application entry point
```

---

## Setup & Execution

### 1. Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* (Optional) MongoDB local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster URI.

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file (copied from `.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/nexus_db
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
```

### 4. Run Server
* Development mode with auto-reload:
  ```bash
  npm run dev
  ```
* Production start:
  ```bash
  npm start
  ```
* The API will be running at `http://localhost:5000`. Test the health check at `http://localhost:5000/api/health`.

---

## Running Automated Tests
Execute the built-in test suite:
```bash
npm test
```
This runs 16 automated integration tests validating health checks, registration, duplicate protection, authentication guards, post creation, likes, comments, and user profiles.
