import React from 'react';
import { useTheme } from '../../../components/ThemeProvider';

const SponsoringHome = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`sponsoring-home ${isDarkMode ? 'dark-mode' : ''}`}>
      <h2>Sponsorship Dashboard</h2>
      
      <div className="staff-card">
        <h3>Sponsorship Overview</h3>
        <div className="event-stats">
          <div className="stat-item">
            <span className="stat-value">$42,500</span>
            <span className="stat-label">Total Raised</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">$50,000</span>
            <span className="stat-label">Goal</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">85%</span>
            <span className="stat-label">Progress</span>
          </div>
        </div>
        
        <div className="progress-bar">
          <div className="progress" style={{ width: '85%' }}></div>
        </div>
      </div>
      
      <div className="staff-card">
        <h3>Recent Sponsors</h3>
        <table className="staff-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Tier</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>TechCorp</td>
              <td>Gold</td>
              <td>$10,000</td>
              <td>Confirmed</td>
            </tr>
            <tr>
              <td>InnovateSoft</td>
              <td>Silver</td>
              <td>$5,000</td>
              <td>Confirmed</td>
            </tr>
            <tr>
              <td>DevStream</td>
              <td>Bronze</td>
              <td>$2,500</td>
              <td>Pending</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="staff-card">
        <h3>Quick Actions</h3>
        <div className="button-group">
          <button className="staff-button">Add Sponsor</button>
          <button className="staff-button staff-button-secondary">View Budget</button>
        </div>
      </div>
    </div>
  );
};

export default SponsoringHome;