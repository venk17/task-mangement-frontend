import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/auth';

const PrivateRoute = ({ children }) => {
  const { authState } = useContext(AuthContext);

  return authState.isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;