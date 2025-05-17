import React from 'react';

const StoreSearch = ({ filters, setFilters }) => {
  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="row">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search stores by name"
              value={filters.name}
              onChange={(e) => setFilters({...filters, name: e.target.value})}
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search by address"
              value={filters.address}
              onChange={(e) => setFilters({...filters, address: e.target.value})}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreSearch;