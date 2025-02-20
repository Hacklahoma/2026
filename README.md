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
  - Each view features a left-side navigation bar for quick access to subviews and a standardized layout including a top “To Do” section along with side-by-side panels for Files, Chat, and Requests.

The project is divided into two primary parts:
- **Frontend:** Built as a React Vite project with fully responsive, full-screen designs. Registration and Login pages have been implemented with modern, dynamic, and scrollable mobile layouts.
- **Backend:** Built with Node.js and Express. It handles data storage, user authentication (using JWT stored in HTTP‑only cookies), and secure role-based authorization. MongoDB is used for data persistence.

## Features

- **Public Landing Page:**  
  - A dynamic and responsive landing page at `2026.hacklahoma.org`.

- **User Authentication:**  
  - Separate registration and login flows for hackers and staff.
  - Secure role-based access control using HTTP‑only cookies and JWT.
  - Protected routes to ensure hackers and staff see only what they’re permitted.

- **Hacker Dashboard:**  
  - Secure access to personal profiles, event details, and QR code generation.
  - Dynamic data is loaded from the database.

- **Staff Dashboard:**  
  - Dedicated workspaces for different teams (Operations, Sponsoring, Tech, Marketing, Exec).
  - Modular layout with left-side navigation and subviews for team-specific functions.

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
│   │   └── admin.js           # Admin routes (e.g., promoting users)
│   ├── /controllers           
│   │   ├── authController.js  # Handles registration, login, and token verification endpoints
│   │   └── hackerController.js# Handles hacker profile endpoint
│   ├── /models                
│   │   └── User.js            # Mongoose schema for user data
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
│   │   │       ├── StaffDashboard.jsx     # Staff dashboard page
│   │   │       ├── Profile.jsx            # Staff profile page
│   │   │       ├── /operations
│   │   │       │   └── Schedule.jsx       # Operations schedule page
│   │   │       ├── /sponsoring
│   │   │       │   ├── Sponsors.jsx       # Sponsoring sponsors page
│   │   │       │   └── Budget.jsx         # Sponsoring budget page
│   │   │       ├── /tech
│   │   │       │   ├── Registration.jsx   # Tech registration page
│   │   │       │   └── Admin.jsx          # Tech admin page
│   │   │       ├── /marketing
│   │   │       │   ├── ThemeBoard.jsx     # Marketing theme board page
│   │   │       │   └── Assets.jsx         # Marketing assets page
│   │   │       └── /exec
│   │   │           └── TeamManagement.jsx # Exec team management page
│   │   ├── App.jsx            # Main React component with routing
│   │   └── index.jsx          # Application entry point
├── package.json               # Project metadata and dependencies
└── README.md                  # Project documentation (this file)
```

## Technologies and Libraries

### Frontend

- **React** with **Vite:** Fast, modern, and modular development.
- **React Router:** Routing between landing, registration, login, hacker, and staff pages.
- **Axios/Fetch API:** For API calls to the backend.
- **UI Styling:** Custom CSS with a pastel, comfortable color scheme. Layouts are fully responsive and designed to fill the screen on desktop while becoming scrollable on mobile.
- **Reusable Components:** Modular components like Modal for displaying status messages.

### Backend

- **Node.js & Express:** For building the RESTful API and handling server-side logic.
- **MongoDB:** Database for storing user registration data and profiles.
- **Authentication:** JSON Web Tokens (JWT) and Bcrypt for secure login and password hashing.
- **HTTP‑Only Cookies:** Secure session management with tokens stored in HTTP‑only cookies.
- **Logging and Middleware:** Detailed request/response logging and JWT verification middleware.

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
  - Basic routing and page templates for staff views (Operations, Sponsoring, Tech, Marketing, Exec) are in place; further functionality and UI refinements are pending.

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
   In the backend directory, create a `.env` file with your database credentials, JWT secret, and port. For example:
   ```
   MONGODB_URI=mongodb://localhost:27017/hacklahoma
   JWT_SECRET=your_jwt_secret_here
   PORT=5000
   ```

4. **Run Locally:**
   - Start the backend server:
     ```bash
     npm run dev
     ```
   - Start the frontend development server:
     ```bash
     npm run dev
     ```

5. **Deployment:**  
   Follow the guidelines of your chosen hosting provider to deploy both the frontend and backend.
