import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const { name, email, password } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const { success, error } = await register({ name, email, password });

    if (success) {
      navigate('/');
    } else {
      setError(error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1 className="register-title">Create Account</h1>
          <p className="register-subtitle">Join us to manage your tasks efficiently</p>
        </div>
        
        {error && (
          <div className="register-error">
            <span className="error-icon">!</span>
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="register-form">
          <div className="register-form-group">
            <input
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              required
              className="register-input"
              placeholder=" "
            />
            <label className="register-label">Full Name</label>
            <span className="register-focus-border"></span>
          </div>

          <div className="register-form-group">
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              className="register-input"
              placeholder=" "
            />
            <label className="register-label">Email Address</label>
            <span className="register-focus-border"></span>
          </div>

          <div className="register-form-group">
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
              minLength="6"
              className="register-input"
              placeholder=" "
            />
            <label className="register-label">Password</label>
            <span className="register-focus-border"></span>
          </div>

          <button 
            type="submit" 
            className={`register-submit-btn ${isSubmitting ? 'submitting' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Processing...
              </>
            ) : (
              'Register Now'
            )}
          </button>
        </form>

        <div className="register-footer">
          Already have an account? <a href="/login" className="register-login-link">Sign In</a>
        </div>
      </div>
    </div>
  );
};

export default Register;