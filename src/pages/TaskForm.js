import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/auth';
import moment from 'moment';
import "./TaskForm.css";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL || "https://task-mangement-backend-2.onrender.com/api";

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: moment().add(1, 'day').format('YYYY-MM-DD'),
    status: 'pending',
    remarks: ''
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!authState.isAuthenticated) {
      navigate('/login');
    }
  }, [authState.isAuthenticated, navigate]);

  // Fetch task if editing
  useEffect(() => {
    if (id && authState.token) {
      const fetchTask = async () => {
        setInitialLoading(true);
        try {
          const res = await axios.get(
            `${REACT_APP_API_URL}/tasks/${id}`,
            {
              headers: {
                'Authorization': `Bearer ${authState.token}`
              }
            }
          );
          const task = res.data.data;
          setFormData({
            title: task.title,
            description: task.description,
            dueDate: moment(task.dueDate).format('YYYY-MM-DD'),
            status: task.status,
            remarks: task.remarks || ''
          });
        } catch (err) {
          console.error(err);
          setError(err.response?.data?.message || 'Failed to fetch task');
        } finally {
          setInitialLoading(false);
        }
      };

      fetchTask();
    }
  }, [id, authState.token]);

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${authState.token}`
        }
      };

      if (id) {
        await axios.put(
          `${REACT_APP_API_URL}/tasks/${id}`,
          formData,
          config
        );
      } else {
        await axios.post(
          `${REACT_APP_API_URL}/tasks`,
          formData,
          config
        );
      }
      navigate('/tasks');
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="task-form-container">
        <div className="loading-spinner">Loading task details...</div>
      </div>
    );
  }

  return (
    <div className="task-form-container">
      <div className="task-form-card">
        <div className="task-form-header">
          <h1 className="task-form-title">
            {id ? 'Edit Task' : 'Create New Task'}
            <span className="task-form-icon">
              {id ? '✏️' : '➕'}
            </span>
          </h1>
          <p className="task-form-subtitle">
            {id ? 'Update your task details' : 'Fill in the details for your new task'}
          </p>
        </div>

        {error && (
          <div className="task-form-error">
            <span className="error-icon">!</span>
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="task-form">
          <div className="task-form-group">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={onChange}
              required
              className="task-form-input"
              placeholder=" "
            />
            <label className="task-form-label">Task Title</label>
            <span className="task-form-focus-border"></span>
          </div>

          <div className="task-form-group">
            <textarea
              name="description"
              value={formData.description}
              onChange={onChange}
              required
              rows="5"
              className="task-form-textarea"
              placeholder=" "
            />
            <label className="task-form-label">Description</label>
            <span className="task-form-focus-border"></span>
          </div>

          <div className="task-form-row">
            <div className="task-form-group task-form-date-group">
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={onChange}
                required
                min={moment().format('YYYY-MM-DD')}
                className="task-form-date"
              />
              <label className="task-form-label">Due Date</label>
            </div>

            <div className="task-form-group task-form-select-group">
              <select
                name="status"
                value={formData.status}
                onChange={onChange}
                required
                className="task-form-select"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <label className="task-form-label">Status</label>
              <span className="task-form-select-arrow"></span>
            </div>
          </div>

          <div className="task-form-group">
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={onChange}
              rows="3"
              className="task-form-textarea"
              placeholder=" "
            />
            <label className="task-form-label">Remarks (Optional)</label>
          </div>

          <button
            type="submit"
            className={`task-form-submit-btn ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="task-form-spinner"></span>
                Processing...
              </>
            ) : id ? (
              'Update Task'
            ) : (
              'Create Task'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;