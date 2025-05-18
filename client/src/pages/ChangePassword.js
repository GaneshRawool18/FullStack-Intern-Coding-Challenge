import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ChangePassword = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await axios.put(`/api/users/${user.id}/password`, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      // Clear form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Show success message
      setMessage({ 
        type: 'success', 
        text: 'Password changed successfully!' 
      });
      
      // Redirect to profile after 2 seconds
      setTimeout(() => {
        navigate('/dashboard/profile');
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Change Password</h1>
      
      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
          {message.text}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setMessage({ type: '', text: '' })}
            aria-label="Close"
          />
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger mb-4">
          {error}
        </div>
      )}
      
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="currentPassword" className="form-label">Current Password *</label>
              <input 
                type="password" 
                className="form-control" 
                id="currentPassword" 
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required
                placeholder="Enter your current password"
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">New Password *</label>
              <input 
                type="password" 
                className="form-control" 
                id="newPassword" 
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                placeholder="Enter new password"
                minLength="6"
              />
              <div className="form-text">
                Password must be at least 6 characters long
              </div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Confirm New Password *</label>
              <input 
                type="password" 
                className="form-control" 
                id="confirmPassword" 
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm new password"
              />
            </div>
            
            <div className="d-flex justify-content-end gap-2">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => navigate('/dashboard/profile')}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={loading}
              >
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword; 