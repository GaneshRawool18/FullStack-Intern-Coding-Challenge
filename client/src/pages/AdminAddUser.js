import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminAddUser = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user'
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
    
    setLoading(true);
    setError('');
    
    try {
      // If the role is store_owner, ensure correct email format
      if (formData.role === 'store_owner' && !formData.email.endsWith('@owner.ratemystore.com')) {
        formData.email = formData.email.split('@')[0] + '@owner.ratemystore.com';
      }
      
      // If the role is admin, ensure correct email format
      if (formData.role === 'admin' && !formData.email.endsWith('@admin.ratemystore.com')) {
        formData.email = formData.email.split('@')[0] + '@admin.ratemystore.com';
      }
      
      const response = await axios.post('/api/admin/users', formData);
      
      setMessage({ 
        type: 'success', 
        text: `User ${response.data.user.username} created successfully!` 
      });
      
      // Reset form after success
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'user'
      });
      
      // Redirect after 4 seconds
      setTimeout(() => {
        navigate('/dashboard/admin/users');
      }, 4000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Display role-specific email requirement
  const getRoleEmailHint = () => {
    switch(formData.role) {
      case 'admin':
        return 'Admin accounts require @admin.ratemystore.com email domain';
      case 'store_owner':
        return 'Store owner accounts require @owner.ratemystore.com email domain';
      default:
        return '';
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Add New User</h1>
      
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
            <div className="mb-4">
              <h4>User Information</h4>
              <hr />
              
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="username" className="form-label">Username *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="username" 
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Enter username"
                  />
                </div>
                
                <div className="col-md-6">
                  <label htmlFor="email" className="form-label">Email *</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    id="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter email"
                  />
                  {getRoleEmailHint() && (
                    <small className="form-text text-info">
                      {getRoleEmailHint()}
                    </small>
                  )}
                </div>
                
                <div className="col-md-6">
                  <label htmlFor="password" className="form-label">Password *</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    id="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter password"
                    minLength="6"
                  />
                </div>
                
                <div className="col-md-6">
                  <label htmlFor="role" className="form-label">Role *</label>
                  <select 
                    className="form-select" 
                    id="role" 
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="user">Regular User</option>
                    <option value="store_owner">Store Owner</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="d-flex justify-content-end gap-2">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => navigate('/dashboard/admin/users')}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAddUser; 