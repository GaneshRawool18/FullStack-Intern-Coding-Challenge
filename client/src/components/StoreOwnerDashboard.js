import React from 'react';

const StoreOwnerDashboard = ({ store, ratings }) => {
  const averageRating = ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;

  return (
    <div className="container mt-4">
      <div className="card mb-4">
        <div className="card-header">
          <h4>Store Statistics</h4>
        </div>
        <div className="card-body">
          <h5>Average Rating: {averageRating.toFixed(1)}</h5>
          <p>Total Ratings: {ratings.length}</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h4>Customer Ratings</h4>
        </div>
        <div className="card-body">
          <div className="list-group">
            {ratings.map((rating) => (
              <div key={rating.id} className="list-group-item">
                <div className="d-flex justify-content-between">
                  <div>
                    <h6>{rating.userName}</h6>
                    <p className="mb-1">Rating: {rating.rating}/5</p>
                    <p className="mb-0">{rating.comment}</p>
                  </div>
                  <small className="text-muted">
                    {new Date(rating.createdAt).toLocaleDateString()}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;