import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../context/AuthContext';

// Validation schema
const schema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup.string().required('Password is required')
});

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Get the redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log('User is already authenticated, redirecting to:', from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });
  
  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    
    try {
      console.log('Submitting login form with data:', data);
      const result = await login(data);
      
      if (result.success) {
        console.log('Login successful, redirecting to:', from);
        navigate(from, { replace: true });
      } else {
        console.error('Login failed:', result.message);
        setError(result.message);
      }
    } catch (err) {
      console.error('Unexpected login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Login to Your Account</h2>
        <p className="auth-subtitle">Welcome back! Please enter your credentials.</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              {...register('email')}
              placeholder="Enter your email"
            />
            {errors.email && (
              <div className="form-error">{errors.email.message}</div>
            )}
          </div>
          
          <div className="form-group">
            <div className="form-label-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <Link to="#" className="form-link">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              id="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              {...register('password')}
              placeholder="Enter your password"
            />
            {errors.password && (
              <div className="form-error">{errors.password.message}</div>
            )}
          </div>
          
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          
          <div className="auth-footer">
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Register
            </Link>
          </div>
        </form>
      </div>
      
      <style jsx="true">{`
        .auth-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 200px);
          padding: 2rem 1rem;
        }
        
        .auth-card {
          background-color: white;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          padding: 2rem;
          width: 100%;
          max-width: 480px;
        }
        
        .auth-title {
          margin-bottom: 0.5rem;
          font-size: 1.8rem;
          color: var(--text-color);
        }
        
        .auth-subtitle {
          color: var(--light-text);
          margin-bottom: 2rem;
        }
        
        .auth-error {
          background-color: rgba(231, 76, 60, 0.1);
          color: var(--error-color);
          padding: 0.75rem;
          border-radius: var(--border-radius);
          margin-bottom: 1.5rem;
        }
        
        .auth-form {
          margin-bottom: 1rem;
        }
        
        .form-label-group {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        
        .form-link {
          font-size: 0.875rem;
        }
        
        .btn-block {
          width: 100%;
          margin: 1.5rem 0;
        }
        
        .auth-footer {
          text-align: center;
          margin-top: 1rem;
          color: var(--light-text);
        }
        
        .auth-link {
          color: var(--primary-color);
          font-weight: 500;
        }
        
        .is-invalid {
          border-color: var(--error-color);
        }
      `}</style>
    </div>
  );
};

export default Login; 