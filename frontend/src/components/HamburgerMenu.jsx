import React, { useEffect, useRef } from 'react';

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="hamburger-menu" ref={menuRef}>
      <button onClick={() => setIsOpen(!isOpen)}>
        {/* ... existing hamburger icon ... */}
      </button>
      
      {isOpen && (
        <div className="menu-items">
          {/* ... existing menu items ... */}
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu; 