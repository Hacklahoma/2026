import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children, requiredRole }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null means loading
  const [userRole, setUserRole] = useState(null);

  const serverPort = import.meta.env.VITE_SERVER_PORT || 5174;
  const baseURL = `http://${window.location.hostname}:${serverPort}`;

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/auth/verify`, {
          withCredentials: true, // send cookies with the request
        });
        // Expect response.data to be { authenticated: true, role: 'hacker' } or similar
        if (response.data.authenticated) {
          setIsAuthenticated(true);
          setUserRole(response.data.role);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth verification error:', error);
        setIsAuthenticated(false);
      }
    };

    verifyAuth();
  }, [baseURL]);

  // While waiting for the verification, show a loading indicator
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  // If not authenticated, redirect to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required but doesn't match, redirect to unauthorized page
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated (and authorized), so render the children
  return children;
};

export default ProtectedRoute;