import React from 'react';
import { useTheme } from '../../../components/ThemeProvider';

const MarketingHome = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`marketing-home ${isDarkMode ? 'dark-mode' : ''}`}>
      <h2>Marketing Dashboard</h2>
      
      <div className="staff-card">
        <h3>Campaign Performance</h3>
        <div className="event-stats">
          <div className="stat-item">
            <span className="stat-value">12,450</span>
            <span className="stat-label">Social Reach</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">423</span>
            <span className="stat-label">Registrations</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">3.4%</span>
            <span className="stat-label">Conversion Rate</span>
          </div>
        </div>
      </div>
      
      <div className="staff-card">
        <h3>Upcoming Posts</h3>
        <table className="staff-table">
          <thead>
            <tr>
              <th>Platform</th>
              <th>Content</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Instagram</td>
              <td>Sponsor Announcement</td>
              <td>Mar 15, 2023</td>
              <td>Scheduled</td>
            </tr>
            <tr>
              <td>Twitter</td>
              <td>Registration Reminder</td>
              <td>Mar 18, 2023</td>
              <td>Draft</td>
            </tr>
            <tr>
              <td>LinkedIn</td>
              <td>Speaker Spotlight</td>
              <td>Mar 20, 2023</td>
              <td>Pending Approval</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="staff-card">
        <h3>Quick Actions</h3>
        <div className="button-group">
          <button className="staff-button">Create Post</button>
          <button className="staff-button staff-button-secondary">View Assets</button>
        </div>
      </div>
    </div>
  );
};

export default MarketingHome;
