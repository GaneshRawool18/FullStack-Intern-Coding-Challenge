import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <Link to="/" className="footer-logo-link">
              RateMyStore
            </Link>
            <p className="footer-description">
              Find and rate the best stores in your area
            </p>
          </div>
          
          <div className="footer-links">
            <div className="footer-links-column">
              <h4 className="footer-links-title">Navigation</h4>
              <ul className="footer-links-list">
                <li>
                  <Link to="/" className="footer-link">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/stores" className="footer-link">
                    Stores
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="footer-link">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="footer-link">
                    Register
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h4 className="footer-links-title">Legal</h4>
              <ul className="footer-links-list">
                <li>
                  <Link to="#" className="footer-link">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="#" className="footer-link">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} RateMyStore. All rights reserved.
          </p>
        </div>
      </div>
      
      <style jsx="true">{`
        .footer {
          background-color: var(--text-color);
          color: var(--white);
          padding: 3rem 0 1rem;
        }
        
        .footer-content {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2rem;
        }
        
        .footer-logo {
          max-width: 300px;
        }
        
        .footer-logo-link {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--white);
          margin-bottom: 1rem;
          display: inline-block;
        }
        
        .footer-description {
          color: var(--medium-gray);
          font-size: 0.9rem;
        }
        
        .footer-links {
          display: flex;
          gap: 3rem;
        }
        
        .footer-links-title {
          color: var(--white);
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }
        
        .footer-links-list {
          list-style: none;
          padding: 0;
        }
        
        .footer-links-list li {
          margin-bottom: 0.5rem;
        }
        
        .footer-link {
          color: var(--medium-gray);
          transition: var(--transition);
          font-size: 0.9rem;
        }
        
        .footer-link:hover {
          color: var(--white);
          text-decoration: none;
        }
        
        .footer-bottom {
          border-top: 1px solid var(--dark-gray);
          padding-top: 1rem;
          text-align: center;
        }
        
        .footer-copyright {
          color: var(--dark-gray);
          font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
          .footer-content {
            flex-direction: column;
            gap: 2rem;
          }
          
          .footer-links {
            flex-direction: column;
            gap: 1.5rem;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer; 