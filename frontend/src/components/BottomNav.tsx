// src/components/BottomNav.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './BottomNav.css'; // Import the CSS file for styling

const BottomNav: React.FC = () => {
  const location = useLocation();
  
  // Determine which tab is active based on the current path
  const getNavItemClass = (path: string) => 
    location.pathname === path ? 'nav-item active' : 'nav-item';

  return (
    <div className="bottom-nav">
      <Link to="/home" className={getNavItemClass('/home')}>Home</Link>
      <Link to="/this-gameweek" className={getNavItemClass('/this-gameweek')}>This Gameweek</Link>
      <Link to="/overall-table" className={getNavItemClass('/overall-table')}>Overall Table</Link>
      <Link to="/cup" className={getNavItemClass('/cup')}>Cup</Link>
    </div>
  );
};

export default BottomNav;
