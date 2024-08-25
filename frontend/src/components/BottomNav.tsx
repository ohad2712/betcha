// src/components/BottomNav.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCalendarWeek, faTable, faTrophy } from '@fortawesome/free-solid-svg-icons';
import './BottomNav.css'; // Import the CSS file for styling

const BottomNav: React.FC = () => {
  const location = useLocation();

  // Determine which tab is active based on the current path
  const getNavItemClass = (path: string) => 
    location.pathname === path ? 'nav-item active' : 'nav-item';

  return (
    <div className="bottom-nav">
      <Link to="/home" className={getNavItemClass('/home')}>
        <div className="nav-icon">
          <FontAwesomeIcon icon={faHome} />
        </div>
        <div className="nav-label">Home</div>
      </Link>
      <Link to="/this-gameweek" className={getNavItemClass('/this-gameweek')}>
        <div className="nav-icon">
          <FontAwesomeIcon icon={faCalendarWeek} />
        </div>
        <div className="nav-label">This Gameweek</div>
      </Link>
      <Link to="/overall-table" className={getNavItemClass('/overall-table')}>
        <div className="nav-icon">
          <FontAwesomeIcon icon={faTable} />
        </div>
        <div className="nav-label">Overall Table</div>
      </Link>
      <Link to="/cup" className={getNavItemClass('/cup')}>
        <div className="nav-icon">
          <FontAwesomeIcon icon={faTrophy} />
        </div>
        <div className="nav-label">Cup</div>
      </Link>
    </div>
  );
};

export default BottomNav;
