import React, { createContext, useState, useEffect, useContext } from 'react';
import '../styles/Theme.css';

// Create a context for theme management
const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    const isDark = savedTheme === 'true';
    setIsDarkMode(isDark);
    
    // Apply dark mode class to body if needed
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, []);

  // Function to toggle theme
  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    // Update localStorage
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    // Update body class
    if (newDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  // Theme toggle component
  const ThemeToggle = () => (
    <div 
      className={`theme-toggle ${isDarkMode ? 'dark' : 'light'}`} 
      onClick={toggleTheme}
      role="button"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      tabIndex={0}
    >
      <div className="toggle-thumb"></div>
      <svg 
        className="theme-icon sun" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="#f59e0b" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
      <svg 
        className="theme-icon moon" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="#f1c40f" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    </div>
  );

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, ThemeToggle }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 