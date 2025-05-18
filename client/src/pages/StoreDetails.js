import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaStar, FaRegStar, FaStoreAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';

const StoreDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const response = await axios.get(`/api/stores/${id}`);
        setStore(response.data.store || response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load store details');
        setLoading(false);
      }
    };

    fetchStoreDetails();
  }, [id]);

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (rating === 0) {
      setError('Please select a rating before submitting');
      return;
    }

    try {
      await axios.post(`/api/stores/${id}/ratings`, {
        rating,
        comment
      });
      
      // Show success message
      setSuccessMessage('Your rating was submitted successfully!');
      
      // Refresh store details to show new rating
      const response = await axios.get(`/api/stores/${id}`);
      setStore(response.data.store || response.data);
      
      // Reset form
      setRating(0);
      setComment('');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError('Failed to submit rating. Please try again.');
    }
  };

  const renderStarRating = (value) => {
    return (
      <div className="text-warning d-inline-flex">
        {[1, 2, 3, 4, 5].map(star => (
          <span key={star} className="fs-4">
            {star <= value ? <FaStar/> : <FaRegStar/>}
          </span>
        ))}
      </div>
    );
  };

  if (loading) return <div className="container mt-4">Loading...</div>;
  if (error) return <div className="container mt-4 alert alert-danger">{error}</div>;
  if (!store) return <div className="container mt-4">Store not found</div>;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <h1 className="card-title">{store.name}</h1>
              
              <div className="d-flex align-items-center mb-3">
                {renderStarRating(store.averageRating || 0)}
                <span className="ms-2 fs-5">
                  {store.averageRating ? store.averageRating.toFixed(1) : 'No ratings yet'}
                </span>
              </div>
              
              <p className="card-text">{store.description}</p>
              
              <div className="mb-3">
                <div className="d-flex align-items-start mb-2">
                  <FaStoreAlt className="text-secondary me-2 mt-1" />
                  <div>{store.address}</div>
                </div>
                
                {store.openingHours && (
                  <div className="d-flex align-items-start mb-2">
                    <FaClock className="text-secondary me-2 mt-1" />
                    <div>{store.openingHours}</div>
                  </div>
                )}
                
                {store.contactPhone && (
                  <div className="d-flex align-items-start mb-2">
                    <FaPhone className="text-secondary me-2 mt-1" />
                    <div>{store.contactPhone}</div>
                  </div>
                )}
                
                {store.contactEmail && (
                  <div className="d-flex align-items-start mb-2">
                    <FaEnvelope className="text-secondary me-2 mt-1" />
                    <div>{store.contactEmail}</div>
                  </div>
                )}
              </div>
              
              {store.imageUrl && (
                <img 
                  src={store.imageUrl} 
                  alt={store.name}
                  className="img-fluid rounded mb-3"
                  style={{ maxHeight: '300px', width: '100%', objectFit: 'cover' }}
                />
              )}
            </div>
          </div>
          
          {/* Ratings List */}
          <div className="card">
            <div className="card-header">
              <h3 className="mb-0">Recent Ratings</h3>
            </div>
            <div className="card-body">
              {store.ratings && store.ratings.length > 0 ? (
                <div className="list-group list-group-flush">
                  {store.ratings.map((rating, index) => (
                    <div key={rating.id || index} className="list-group-item px-0">
                      <div className="d-flex justify-content-between">
                        <div>
                          <strong>{rating.username || 'Anonymous'}</strong>
                          <div className="text-warning">
                            {renderStarRating(rating.rating)}
                          </div>
                        </div>
                        <small className="text-muted">
                          {new Date(rating.created_at || rating.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                      <p className="mb-0 mt-2">{rating.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center my-4">No ratings yet. Be the first to rate this store!</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          {/* Rating Form */}
          <div className="card sticky-top" style={{ top: '1rem' }}>
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">Rate this store</h3>
            </div>
            <div className="card-body">
              {user ? (
                <form onSubmit={handleSubmitRating}>
                  {successMessage && (
                    <div className="alert alert-success">{successMessage}</div>
                  )}
                  
                  <div className="mb-3">
                    <label className="form-label">Your Rating</label>
                    <div className="star-rating">
                      {[1, 2, 3, 4, 5].map(star => (
                        <span 
                          key={star}
                          className="fs-1 me-1 cursor-pointer"
                          style={{ cursor: 'pointer', color: (hoverRating || rating) >= star ? '#ffc107' : '#e4e5e9' }}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Your Comment</label>
                    <textarea 
                      className="form-control" 
                      value={comment} 
                      onChange={(e) => setComment(e.target.value)}
                      rows="4"
                      placeholder="Share your experience with this store..."
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">Submit Rating</button>
                </form>
              ) : (
                <div className="text-center py-3">
                  <p>Please log in to rate this store</p>
                  <button 
                    onClick={() => navigate('/login')}
                    className="btn btn-outline-primary"
                  >
                    Login to Rate
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDetails; 