import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import '../../../styles/TeamPage.css';

const ExecPage = () => {
  return (
    <div className="team-page-container">
      <nav className="team-navbar">
        <NavLink to="/staff/exec/home" className={({ isActive }) => (isActive ? 'active' : '')}>
          Home
        </NavLink>
        <NavLink to="/staff/exec/team_management" className={({ isActive }) => (isActive ? 'active' : '')}>
          Team Management
        </NavLink>
      </nav>
      <div className="team-content">
        <Outlet />
      </div>
    </div>
  );
};

export default ExecPage;
