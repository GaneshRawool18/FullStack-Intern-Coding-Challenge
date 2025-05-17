import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaStore, FaSignOutAlt, FaTachometerAlt, FaUserCog, FaSearch, FaUsers, FaUserPlus, FaPlus } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // Check if the current path matches the given path
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          RateMyStore
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className={`nav-item ${isActive('/') ? 'active' : ''}`}>
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className={`nav-item ${isActive('/stores') ? 'active' : ''}`}>
              <Link className="nav-link" to="/stores">
                <FaStore className="me-1" /> Stores
              </Link>
            </li>
            
            {/* Role-based navigation items */}
            {user ? (
              <>
                {/* All authenticated users see this */}
                <li className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
                  <Link className="nav-link" to="/dashboard">
                    <FaTachometerAlt className="me-1" /> Dashboard
                  </Link>
                </li>
                
                {/* Admin links */}
                {user.role === 'admin' && (
                  <li className="nav-item dropdown">
                    <span
                      className={`nav-link dropdown-toggle ${isActive('/dashboard/admin') ? 'active' : ''}`}
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <FaUserCog className="me-1" /> Admin
                    </span>
                    <ul className="dropdown-menu" aria-labelledby="adminDropdown">
                      <li>
                        <Link className="dropdown-item" to="/dashboard/admin/dashboard">
                          <FaTachometerAlt className="me-2" /> Admin Dashboard
                        </Link>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <Link className="dropdown-item" to="/dashboard/admin/users">
                          <FaUsers className="me-2" /> Manage Users
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/dashboard/admin/users/add">
                          <FaUserPlus className="me-2" /> Add User
                        </Link>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <Link className="dropdown-item" to="/dashboard/admin/stores">
                          <FaStore className="me-2" /> Manage Stores
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/dashboard/admin/stores/add">
                          <FaPlus className="me-2" /> Add Store
                        </Link>
                      </li>
                    </ul>
                  </li>
                )}
                
                {/* Store Owner links */}
                {user.role === 'store_owner' && (
                  <li className={`nav-item ${isActive('/stores/create') ? 'active' : ''}`}>
                    <Link className="nav-link" to="/stores/create">
                      <FaStore className="me-1" /> Add Store
                    </Link>
                  </li>
                )}
              </>
            ) : (
              <li className={`nav-item ${isActive('/about') ? 'active' : ''}`}>
                <Link className="nav-link" to="/about">
                  About
                </Link>
              </li>
            )}
          </ul>
          
          {/* Search bar */}
          <div className="nav-search">
            {isSearchOpen ? (
              <div className="search-container">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search stores..."
                  onBlur={() => setIsSearchOpen(false)}
                  autoFocus
                />
              </div>
            ) : (
              <button 
                className="search-icon-btn"
                onClick={() => setIsSearchOpen(true)}
              >
                <FaSearch />
              </button>
            )}
          </div>
          
          {/* Right side navigation */}
          <ul className="navbar-nav">
            {user ? (
              <li className="nav-item dropdown">
                <span
                  className="nav-link dropdown-toggle user-dropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FaUser className="me-1" /> {user.username}
                </span>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li>
                    <Link className="dropdown-item" to="/dashboard/profile">
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/dashboard/change-password">
                      Change Password
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <FaSignOutAlt className="me-1" /> Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className={`nav-item ${isActive('/login') ? 'active' : ''}`}>
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className={`nav-item ${isActive('/register') ? 'active' : ''}`}>
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      
      <style jsx="true">{`
        .navbar {
          background: linear-gradient(to right, #4a90e2, #50c878);
          padding: 1rem 0;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .navbar-brand {
          font-weight: 700;
          font-size: 1.4rem;
          letter-spacing: 0.5px;
        }
        
        .nav-link {
          color: rgba(255, 255, 255, 0.9) !important;
          font-weight: 500;
          transition: all 0.3s ease;
          position: relative;
          padding: 0.5rem 1rem !important;
        }
        
        .nav-link:hover, .nav-item.active .nav-link {
          color: #fff !important;
        }
        
        .nav-item.active .nav-link:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 1rem;
          right: 1rem;
          height: 2px;
          background-color: #fff;
        }
        
        .dropdown-menu {
          border: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-radius: 4px;
          padding: 0.5rem 0;
        }
        
        .dropdown-item {
          padding: 0.6rem 1.5rem;
          transition: all 0.2s ease;
        }
        
        .dropdown-item:hover {
          background-color: rgba(74, 144, 226, 0.1);
          color: #4a90e2;
        }
        
        .nav-search {
          margin-right: 1.5rem;
        }
        
        .search-icon-btn {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.9);
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .search-icon-btn:hover {
          color: #fff;
          transform: scale(1.1);
        }
        
        .search-container {
          position: relative;
        }
        
        .search-input {
          background-color: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 50px;
          padding: 0.5rem 1rem;
          color: white;
          width: 200px;
          transition: all 0.3s ease;
        }
        
        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }
        
        .search-input:focus {
          outline: none;
          background-color: rgba(255, 255, 255, 0.3);
          width: 250px;
        }
        
        .user-dropdown {
          display: flex;
          align-items: center;
        }
        
        @media (max-width: 992px) {
          .nav-search {
            margin: 0.5rem 0;
          }
          
          .search-input {
            width: 100%;
          }
          
          .search-input:focus {
            width: 100%;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar; 