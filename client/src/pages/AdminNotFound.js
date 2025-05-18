import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const AdminNotFound = () => {
  return (
    <div className="container">
      <div className="card border-0 shadow-sm my-4">
        <div className="card-body text-center p-5">
          <FaExclamationTriangle className="text-warning mb-4" style={{ fontSize: '5rem' }} />
          <h1 className="display-4 mb-3">404 - Page Not Found</h1>
          <p className="lead mb-4">The admin page you are looking for does not exist or has been moved.</p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/dashboard/admin/dashboard" className="btn btn-primary btn-lg">
              Go to Admin Dashboard
            </Link>
            <Link to="/dashboard" className="btn btn-outline-secondary btn-lg">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotFound; 