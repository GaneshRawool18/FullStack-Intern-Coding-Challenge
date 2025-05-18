import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import RatingForm from '../components/RatingForm';
import { FaStar, FaUser, FaMapMarkerAlt, FaStore } from 'react-icons/fa';

const StoreView = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [userRating, setUserRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await axios.get(`/api/stores/${id}`);
        setStore(response.data.store);
        setRatings(response.data.ratings || []);
        
        // If user is logged in, fetch their rating for this store
        if (user) {
          try {
            const userRatingResponse = await axios.get(`/api/ratings/user/${id}`);
            if (userRatingResponse.data) {
              setUserRating(userRatingResponse.data);
            }
          } catch (err) {
            // No rating exists for this user and store
            console.log('No rating found for this user');
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching store data:', err);
        setError('Failed to load store details. Please try again later.');
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [id, user]);

  const handleRatingSubmitted = (newRating) => {
    // Update the user's rating
    setUserRating(newRating);
    
    // Refresh the ratings list
    axios.get(`/api/stores/${id}`)
      .then(response => {
        setStore(response.data.store);
        setRatings(response.data.ratings || []);
      })
      .catch(err => {
        console.error('Error refreshing ratings:', err);
      });
  };

  if (loading) return <div className="container mt-5 text-center">Loading store details...</div>;
  
  if (error) return (
    <div className="container mt-5">
      <div className="alert alert-danger">{error}</div>
      <Link to="/stores" className="btn btn-primary">Back to Stores</Link>
    </div>
  );
  
  if (!store) return (
    <div className="container mt-5">
      <div className="alert alert-warning">Store not found</div>
      <Link to="/stores" className="btn btn-primary">Back to Stores</Link>
    </div>
  );

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-body">
              <h1 className="mb-4">
                <FaStore className="me-2" />
                {store.name}
              </h1>
              
              <div className="mb-3">
                <p className="text-muted mb-2">
                  <FaMapMarkerAlt className="me-2" />
                  {store.address}
                </p>
                
                <div className="d-flex align-items-center mb-3">
                  <div className="me-3 text-warning">
                    {'★'.repeat(Math.round(store.averageRating || 0))}
                    {'☆'.repeat(5 - Math.round(store.averageRating || 0))}
                  </div>
                  <span className="text-muted">
                    {store.averageRating ? (
                      `${store.averageRating.toFixed(1)} out of 5 (${store.ratingCount || 0} ratings)`
                    ) : (
                      'No ratings yet'
                    )}
                  </span>
                </div>
              </div>
              
              <div className="mb-4">
                <h5>Description</h5>
                <p>{store.description || 'No description available for this store.'}</p>
              </div>
              
              <Link to="/stores" className="btn btn-outline-primary">
                Back to Stores
              </Link>
            </div>
          </div>
          
          {user && (
            <RatingForm
              storeId={id}
              existingRating={userRating}
              onRatingSubmitted={handleRatingSubmitted}
            />
          )}
          
          <div className="card">
            <div className="card-header bg-light">
              <h5 className="mb-0">Recent Ratings</h5>
            </div>
            <div className="card-body">
              {ratings.length > 0 ? (
                <div className="list-group">
                  {ratings.map((rating) => (
                    <div key={rating.id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            <FaUser size={24} className="text-secondary" />
                          </div>
                          <div>
                            <h6 className="mb-0">{rating.username}</h6>
                            <div className="text-warning">
                              {'★'.repeat(rating.rating)}
                              {'☆'.repeat(5 - rating.rating)}
                            </div>
                          </div>
                        </div>
                        <small className="text-muted">
                          {new Date(rating.created_at).toLocaleDateString()}
                        </small>
                      </div>
                      {rating.comment && (
                        <p className="mt-2 mb-0">{rating.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center">No ratings yet. Be the first to rate this store!</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="card mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0">Store Information</h5>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <strong>Owner:</strong> {store.owner?.username || 'Not specified'}
              </li>
              <li className="list-group-item">
                <strong>Status:</strong> 
                <span className={`badge bg-${store.status === 'approved' ? 'success' : 'warning'} ms-2`}>
                  {store.status}
                </span>
              </li>
              <li className="list-group-item">
                <strong>Created:</strong> {new Date(store.created_at).toLocaleDateString()}
              </li>
            </ul>
          </div>
          
          {user?.role === 'admin' && (
            <div className="card">
              <div className="card-header bg-light">
                <h5 className="mb-0">Admin Actions</h5>
              </div>
              <div className="card-body">
                <Link to={`/admin/stores/${id}/edit`} className="btn btn-primary w-100 mb-2">
                  Edit Store
                </Link>
                {store.status !== 'approved' && (
                  <button className="btn btn-success w-100 mb-2">
                    Approve Store
                  </button>
                )}
                <button className="btn btn-danger w-100">
                  Delete Store
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreView; 