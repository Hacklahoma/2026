import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ThemeProvider from './components/ThemeProvider';
import './App.css';
import './styles/Theme.css';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import HackerDashboard from './pages/hacker/HackerDashboard';
import StaffDashboard from './pages/staff/StaffDashboard';
import ProtectedRoute from './components/ProtectedRoute';

// Staff base view
import ProfileView from './pages/staff/Profile';

// Operations Team
import OperationsPage from './pages/staff/operations/OperationsPage';
import OperationsHome from './pages/staff/operations/OperationsHome';
import OperationsSchedule from './pages/staff/operations/OperationsSchedule';

// Sponsoring Team
import SponsoringPage from './pages/staff/sponsoring/SponsoringPage';
import SponsoringHome from './pages/staff/sponsoring/SponsoringHome';
import SponsoringSponsors from './pages/staff/sponsoring/SponsoringSponsors';
import SponsoringBudget from './pages/staff/sponsoring/SponsoringBudget';

// Tech Team
import TechPage from './pages/staff/tech/TechPage';
import TechHome from './pages/staff/tech/TechHome';
import TechRegistration from './pages/staff/tech/TechRegistration';
import TechAdmin from './pages/staff/tech/TechAdmin';

// Marketing Team
import MarketingPage from './pages/staff/marketing/MarketingPage';
import MarketingHome from './pages/staff/marketing/MarketingHome';
import MarketingThemeboard from './pages/staff/marketing/MarketingThemeboard';
import MarketingAssets from './pages/staff/marketing/MarketingAssets';

// Exec Team
import ExecPage from './pages/staff/exec/ExecPage';
import ExecHome from './pages/staff/exec/ExecHome';
import ExecTeamManagement from './pages/staff/exec/ExecTeamManagement';

import Settings from './pages/hacker/Settings';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Route for Hacker Section */}
          <Route 
            path="/hacker" 
            element={
              <ProtectedRoute requiredRole="hacker">
                <HackerDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Protected Route for Staff Section */}
          <Route 
            path="/staff" 
            element={
              <ProtectedRoute requiredRole="staff">
                <StaffDashboard />
              </ProtectedRoute>
            }
          >
            {/* Default staff route: Profile */}
            <Route index element={<ProfileView />} />
            <Route path="profile" element={<ProfileView />} />

            {/* Operations Routes */}
            <Route path="operations/*" element={<OperationsPage />}>
              <Route index element={<OperationsHome />} />
              <Route path="home" element={<OperationsHome />} />
              <Route path="schedule" element={<OperationsSchedule />} />
            </Route>

            {/* Sponsoring Routes */}
            <Route path="sponsoring/*" element={<SponsoringPage />}>
              <Route index element={<SponsoringHome />} />
              <Route path="home" element={<SponsoringHome />} />
              <Route path="sponsors" element={<SponsoringSponsors />} />
              <Route path="budget" element={<SponsoringBudget />} />
            </Route>

            {/* Tech Routes */}
            <Route path="tech/*" element={<TechPage />}>
              <Route index element={<TechHome />} />
              <Route path="home" element={<TechHome />} />
              <Route path="registration" element={<TechRegistration />} />
              <Route path="admin" element={<TechAdmin />} />
            </Route>

            {/* Marketing Routes */}
            <Route path="marketing/*" element={<MarketingPage />}>
              <Route index element={<MarketingHome />} />
              <Route path="home" element={<MarketingHome />} />
              <Route path="themeboard" element={<MarketingThemeboard />} />
              <Route path="assets" element={<MarketingAssets />} />
            </Route>

            {/* Exec Routes */}
            <Route path="exec/*" element={<ExecPage />}>
              <Route index element={<ExecHome />} />
              <Route path="home" element={<ExecHome />} />
              <Route path="team_management" element={<ExecTeamManagement />} />
            </Route>
          </Route>

          {/* Unauthorized */}
          <Route path="/unauthorized" element={<div>Access Denied</div>} />

          {/* Settings - accessible by both hackers and staff */}
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;