import React from 'react';
import { useTheme } from '../../../components/ThemeProvider';

const OperationsHome = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`operations-home ${isDarkMode ? 'dark-mode' : ''}`}>
      <h2>Operations Dashboard</h2>
      
      <div className="staff-card">
        <h3>Upcoming Tasks</h3>
        <ul>
          <li>Finalize venue logistics - Due: 3/15/2023</li>
          <li>Coordinate with food vendors - Due: 3/20/2023</li>
          <li>Schedule volunteer training - Due: 3/25/2023</li>
        </ul>
      </div>
      
      <div className="staff-card">
        <h3>Event Overview</h3>
        <p>The hackathon is scheduled for April 15-16, 2023. We are expecting approximately 300 participants.</p>
        
        <div className="event-stats">
          <div className="stat-item">
            <span className="stat-value">300</span>
            <span className="stat-label">Expected Participants</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">25</span>
            <span className="stat-label">Volunteers</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">15</span>
            <span className="stat-label">Sponsors</span>
          </div>
        </div>
      </div>
      
      <div className="staff-card">
        <h3>Quick Actions</h3>
        <div className="button-group">
          <button className="staff-button">View Schedule</button>
          <button className="staff-button staff-button-secondary">Send Update</button>
        </div>
      </div>
    </div>
  );
};

export default OperationsHome;