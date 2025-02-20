import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import '../../../styles/TeamPage.css';

const OperationsPage = () => {
  return (
    <div className="team-page-container">
      <nav className="team-navbar">
        <NavLink to="/staff/operations/home" className={({ isActive }) => (isActive ? 'active' : '')}>
          Home
        </NavLink>
        <NavLink to="/staff/operations/schedule" className={({ isActive }) => (isActive ? 'active' : '')}>
          Schedule
        </NavLink>
      </nav>
      <div className="team-content">
        <Outlet />
      </div>
    </div>
  );
};

export default OperationsPage;