import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StoreDetails from './pages/StoreDetails';
import NotFound from './pages/NotFound';

// Protected Pages
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import StoreList from './pages/StoreList';
import AdminUsers from './pages/AdminUsers';
import AdminAddUser from './pages/AdminAddUser';
import AdminStores from './pages/AdminStores';
import AdminAddStore from './pages/AdminAddStore';
import AdminDashboard from './pages/AdminDashboard';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';
import AdminNotFound from './pages/AdminNotFound';
import ChangePassword from './pages/ChangePassword';
import CreateStore from './pages/CreateStore';

// Protected route wrapper
const ProtectedRoute = ({ element, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  
  // Show loading state if auth is still loading
  if (loading) {
    return <div className="container text-center mt-4">Loading...</div>;
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // If roles are specified, check if user has required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }
  
  return element;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="stores/:id" element={<StoreDetails />} />
        <Route path="/stores" element={<StoreList />} />
      </Route>
      
      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute
            element={<DashboardLayout />}
            allowedRoles={['admin', 'user', 'store_owner']}
          />
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="change-password" element={<ChangePassword />} />
        <Route path="stores" element={<StoreList />} />
        
        {/* Store Owner Routes */}
        <Route
          path="stores/create"
          element={
            <ProtectedRoute
              element={<CreateStore />}
              allowedRoles={['store_owner']}
            />
          }
        />
        
        {/* Admin Routes */}
        <Route path="admin">
          {/* Admin Dashboard */}
          <Route
            index
            element={
              <ProtectedRoute
                element={<AdminDashboard />}
                allowedRoles={['admin']}
              />
            }
          />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute
                element={<AdminDashboard />}
                allowedRoles={['admin']}
              />
            }
          />
          
          {/* User Management Routes */}
          <Route
            path="users"
            element={
              <ProtectedRoute
                element={<AdminUsers />}
                allowedRoles={['admin']}
              />
            }
          />
          <Route
            path="users/add"
            element={
              <ProtectedRoute
                element={<AdminAddUser />}
                allowedRoles={['admin']}
              />
            }
          />
          
          {/* Store Management Routes */}
          <Route
            path="stores"
            element={
              <ProtectedRoute
                element={<AdminStores />}
                allowedRoles={['admin']}
              />
            }
          />
          <Route
            path="stores/add"
            element={
              <ProtectedRoute
                element={<AdminAddStore />}
                allowedRoles={['admin']}
              />
            }
          />
          <Route
            path="stores/:id/edit"
            element={
              <ProtectedRoute
                element={<AdminAddStore />}
                allowedRoles={['admin']}
              />
            }
          />
          
          {/* Admin 404 Catch-all Route */}
          <Route
            path="*"
            element={
              <ProtectedRoute
                element={<AdminNotFound />}
                allowedRoles={['admin']}
              />
            }
          />
        </Route>
        
        {/* Store Owner Routes */}
        <Route
          path="store-owner"
          element={
            <ProtectedRoute
              element={<StoreOwnerDashboard />}
              allowedRoles={['store_owner']}
            />
          }
        />
      </Route>
      
      {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;