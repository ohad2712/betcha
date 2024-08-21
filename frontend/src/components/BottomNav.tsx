import React from 'react';
import { Link } from 'react-router-dom';
import './BottomNav.css'; // Import the CSS file for styling

const BottomNav: React.FC = () => {
  return (
    <div className="bottom-nav">
      <Link to="/home" className="nav-item">Home</Link>
      <Link to="/this-gameweek" className="nav-item">This Gameweek</Link>
      <Link to="/overall-table" className="nav-item">Overall Table</Link>
      <Link to="/cup" className="nav-item">Cup</Link>
    </div>
  );
};

export default BottomNav;
