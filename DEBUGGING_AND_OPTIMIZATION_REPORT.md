# Nexus - Testing, Debugging, and Optimization Report

**Project:** Nexus (Social Media Platform)  
**Author:** Sarthak Srivastava  
**Milestone:** Week 5 Deliverable – Testing, Debugging, and Performance Optimization  
**Internship:** Full Stack Web Development (CodeAlpha / Yuva Intern)  

---

## 1. Executive Testing Strategy

To ensure high software reliability, maintainability, and responsiveness, the application was subjected to a comprehensive two-tier testing methodology:
1. **Front-End Unit Testing (`frontend/tests/unit.test.js`):** Focuses on pure UI logic, optimistic state calculations, input sanitization, timestamp relative formatting, and HTTP header generation.
2. **Back-End Integration Testing (`backend/tests/api.test.js`):** Exercises end-to-end HTTP request/response flows against the Express server using Supertest and Node.js native test runner, validating data validation, authentication guards, security tampering, and response latencies.

### Overall Test Execution Summary
* **Frontend Tests Passed:** 5 / 5 (100% pass rate)
* **Backend Tests Passed:** 21 / 21 (100% pass rate)
* **Total Automated Tests:** 26 / 26 (100% pass rate)

---

## 2. Debugging Case Studies & Issues Resolved

### Case Study 1: CORS Preflight Negotiation Failure
* **Symptom:** Asynchronous requests from `http://localhost:5173` (Vite) to `http://localhost:5000` (Express) were blocked by the browser with `Missing CORS header 'Access-Control-Allow-Origin'`.
* **Root Cause:** Standard browser security prohibits cross-origin API calls without explicit server headers.
* **Resolution:** Configured Express `cors` middleware in `backend/server.js` with explicit methods (`GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`) and allowed headers (`Content-Type`, `Authorization`).

### Case Study 2: Optimistic UI Desynchronization on Like Toggling
* **Symptom:** Rapidly clicking the "Like" button could cause counters to drop below zero or desynchronize from backend state if network latency was introduced.
* **Root Cause:** Direct state increments without boundary checks (`prev - 1`) could produce negative integers.
* **Resolution:** Implemented `Math.max(0, prev - 1)` clamping on the client in `PostCard.jsx` and verified idempotency on the backend using unique user ID membership arrays.

### Case Study 3: Session Rehydration & Expired Token Edge Cases
* **Symptom:** If a user’s JWT token expired while browsing or the backend server was restarted, the frontend would remain in an authenticated state with broken API calls.
* **Root Cause:** `AuthContext` only verified the presence of `localStorage.getItem('nexus_token')` without validating validity against the server.
* **Resolution:** Added an initialization hook in `AuthContext.jsx` that calls `GET /api/auth/me` on mount. If the server responds with `401 Unauthorized`, the token is purged automatically and state resets cleanly.

### Case Study 4: Vite 8 / Rolldown Chunk Splitting Compatibility
* **Symptom:** Build failed with `TypeError: manualChunks is not a function`.
* **Root Cause:** Modern Vite (utilizing Rolldown) requires `manualChunks` in Rollup options to be specified as a callback function `(id) => chunkName` rather than a static dictionary.
* **Resolution:** Refactored `frontend/vite.config.js` to dynamically evaluate module paths, separating `react-vendor` and `ui-icons` through function evaluation.

---

## 3. Performance Optimizations & Benchmarks

### 1. Front-End Bundle Optimization (Vite Code Splitting)
By isolating vendor dependencies into a standalone cacheable chunk, the initial entry application chunk size was drastically reduced:

| Metric | Before Optimization | After Optimization | Improvement |
| :--- | :--- | :--- | :--- |
| **Main App Chunk (`index.js`)** | 251.82 kB | **18.72 kB** (gzip: 5.60 kB) | **92.5% Reduction** |
| **Shared Vendor Chunk** | None (monolithic) | 232.87 kB (gzip: 74.88 kB) | **Cache Isolated** |
| **Production Build Time** | 2.19s | **1.26s** | **42.4% Faster** |

### 2. Back-End Latency Benchmarking
Response times for feed retrieval and profile lookups were benchmarked using high-resolution performance timers:
* **Target Benchmark:** `< 100 ms`
* **Measured Response Latency:** **0.85 ms to 15.8 ms**
* **Result:** **PASSED** (Test 21 confirmed sub-100ms performance).

### 3. Database Indexing & Payload Projection
* Indexed `Post` collections by `{ createdAt: -1 }` to eliminate in-memory sorting overhead on feed queries.
* Applied `.select('+password')` selectively to ensure sensitive password hashes are excluded by default from JSON payloads.

---

## 4. How to Execute Test Suites

### Run Front-End Unit Tests
```bash
cd frontend
npm test
```

### Run Back-End API & Benchmark Tests
```bash
cd backend
npm test
```
