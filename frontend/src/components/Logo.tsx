// src/components/Logo.tsx
import React from 'react';
import './Logo.css';

const Logo: React.FC = () => {
  return (
    <div className="logo">
      <img src="/betcha-logo.png" alt="Betcha Logo" />
    </div>
  );
};

export default Logo;
