import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Set base URL - try all ports in sequence if needed
const API_PORTS = [5000, 5001, 5002, 5003, 5004, 5005];
let currentPortIndex = 0;

// Configure axios defaults
axios.defaults.baseURL = `http://localhost:${API_PORTS[currentPortIndex]}`;
axios.defaults.timeout = 5000; // Set timeout to 5 seconds

// Create axios interceptor to handle errors and retry with different ports
axios.interceptors.response.use(
  response => response,
  error => {
    // If connection error and we haven't tried all ports
    if ((error.code === 'ECONNREFUSED' || !error.response) && currentPortIndex < API_PORTS.length - 1) {
      // Try next port
      currentPortIndex++;
      const newBaseURL = `http://localhost:${API_PORTS[currentPortIndex]}`;
      console.log(`API connection failed, trying port ${API_PORTS[currentPortIndex]}`);
      axios.defaults.baseURL = newBaseURL;
      
      // Return the same request with new baseURL
      const config = error.config;
      config.baseURL = newBaseURL;
      return axios(config);
    }
    
    return Promise.reject(error);
  }
);

// Create the context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Set default axios headers for auth
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is authenticated
  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        console.log('Verifying user token...');
        const response = await axios.get('/api/auth/me');
        console.log('Auth verification response:', response.data);
        setUser(response.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth verification error:', error);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [token]);

  // Register user
  const register = async (userData) => {
    try {
      console.log('Registering user with data:', userData);
      const response = await axios.post('/api/auth/register', userData);
      console.log('Registration response:', response.data);
      
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      
      toast.success('Registration successful');
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      
      return { success: false, message };
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      console.log('Logging in with credentials:', credentials);
      const response = await axios.post('/api/auth/login', credentials);
      console.log('Login response:', response.data);
      
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      
      toast.success('Login successful');
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      
      return { success: false, message };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    
    toast.info('Logged out successfully');
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const response = await axios.put(`/api/users/${user.id}`, userData);
      setUser(response.data);
      toast.success('Profile updated successfully');
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      
      return { success: false, message };
    }
  };

  // Value object to be provided to consumers
  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    register,
    login,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}; 