// src/components/AuthPage.tsx
import React from 'react';
import Login from './Login';
import Register from './Register';
import Logo from './Logo';
import './AuthPage.css';

const AuthPage: React.FC = () => {
  return (
    <div className="auth-page">
      <Logo />
      <div className="auth-container">
        <Login />
        <Register />
      </div>
    </div>
  );
};

export default AuthPage;
