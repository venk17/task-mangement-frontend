import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/auth';

const AuthRoute = ({ children }) => {
  const { authState } = useContext(AuthContext);

  return !authState.isAuthenticated ? children : <Navigate to="/" />;
};

export default AuthRoute;