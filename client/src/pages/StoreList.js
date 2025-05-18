import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import SearchBox from '../components/SearchBox';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Memoize handleSearch to prevent unnecessary re-renders
  const handleSearch = useCallback(async (searchFilters) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/stores/search', {
        params: searchFilters
      });
      setStores(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('Error searching stores');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    handleSearch(filters);
  }, [handleSearch, filters]);

  const renderStars = (rating) => (
    [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={index < Math.floor(rating || 0) ? 'text-warning' : 'text-muted'}
      />
    ))
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Browse Stores</h2>
      
      <SearchBox 
        filters={filters}
        setFilters={setFilters}
        onSearch={handleSearch}
      />

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : stores.length > 0 ? (
        <div className="row">
          {stores.map(store => (
            <div key={store.id} className="col-md-4 mb-4">
              <div className="card h-100 hover-effect">
                {store.imageUrl && (
                  <img
                    src={store.imageUrl}
                    alt={store.name}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{store.name}</h5>
                  <div className="mb-2">
                    <FaMapMarkerAlt className="text-secondary me-2" />
                    <small className="text-muted">{store.address}</small>
                  </div>
                  <div className="mb-3">
                    {renderStars(store.average_rating)}
                    <span className="ms-2">
                      ({Number(store.average_rating || 0).toFixed(1)})
                      <small className="text-muted ms-1">
                        {store.total_ratings || 0} reviews
                      </small>
                    </span>
                  </div>
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => navigate(`/stores/${store.id}`)}
                  >
                    View & Rate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-4">
          <p className="text-muted">No stores found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default StoreList;