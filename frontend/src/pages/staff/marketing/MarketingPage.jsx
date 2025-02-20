import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import '../../../styles/TeamPage.css';

const MarketingPage = () => {
  return (
    <div className="team-page-container">
      <nav className="team-navbar">
        <NavLink to="/staff/marketing/home" className={({ isActive }) => (isActive ? 'active' : '')}>
          Home
        </NavLink>
        <NavLink to="/staff/marketing/themeboard" className={({ isActive }) => (isActive ? 'active' : '')}>
          Themeboard
        </NavLink>
        <NavLink to="/staff/marketing/assets" className={({ isActive }) => (isActive ? 'active' : '')}>
          Assets
        </NavLink>
      </nav>
      <div className="team-content">
        <Outlet />
      </div>
    </div>
  );
};

export default MarketingPage;
