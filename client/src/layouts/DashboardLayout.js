import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-container">
        <Sidebar />
        <main className="dashboard-content">
          <div className="container">
            <h1 className="dashboard-welcome mb-4">
              Welcome, {user?.name || 'User'}
            </h1>
            <Outlet />
          </div>
        </main>
      </div>
      
      <style jsx="true">{`
        .dashboard-container {
          display: flex;
          min-height: calc(100vh - 60px);
        }
        
        .dashboard-content {
          flex: 1;
          padding: 2rem;
          background-color: var(--lightest-gray);
        }
        
        .dashboard-welcome {
          font-size: 1.8rem;
          color: var(--primary-color);
          border-bottom: 2px solid var(--light-gray);
          padding-bottom: 1rem;
        }
        
        @media (max-width: 768px) {
          .dashboard-container {
            flex-direction: column;
          }
          
          .dashboard-content {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout; 