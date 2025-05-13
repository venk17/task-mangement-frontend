import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/auth';
import AuthRoute from './utils/AuthRoute';
import PrivateRoute from './utils/PrivateRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import TaskForm from './pages/TaskForm';
import Profile from './pages/Profile'; // Add this import
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <Router>
       
          <Navbar />
         
            <Routes>
              <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
              <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/tasks" element={<PrivateRoute><Tasks /></PrivateRoute>} />
              <Route path="/tasks/new" element={<PrivateRoute><TaskForm /></PrivateRoute>} />
              <Route path="/tasks/:id/edit" element={<PrivateRoute><TaskForm /></PrivateRoute>} />
              {/* Add the Profile route */}
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            </Routes>
        
       
      </Router>
    </AuthProvider>
  );
}

export default App;