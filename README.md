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
  - Includes personal profile management, QR code for event check-in, and essential event information.

- **Staff Section:**  
  - Accessible only to pre-approved staff accounts.  
  - Offers a modular dashboard with dedicated views for Profile, Operations, Sponsoring, Tech, Marketing, and Exec teams.  
  - Each view features a left-side navigation bar for quick access to subviews (e.g., Operations schedule, Sponsoring budget) and a standardized layout that includes a top “To Do” section along with three columns for Files, Chat, and Requests.

The project is divided into two primary parts:
- **Frontend:** Built as a React Vite JS project.
- **Backend:** Responsible for handling data storage, user authentication, and registration content.

## Features

- **Public Landing Page:**  
  - A dynamic and responsive landing page at `2026.hacklahoma.org`.

- **User Authentication:**  
  - Separate registration and login flows for hackers and staff.
  - Role-based access control ensuring that hackers and staff see only what they’re permitted.

- **Hacker Dashboard:**  
  - Secure access to personal profiles, event details, and QR code generation for check-in.

- **Staff Dashboard:**  
  - Dedicated workspaces for different teams (Operations, Sponsoring, Tech, Marketing, Exec).
  - A common layout for each team’s dashboard with a top “To Do” section and side-by-side panels for Files, Chat, and Requests.
  - Integrated left-side navigation with buttons for each team view and subviews.

## File Structure

The repository is organized into two main directories for the front end and back end:

```
/ (root)
├── /backend
│   ├── server.js              # Entry point for the backend server
│   ├── /routes                # Express route definitions (e.g., auth, registration, staff)
│   ├── /controllers           # Request handlers for API endpoints
│   ├── /models                # Data models and schema definitions
│   ├── /middleware            # Authentication and error-handling middleware
│   └── /config                # Configuration files (database, environment variables)
├── /frontend
│   ├── /public                # Static assets and index.html
│   ├── /src
│   │   ├── /components        # Reusable UI components (Navbar, ToDo, Sidebar)
│   │   ├── /pages
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── StaffLogin.jsx
│   │   │   ├── /hacker
│   │   │   │   ├── HackerDashboard.jsx
│   │   │   │   ├── Profile.jsx
│   │   │   │   └── QR.jsx
│   │   │   └── /staff
│   │   │       ├── StaffDashboard.jsx
│   │   │       ├── Profile.jsx
│   │   │       ├── /operations
│   │   │       │   └── Schedule.jsx
│   │   │       ├── /sponsoring
│   │   │       │   ├── Sponsors.jsx
│   │   │       │   └── Budget.jsx
│   │   │       ├── /tech
│   │   │       │   ├── Registration.jsx
│   │   │       │   └── Admin.jsx
│   │   │       ├── /marketing
│   │   │       │   ├── ThemeBoard.jsx
│   │   │       │   └── Assets.jsx
│   │   │       └── /exec
│   │   │           └── TeamManagement.jsx
│   │   ├── App.jsx            # Main React component with routing
│   │   └── index.jsx          # Application entry point
├── package.json               # Project metadata and dependencies
└── README.md                  # Project documentation (this file)
```

## Technologies and Libraries

### Frontend

- **React** with **Vite:** For fast, modern, and modular development.
- **React Router:** To handle routing between landing, registration, login, hacker, and staff pages.
- **Axios/Fetch API:** For API calls to the backend.
- **State Management:** (Optional) Redux or Context API for managing application state.
- **UI Framework:** Tailwind CSS, Bootstrap, or Material UI for responsive design.
- **QR Code Library:** For generating QR codes on the hacker page (e.g., `qrcode.react`).

### Backend

- **Node.js & Express:** For building the RESTful API and handling server-side logic.
- **Database:** MongoDB or PostgreSQL for storing registration data and user profiles.
- **Authentication:** JSON Web Tokens (JWT) and Bcrypt for secure login and password hashing.
- **Real-Time Communication:** Socket.io (if real-time chat is implemented).

### Testing

- **Frontend Testing:** Jest and React Testing Library.
- **Backend Testing:** Jest and Supertest.

## Plan of Work

### Phase 1: Setup & Infrastructure
- **Repository Initialization:** Set up the Git repository with the above file structure.
- **Environment Configuration:** Establish development, testing, and production configurations.
- **Tooling:** Configure Vite for the frontend and Express for the backend.

### Phase 2: Authentication and User Management
- **User Registration & Login:** Implement routes and UI for hackers and staff.
- **Role-Based Access Control:** Secure endpoints and pages based on user type.
- **Session Management:** Integrate JWT for session handling.

### Phase 3: Hacker Section Development
- **Profile Management:** Create and integrate the hacker dashboard, profile view, and QR code generation.
- **Event Info:** Display essential event information and any updates.

### Phase 4: Staff Section Development
- **Dashboard Layout:** Design the unified staff dashboard layout (left nav, To Do section, Files, Chat, Requests).
- **Team Views:** Develop subviews for Operations, Sponsoring, Tech, Marketing, and Exec.
- **Subview Specifics:**  
  - Operations: Schedule management.  
  - Sponsoring: Manage sponsors and budget.  
  - Tech: Registration handling and admin tools.  
  - Marketing: Theme board and asset management.  
  - Exec: Team management interface.

### Phase 5: Integration & Testing
- **API Integration:** Connect frontend components to backend APIs.
- **Testing:** Unit testing, integration testing, and user acceptance testing.
- **Bug Fixes & Optimizations:** Iterative improvements based on feedback.

### Phase 6: Deployment & Finalization
- **Deployment:** Setup hosting for both frontend (e.g., Vercel, Netlify) and backend (e.g., Heroku, DigitalOcean).
- **Domain Registration:** Register the domain (`2026.hacklahoma.org`) and configure DNS.
- **Documentation & Launch:** Finalize documentation, perform a launch checklist, and deploy.

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
   Create a `.env` file in the backend directory with your database credentials, JWT secret, and other configuration details.

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
