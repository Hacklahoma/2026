import React from 'react';
import { useTheme } from '../../../components/ThemeProvider';

const TechHome = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`tech-home ${isDarkMode ? 'dark-mode' : ''}`}>
      <h2>Tech Team Dashboard</h2>
      
      <div className="staff-card">
        <h3>System Status</h3>
        <div className="status-indicators">
          <div className="status-item">
            <span className="status-label">Registration System:</span>
            <span className="status-value success">Online</span>
          </div>
          <div className="status-item">
            <span className="status-label">Judging Platform:</span>
            <span className="status-value success">Online</span>
          </div>
          <div className="status-item">
            <span className="status-label">Check-in System:</span>
            <span className="status-value warning">In Development</span>
          </div>
        </div>
      </div>
      
      <div className="staff-card">
        <h3>Registration Statistics</h3>
        <div className="event-stats">
          <div className="stat-item">
            <span className="stat-value">423</span>
            <span className="stat-label">Total Registrations</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">287</span>
            <span className="stat-label">Approved</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">136</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
      </div>
      
      <div className="staff-card">
        <h3>Quick Actions</h3>
        <div className="button-group">
          <button className="staff-button">View Registrations</button>
          <button className="staff-button staff-button-secondary">System Settings</button>
        </div>
      </div>
    </div>
  );
};

export default TechHome;