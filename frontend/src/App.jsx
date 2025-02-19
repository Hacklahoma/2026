import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';

import Login from './pages/Login';
import Register from './pages/Register';

import HackerDashboard from './pages/hacker/HackerDashboard';
import StaffDashboard from './pages/staff/StaffDashboard';

import ProtectedRoute from './components/ProtectedRoute';

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

        {/* Protected Route for Staff Section */}
        <Route 
          path="/staff" 
          element={
            <ProtectedRoute requiredRole="staff">
              <StaffDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Optional: Handle unauthorized access */}
        <Route path="/unauthorized" element={<div>Access Denied</div>} />

      </Routes>
    </Router>
  );
}

export default App;