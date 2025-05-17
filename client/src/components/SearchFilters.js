import React from 'react';

const SearchFilters = ({ filters, setFilters }) => {
  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="row">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name"
              value={filters.name}
              onChange={(e) => setFilters({...filters, name: e.target.value})}
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by email"
              value={filters.email}
              onChange={(e) => setFilters({...filters, email: e.target.value})}
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by address"
              value={filters.address}
              onChange={(e) => setFilters({...filters, address: e.target.value})}
            />
          </div>
          <div className="col-md-3">
            <select 
              className="form-control"
              value={filters.role}
              onChange={(e) => setFilters({...filters, role: e.target.value})}
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="store_owner">Store Owner</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;