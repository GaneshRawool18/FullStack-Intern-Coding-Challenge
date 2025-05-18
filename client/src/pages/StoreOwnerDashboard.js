import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';

const StoreOwnerDashboard = () => {
  const [ratings, setRatings] = useState({
    average: 0,
    total: 0,
    list: []
  });
  const navigate = useNavigate();

  // Memoized fetchRatings to satisfy React Hook dependency warning
  const fetchRatings = useCallback(async () => {
    try {
      const response = await axios.get('/api/store/ratings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setRatings({
        average: response.data.averageRating,
        total: response.data.totalRatings,
        list: response.data.ratings
      });
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  return (
    <div className="container py-4">
      {/* Auth Actions */}
      <div className="text-end mb-4">
        <button 
          onClick={() => navigate('/change-password')} 
          className="btn btn-primary me-2"
        >
          Change Password
        </button>
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/login');
          }} 
          className="btn btn-danger"
        >
          Logout
        </button>
      </div>

      {/* Rating Overview */}
      <div className="card mb-4">
        <div className="card-body text-center">
          <div className="display-4">
            {ratings.average.toFixed(1)}
            <FaStar className="text-warning ms-2" />
          </div>
          <div className="text-muted">
            Based on {ratings.total} rating{ratings.total !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Ratings List */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Customer Ratings</h5>
        </div>
        <div className="table-responsive">
          <table className="table mb-0">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {ratings.list.length > 0 ? (
                ratings.list.map(rating => (
                  <tr key={rating.id}>
                    <td>{rating.username}</td>
                    <td>
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={i < rating.rating ? 'text-warning' : 'text-muted'}
                        />
                      ))}
                    </td>
                    <td>{rating.comment || '-'}</td>
                    <td>{new Date(rating.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-3">
                    No ratings yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


export default StoreOwnerDashboard;
