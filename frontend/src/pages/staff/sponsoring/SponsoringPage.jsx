import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import '../../../styles/TeamPage.css';

const SponsoringPage = () => {
  return (
    <div className="team-page-container">
      <nav className="team-navbar">
        <NavLink to="/staff/sponsoring/home" className={({ isActive }) => (isActive ? 'active' : '')}>
          Home
        </NavLink>
        <NavLink to="/staff/sponsoring/sponsors" className={({ isActive }) => (isActive ? 'active' : '')}>
          Sponsors
        </NavLink>
        <NavLink to="/staff/sponsoring/budget" className={({ isActive }) => (isActive ? 'active' : '')}>
          Budget
        </NavLink>
      </nav>
      <div className="team-content">
        <Outlet />
      </div>
    </div>
  );
};

export default SponsoringPage;