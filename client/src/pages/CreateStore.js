import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateStore = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    contactEmail: '',
    contactPhone: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post('/api/stores', formData);
      navigate('/dashboard/stores');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating store');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card">
            <div className="card-header">
              <h4 className="mb-0">Create New Store</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Store Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Address *</label>
                  <textarea
                    className="form-control"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows="2"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Contact Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Contact Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                  />
                </div>

                {error && (
                  <div className="alert alert-danger">{error}</div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Store'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateStore;