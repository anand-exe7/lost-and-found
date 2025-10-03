import React from 'react';

const ItemCard = ({ item, onClick }) => {
  return (
    <div className="item-card" onClick={onClick}>
      <div className="card-image-container">
        <img src={item.image} alt={item.name} className="card-image" />
        <div className="card-overlay">
          <button className="quick-action">View Details</button>
        </div>
        {item.urgent && (
          <div className="urgent-badge-card pulsing">
            🔥 Urgent
          </div>
        )}
      </div>
      
      <div className="card-content">
        <div className="card-header">
          <h3 className="card-title">{item.name}</h3>
          <span className="card-category">{item.category}</span>
        </div>
        
        <p className="card-description">{item.description}</p>
        
        <div className="card-meta">
          <div className="meta-item">
            <span className="meta-icon">📍</span>
            <span className="meta-text">{item.location}</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">📅</span>
            <span className="meta-text">{item.date}</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">⏰</span>
            <span className="meta-text">{item.time}</span>
          </div>
        </div>
        
        <div className="card-footer">
          <div className="reporter-info">
          
            <span className="reporter-name">by {item.reporter}</span>
          </div>
          
          <div className="card-actions">
            <button className="card-action-btn">
              💬
            </button>
           
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;