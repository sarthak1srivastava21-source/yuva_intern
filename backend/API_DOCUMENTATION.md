# Nexus RESTful API Documentation

This document outlines the API specifications for the **Nexus Social Media Platform** backend built with Node.js and Express.

---

## Base URL
```text
http://localhost:5000/api
```

---

## Authentication
Protected routes require a JSON Web Token (JWT) passed in the `Authorization` header with the `Bearer` scheme:
```http
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints Overview

| Category | Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- | :--- |
| **System** | `GET` | `/health` | API & Database health check | No |
| **Auth** | `POST` | `/auth/register` | Register new user | No |
| **Auth** | `POST` | `/auth/login` | Authenticate & obtain JWT | No |
| **Auth** | `GET` | `/auth/me` | Fetch authenticated user profile | **Yes** |
| **Posts** | `GET` | `/posts` | Get all feed posts (paginated) | No |
| **Posts** | `POST` | `/posts` | Create new post | **Yes** |
| **Posts** | `GET` | `/posts/:id` | Get post by ID | No |
| **Posts** | `DELETE`| `/posts/:id` | Delete user post | **Yes** |
| **Posts** | `POST` | `/posts/:id/like`| Toggle like / unlike on post | **Yes** |
| **Comments**| `GET` | `/posts/:id/comments` | Retrieve comments for post | No |
| **Comments**| `POST`| `/posts/:id/comments` | Add comment to post | **Yes** |
| **Users** | `GET` | `/users/:username` | Public profile & user posts | No |
| **Users** | `PUT` | `/users/profile` | Update bio & avatar | **Yes** |
| **Users** | `GET` | `/users/suggestions`| Get recommended profiles | No |

---

## Detailed Endpoint Specifications

### 1. System Health Check
* **Endpoint:** `GET /api/health`
* **Response (200 OK):**
```json
{
  "status": "online",
  "timestamp": "2026-09-07T12:00:00.000Z",
  "service": "Nexus Social Media REST API",
  "database": {
    "connected": true,
    "database": "nexus_db"
  }
}
```

---

### 2. User Registration
* **Endpoint:** `POST /api/auth/register`
* **Request Body:**
```json
{
  "username": "sarthak",
  "email": "sarthak@nexus.dev",
  "password": "password123",
  "bio": "Full Stack Developer"
}
```
* **Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f010000000000000000001",
    "username": "sarthak",
    "email": "sarthak@nexus.dev",
    "bio": "Full Stack Developer",
    "avatar": "https://..."
  }
}
```

---

### 3. User Login
* **Endpoint:** `POST /api/auth/login`
* **Request Body:**
```json
{
  "email": "sarthak@nexus.dev",
  "password": "password123"
}
```
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f010000000000000000001",
    "username": "sarthak",
    "email": "sarthak@nexus.dev"
  }
}
```

---

### 4. Feed & Posts
#### Fetch Feed Posts
* **Endpoint:** `GET /api/posts?page=1&limit=10`
* **Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "page": 1,
  "data": [
    {
      "_id": "65f020000000000000000001",
      "authorName": "Sarthak Srivastava",
      "authorHandle": "sarthak",
      "content": "Just launched the front-end setup for Nexus! 🚀",
      "likesCount": 5,
      "commentsCount": 2,
      "createdAt": "2026-09-07T11:00:00.000Z"
    }
  ]
}
```

#### Create Post
* **Endpoint:** `POST /api/posts`
* **Headers:** `Authorization: Bearer <token>`
* **Request Body:**
```json
{
  "content": "Excited about our Node.js REST API milestone! #FullStack",
  "mediaUrl": ""
}
```
* **Response (201 Created):**
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "_id": "65f020000000000000000003",
    "content": "Excited about our Node.js REST API milestone! #FullStack",
    "likesCount": 0,
    "commentsCount": 0
  }
}
```

#### Toggle Like
* **Endpoint:** `POST /api/posts/:id/like`
* **Headers:** `Authorization: Bearer <token>`
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Post liked",
  "liked": true,
  "likesCount": 6
}
```

---

### 5. Comments
#### Add Comment
* **Endpoint:** `POST /api/posts/:postId/comments`
* **Headers:** `Authorization: Bearer <token>`
* **Request Body:**
```json
{
  "text": "Great job on the API architecture!"
}
```
* **Response (201 Created):**
```json
{
  "success": true,
  "message": "Comment added successfully",
  "data": {
    "_id": "65f030000000000000000002",
    "text": "Great job on the API architecture!",
    "authorName": "sarthak"
  }
}
```

---

### 6. User Profile
#### Get Profile
* **Endpoint:** `GET /api/users/:username`
* **Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "65f010000000000000000001",
    "username": "sarthak",
    "bio": "Building Nexus Platform",
    "followersCount": 12,
    "followingCount": 8,
    "postsCount": 3
  },
  "posts": [...]
}
```

---

## Status Codes Summary
* `200 OK` – Request succeeded.
* `201 Created` – Resource created (user, post, comment).
* `400 Bad Request` – Missing required fields or duplicate entries.
* `401 Unauthorized` – Missing, invalid, or expired JWT.
* `403 Forbidden` – Attempted unauthorized action (e.g. deleting someone else's post).
* `404 Not Found` – Requested resource does not exist.
* `500 Server Error` – Unhandled server exception.
