import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const REACT_APP_API_URL = "https://task-mangement-awi2.onrender.com/api";

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    user: null,
    loading: true
  });

  // Set axios defaults when token changes
  useEffect(() => {
    if (authState.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${authState.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [authState.token]);

  useEffect(() => {
    if (authState.token) {
      loadUser();
    } else {
      setAuthState(prev => ({
        ...prev,
        loading: false
      }));
    }
    // eslint-disable-next-line
  }, []);

  const loadUser = async () => {
    try {
      const res = await axios.get(`${REACT_APP_API_URL}/auth/me`);
      
      setAuthState({
        token: authState.token,
        isAuthenticated: true,
        user: res.data,
        loading: false
      });
    } catch (err) {
      console.error('Error loading user:', err.response?.data);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setAuthState({
        token: null,
        isAuthenticated: false,
        user: null,
        loading: false
      });
    }
  };

  const register = async formData => {
    try {
      const res = await axios.post(
        `${REACT_APP_API_URL}/auth/register`,
        formData
      );

      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

      setAuthState({
        token: res.data.token,
        isAuthenticated: true,
        user: res.data.user,
        loading: false
      });

      return { success: true };
    } catch (err) {
      console.error('Registration error:', err.response?.data);
      return {
        success: false,
        error: err.response?.data?.error || 'Registration failed'
      };
    }
  };

  const login = async formData => {
    try {
      const res = await axios.post(
        `${REACT_APP_API_URL}/auth/login`,
        formData
      );

      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

      setAuthState({
        token: res.data.token,
        isAuthenticated: true,
        user: res.data.user,
        loading: false
      });

      return { success: true };
    } catch (err) {
      console.error('Login error:', err.response?.data);
      return {
        success: false,
        error: err.response?.data?.error || 'Login failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setAuthState({
      token: null,
      isAuthenticated: false,
      user: null,
      loading: false
    });
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        register,
        login,
        logout,
        loadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };