# Nexus - Full Stack Social Media Platform

Welcome to **Nexus**, a modern, responsive full-stack social media web application developed as part of the Full Stack Web Development Internship (CodeAlpha / Yuva Intern).

---

## 🌟 Project Highlights
* **Cohesive Full-Stack Architecture:** Scaffolding and integration across all 4 weeks:
  * **Week 1:** System Architecture, Wireframes & Database Planning
  * **Week 2:** Front-End UI Scaffolding, SPA Routing & Design System
  * **Week 3:** Node.js/Express REST API Development & Automated Testing
  * **Week 4:** End-to-End Integration, Asynchronous Data Fetching & Authentication
* **Seamless Authentication:** JWT Bearer tokens stored in client state and `localStorage` with automatic rehydration.
* **Interactive Dynamic Feed:** Real-time post creation, instant like counter increments, and nested comment threads.
* **Responsive Dark-Mode UI:** Custom CSS Variables with glassmorphic cards and Lucide SVG icons.

---

## 🏗️ Repository Architecture
```text
yuvaintern/
├── frontend/                  # React 19 + Vite Frontend SPA
│   ├── src/
│   │   ├── components/        # Sidebar.jsx, PostCard.jsx
│   │   ├── context/           # AuthContext.jsx (global authentication)
│   │   ├── pages/             # Landing.jsx, Dashboard.jsx, Profile.jsx
│   │   ├── services/          # api.js (centralized fetch client)
│   │   ├── App.css            # Dark mode tokens, glassmorphism & responsive grid
│   │   ├── App.jsx            # Route definitions & AuthProvider
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/                   # Node.js + Express REST API
│   ├── config/                # db.js (Mongoose connection) & store.js (dual-mode persistence)
│   ├── controllers/           # auth, post, user, and comment controllers
│   ├── middleware/            # authMiddleware.js & errorHandler.js
│   ├── models/                # User.js, Post.js, Comment.js, Follow.js
│   ├── routes/                # authRoutes.js, postRoutes.js, userRoutes.js
│   ├── tests/                 # api.test.js (16/16 passing automated tests)
│   ├── API_DOCUMENTATION.md   # Complete RESTful API specifications
│   ├── package.json
│   └── server.js
│
├── Week1_Project_Planning_Report.md
├── Week2_Internship_Report.docx
├── Week3_Internship_Report.docx
├── Week4_Internship_Report.docx
└── fullstack_submission.zip
```

---

## 🚀 How to Run the Integrated Application Locally

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher installed)
* (Optional) MongoDB local or MongoDB Atlas cluster URI (automatic in-memory fallback enabled by default)

---

### Step 1: Start the Backend Server
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend:
   ```bash
   npm start
   # Or for development with auto-reload:
   npm run dev
   ```
   * The backend will run on **`http://localhost:5000`**.
   * Verify health check: `http://localhost:5000/api/health`.

---

### Step 2: Start the Frontend Application
1. Open a second terminal window and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Launch the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to **`http://localhost:5173`** (or the URL printed in the terminal).

---

## 🧪 Running Automated Tests
To run the automated test suite verifying all 16 backend API endpoints:
```bash
cd backend
npm test
```
All 16 tests validate registration, login, protected routes, post CRUD, like toggling, comments, and profile queries.

---

## 📄 Deliverables & Reports
* **Week 1 Planning Report:** `Week1_Project_Planning_Report.md`
* **Week 2 Frontend Setup Report:** `Week2_Internship_Report.docx`
* **Week 3 Backend API Report:** `Week3_Internship_Report.docx`
* **Week 4 Integration Report:** `Week4_Internship_Report.docx`
* **Complete Code Archive:** `fullstack_submission.zip`

---

## 👤 Author
* **Name:** Sarthak Srivastava
* **Internship:** Full Stack Web Development
* **Repository:** [https://github.com/sarthak1srivastava21-source/yuva_intern](https://github.com/sarthak1srivastava21-source/yuva_intern)
