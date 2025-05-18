import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const AdminAddStore = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get store ID from URL if editing
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [storeOwners, setStoreOwners] = useState([]);
  const [loadingOwners, setLoadingOwners] = useState(true);
  const [loadingStore, setLoadingStore] = useState(isEditMode);
  const [newStoreOwner, setNewStoreOwner] = useState(false);
  const [storeOwnerData, setStoreOwnerData] = useState({
    username: '',
    email: '',
    password: 'owner123'  // Default password for new store owners
  });
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    imageUrl: '',
    category: '',
    ownerId: '',
    approved: true,
    openingHours: '',
    contactEmail: '',
    contactPhone: ''
  });

  // Fetch store owners when component mounts
  useEffect(() => {
    const fetchStoreOwners = async () => {
      try {
        const response = await axios.get('/api/admin/users', {
          params: { role: 'store_owner' }
        });
        
        if (Array.isArray(response.data)) {
          setStoreOwners(response.data);
        } else if (response.data && Array.isArray(response.data.users)) {
          setStoreOwners(response.data.users);
        } else {
          setStoreOwners([]);
        }
      } catch (err) {
        console.error('Error fetching store owners:', err);
      } finally {
        setLoadingOwners(false);
      }
    };
    
    fetchStoreOwners();
  }, []);

  // Fetch store data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchStore = async () => {
        try {
          const response = await axios.get(`/api/admin/stores/${id}`);
          const storeData = response.data;
          
          setFormData({
            name: storeData.name || '',
            address: storeData.address || '',
            description: storeData.description || '',
            imageUrl: storeData.imageUrl || '',
            category: storeData.category || '',
            ownerId: storeData.ownerId || '',
            approved: storeData.approved !== false, // Default to true if not specified
            openingHours: storeData.openingHours || '',
            contactEmail: storeData.contactEmail || '',
            contactPhone: storeData.contactPhone || ''
          });
        } catch (err) {
          console.error('Error fetching store:', err);
          setError('Failed to load store data. Please try again.');
        } finally {
          setLoadingStore(false);
        }
      };
      
      fetchStore();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleStoreOwnerChange = (e) => {
    const { name, value } = e.target;
    setStoreOwnerData({
      ...storeOwnerData,
      [name]: value
    });
  };

  const createStoreOwner = async () => {
    try {
      // Ensure email has proper domain for store owner
      let email = storeOwnerData.email;
      if (!email.endsWith('@owner.ratemystore.com')) {
        email = email.split('@')[0] + '@owner.ratemystore.com';
      }
      
      const userData = {
        username: storeOwnerData.username,
        email: email,
        password: storeOwnerData.password,
        role: 'store_owner'
      };
      
      const response = await axios.post('/api/admin/users', userData);
      
      // Return the new store owner ID
      return response.data.user.id;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to create store owner');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      let ownerId = formData.ownerId;
      
      // If creating a new store owner
      if (newStoreOwner) {
        try {
          ownerId = await createStoreOwner();
        } catch (err) {
          setError(`Failed to create store owner: ${err.message}`);
          setLoading(false);
          return;
        }
      }
      
      // Update the form data with the new owner ID if needed
      const storeData = {
        ...formData,
        ownerId: ownerId
      };
      
      let response;
      
      if (isEditMode) {
        // Update existing store
        response = await axios.put(`/api/admin/stores/${id}`, storeData);
        setMessage({ 
          type: 'success', 
          text: `Store "${response.data.name}" updated successfully!` 
        });
      } else {
        // Create new store
        response = await axios.post('/api/admin/stores', storeData);
        setMessage({ 
          type: 'success', 
          text: `Store "${response.data.name}" created successfully!${newStoreOwner ? ' A new store owner account was also created.' : ''}` 
        });
        
        // Only reset form for new store creation
        setFormData({
          name: '',
          address: '',
          description: '',
          imageUrl: '',
          category: '',
          ownerId: '',
          approved: true,
          openingHours: '',
          contactEmail: '',
          contactPhone: ''
        });
        
        setNewStoreOwner(false);
        setStoreOwnerData({
          username: '',
          email: '',
          password: 'owner123'
        });
      }
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/dashboard/admin/stores');
      }, 2000);
      
    } catch (err) {
      const actionWord = isEditMode ? 'update' : 'create';
      setError(err.response?.data?.message || `Failed to ${actionWord} store. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const toggleNewStoreOwnerForm = () => {
    setNewStoreOwner(!newStoreOwner);
  };

  if (loadingStore) {
    return <div className="container mt-4">Loading store data...</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">{isEditMode ? 'Edit Store' : 'Add New Store'}</h1>
      
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
              <h4>Basic Information</h4>
              <hr />
              
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="name" className="form-label">Store Name *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="name" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter store name"
                  />
                </div>
                
                <div className="col-md-6">
                  <label htmlFor="category" className="form-label">Category *</label>
                  <select
                    className="form-select"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Cafe">Cafe</option>
                    <option value="Retail">Retail</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Grocery">Grocery</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Services">Services</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="col-12">
                  <label htmlFor="address" className="form-label">Address *</label>
                  <textarea 
                    className="form-control" 
                    id="address" 
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="Enter complete address"
                    rows="2"
                  />
                </div>
                
                <div className="col-12">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea 
                    className="form-control" 
                    id="description" 
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter store description"
                    rows="3"
                  />
                </div>
                
                <div className="col-md-6">
                  <label htmlFor="openingHours" className="form-label">Opening Hours</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="openingHours" 
                    name="openingHours"
                    value={formData.openingHours}
                    onChange={handleChange}
                    placeholder="E.g., Mon-Fri: 9AM-5PM"
                  />
                </div>
                
                <div className="col-md-6">
                  <label htmlFor="imageUrl" className="form-label">Image URL</label>
                  <input 
                    type="url" 
                    className="form-control" 
                    id="imageUrl" 
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div className="col-md-6">
                  <label htmlFor="contactEmail" className="form-label">Contact Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    id="contactEmail" 
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    placeholder="contact@store.com"
                  />
                </div>
                
                <div className="col-md-6">
                  <label htmlFor="contactPhone" className="form-label">Contact Phone</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="contactPhone" 
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    placeholder="(123) 456-7890"
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <h4>Store Management</h4>
              <hr />
              
              <div className="row g-3">
                {!newStoreOwner && (
                  <div className="col-md-6">
                    <label htmlFor="ownerId" className="form-label">Store Owner *</label>
                    {loadingOwners ? (
                      <p className="form-text">Loading store owners...</p>
                    ) : (
                      <>
                        <select
                          className="form-select"
                          id="ownerId"
                          name="ownerId"
                          value={formData.ownerId}
                          onChange={handleChange}
                          required={!newStoreOwner}
                          disabled={newStoreOwner}
                        >
                          <option value="">Select a store owner</option>
                          {storeOwners.map(owner => (
                            <option key={owner.id} value={owner.id}>
                              {owner.username} ({owner.email})
                            </option>
                          ))}
                        </select>
                        {storeOwners.length === 0 && (
                          <p className="form-text text-warning mt-2">
                            No store owners found. Please create a new store owner below.
                          </p>
                        )}
                      </>
                    )}
                  </div>
                )}
                
                <div className="col-md-6 d-flex align-items-end mb-3">
                  <div>
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={toggleNewStoreOwnerForm}
                    >
                      {newStoreOwner ? "Use Existing Store Owner" : "Create New Store Owner"}
                    </button>
                  </div>
                </div>

                {newStoreOwner && (
                  <div className="col-12">
                    <div className="card border-primary mt-2">
                      <div className="card-header bg-primary text-white">
                        Create New Store Owner
                      </div>
                      <div className="card-body">
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label htmlFor="username" className="form-label">Username *</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              id="username" 
                              name="username"
                              value={storeOwnerData.username}
                              onChange={handleStoreOwnerChange}
                              required={newStoreOwner}
                              placeholder="Enter store owner username"
                            />
                          </div>
                          
                          <div className="col-md-6">
                            <label htmlFor="email" className="form-label">Email *</label>
                            <div className="input-group">
                              <input 
                                type="text" 
                                className="form-control" 
                                id="email" 
                                name="email"
                                value={storeOwnerData.email}
                                onChange={handleStoreOwnerChange}
                                required={newStoreOwner}
                                placeholder="username"
                              />
                              <span className="input-group-text">@owner.ratemystore.com</span>
                            </div>
                            <small className="form-text text-muted">
                              Default password: <code>{storeOwnerData.password}</code>
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="col-md-6 mt-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="approved"
                      name="approved"
                      checked={formData.approved}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="approved">
                      {isEditMode ? 'Store is approved' : 'Approve store immediately'}
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="d-flex justify-content-end gap-2">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => navigate('/dashboard/admin/stores')}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={loading || (!newStoreOwner && storeOwners.length === 0 && !loadingOwners)}
              >
                {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Store' : 'Create Store')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAddStore; 