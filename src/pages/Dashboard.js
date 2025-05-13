import React from 'react';
import { Link } from 'react-router-dom';
import "./Dashboard.css"

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1 className="dashboard-title">Welcome to Task Manager</h1>
        <p className="dashboard-subtitle">
          Manage your tasks efficiently and stay organized
        </p>
        <div className="dashboard-btn-group">
          <Link to="/tasks" className="dashboard-btn">
            View Tasks
          </Link>
          <Link to="/tasks/new" className="dashboard-btn dashboard-btn-primary">
            Add New Task
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;