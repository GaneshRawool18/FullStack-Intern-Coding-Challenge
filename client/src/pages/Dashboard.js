import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRatings: 0,
    averageRating: 0,
    recentRatings: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('/api/dashboard');
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="container mt-4">Loading...</div>;
  if (error) return <div className="container mt-4 text-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Dashboard</h1>
      
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Welcome, {user?.username}!</h5>
              <p className="card-text">
                Role: <span className="badge bg-primary">{user?.role}</span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Statistics</h5>
              <div className="d-flex justify-content-between">
                <div>
                  <h6>Total Ratings</h6>
                  <p className="h3">{stats.totalRatings}</p>
                </div>
                <div>
                  <h6>Average Rating</h6>
                  <p className="h3">{stats.averageRating?.toFixed(1) || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Recent Activity</h5>
          {stats.recentRatings && stats.recentRatings.length > 0 ? (
            <div className="list-group">
              {stats.recentRatings.map(rating => (
                <div key={rating.id} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">{rating.store?.name}</h6>
                      <div className="text-warning">
                        {'★'.repeat(rating.rating)}{'☆'.repeat(5 - rating.rating)}
                      </div>
                    </div>
                    <small className="text-muted">
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                  <p className="mb-0 mt-2">{rating.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 