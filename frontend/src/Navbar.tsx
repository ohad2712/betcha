import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/this-gameweek">This Gameweek</Link></li>
        <li><Link to="/overall-table">Overall Table</Link></li>
        <li><Link to="/cup">Cup</Link></li>
        <li><Link to="/settings">Settings</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
