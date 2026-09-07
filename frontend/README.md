# Nexus - Social Media Platform Front-End

This is the Week 2 front-end implementation for the "Nexus" Social Media Platform, built as part of the Code Alpha Full Stack Developer Internship.

## Development Process

1.  **Project Initialization:** I used Vite to scaffold a blazing-fast React application.
2.  **Routing Setup:** Implemented `react-router-dom` to manage navigation between the three required views.
3.  **UI/UX Design:** Designed a modern, premium "dark mode" interface using custom CSS. The design leverages glassmorphism effects (on the login screen), responsive CSS Grids/Flexbox, and sleek typography (Inter font).
4.  **Component Architecture:** Built reusable components like `Sidebar.jsx` and `PostCard.jsx` to keep the code DRY and modular.
5.  **Interactivity:** Used React `useState` to mock interactivity such as liking posts, creating new posts, and toggling between the Login/Signup views.

## Views Implemented

1.  **Landing Page (`/`)**: A split-screen inspired glassmorphic login/registration card.
2.  **User Dashboard (`/dashboard`)**: The main home feed featuring a responsive 3-column layout (Sidebar navigation, Main feed, Suggestions). Includes a fully interactive "Create Post" input.
3.  **Detail View (`/profile/:username`)**: A detailed user profile displaying the user's avatar, bio, follower statistics, and their individual posts.

## Libraries & Design Patterns Used

-   **React (via Vite):** For component-based UI architecture.
-   **React Router v6:** For seamless, Single-Page Application (SPA) client-side routing.
-   **Lucide React:** For clean, scalable SVG icons used in the navigation and post interactions.
-   **Vanilla CSS Variables:** Used CSS custom properties (`--bg-dark`, `--accent`, etc.) to build a consistent design system without relying on heavy external styling frameworks, ensuring complete customizability.

## How to Run Locally

1. Ensure you have [Node.js](https://nodejs.org/) installed on your machine.
2. Unzip this folder and open a terminal inside the `frontend` directory.
3. Install the dependencies by running:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173` (or the URL provided in your terminal).
