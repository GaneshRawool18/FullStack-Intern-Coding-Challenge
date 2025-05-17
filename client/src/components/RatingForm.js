import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';

const RatingForm = ({ storeId, onRatingSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [existingRating, setExistingRating] = useState(null);

  useEffect(() => {
    fetchUserRating();
  }, [storeId]);

  const fetchUserRating = async () => {
    try {
      const response = await axios.get(`/api/ratings/store/${storeId}/user`);
      if (response.data) {
        setExistingRating(response.data);
        setRating(response.data.rating);
        setComment(response.data.comment || '');
      }
    } catch (err) {
      console.error('Error fetching user rating:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`/api/ratings/store/${storeId}`, {
        rating,
        comment
      });
      
      if (onRatingSubmit) {
        onRatingSubmit(response.data.rating);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting rating');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!existingRating || !window.confirm('Are you sure you want to delete your rating?')) {
      return;
    }

    try {
      await axios.delete(`/api/ratings/${existingRating.id}`);
      setRating(0);
      setComment('');
      setExistingRating(null);
      if (onRatingSubmit) {
        onRatingSubmit(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting rating');
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">Your Rating</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <div className="star-rating">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <FaStar
                    key={index}
                    className={`star ${ratingValue <= (hover || rating) ? 'text-warning' : 'text-muted'}`}
                    size={24}
                    onClick={() => setRating(ratingValue)}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(0)}
                    style={{ cursor: 'pointer', marginRight: '4px' }}
                  />
                );
              })}
            </div>
          </div>
          
          <div className="mb-3">
            <textarea
              className="form-control"
              rows="3"
              placeholder="Write your review (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          <div className="d-flex gap-2">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading || !rating}
            >
              {loading ? 'Submitting...' : existingRating ? 'Update Rating' : 'Submit Rating'}
            </button>
            
            {existingRating && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={loading}
              >
                Delete Rating
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RatingForm;