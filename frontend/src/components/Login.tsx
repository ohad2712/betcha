import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../store/userSlice';
import { AppDispatch } from '../store';
import './AuthForm.css';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameValid, setUsernameValid] = useState<boolean | null>(null);
  const [passwordValid, setPasswordValid] = useState<boolean | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { username, password });
      dispatch(login({ username } as any));
    } catch (error) {
      console.error('Login failed', error);
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
      <div className="auth-form login-form">
        <h2>Login</h2>
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
        <button onClick={handleLogin}>Login</button>

        <p className="login-register-link">
          Don't have an account yet?{' '}
          <Link to="/register" className="login-register-link-text">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
