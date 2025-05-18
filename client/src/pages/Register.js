import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// Validation schema
const schema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required')
    .min(2, 'Username must be at least 2 characters')
    .max(50, 'Username must not exceed 50 characters'),
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must not exceed 16 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password must contain at least one special character'
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  role: yup.string()
});

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState('user');
  const [emailValid, setEmailValid] = useState(true);
  const [emailMessage, setEmailMessage] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      role: 'user'
    }
  });
  
  // Watch email and role to validate in real-time
  const watchEmail = watch('email');
  const watchRole = watch('role');
  
  // Validate email domain when email or role changes
  useEffect(() => {
    const validateEmail = async () => {
      // Only validate if both email and role are present
      if (!watchEmail || !watchRole || !watchEmail.includes('@')) {
        setEmailValid(true);
        setEmailMessage('');
        return;
      }
      
      try {
        const response = await axios.post('/api/auth/validate-email', {
          email: watchEmail,
          role: watchRole
        });
        
        setEmailValid(response.data.valid);
        setEmailMessage('');
      } catch (err) {
        setEmailValid(false);
        setEmailMessage(err.response?.data?.message || 'Invalid email for the selected role');
      }
    };
    
    // Add a debounce to avoid too many requests
    const timer = setTimeout(() => {
      validateEmail();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [watchEmail, watchRole]);
  
  const onSubmit = async (data) => {
    // Don't submit if email is invalid for the role
    if (!emailValid) {
      setError(emailMessage || 'Email is not valid for the selected role');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Remove confirmPassword as it's not needed for API call
      const { confirmPassword, ...userData } = data;
      
      const result = await registerUser(userData);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle role change to show domain requirements
  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  // Get email domain help text based on selected role
  const getEmailHelpText = () => {
    switch (selectedRole) {
      case 'admin':
        return 'Admin accounts must use @admin.ratemystore.com domain';
      case 'store_owner':
        return 'Store owner accounts must use @owner.ratemystore.com domain';
      default:
        return 'You can use any valid email address';
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create an Account</h2>
        <p className="auth-subtitle">Join our community and start rating stores!</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              className={`form-control ${errors.username ? 'is-invalid' : ''}`}
              {...register('username')}
              placeholder="Enter your username"
            />
            {errors.username && (
              <div className="form-error">{errors.username.message}</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="role" className="form-label">
              Account Type
            </label>
            <select
              id="role"
              className="form-control"
              {...register('role')}
              onChange={handleRoleChange}
            >
              <option value="user">Regular User</option>
              <option value="store_owner">Store Owner</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className={`form-control ${errors.email || !emailValid ? 'is-invalid' : ''}`}
              {...register('email')}
              placeholder="Enter your email"
            />
            <div className={`form-text ${!emailValid ? 'text-danger' : ''}`}>
              {!emailValid && emailMessage ? emailMessage : getEmailHelpText()}
            </div>
            {errors.email && (
              <div className="form-error">{errors.email.message}</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
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
          
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
              {...register('confirmPassword')}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <div className="form-error">{errors.confirmPassword.message}</div>
            )}
          </div>
          
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading || !emailValid}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
          
          <div className="auth-footer">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Login
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
        
        .form-text {
          font-size: 0.875rem;
          color: var(--light-text);
          margin-top: 0.25rem;
        }
        
        .text-danger {
          color: var(--error-color) !important;
        }
        
        .auth-form {
          margin-bottom: 1rem;
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

export default Register; 