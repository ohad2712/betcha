import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const context = useContext(UserContext);

  if (!context) {
    // Handle the case when context is null (optional)
    return <Navigate to="/login" />;
  }

  const { user } = context;

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;