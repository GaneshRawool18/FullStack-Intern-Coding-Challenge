import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaRegStar, FaStarHalfAlt, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';

const StoreCard = ({ store }) => {
  // Generate stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="rating-star filled" />);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="rating-star filled" />);
    }
    
    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="rating-star" />);
    }
    
    return stars;
  };

  // Default image for stores without images
  const storeImage = store.imageUrl || 'https://via.placeholder.com/600x400?text=Store+Image';
  
  return (
    <div className="store-card">
      <div className="store-card-image">
        <img src={storeImage} alt={store.name} />
        <div className="rating-badge">
          <span>{store.averageRating?.toFixed(1) || "N/A"}</span>
        </div>
      </div>
      
      <div className="store-card-body">
        <h3 className="store-name">
          <Link to={`/stores/${store.id}`}>{store.name}</Link>
        </h3>
        
        <div className="store-address">
          <FaMapMarkerAlt className="address-icon" />
          <span>{store.address}</span>
        </div>
        
        <div className="store-rating">
          <div className="stars">{renderStars(store.averageRating || 0)}</div>
          <span className="total-ratings">({store.totalRatings || 0} ratings)</span>
        </div>
        
        {store.category && (
          <div className="store-category">
            <span className="category-tag">{store.category}</span>
          </div>
        )}
        
        {store.userRating !== null && store.userRating !== undefined && (
          <div className="user-rating">
            <span className="user-rating-label">Your rating:</span>
            <div className="stars">{renderStars(store.userRating)}</div>
            <span className="rating-value">{store.userRating.toFixed(1)}</span>
          </div>
        )}
      </div>
      
      <div className="store-card-footer">
        <Link to={`/stores/${store.id}`} className="view-details-btn">
          View Details <FaArrowRight className="arrow-icon" />
        </Link>
      </div>
      
      <style jsx="true">{`
        .store-card {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
        }
        
        .store-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }
        
        .store-card-image {
          position: relative;
          height: 180px;
          overflow: hidden;
        }
        
        .store-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .store-card:hover .store-card-image img {
          transform: scale(1.05);
        }
        
        .rating-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: linear-gradient(135deg, #4a90e2, #50c878);
          color: white;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        
        .store-card-body {
          padding: 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .store-name {
          font-size: 1.3rem;
          margin: 0;
          line-height: 1.3;
        }
        
        .store-name a {
          color: var(--text-color);
          text-decoration: none;
          transition: var(--transition);
        }
        
        .store-name a:hover {
          color: var(--primary-color);
        }
        
        .store-address {
          display: flex;
          align-items: center;
          color: var(--light-text);
          font-size: 0.9rem;
        }
        
        .address-icon {
          color: var(--accent-color);
          margin-right: 0.5rem;
          flex-shrink: 0;
        }
        
        .store-rating {
          display: flex;
          align-items: center;
        }
        
        .stars {
          display: flex;
          margin-right: 0.5rem;
        }
        
        .rating-star {
          color: var(--medium-gray);
          margin-right: 2px;
        }
        
        .rating-star.filled {
          color: var(--accent-color);
        }
        
        .total-ratings {
          font-size: 0.85rem;
          color: var(--light-text);
        }
        
        .store-category {
          margin-top: 0.5rem;
        }
        
        .category-tag {
          display: inline-block;
          background-color: rgba(74, 144, 226, 0.1);
          color: var(--primary-color);
          padding: 0.25rem 0.75rem;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        
        .user-rating {
          display: flex;
          align-items: center;
          background-color: var(--lightest-gray);
          padding: 0.5rem 0.75rem;
          border-radius: var(--border-radius);
          margin-top: 0.5rem;
        }
        
        .user-rating-label {
          margin-right: 0.5rem;
          font-size: 0.85rem;
          font-weight: 500;
        }
        
        .store-card-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid var(--light-gray);
        }
        
        .view-details-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary-color);
          font-weight: 600;
          transition: all 0.3s ease;
          text-decoration: none;
        }
        
        .view-details-btn:hover {
          color: var(--secondary-color);
          text-decoration: none;
        }
        
        .arrow-icon {
          margin-left: 5px;
          transition: transform 0.3s ease;
        }
        
        .view-details-btn:hover .arrow-icon {
          transform: translateX(3px);
        }
        
        @media (max-width: 768px) {
          .store-card-image {
            height: 150px;
          }
        }
      `}</style>
    </div>
  );
};

export default StoreCard; 