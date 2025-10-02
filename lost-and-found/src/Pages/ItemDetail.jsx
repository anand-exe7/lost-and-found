import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ImageCarousel from '../Components/Dashboard/ImageCarousel';
import { getComments, addComment, deleteComment, createClaim, getItemById } from '../api';
import './ItemDetail.css';

const ItemDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [item, setItem] = useState(location.state?.item || null);
  
  const [showFoundModal, setShowFoundModal] = useState(false);
  const [foundLocation, setFoundLocation] = useState('');
  const [foundMessage, setFoundMessage] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setCurrentUser(user);
    
    if (!item) {
      fetchItem();
    }
    
    fetchComments();

    // Listen for item updates
    const handleItemUpdate = () => {
      fetchItem();
    };
    window.addEventListener('itemUpdated', handleItemUpdate);
    return () => window.removeEventListener('itemUpdated', handleItemUpdate);
  }, [id]);

  const fetchItem = async () => {
    try {
      const data = await getItemById(id);
      setItem(data);
    } catch (err) {
      console.error('Error fetching item:', err);
    }
  };

  const fetchComments = async () => {
    try {
      const data = await getComments(id);
      setComments(data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleFoundSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!foundLocation.trim() || !foundMessage.trim()) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      await createClaim(item._id, foundLocation, foundMessage);
      setShowFoundModal(false);
      setFoundLocation('');
      setFoundMessage('');
      alert('Your claim has been submitted! The owner will be notified.');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to submit claim');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;

    try {
      await addComment(id, comment);
      setComment('');
      fetchComments();
    } catch (err) {
      console.error('Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      await deleteComment(commentId);
      fetchComments();
    } catch (err) {
      console.error('Failed to delete comment');
    }
  };

  const handleReply = async (parentCommentId, replyText) => {
    if (!replyText.trim()) return;

    try {
      await addComment(id, replyText, parentCommentId);
      fetchComments();
    } catch (err) {
      console.error('Failed to add reply');
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  if (!item) {
    return (
      <div className="item-detail-container">
        <div className="error-state">
          <h2>Item not found</h2>
          <button onClick={() => navigate('/dashboard')} className="back-btn">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const images = item.image ? [item.image] : ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600'];
  const isOwner = currentUser && item.createdBy === currentUser.id;
  const isResolved = item.type === 'found' && item.status === 'resolved';

  return (
    <div className="item-detail-container">
      {/* Header */}
      <div className="detail-header">
        <button onClick={() => navigate('/dashboard')} className="back-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2"/>
          </svg>
          Back to Dashboard
        </button>
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
                  <span className="urgent-badge pulsing">🔥 Urgent</span>
                )}
                {isResolved && (
                  <span className="resolved-badge">✅ Resolved</span>
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

            {/* Show found by info if resolved */}
            {isResolved && item.foundByName && (
              <>
                <div className="info-row">
                  <span className="info-label">✅ Found By:</span>
                  <span className="info-value">{item.foundByName}</span>
                </div>
                {item.foundLocation && (
                  <div className="info-row">
                    <span className="info-label">📍 Found At:</span>
                    <span className="info-value">{item.foundLocation}</span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Action Buttons - Only show for lost items and non-owners */}
          {!isOwner && item.type === 'lost' && !isResolved && (
            <div className="action-buttons">
              <button
                className="action-btn primary"
                onClick={() => setShowFoundModal(true)}
              >
                <span className="btn-icon">✅</span>
                I Found This
              </button>
            </div>
          )}

          {/* Owner message for resolved items */}
          {isResolved && isOwner && (
            <div className="owner-message">
              <p>🎉 Great news! This item has been found and marked as resolved.</p>
            </div>
          )}
        </div>
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        <h3 className="comments-title">Community Tips & Updates ({comments.length})</h3>
        
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
            <CommentItem
              key={comment._id}
              comment={comment}
              currentUser={currentUser}
              onDelete={handleDeleteComment}
              onReply={handleReply}
              getTimeAgo={getTimeAgo}
            />
          ))}
        </div>
      </div>

      {/* Found Modal */}
      {showFoundModal && (
        <div className="modal-overlay" onClick={() => setShowFoundModal(false)}>
          <div className="modal-content found-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowFoundModal(false)}>×</button>
            <h3>🎉 Great! You Found This Item</h3>
            <p>Please provide details so the owner can verify and collect their item.</p>
            
            {error && (
              <div className="error-box">{error}</div>
            )}

            <form onSubmit={handleFoundSubmit}>
              <div className="form-group">
                <label>Where did you find it?</label>
                <input
                  type="text"
                  value={foundLocation}
                  onChange={(e) => setFoundLocation(e.target.value)}
                  placeholder="e.g., Near the cafeteria entrance"
                  required
                />
              </div>

              <div className="form-group">
                <label>Additional details</label>
                <textarea
                  value={foundMessage}
                  onChange={(e) => setFoundMessage(e.target.value)}
                  placeholder="Describe any identifying features or how you found it..."
                  rows="4"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowFoundModal(false)} disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className="confirm-btn" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Claim'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Comment Component
const CommentItem = ({ comment, currentUser, onDelete, onReply, getTimeAgo }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleReplySubmit = () => {
    onReply(comment._id, replyText);
    setReplyText('');
    setShowReplyInput(false);
  };

  return (
    <div className="comment-item">
      <img 
        src={`https://ui-avatars.com/api/?name=${comment.user.name}&background=random`}
        alt={comment.user.name} 
        className="comment-avatar" 
      />
      <div className="comment-content">
        <div className="comment-header">
          <span className="comment-user">{comment.user.name}</span>
          <span className="comment-time">{getTimeAgo(comment.createdAt)}</span>
        </div>
        <p className="comment-text">{comment.text}</p>
        
        <div className="comment-actions">
          <button onClick={() => setShowReplyInput(!showReplyInput)}>Reply</button>
          {currentUser && comment.user._id === currentUser.id && (
            <button onClick={() => onDelete(comment._id)} className="delete-btn">Delete</button>
          )}
        </div>

        {showReplyInput && (
          <div className="reply-input">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              rows="2"
            />
            <div className="reply-actions">
              <button onClick={() => setShowReplyInput(false)}>Cancel</button>
              <button onClick={handleReplySubmit} className="submit-reply">Reply</button>
            </div>
          </div>
        )}
        
        {comment.replies && comment.replies.map(reply => (
          <div key={reply._id} className="reply-item">
            <img 
              src={`https://ui-avatars.com/api/?name=${reply.user.name}&background=random`}
              alt={reply.user.name} 
              className="reply-avatar" 
            />
            <div className="reply-content">
              <div className="reply-header">
                <span className="reply-user">{reply.user.name}</span>
                <span className="reply-time">{getTimeAgo(reply.createdAt)}</span>
              </div>
              <p className="reply-text">{reply.text}</p>
              {currentUser && reply.user._id === currentUser.id && (
                <button onClick={() => onDelete(reply._id)} className="delete-btn-small">Delete</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemDetail;