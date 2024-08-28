import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../store/userSlice';
import { AppDispatch } from '../store';
import './AuthForm.css';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { jwtDecode } from 'jwt-decode';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameValid, setUsernameValid] = useState<boolean | null>(null);
  const [passwordValid, setPasswordValid] = useState<boolean | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { username, password });
      const token = response.data.token;
  
      // Decode token to get expiration time
      const decodedToken: any = jwtDecode(token);
      const { userId } = decodedToken;
      const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
  
      // Store token and expiration time in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('tokenExpiration', expirationTime.toString());
      localStorage.setItem('userId', userId.toString());  // Store userId

  
      // Add token to axios default headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
      dispatch(login({ username, id: userId }));
      navigate('/home');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the default form submission
      handleLogin();
    }
  };

  const validateUsername = (value: string) => {
    setUsernameValid(value.length >= 3);
    setUsername(value);
  };

  const validatePassword = (value: string) => {
    setPasswordValid(value.length >= 6);
    setPassword(value);
  };

  return (
    <div className="auth-container">
      <Logo />
      <form className="auth-form login-form" onKeyDown={handleKeyDown}>
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
      </form>
    </div>
  );
};

export default Login;