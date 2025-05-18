import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await axios.get('/api/admin/stores');
      
      // Check if response.data is an array or has a stores property that is an array
      if (Array.isArray(response.data)) {
        setStores(response.data);
      } else if (response.data && Array.isArray(response.data.stores)) {
        setStores(response.data.stores);
      } else {
        console.warn('API response format unexpected:', response.data);
        setStores([]); // Ensure stores is an empty array if data format is unexpected
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching stores:', err);
      setError('Failed to load stores');
      setLoading(false);
    }
  };

  const handleApproveStore = async (storeId) => {
    try {
      await axios.put(`/api/admin/stores/${storeId}/approve`);
      setMessage({ type: 'success', text: 'Store approved successfully' });
      fetchStores(); // Refresh the store list
    } catch (err) {
      setMessage({ 
        type: 'danger', 
        text: err.response?.data?.message || 'Failed to approve store' 
      });
    }
  };

  const handleDeleteStore = async (storeId) => {
    if (!window.confirm('Are you sure you want to delete this store?')) {
      return;
    }

    try {
      await axios.delete(`/api/admin/stores/${storeId}`);
      setMessage({ type: 'success', text: 'Store deleted successfully' });
      fetchStores(); // Refresh the store list
    } catch (err) {
      setMessage({ 
        type: 'danger', 
        text: err.response?.data?.message || 'Failed to delete store' 
      });
    }
  };

  // Ensure we have an array before filtering
  const filteredStores = Array.isArray(stores) 
    ? stores.filter(store => 
        store.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.owner?.username?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  if (loading) return <div className="container mt-4">Loading...</div>;
  if (error) return <div className="container mt-4 text-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Store Management</h1>
        <Link to="/admin/stores/add" className="btn btn-primary">
          <i className="fas fa-plus-circle me-1"></i> Add New Store
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

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search stores by name, address, or owner..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="card">
        <div className="card-body">
          {filteredStores.length === 0 ? (
            <div className="text-center p-4">
              <p className="mb-0">No stores found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Owner</th>
                    <th>Status</th>
                    <th>Rating</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStores.map(store => (
                    <tr key={store.id}>
                      <td>
                        <Link to={`/stores/${store.id}`}>{store.name}</Link>
                      </td>
                      <td>{store.address}</td>
                      <td>{store.owner?.username || 'Unknown'}</td>
                      <td>
                        <span className={`badge bg-${store.approved ? 'success' : 'warning'}`}>
                          {store.approved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td>
                        <div className="text-warning">
                          {'★'.repeat(Math.round(store.averageRating || 0))}
                          {'☆'.repeat(5 - Math.round(store.averageRating || 0))}
                        </div>
                        <small className="text-muted">
                          {store.averageRating ? store.averageRating.toFixed(1) : 'No ratings'}
                        </small>
                      </td>
                      <td>{store.createdAt ? new Date(store.createdAt).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        <div className="d-flex gap-2">
                          {!store.approved && (
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleApproveStore(store.id)}
                            >
                              Approve
                            </button>
                          )}
                          <Link 
                            to={`/admin/stores/${store.id}/edit`} 
                            className="btn btn-primary btn-sm"
                          >
                            Edit
                          </Link>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteStore(store.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminStores; 