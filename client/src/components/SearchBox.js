import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBox = ({ filters, setFilters, type, onSearch }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-5">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name..."
                name="name"
                value={filters.name}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-5">
              <input
                type="text"
                className="form-control"
                placeholder="Search by address..."
                name="address"
                value={filters.address}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-primary w-100">
                <FaSearch className="me-2" />
                Search
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchBox;