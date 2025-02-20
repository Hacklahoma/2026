import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import HackerDashboard from './pages/hacker/HackerDashboard';
import StaffDashboard from './pages/staff/StaffDashboard';
import ProtectedRoute from './components/ProtectedRoute';

// Import staff view components from the same folder as StaffDashboard
import ProfileView from './pages/staff/Profile';
import OperationsView from './pages/staff/Operations';
import SponsoringView from './pages/staff/Sponsoring';
import TechView from './pages/staff/Tech';
import MarketingView from './pages/staff/Marketing';
import ExecView from './pages/staff/Exec';

function App() {
  return (
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

        {/* Protected Route for Staff Section with Nested Routes */}
        <Route 
          path="/staff/*" 
          element={
            <ProtectedRoute requiredRole="staff">
              <StaffDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<ProfileView />} />
          <Route path="profile" element={<ProfileView />} />
          <Route path="operations" element={<OperationsView />} />
          <Route path="sponsoring" element={<SponsoringView />} />
          <Route path="tech" element={<TechView />} />
          <Route path="marketing" element={<MarketingView />} />
          <Route path="exec" element={<ExecView />} />
        </Route>

        {/* Optional: Handle unauthorized access */}
        <Route path="/unauthorized" element={<div>Access Denied</div>} />
      </Routes>
    </Router>
  );
}

export default App;
