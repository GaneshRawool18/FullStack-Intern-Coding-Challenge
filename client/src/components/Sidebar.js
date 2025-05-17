import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaHome,
  FaUser,
  FaStore,
  FaUsers,
  FaChartBar,
  FaTable,
  FaBars,
  FaTachometerAlt,
  FaUserPlus,
  FaPlus
} from 'react-icons/fa';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === path ? 'active' : '';
    }
    return location.pathname.startsWith(path) ? 'active' : '';
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        <FaBars />
      </div>
      
      <ul className="sidebar-menu">
        <li className={`sidebar-item ${isActive('/dashboard')}`}>
          <Link to="/dashboard" className="sidebar-link">
            <FaHome className="sidebar-icon" />
            <span className="sidebar-text">Dashboard</span>
          </Link>
        </li>
        
        <li className={`sidebar-item ${isActive('/dashboard/profile')}`}>
          <Link to="/dashboard/profile" className="sidebar-link">
            <FaUser className="sidebar-icon" />
            <span className="sidebar-text">Profile</span>
          </Link>
        </li>
        
        <li className={`sidebar-item ${isActive('/dashboard/stores')}`}>
          <Link to="/dashboard/stores" className="sidebar-link">
            <FaStore className="sidebar-icon" />
            <span className="sidebar-text">Stores</span>
          </Link>
        </li>
        
        {user?.role === 'admin' && (
          <>
            <li className="sidebar-separator">
              <span className="sidebar-text">Admin</span>
            </li>
            
            <li className={`sidebar-item ${isActive('/dashboard/admin/dashboard')}`}>
              <Link to="/dashboard/admin/dashboard" className="sidebar-link">
                <FaTachometerAlt className="sidebar-icon" />
                <span className="sidebar-text">Admin Dashboard</span>
              </Link>
            </li>
            
            <li className={`sidebar-item ${isActive('/dashboard/admin/users')}`}>
              <Link to="/dashboard/admin/users" className="sidebar-link">
                <FaUsers className="sidebar-icon" />
                <span className="sidebar-text">Manage Users</span>
              </Link>
            </li>
            
            <li className={`sidebar-item ${isActive('/dashboard/admin/users/add')}`}>
              <Link to="/dashboard/admin/users/add" className="sidebar-link">
                <FaUserPlus className="sidebar-icon" />
                <span className="sidebar-text">Add User</span>
              </Link>
            </li>
            
            <li className={`sidebar-item ${isActive('/dashboard/admin/stores')}`}>
              <Link to="/dashboard/admin/stores" className="sidebar-link">
                <FaTable className="sidebar-icon" />
                <span className="sidebar-text">Manage Stores</span>
              </Link>
            </li>
            
            <li className={`sidebar-item ${isActive('/dashboard/admin/stores/add')}`}>
              <Link to="/dashboard/admin/stores/add" className="sidebar-link">
                <FaPlus className="sidebar-icon" />
                <span className="sidebar-text">Add Store</span>
              </Link>
            </li>
          </>
        )}
        
        {user?.role === 'store_owner' && (
          <>
            <li className="sidebar-separator">
              <span className="sidebar-text">Store Owner</span>
            </li>
            
            <li className={`sidebar-item ${isActive('/dashboard/store-owner')}`}>
              <Link to="/dashboard/store-owner" className="sidebar-link">
                <FaChartBar className="sidebar-icon" />
                <span className="sidebar-text">My Store</span>
              </Link>
            </li>
          </>
        )}
      </ul>
      
      <style jsx="true">{`
        .sidebar {
          background-color: var(--white);
          width: 250px;
          box-shadow: var(--shadow);
          transition: var(--transition);
          overflow-y: auto;
          z-index: 90;
        }
        
        .sidebar.collapsed {
          width: 70px;
        }
        
        .sidebar-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          font-size: 1.2rem;
          cursor: pointer;
          color: var(--text-color);
          border-bottom: 1px solid var(--light-gray);
        }
        
        .sidebar-menu {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .sidebar-item {
          margin: 0.5rem 0;
        }
        
        .sidebar-item.active .sidebar-link {
          background-color: var(--light-gray);
          color: var(--primary-color);
          border-left: 3px solid var(--primary-color);
        }
        
        .sidebar-link {
          display: flex;
          align-items: center;
          padding: 0.8rem 1.5rem;
          color: var(--text-color);
          text-decoration: none;
          transition: var(--transition);
          border-left: 3px solid transparent;
        }
        
        .sidebar-link:hover {
          background-color: var(--light-gray);
          color: var(--primary-color);
          text-decoration: none;
        }
        
        .sidebar-icon {
          margin-right: 0.75rem;
          font-size: 1.1rem;
          min-width: 1.1rem;
        }
        
        .sidebar-text {
          white-space: nowrap;
        }
        
        .sidebar.collapsed .sidebar-text {
          display: none;
        }
        
        .sidebar-separator {
          margin: 1.5rem 0 0.5rem;
          padding: 0 1.5rem;
          color: var(--dark-gray);
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .sidebar.collapsed .sidebar-separator {
          text-align: center;
          padding: 0;
        }
        
        .sidebar.collapsed .sidebar-separator .sidebar-text {
          display: none;
        }
        
        @media (max-width: 768px) {
          .sidebar {
            width: 100%;
            position: relative;
          }
          
          .sidebar.collapsed {
            width: 100%;
          }
          
          .sidebar.collapsed .sidebar-text {
            display: block;
          }
          
          .sidebar-menu {
            display: ${collapsed ? 'none' : 'block'};
          }
        }
      `}</style>
    </div>
  );
};

export default Sidebar; 