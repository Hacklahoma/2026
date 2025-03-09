import React, { useState } from 'react';
import { useTheme } from '../../../components/ThemeProvider';

const TechRegistration = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('pending');
  
  // Sample registration data
  const registrationData = {
    pending: [
      { id: 'REG001', name: 'John Smith', email: 'john.smith@example.com', university: 'University of Oklahoma', date: '2023-03-01' },
      { id: 'REG002', name: 'Emily Johnson', email: 'emily.j@example.com', university: 'Oklahoma State University', date: '2023-03-02' },
      { id: 'REG003', name: 'Michael Brown', email: 'mbrown@example.com', university: 'University of Tulsa', date: '2023-03-03' },
    ],
    approved: [
      { id: 'REG004', name: 'Sarah Davis', email: 'sarah.d@example.com', university: 'University of Oklahoma', date: '2023-02-25' },
      { id: 'REG005', name: 'David Wilson', email: 'dwilson@example.com', university: 'Oklahoma State University', date: '2023-02-26' },
      { id: 'REG006', name: 'Jessica Lee', email: 'jlee@example.com', university: 'University of Central Oklahoma', date: '2023-02-27' },
    ],
    rejected: [
      { id: 'REG007', name: 'Robert Taylor', email: 'rtaylor@example.com', university: 'University of Tulsa', date: '2023-02-20' },
      { id: 'REG008', name: 'Amanda Martinez', email: 'amartinez@example.com', university: 'Oklahoma City University', date: '2023-02-21' },
    ],
  };
  
  return (
    <div className={`tech-registration ${isDarkMode ? 'dark-mode' : ''}`}>
      <h2>Registration Management</h2>
      
      <div className="staff-card">
        <h3>Registration Statistics</h3>
        <div className="event-stats">
          <div className="stat-item">
            <span className="stat-value">{registrationData.pending.length}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{registrationData.approved.length}</span>
            <span className="stat-label">Approved</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{registrationData.rejected.length}</span>
            <span className="stat-label">Rejected</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{registrationData.pending.length + registrationData.approved.length + registrationData.rejected.length}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>
      </div>
      
      <div className="staff-card">
        <div className="schedule-tabs">
          <button 
            className={`schedule-tab ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending
          </button>
          <button 
            className={`schedule-tab ${activeTab === 'approved' ? 'active' : ''}`}
            onClick={() => setActiveTab('approved')}
          >
            Approved
          </button>
          <button 
            className={`schedule-tab ${activeTab === 'rejected' ? 'active' : ''}`}
            onClick={() => setActiveTab('rejected')}
          >
            Rejected
          </button>
        </div>
        
        <div className="registration-content">
          <div className="search-filter">
            <input 
              type="text" 
              placeholder="Search by name or email" 
              className="search-input"
            />
            <select className="filter-select">
              <option value="all">All Universities</option>
              <option value="uok">University of Oklahoma</option>
              <option value="osu">Oklahoma State University</option>
              <option value="ut">University of Tulsa</option>
              <option value="uco">University of Central Oklahoma</option>
            </select>
          </div>
          
          <table className="staff-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>University</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {registrationData[activeTab].map((registration) => (
                <tr key={registration.id}>
                  <td>{registration.id}</td>
                  <td>{registration.name}</td>
                  <td>{registration.email}</td>
                  <td>{registration.university}</td>
                  <td>{registration.date}</td>
                  <td>
                    <div className="action-buttons">
                      {activeTab === 'pending' && (
                        <>
                          <button className="action-button approve">Approve</button>
                          <button className="action-button reject">Reject</button>
                        </>
                      )}
                      {activeTab === 'approved' && (
                        <button className="action-button reject">Revoke</button>
                      )}
                      {activeTab === 'rejected' && (
                        <button className="action-button approve">Reconsider</button>
                      )}
                      <button className="action-button view">View</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="staff-card">
        <h3>Bulk Actions</h3>
        <div className="button-group">
          <button className="staff-button">Approve Selected</button>
          <button className="staff-button staff-button-secondary">Reject Selected</button>
          <button className="staff-button staff-button-secondary">Export Data</button>
        </div>
      </div>
    </div>
  );
};

export default TechRegistration;