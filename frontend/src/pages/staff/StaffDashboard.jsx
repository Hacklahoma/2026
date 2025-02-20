import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import '../../styles/StaffDashboard.css';

const StaffDashboard = () => {
  return (
    <div className="staff-dashboard-container">
      <nav className="staff-sidebar">
        <ul>
          <li>
            <NavLink 
              to="/staff/profile" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <span className="icon">👤</span>
              <span className="tooltip">Profile</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/staff/operations" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <span className="icon">⚙️</span>
              <span className="tooltip">Operations</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/staff/sponsoring" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <span className="icon">$</span>
              <span className="tooltip">Sponsoring</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/staff/tech" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <span className="icon">{'</>'}</span>
              <span className="tooltip">Tech</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/staff/marketing" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <span className="icon">📣</span>
              <span className="tooltip">Marketing</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/staff/exec" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <span className="icon">👥</span>
              <span className="tooltip">Exec</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="staff-main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default StaffDashboard;
