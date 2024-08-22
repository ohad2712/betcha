import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './AuthForm.css';
import Logo from './Logo';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameValid, setUsernameValid] = useState<boolean | null>(null);
  const [passwordValid, setPasswordValid] = useState<boolean | null>(null);
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, { username, password });
      navigate('/login');
    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  const validateUsername = (value: string) => {
    setUsernameValid(value.length >= 3); // Simple validation, customize as needed
    setUsername(value);
  };

  const validatePassword = (value: string) => {
    setPasswordValid(value.length >= 6); // Simple validation, customize as needed
    setPassword(value);
  };

  return (
    <div className="auth-container">
      <Logo />
      <div className="auth-form register-form">
        <h2>Register</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => validateUsername(e.target.value)}
          className={usernameValid === null ? '' : usernameValid ? 'user-valid' : 'user-invalid'}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => validatePassword(e.target.value)}
          className={passwordValid === null ? '' : passwordValid ? 'user-valid' : 'user-invalid'}
        />
        <button onClick={handleRegister}>Register</button>

        <p className="login-register-link">
          Already have an account?{' '}
          <Link to="/login" className="login-register-link-text">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
