import React, { useState } from 'react';
import { useTheme } from '../../../components/ThemeProvider';

const OperationsSchedule = () => {
  const { isDarkMode } = useTheme();
  const [selectedDay, setSelectedDay] = useState('day1');
  
  // Sample schedule data
  const scheduleData = {
    day1: [
      { time: '08:00 AM - 09:00 AM', event: 'Check-in & Registration', location: 'Main Lobby' },
      { time: '09:00 AM - 10:00 AM', event: 'Opening Ceremony', location: 'Auditorium' },
      { time: '10:00 AM - 12:00 PM', event: 'Team Formation', location: 'Main Hall' },
      { time: '12:00 PM - 01:00 PM', event: 'Lunch', location: 'Cafeteria' },
      { time: '01:00 PM - 02:00 PM', event: 'Sponsor Showcase', location: 'Exhibition Area' },
      { time: '02:00 PM - 06:00 PM', event: 'Hacking Time', location: 'Hacking Spaces' },
      { time: '06:00 PM - 07:00 PM', event: 'Dinner', location: 'Cafeteria' },
      { time: '07:00 PM - 09:00 PM', event: 'Workshop: Intro to AI', location: 'Workshop Room A' },
      { time: '09:00 PM - 12:00 AM', event: 'Hacking Time', location: 'Hacking Spaces' },
    ],
    day2: [
      { time: '12:00 AM - 08:00 AM', event: 'Overnight Hacking', location: 'Hacking Spaces' },
      { time: '08:00 AM - 09:00 AM', event: 'Breakfast', location: 'Cafeteria' },
      { time: '09:00 AM - 12:00 PM', event: 'Hacking Time', location: 'Hacking Spaces' },
      { time: '12:00 PM - 01:00 PM', event: 'Lunch', location: 'Cafeteria' },
      { time: '01:00 PM - 02:00 PM', event: 'Submission Deadline', location: 'Online' },
      { time: '02:00 PM - 04:00 PM', event: 'Project Expo', location: 'Exhibition Area' },
      { time: '04:00 PM - 05:00 PM', event: 'Judging', location: 'Exhibition Area' },
      { time: '05:00 PM - 06:00 PM', event: 'Closing Ceremony & Awards', location: 'Auditorium' },
    ],
  };
  
  return (
    <div className={`operations-schedule ${isDarkMode ? 'dark-mode' : ''}`}>
      <h2>Event Schedule</h2>
      
      <div className="staff-card">
        <div className="schedule-tabs">
          <button 
            className={`schedule-tab ${selectedDay === 'day1' ? 'active' : ''}`}
            onClick={() => setSelectedDay('day1')}
          >
            Day 1 (April 15)
          </button>
          <button 
            className={`schedule-tab ${selectedDay === 'day2' ? 'active' : ''}`}
            onClick={() => setSelectedDay('day2')}
          >
            Day 2 (April 16)
          </button>
        </div>
        
        <div className="schedule-content">
          <table className="staff-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Event</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {scheduleData[selectedDay].map((item, index) => (
                <tr key={index}>
                  <td>{item.time}</td>
                  <td>{item.event}</td>
                  <td>{item.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="staff-card">
        <h3>Schedule Management</h3>
        <div className="staff-form-group">
          <label htmlFor="event-name">Event Name</label>
          <input type="text" id="event-name" placeholder="Enter event name" />
        </div>
        <div className="staff-form-group">
          <label htmlFor="event-time">Time</label>
          <input type="text" id="event-time" placeholder="e.g. 09:00 AM - 10:00 AM" />
        </div>
        <div className="staff-form-group">
          <label htmlFor="event-location">Location</label>
          <input type="text" id="event-location" placeholder="Enter location" />
        </div>
        <div className="staff-form-group">
          <label htmlFor="event-day">Day</label>
          <select id="event-day">
            <option value="day1">Day 1 (April 15)</option>
            <option value="day2">Day 2 (April 16)</option>
          </select>
        </div>
        <div className="button-group">
          <button className="staff-button">Add Event</button>
          <button className="staff-button staff-button-secondary">Export Schedule</button>
        </div>
      </div>
    </div>
  );
};

export default OperationsSchedule;