import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ImageCarousel from '../Components/Dashboard/ImageCarousel';
import './ItemDetail.css';

const ItemDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { item } = location.state || {};
  
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showFoundModal, setShowFoundModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      user: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      text: 'I think I saw this near the parking garage yesterday!',
      time: '2 hours ago',
      replies: []
    },
    {
      id: 2,
      user: 'Maria Garcia',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      text: 'Have you checked with campus security?',
      time: '4 hours ago',
      replies: [
        {
          id: 3,
          user: 'John Doe',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
          text: 'Yes, I already filed a report with them.',
          time: '3 hours ago'
        }
      ]
    }
  ]);

  if (!item) {
    return (
      <div className="item-detail-container">
        <div className="error-state">
          <h2>Item not found</h2>
          <button onClick={() => navigate('/')} className="back-btn">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const images = [
    item.image,
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600'
  ];

  const handleAddComment = () => {
    if (comment.trim()) {
      const newComment = {
        id: comments.length + 1,
        user: 'Current User',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face',
        text: comment,
        time: 'Just now',
        replies: []
      };
      setComments([...comments, newComment]);
      setComment('');
    }
  };

  const activityTimeline = [
    { action: 'Item reported as lost', user: item.reporter, time: '3 days ago', icon: '📢' },
    { action: 'Marked as urgent', user: 'System', time: '2 days ago', icon: '🔥' },
    { action: 'Location updated', user: item.reporter, time: '1 day ago', icon: '📍' },
    { action: 'Boosted visibility', user: 'Community', time: '6 hours ago', icon: '⭐' }
  ];

  return (
    <div className="item-detail-container">
      {/* Header */}
      <div className="detail-header">
        <button onClick={() => navigate('/')} className="back-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2"/>
          </svg>
          Back to Dashboard
        </button>
        
        <div className="social-actions">
        </div>
      </div>

      {/* Main Content */}
      <div className="detail-content">
        {/* Left Section - Image Carousel */}
        <div className="image-section">
          <ImageCarousel images={images} />
        </div>

        {/* Right Section - Item Details */}
        <div className="details-section">
          <div className="item-header">
            <div className="item-title-section">
              <h1 className="item-title">{item.name}</h1>
              <div className="item-badges">
                <span className="category-badge">{item.category}</span>
                {item.urgent && (
                  <span className="urgent-badge pulsing">
                    🔥 Urgent
                  </span>
                )}
              </div>
            </div>
            
            <div className="reporter-info">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
                alt={item.reporter}
                className="reporter-avatar"
              />
              <div>
                <p className="reporter-name">{item.reporter}</p>
                <p className="report-time">{item.date} at {item.time}</p>
              </div>
            </div>
          </div>

          <div className="item-info">
            <div className="info-row">
              <span className="info-label">📍 Location:</span>
              <span className="info-value">{item.location}</span>
            </div>
            <div className="info-row">
              <span className="info-label">📅 Date:</span>
              <span className="info-value">{item.date} at {item.time}</span>
            </div>
            <div className="info-row description">
              <span className="info-label">📝 Description:</span>
              <p className="info-value">{item.description}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              className="action-btn primary"
              onClick={() => setShowFoundModal(true)}
            >
              <span className="btn-icon">✅</span>
              I Found This
            </button>
            <button
              className="action-btn secondary"
              onClick={() => setShowContactModal(true)}
            >
              <span className="btn-icon">💬</span>
              Contact Owner
            </button>
          
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        <h3 className="comments-title">Community Tips & Updates</h3>
        
        <div className="add-comment">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face"
            alt="Your avatar"
            className="comment-avatar"
          />
          <div className="comment-input-container">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share any tips or information..."
              className="comment-input"
            />
            <button onClick={handleAddComment} className="comment-submit">
              Post
            </button>
          </div>
        </div>

        <div className="comments-list">
          {comments.map(comment => (
            <div key={comment.id} className="comment-item">
              <img src={comment.avatar} alt={comment.user} className="comment-avatar" />
              <div className="comment-content">
                <div className="comment-header">
                  <span className="comment-user">{comment.user}</span>
                  <span className="comment-time">{comment.time}</span>
                </div>
                <p className="comment-text">{comment.text}</p>
                
                {comment.replies && comment.replies.map(reply => (
                  <div key={reply.id} className="reply-item">
                    <img src={reply.avatar} alt={reply.user} className="reply-avatar" />
                    <div className="reply-content">
                      <div className="reply-header">
                        <span className="reply-user">{reply.user}</span>
                        <span className="reply-time">{reply.time}</span>
                      </div>
                      <p className="reply-text">{reply.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    

      {/* Modals */}
      {showFoundModal && (
        <div className="modal-overlay" onClick={() => setShowFoundModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Confirm Item Found</h3>
            <p>Please provide details about where and when you found this item.</p>
            <textarea placeholder="Additional details..."></textarea>
            <div className="modal-actions">
              <button onClick={() => setShowFoundModal(false)}>Cancel</button>
              <button className="confirm-btn">Confirm Found</button>
            </div>
          </div>
        </div>
      )}

      {showContactModal && (
        <div className="modal-overlay" onClick={() => setShowContactModal(false)}>
          <div className="modal-content chat-modal" onClick={e => e.stopPropagation()}>
            <div className="chat-header">
              <h3>Contact {item.reporter}</h3>
              <button onClick={() => setShowContactModal(false)}>×</button>
            </div>
            <div className="chat-messages">
              <div className="chat-message received">
                <p>Hi! Thanks for reaching out about my lost item.</p>
              </div>
            </div>
            <div className="chat-input">
              <input type="text" placeholder="Type your message..." />
              <button>Send</button>
            </div>
          </div>
        </div>
      )}

      
    </div>
  );
};

export default ItemDetail;
