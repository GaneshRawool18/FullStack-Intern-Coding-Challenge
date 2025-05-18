import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import StoreCard from '../components/StoreCard';
import { FaSearch, FaStar, FaStore, FaArrowRight } from 'react-icons/fa';

const Home = () => {
  const [topStores, setTopStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTopStores = async () => {
      try {
        const response = await axios.get('/api/stores', {
          params: {
            limit: 4,
            sort: 'averageRating',
            order: 'DESC'
          }
        });
        
        // Check if response.data.stores exists, otherwise use empty array or direct data
        if (response.data && Array.isArray(response.data.stores)) {
          setTopStores(response.data.stores);
        } else if (response.data && Array.isArray(response.data)) {
          // If data is returned directly as an array
          setTopStores(response.data);
        } else {
          // Fallback to empty array if no valid data
          console.warn('No valid stores data returned from API');
          setTopStores([]);
        }
      } catch (err) {
        console.error('Error fetching top stores:', err);
        setError('Failed to load top stores. Please try again later.');
        setTopStores([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchTopStores();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/stores?search=${encodeURIComponent(searchTerm)}`;
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Find and Rate the Best Stores</h1>
          <p className="hero-subtitle">
            Discover top-rated stores in your area and share your experiences
          </p>
          
          <div className="hero-search">
            <form onSubmit={handleSearch} className="search-box">
              <input
                type="text"
                placeholder="Search for stores..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="search-btn">
                <FaSearch />
              </button>
            </form>
            
            <div className="hero-buttons">
              <Link to="/stores" className="btn btn-primary">
                Browse Stores
              </Link>
              <Link to="/register" className="btn btn-outline">
                Join Our Community
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features section">
        <div className="container">
          <div className="section-heading">
            <h2 className="section-title">Why Choose Us</h2>
            <p className="section-subtitle">
              The best platform for store reviews and ratings
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaStore />
              </div>
              <h3 className="feature-title">Discover Stores</h3>
              <p className="feature-description">
                Find the best stores in your area with detailed information and reviews
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FaStar />
              </div>
              <h3 className="feature-title">Rate & Review</h3>
              <p className="feature-description">
                Share your experiences by rating and reviewing stores you've visited
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FaSearch />
              </div>
              <h3 className="feature-title">Easy Search</h3>
              <p className="feature-description">
                Quickly find stores by name, location, or category with our powerful search
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Stores Section */}
      <section className="top-stores section">
        <div className="container">
          <div className="section-heading">
            <h2 className="section-title">Top Rated Stores</h2>
            <p className="section-subtitle">Explore our highest-rated stores</p>
          </div>
          
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading top stores...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p className="error-message">{error}</p>
            </div>
          ) : (
            <>
              <div className="stores-grid">
                {Array.isArray(topStores) && topStores.length > 0 ? (
                  topStores.map((store) => (
                    <div className="store-grid-item" key={store.id}>
                      <StoreCard store={store} />
                    </div>
                  ))
                ) : (
                  <div className="no-stores">No stores found. Check back soon!</div>
                )}
              </div>
              
              <div className="view-all-container">
                <Link to="/stores" className="view-all-link">
                  View All Stores <FaArrowRight className="arrow-icon" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
      
      {/* Join Community Section */}
      <section className="join-section section">
        <div className="container">
          <div className="join-card">
            <div className="join-content">
              <h2 className="join-title">Ready to Start Rating?</h2>
              <p className="join-text">
                Join our community of store reviewers and start sharing your experiences today.
              </p>
              <div className="join-buttons">
                <Link to="/register" className="btn btn-primary">Create an Account</Link>
                <Link to="/login" className="btn btn-outline">Login</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <style jsx="true">{`
        .hero {
          background: linear-gradient(to right, #4a90e2, #50c878);
          color: white;
          padding: 6rem 0 4rem;
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .hero-content {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        
        .hero-title {
          font-size: 3rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }
        
        .hero-subtitle {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          opacity: 0.9;
        }
        
        .hero-search {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }
        
        .search-box {
          display: flex;
          width: 100%;
          max-width: 550px;
          background-color: white;
          border-radius: 50px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        
        .search-input {
          flex: 1;
          padding: 1rem 1.5rem;
          border: none;
          font-size: 1rem;
          min-width: 0;
        }
        
        .search-input:focus {
          outline: none;
        }
        
        .search-btn {
          background: linear-gradient(to right, #4a90e2, #50c878);
          color: white;
          padding: 1rem 1.5rem;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 50px;
          transition: all 0.3s ease;
        }
        
        .search-btn:hover {
          opacity: 0.9;
        }
        
        .hero-buttons {
          display: flex;
          gap: 1rem;
        }
        
        .features {
          background-color: white;
        }
        
        .section-subtitle {
          font-size: 1.1rem;
          color: var(--light-text);
          max-width: 600px;
          margin: 0 auto;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2.5rem;
          margin-top: 2rem;
        }
        
        .feature-card {
          text-align: center;
          padding: 2.5rem 1.5rem;
          border-radius: 8px;
          background-color: #fff;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }
        
        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .feature-icon {
          font-size: 2.5rem;
          color: var(--primary-color);
          margin-bottom: 1.5rem;
          height: 60px;
          width: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(to right, rgba(74, 144, 226, 0.1), rgba(80, 200, 120, 0.1));
          border-radius: 50%;
          margin: 0 auto 1.5rem;
        }
        
        .feature-title {
          font-size: 1.3rem;
          margin-bottom: 1rem;
          font-weight: 600;
        }
        
        .feature-description {
          color: var(--light-text);
          line-height: 1.6;
        }
        
        .top-stores {
          background-color: var(--lightest-gray);
        }
        
        .stores-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }
        
        .store-grid-item {
          height: 100%;
          min-height: 100%;
        }
        
        .loading-container, .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 0;
          text-align: center;
        }
        
        .loading-spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-left-color: var(--primary-color);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        .error-message {
          color: var(--error-color);
          font-weight: 500;
        }
        
        .no-stores {
          text-align: center;
          padding: 3rem 0;
          color: var(--light-text);
          font-size: 1.1rem;
          grid-column: 1 / -1;
        }
        
        .view-all-container {
          text-align: center;
          margin-top: 2.5rem;
        }
        
        .view-all-link {
          display: inline-flex;
          align-items: center;
          color: var(--primary-color);
          font-weight: 600;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          text-decoration: none;
        }
        
        .view-all-link:hover {
          color: var(--secondary-color);
          text-decoration: none;
        }
        
        .arrow-icon {
          margin-left: 8px;
          transition: transform 0.3s ease;
        }
        
        .view-all-link:hover .arrow-icon {
          transform: translateX(5px);
        }
        
        .join-section {
          padding-bottom: 6rem;
        }
        
        .join-card {
          background: linear-gradient(135deg, #4a90e2, #50c878);
          border-radius: 10px;
          padding: 3rem;
          color: white;
          text-align: center;
          box-shadow: 0 10px 30px rgba(74, 144, 226, 0.3);
        }
        
        .join-title {
          font-size: 2rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }
        
        .join-text {
          font-size: 1.1rem;
          margin-bottom: 2rem;
          opacity: 0.9;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .join-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }
        
        .join-buttons .btn-outline {
          border-color: white;
          color: white;
        }
        
        .join-buttons .btn-outline:hover {
          background-color: white;
          color: var(--primary-color);
        }
        
        /* Responsive styles */
        @media (max-width: 768px) {
          .hero {
            padding: 4rem 0 3rem;
          }
          
          .hero-title {
            font-size: 2.2rem;
          }
          
          .hero-buttons {
            flex-direction: column;
            width: 100%;
            max-width: 550px;
          }
          
          .hero-buttons .btn {
            width: 100%;
          }
          
          .features-grid {
            gap: 1.5rem;
          }
          
          .join-card {
            padding: 2rem 1.5rem;
          }
          
          .join-buttons {
            flex-direction: column;
            width: 100%;
            max-width: 300px;
            margin: 0 auto;
          }
        }
      `}</style>
    </div>
  );
};

export default Home; 