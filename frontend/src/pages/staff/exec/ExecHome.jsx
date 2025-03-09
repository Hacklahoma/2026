import React from 'react';
import { useTheme } from '../../../components/ThemeProvider';

const ExecHome = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`exec-home ${isDarkMode ? 'dark-mode' : ''}`}>
      <h2>Executive Dashboard</h2>
      
      <div className="staff-card">
        <h3>Event Overview</h3>
        <div className="event-stats">
          <div className="stat-item">
            <span className="stat-value">32</span>
            <span className="stat-label">Days Until Event</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">423</span>
            <span className="stat-label">Registrations</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">$42,500</span>
            <span className="stat-label">Budget Secured</span>
          </div>
        </div>
      </div>
      
      <div className="staff-card">
        <h3>Team Status</h3>
        <table className="staff-table">
          <thead>
            <tr>
              <th>Team</th>
              <th>Lead</th>
              <th>Members</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Operations</td>
              <td>Sarah Johnson</td>
              <td>5</td>
              <td>On Track</td>
            </tr>
            <tr>
              <td>Sponsoring</td>
              <td>Michael Chen</td>
              <td>4</td>
              <td>On Track</td>
            </tr>
            <tr>
              <td>Tech</td>
              <td>Alex Rodriguez</td>
              <td>6</td>
              <td>Needs Attention</td>
            </tr>
            <tr>
              <td>Marketing</td>
              <td>Jamie Smith</td>
              <td>3</td>
              <td>On Track</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="staff-card">
        <h3>Quick Actions</h3>
        <div className="button-group">
          <button className="staff-button">Schedule Meeting</button>
          <button className="staff-button staff-button-secondary">Team Management</button>
        </div>
      </div>
    </div>
  );
};

export default ExecHome;
