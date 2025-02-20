import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import '../../../styles/TeamPage.css';

const TechPage = () => {
  return (
    <div className="team-page-container">
      <nav className="team-navbar">
        <NavLink to="/staff/tech/home" className={({ isActive }) => (isActive ? 'active' : '')}>
          Home
        </NavLink>
        <NavLink to="/staff/tech/registration" className={({ isActive }) => (isActive ? 'active' : '')}>
          Registration
        </NavLink>
        <NavLink to="/staff/tech/admin" className={({ isActive }) => (isActive ? 'active' : '')}>
          Admin
        </NavLink>
      </nav>
      <div className="team-content">
        <Outlet />
      </div>
    </div>
  );
};

export default TechPage;