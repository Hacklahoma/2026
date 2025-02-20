# Hacklahoma 2026 Website

The Hacklahoma Website is the official online hub for the Hacklahoma 2026 event. It is designed to serve two distinct user groups – hackers (event attendees) and staff (event organizers) – by providing secure, role-based access to relevant tools, resources, and real-time updates.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [File Structure](#file-structure)
- [Technologies and Libraries](#technologies-and-libraries)
- [Plan of Work](#plan-of-work)
- [Setup and Deployment](#setup-and-deployment)
- [Contribution Guidelines](#contribution-guidelines)
- [License](#license)

## Overview

The website will serve as a comprehensive platform for Hacklahoma 2026, featuring a clean landing page (hosted at `2026.hacklahoma.org`) along with dedicated pages for registration, login, and staff login. Once authenticated, users are directed to one of two main sections:

- **Hacker Section:**  
  - Accessible only to registered event attendees.
  - Includes personal profile management, QR code generation for event check-in, and essential event information.
  - Dynamic dashboards load user data from the database via protected endpoints.

- **Staff Section:**  
  - Accessible only to pre-approved staff accounts.
  - Offers a modular dashboard with dedicated views for Profile, Operations, Sponsoring, Tech, Marketing, and Exec teams.
  - Each team page includes a top navbar listing its subviews (e.g. for Exec: Home and Team Management; for Operations: Home and Schedule, etc.) and uses nested routes to render the correct subview.

The project is divided into two primary parts:
- **Frontend:** Built as a React Vite project with fully responsive, full-screen designs. Registration and Login pages have been implemented with modern, dynamic, and scrollable mobile layouts. Staff pages use nested routing to render team subviews.
- **Backend:** Built with Node.js and Express. It handles data storage, user authentication (using JWT stored in HTTP‑only cookies), secure role-based authorization, and supports profile updates (including profile pictures and social links). MongoDB is used for data persistence.

## Features

- **Public Landing Page:**  
  - A dynamic and responsive landing page at `2026.hacklahoma.org`.

- **User Authentication:**  
  - Separate registration and login flows for hackers and staff.
  - Secure role-based access control using HTTP‑only cookies and JWT.
  - Protected routes ensuring that hackers and staff see only what they’re permitted.

- **Hacker Dashboard:**  
  - Secure access to personal profiles, event details, and QR code generation.
  - Dynamic data loaded from the database via protected endpoints.

- **Staff Dashboard:**  
  - Dedicated workspaces for different teams (Profile, Operations, Sponsoring, Tech, Marketing, Exec).
  - Each team page features a top navbar that allows navigation between subviews (e.g., Home, Schedule, Sponsors, Budget, Registration, Admin, Themeboard, Assets, Team Management).
  - Uses nested routing with `<Outlet />` to render subviews based on the URL.

- **Responsive UI:**  
  - Full-screen designs on desktop (no scrolling required) and scrollable, dynamically sized layouts on mobile.
  - Modern card-based layouts for Registration and Login with clear modal feedback during API calls.

## File Structure

```
/ (root)
├── /backend
│   ├── server.js              # Entry point for the backend server (logging, CORS, cookie-parser, MongoDB connection)
│   ├── /routes                
│   │   ├── auth.js            # Routes for authentication (register, login, verify)
│   │   ├── hacker.js          # Hacker routes (e.g., /profile)
│   │   ├── staff.js           # Staff routes (e.g., /profile, /profile/socialLinks)
│   │   └── admin.js           # Admin routes (e.g., promoting users)
│   ├── /controllers           
│   │   ├── authController.js  # Handles registration, login, and token verification endpoints
│   │   ├── hackerController.js# Handles hacker profile endpoint
│   │   └── staffController.js # Handles staff profile and social links update endpoints
│   ├── /models                
│   │   └── User.js            # Mongoose schema for user data (including profilePicture and socialLinks)
│   ├── /middleware            
│   │   └── authMiddleware.js  # Middleware for JWT verification
│   └── /config                # Configuration files (if any)
├── /frontend
│   ├── /public                # Static assets and index.html
│   ├── /src
│   │   ├── /components        
│   │   │   └── Modal.jsx      # Reusable Modal component for displaying status messages
│   │   ├── /pages
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Register.jsx   # Registration page (responsive two-column card design)
│   │   │   ├── Login.jsx      # Login page (responsive, with inline redirect text)
│   │   │   ├── StaffLogin.jsx 
│   │   │   ├── /hacker
│   │   │   │   ├── HackerDashboard.jsx  # Hacker dashboard loading dynamic user data
│   │   │   │   ├── Profile.jsx            # Hacker profile page
│   │   │   │   └── QR.jsx                 # QR code page for event check-in
│   │   │   └── /staff
│   │   │       ├── StaffDashboard.jsx     # Staff dashboard layout with left sidebar and Outlet
│   │   │       ├── Profile.jsx            # Staff profile page with sections for Welcome, To Do, Profile Picture, and Social Links (editable)
│   │   │       ├── /operations
│   │   │       │   ├── OperationsPage.jsx   # Operations team layout with top navbar
│   │   │       │   ├── OperationsHome.jsx   # Operations home subview
│   │   │       │   └── OperationsSchedule.jsx # Operations schedule subview
│   │   │       ├── /sponsoring
│   │   │       │   ├── SponsoringPage.jsx     # Sponsoring team layout with top navbar
│   │   │       │   ├── SponsoringHome.jsx     # Sponsoring home subview
│   │   │       │   ├── SponsoringSponsors.jsx # Sponsoring sponsors subview
│   │   │       │   └── SponsoringBudget.jsx   # Sponsoring budget subview
│   │   │       ├── /tech
│   │   │       │   ├── TechPage.jsx           # Tech team layout with top navbar
│   │   │       │   ├── TechHome.jsx           # Tech home subview
│   │   │       │   ├── TechRegistration.jsx   # Tech registration subview
│   │   │       │   └── TechAdmin.jsx          # Tech admin subview
│   │   │       ├── /marketing
│   │   │       │   ├── MarketingPage.jsx      # Marketing team layout with top navbar
│   │   │       │   ├── MarketingHome.jsx      # Marketing home subview
│   │   │       │   ├── MarketingThemeboard.jsx# Marketing themeboard subview
│   │   │       │   └── MarketingAssets.jsx    # Marketing assets subview
│   │   │       └── /exec
│   │   │           ├── ExecPage.jsx           # Exec team layout with top navbar
│   │   │           ├── ExecHome.jsx           # Exec home subview
│   │   │           └── ExecTeamManagement.jsx # Exec team management subview
│   │   ├── App.jsx            # Main React component with routing
│   │   └── index.jsx          # Application entry point
├── package.json               # Project metadata and dependencies
└── README.md                  # Project documentation (this file)
```

## Technologies and Libraries

### Frontend

- **React** with **Vite:** For fast, modern, and modular development.
- **React Router:** For routing between landing, registration, login, hacker, and staff pages, including nested routes.
- **Axios:** For API calls to the backend.
- **Custom CSS:** Using a pastel, comfortable color scheme with fully responsive, full-screen designs.
- **Reusable Components:** For example, a Modal component to display status messages.

### Backend

- **Node.js & Express:** For building the RESTful API and handling server-side logic.
- **MongoDB:** For storing user registration data and profiles (including profilePicture and socialLinks).
- **Authentication:** JSON Web Tokens (JWT) and Bcrypt for secure login and password hashing.
- **HTTP‑Only Cookies:** For secure session management.
- **Middleware:** Detailed logging and JWT verification middleware.

### Testing

- **Frontend Testing:** Jest and React Testing Library.
- **Backend Testing:** Jest and Supertest.

## Plan of Work

### Completed:
- **Phase 1: Setup & Infrastructure**
  - Repository initialized with a clear file structure.
  - Environment configuration set up for development, testing, and production.
  - Vite configured for the frontend; Express set up for the backend with logging, CORS, and cookie-parser.

- **Phase 2: Authentication and User Management**
  - Registration and login endpoints implemented.
  - Role-based access control with JWT and HTTP‑only cookies.
  - Protected routes and token verification middleware created.

- **Phase 3: Hacker Section Development**
  - Hacker Dashboard, Profile, and QR code pages implemented.
  - API endpoints for fetching dynamic user data in the Hacker section developed.

### In Progress:
- **Phase 4: Staff Section Development**
  - Basic routing and page templates for staff views are in place.
  - Staff Dashboard with a left sidebar and nested routing implemented.
  - Individual team pages (Operations, Sponsoring, Tech, Marketing, Exec) with top navbars for subviews are set up.
  - Staff Profile page implemented with editable Social Links.

- **Phase 5: Integration & Testing**
  - Ongoing API integration between frontend components and backend endpoints.
  - Initial unit and integration tests are being written; more comprehensive test coverage is planned.

### Planned:
- **Phase 6: Deployment & Finalization**
  - Prepare deployment pipelines for the frontend (e.g., Vercel or Netlify) and backend (e.g., Heroku or DigitalOcean).
  - Register and configure the domain (`2026.hacklahoma.org`).
  - Finalize documentation and complete the launch checklist.

## Setup and Deployment

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/hacklahoma-website.git
   cd hacklahoma-website
   ```

2. **Install Dependencies:**
   - For the backend:
     ```bash
     cd backend
     npm install
     ```
   - For the frontend:
     ```bash
     cd ../frontend
     npm install
     ```

3. **Configure Environment Variables:**  
   In the backend directory, create a `.env` file with the following keys (adjust values as needed):
   ```
   MONGODB_URI=mongodb://localhost:27017/hacklahoma
   JWT_SECRET=your_jwt_secret_here
   PORT=5000
   ```
   Replace `your_jwt_secret_here` with a secure secret key.

4. **Running Locally:**

   **On Windows:**
   - **Backend:**  
     Open Command Prompt or PowerShell as Administrator (if needed) and run:
     ```bash
     cd backend
     npm run dev
     ```
     (Alternatively, use `nodemon server.js` if you have nodemon installed.)
   - **Frontend:**  
     Open a separate Command Prompt or PowerShell and run:
     ```bash
     cd frontend
     npm run dev
     ```

   **On macOS:**
   - **Backend:**  
     Open Terminal, navigate to the backend folder, and run:
     ```bash
     cd backend
     npm run dev
     ```
     (Or use `nodemon server.js` if installed.)
   - **Frontend:**  
     Open another Terminal window, navigate to the frontend folder, and run:
     ```bash
     cd frontend
     npm run dev
     ```

5. **Deployment:**
   - Follow the guidelines of your chosen hosting provider for deployment.
   - For the frontend, you can use services like Vercel or Netlify.
   - For the backend, consider Heroku, DigitalOcean, or another Node.js host.
   - Make sure to update environment variables in your production environment.
