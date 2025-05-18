import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBox from '../components/SearchBox';
import { FaStar, FaStore, FaUsers, FaStarHalfAlt } from 'react-icons/fa';

const AdminDashboard = () => {
  const [storeFilters, setStoreFilters] = useState({
    name: '',
    address: '',
    rating: ''
  });
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0
  });
  
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/admin/dashboard/stats');
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    fetchStats();
  }, []);

  const handleSearch = async (filters) => {
    setLoading(true);
    setError(null);
    
    try {
      // Only include non-empty values in the search params
      const searchParams = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );

      const response = await axios.get('/api/admin/stores/search', {
        params: searchParams
      });
      setFilteredStores(response.data);
    } catch (err) {
      setError('Error searching stores. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Admin Dashboard</h1>
      
      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title">Total Users</h6>
                  <h2 className="mb-0">{stats.totalUsers}</h2>
                </div>
                <FaUsers size={40} opacity={0.5} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title">Total Stores</h6>
                  <h2 className="mb-0">{stats.totalStores}</h2>
                </div>
                <FaStore size={40} opacity={0.5} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title">Total Ratings</h6>
                  <h2 className="mb-0">{stats.totalRatings}</h2>
                </div>
                <FaStarHalfAlt size={40} opacity={0.5} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Box */}
      <SearchBox 
        filters={storeFilters} 
        setFilters={setStoreFilters}
        type="store"
        onSearch={handleSearch}
      />

      {/* Loading Spinner */}
      {loading && (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Store Cards */}
      <div className="row mt-4">
        {filteredStores.length > 0 ? (
          filteredStores.map(store => (
            <div key={store._id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                {store.imageUrl && (
                  <img 
                    src={store.imageUrl} 
                    className="card-img-top" 
                    alt={store.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{store.name}</h5>
                  <div className="mb-2">
                    {[...Array(5)].map((_, index) => (
                      <FaStar
                        key={index}
                        className={index < store.averageRating ? 'text-warning' : 'text-muted'}
                      />
                    ))}
                    <span className="ms-2">
                      ({store.averageRating?.toFixed(1)}) 
                      <small className="text-muted">
                        {store.totalRatings} reviews
                      </small>
                    </span>
                  </div>
                  <p className="card-text">{store.address}</p>
                  {store.email && (
                    <p className="card-text">
                      <small className="text-muted">{store.email}</small>
                    </p>
                  )}
                  <div className="mt-3">
                    <button 
                      className="btn btn-outline-primary btn-sm me-2"
                      onClick={() => window.location.href = `/admin/stores/${store._id}/edit`}
                    >
                      Edit Store
                    </button>
                    <button 
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => {
                        if(window.confirm('Are you sure you want to delete this store?')) {
                          // Add delete functionality
                        }
                      }}
                    >
                      Delete Store
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <p className="text-muted">No stores found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;