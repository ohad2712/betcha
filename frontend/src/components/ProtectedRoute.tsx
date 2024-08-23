import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const ProtectedRoute: React.FC<{ children: React.ReactNode; username: string | null }> = ({ children, username }) => {
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);  

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!username) {
    return <div>Loading...</div>; // Show loading until username is available
  }

  return <>{children}</>;
};

export default ProtectedRoute;
