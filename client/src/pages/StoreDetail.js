import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const StoreDetail = () => {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStoreDetails();
    fetchUserRating();
  }, [id]);

  const fetchStoreDetails = async () => {
    try {
      const response = await axios.get(`/api/stores/${id}`);
      setStore(response.data);
    } catch (err) {
      setError('Error fetching store details');
    }
  };

  const fetchUserRating = async () => {
    try {
      const response = await axios.get(`/api/ratings/store/${id}/user`);
      if (response.data) {
        setUserRating(response.data);
        setRating(response.data.rating);
        setComment(response.data.comment);
      }
    } catch (err) {
      console.error('Error fetching user rating:', err);
    }
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`/api/ratings/store/${id}`, {
        rating,
        comment
      });
      fetchStoreDetails();
      fetchUserRating();
    } catch (err) {
      setError('Error submitting rating');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRating = async () => {
    if (!window.confirm('Are you sure you want to delete your rating?')) return;
    
    try {
      await axios.delete(`/api/ratings/${userRating.id}`);
      setUserRating(null);
      setRating(0);
      setComment('');
      fetchStoreDetails();
    } catch (err) {
      setError('Error deleting rating');
    }
  };

  if (!store) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <h2>{store.name}</h2>
              <div className="mb-3">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={
                      index < store.averageRating
                        ? 'text-warning'
                        : 'text-muted'
                    }
                  />
                ))}
                <span className="ms-2">
                  ({store.averageRating?.toFixed(1)})
                  <small className="text-muted ms-1">
                    {store.totalRatings} reviews
                  </small>
                </span>
              </div>
              <p>{store.description}</p>
              <p className="text-muted">{store.address}</p>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h4>Your Rating</h4>
              <form onSubmit={handleSubmitRating}>
                <div className="mb-3">
                  <div className="star-rating">
                    {[...Array(5)].map((_, index) => (
                      <FaStar
                        key={index}
                        className={
                          index < rating ? 'text-warning' : 'text-muted'
                        }
                        style={{ cursor: 'pointer' }}
                        onClick={() => setRating(index + 1)}
                      />
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your review..."
                    rows="3"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {userRating ? 'Update Rating' : 'Submit Rating'}
                </button>
                {userRating && (
                  <button
                    type="button"
                    className="btn btn-danger ms-2"
                    onClick={handleDeleteRating}
                  >
                    Delete Rating
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDetail;