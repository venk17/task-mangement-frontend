import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import "./Login.css"

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setError('');

    const { success, error } = await login({ email, password });

    if (success) {
      navigate('/');
    } else {
      setError(error);
    }
  };


  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Login</h1>
        {error && <div className="login-alert login-alert-danger">{error}</div>}
        <form onSubmit={onSubmit}>
          <div className="login-form-group">
            <label className="login-label">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              className="login-input"
            />
          </div>
          <div className="login-form-group">
            <label className="login-label">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
              className="login-input"
            />
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
        <p className="login-text-center">
          Don't have an account? <a href="/register" className="login-link">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;