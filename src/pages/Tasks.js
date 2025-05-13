import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/auth';
import moment from 'moment';
import "./Tasks.css";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL || "https://task-mangement-awi2.onrender.com/api";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { authState } = useContext(AuthContext);
  const [searchLoading, setSearchLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const location = useLocation();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`${REACT_APP_API_URL}/tasks`, {
        headers: {
          'Authorization': `Bearer ${authState.token}`
        }
      });
      setTasks(res.data.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authState.token) {
      fetchTasks();
    }

    // Check for success message from navigation state
    if (location.state?.success) {
      setSuccessMessage(`Task ${location.state.action || 'created'} successfully!`);
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [authState.token, location.key]);

  const handleSearch = async e => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchTasks();
      return;
    }

    setSearchLoading(true);
    try {
      const res = await axios.get(
        `${REACT_APP_API_URL}/tasks/search?q=${encodeURIComponent(searchTerm)}`,
        {
          headers: {
            'Authorization': `Bearer ${authState.token}`
          }
        }
      );
      setTasks(res.data.data);
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  };

 const deleteTask = async id => {
  if (!window.confirm('Are you sure you want to delete this task?')) return;
  
  try {
    setDeletingId(id);
    setError('');
    
    const response = await axios.delete(`${REACT_APP_API_URL}/tasks/${id}`, {
      headers: {
        'Authorization': `Bearer ${authState.token}`
      }
    });
    
    if (response.data.success) {
      setTasks(prevTasks => prevTasks.filter(task => task._id !== id));
      setSuccessMessage('Task deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  } catch (err) {
    console.error('Delete error:', err);
    const errorMessage = err.response?.data?.message || 
                        err.response?.data?.error ||
                        'Failed to delete task. Please try again.';
    setError(errorMessage);
  } finally {
    setDeletingId(null);
  }
};
  const clearSearch = () => {
    setSearchTerm('');
    fetchTasks();
  };

  if (loading) {
    return (
      <div className="tasks-loading-screen">
        <div className="tasks-spinner"></div>
        <p>Loading your tasks...</p>
      </div>
    );
  }

  return (
    <div className="tasks-container">
      <div className="tasks-card">
        <div className="tasks-header">
          <h1 className="tasks-title">
            Your Tasks
            <span className="tasks-icon">📋</span>
          </h1>
          <Link to="/tasks/new" className="tasks-add-btn">
            <span className="plus-icon">+</span> Add New Task
          </Link>
        </div>

        {successMessage && (
          <div className="tasks-success-message">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="tasks-error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSearch} className="tasks-search-form">
          <div className="tasks-search-group">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="tasks-search-input"
            />
            <button 
              type="submit" 
              className="tasks-search-btn" 
              disabled={searchLoading}
            >
              {searchLoading ? (
                <span className="tasks-search-spinner"></span>
              ) : (
                'Search'
              )}
            </button>
            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                className="tasks-clear-search-btn"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        <div className="tasks-list">
          {tasks.length === 0 ? (
            <div className="tasks-empty-state">
              <div className="tasks-empty-icon">
                {searchTerm ? '🔍' : '📭'}
              </div>
              <h3>
                {searchTerm 
                  ? 'No tasks match your search' 
                  : 'No tasks found'}
              </h3>
              <p>
                {searchTerm
                  ? 'Try a different search term'
                  : 'Create your first task to get started!'}
              </p>
              {!searchTerm && (
                <Link to="/tasks/new" className="tasks-add-btn">
                  <span className="plus-icon">+</span> Add New Task
                </Link>
              )}
            </div>
          ) : (
            tasks.map((task, index) => (
              <div 
                key={task._id} 
                className="tasks-item"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="tasks-item-content">
                  <div className="tasks-item-header">
                    <h3 className="tasks-item-title">{task.title}</h3>
                    <span className={`tasks-item-status tasks-status-${task.status.replace(/\s+/g, '-').toLowerCase()}`}>
                      {task.status}
                    </span>
                  </div>
                  <p className="tasks-item-description">{task.description}</p>
                  <div className="tasks-item-footer">
                    <span className="tasks-item-due">
                      ⏰ Due: {moment(task.dueDate).format('MMM D, YYYY')}
                    </span>
                    <div className="tasks-item-actions">
                      <Link 
                        to={{
                          pathname: `/tasks/${task._id}/edit`,
                          state: { from: location.pathname }
                        }}
                        className="tasks-edit-btn"
                        title="Edit Task"
                      >
                        ✏️ Edit
                      </Link>
                      <button
                        onClick={() => deleteTask(task._id)}
                        className="tasks-delete-btn"
                        title="Delete Task"
                        disabled={deletingId === task._id}
                      >
                        {deletingId === task._id ? (
                          <span className="tasks-delete-spinner"></span>
                        ) : (
                          '🗑️ Delete'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;