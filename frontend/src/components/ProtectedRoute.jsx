import React from 'react';
import { Navigate } from 'react-router-dom';

// Example: Using localStorage to store user info.
// In a real app, you might use context or a state management library.
const ProtectedRoute = ({ children, requiredRole }) => {
  // Retrieve user data from localStorage (or use context)
  const user = JSON.parse(localStorage.getItem('user'));

  // If no user is found, redirect to the login page.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required and the user role does not match, redirect.
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Otherwise, render the protected component.
  return children;
};

export default ProtectedRoute;