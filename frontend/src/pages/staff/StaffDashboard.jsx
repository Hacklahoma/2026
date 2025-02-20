import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import '../../styles/StaffDashboard.css';

const StaffDashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  // When a navigation item is clicked, close the mobile menu.
  const handleNavClick = () => {
    setMenuOpen(false);
  };

  // Clicking main content closes the menu if open
  const handleMainClick = () => {
    if (menuOpen) {
      setMenuOpen(false);
    }
  };

  return (
    <div className="staff-dashboard-container">
      {/* Sidebar for desktop and mobile */}
      <nav className={`staff-sidebar ${menuOpen ? 'open' : ''}`}>
        <ul>
          <li className="menu-item home" onClick={handleNavClick}>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
              <span className="icon">🏠</span>
              <span className="tooltip">Home</span>
            </NavLink>
          </li>
          <li className="menu-item profile" onClick={handleNavClick}>
            <NavLink to="/staff/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
              <span className="icon">👤</span>
              <span className="tooltip">Profile</span>
            </NavLink>
          </li>
          <li className="menu-item operations" onClick={handleNavClick}>
            <NavLink to="/staff/operations" className={({ isActive }) => (isActive ? 'active' : '')}>
              <span className="icon">⚙️</span>
              <span className="tooltip">Operations</span>
            </NavLink>
          </li>
          <li className="menu-item sponsoring" onClick={handleNavClick}>
            <NavLink to="/staff/sponsoring" className={({ isActive }) => (isActive ? 'active' : '')}>
              <span className="icon">$</span>
              <span className="tooltip">Sponsoring</span>
            </NavLink>
          </li>
          <li className="menu-item tech" onClick={handleNavClick}>
            <NavLink to="/staff/tech" className={({ isActive }) => (isActive ? 'active' : '')}>
              <span className="icon">{'</>'}</span>
              <span className="tooltip">Tech</span>
            </NavLink>
          </li>
          <li className="menu-item marketing" onClick={handleNavClick}>
            <NavLink to="/staff/marketing" className={({ isActive }) => (isActive ? 'active' : '')}>
              <span className="icon">📣</span>
              <span className="tooltip">Marketing</span>
            </NavLink>
          </li>
          <li className="menu-item exec" onClick={handleNavClick}>
            <NavLink to="/staff/exec" className={({ isActive }) => (isActive ? 'active' : '')}>
              <span className="icon">👥</span>
              <span className="tooltip">Exec</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="staff-main-content" onClick={handleMainClick}>
        <Outlet />
      </div>

      {/* Mobile Bottom Bar */}
      <div className="mobile-bottom-bar">
        <div className={`mobile-menu-button ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
          {menuOpen ? (
            <span className="menu-icon">✖</span>
          ) : (
            <span className="menu-icon">🧭</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;