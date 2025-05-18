import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Filter state
  const [filters, setFilters] = useState({
    username: '',
    email: '',
    address: '',
    role: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users');
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load users');
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(`/api/admin/users/${userId}/role`, { role: newRole });
      setMessage({ type: 'success', text: 'User role updated successfully' });
      fetchUsers(); // Refresh the user list
    } catch (err) {
      setMessage({ 
        type: 'danger', 
        text: err.response?.data?.message || 'Failed to update user role' 
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await axios.delete(`/api/admin/users/${userId}`);
      setMessage({ type: 'success', text: 'User deleted successfully' });
      fetchUsers(); // Refresh the user list
    } catch (err) {
      setMessage({ 
        type: 'danger', 
        text: err.response?.data?.message || 'Failed to delete user' 
      });
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const clearFilters = () => {
    setFilters({
      username: '',
      email: '',
      address: '',
      role: ''
    });
  };

  // Apply filters to users
  const filteredUsers = users.filter(user => {
    return (
      (filters.username === '' || 
       user.username.toLowerCase().includes(filters.username.toLowerCase())) &&
      (filters.email === '' || 
       user.email.toLowerCase().includes(filters.email.toLowerCase())) &&
      (filters.address === '' || 
       (user.address && user.address.toLowerCase().includes(filters.address.toLowerCase()))) &&
      (filters.role === '' || user.role === filters.role)
    );
  });

  if (loading) return <div className="container mt-4">Loading...</div>;
  if (error) return <div className="container mt-4 text-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>User Management</h1>
        <Link to="/admin/users/add" className="btn btn-primary">
          <i className="fas fa-plus-circle me-1"></i> Add New User
        </Link>
      </div>

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

      <div className="card mb-4">
        <div className="card-header bg-light">
          <h5 className="mb-0">Filter Users</h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input 
                type="text" 
                className="form-control" 
                id="username" 
                name="username"
                value={filters.username}
                onChange={handleFilterChange}
                placeholder="Filter by username"
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input 
                type="text" 
                className="form-control" 
                id="email" 
                name="email"
                value={filters.email}
                onChange={handleFilterChange}
                placeholder="Filter by email"
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="address" className="form-label">Address</label>
              <input 
                type="text" 
                className="form-control" 
                id="address" 
                name="address"
                value={filters.address}
                onChange={handleFilterChange}
                placeholder="Filter by address"
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="role" className="form-label">Role</label>
              <select 
                className="form-select" 
                id="role" 
                name="role"
                value={filters.role}
                onChange={handleFilterChange}
              >
                <option value="">All Roles</option>
                <option value="user">Regular User</option>
                <option value="store_owner">Store Owner</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          </div>
          <div className="mt-3 text-end">
            <button 
              className="btn btn-secondary" 
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Role</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-3">
                      No users found matching your filters
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.address || 'Not provided'}</td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          style={{ width: 'auto' }}
                        >
                          <option value="user">User</option>
                          <option value="store_owner">Store Owner</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Link 
                            to={`/admin/users/${user.id}`} 
                            className="btn btn-sm btn-info text-white"
                          >
                            View
                          </Link>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={user.role === 'admin'} // Prevent deleting admin users
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-3">
            <p className="text-muted">Showing {filteredUsers.length} of {users.length} users</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers; 