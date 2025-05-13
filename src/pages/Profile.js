// src/pages/Profile.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import axios from 'axios';
import './Profile.css';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL || "https://task-mangement-backend-2.onrender.com/api";

const Profile = () => {
  const { authState, logout, loadUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: authState.user?.name || '',
    email: authState.user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [activeTab, setActiveTab] = useState('details');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${REACT_APP_API_URL}/users/updatedetails`, 
        {
          name: formData.name,
          email: formData.email
        },
        {
          headers: {
            'Authorization': `Bearer ${authState.token}`
          }
        }
      );
      setMessage('Details updated successfully');
      setError('');
      loadUser(); // Refresh user data
    } catch (err) {
      setError(err.response?.data?.error || 'Error updating details');
      setMessage('');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    try {
      const res = await axios.put(
        `${REACT_APP_API_URL}/users/updatepassword`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        },
        {
          headers: {
            'Authorization': `Bearer ${authState.token}`
          }
        }
      );
      setMessage('Password updated successfully');
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error updating password');
      setMessage('');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      try {
        await axios.delete(
          `${REACT_APP_API_URL}/users/delete`,
          {
            headers: {
              'Authorization': `Bearer ${authState.token}`
            }
          }
        );
        logout();
        navigate('/login');
      } catch (err) {
        setError(err.response?.data?.error || 'Error deleting account');
      }
    }
  };

  return (
    <div className="profile-container">
      <h1>Profile Settings</h1>
      
      <div className="tabs">
        <button 
          className={activeTab === 'details' ? 'active' : ''}
          onClick={() => setActiveTab('details')}
        >
          Update Details
        </button>
        <button 
          className={activeTab === 'password' ? 'active' : ''}
          onClick={() => setActiveTab('password')}
        >
          Change Password
        </button>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {activeTab === 'details' && (
        <form onSubmit={handleUpdateDetails}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Update Details
          </button>
        </form>
      )}

      {activeTab === 'password' && (
        <form onSubmit={handleUpdatePassword}>
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Change Password
          </button>
        </form>
      )}

      <div className="danger-zone">
        <h3>Danger Zone</h3>
        <button onClick={handleDeleteAccount} className="btn btn-danger">
          Delete My Account
        </button>
      </div>
    </div>
  );
};

export default Profile;