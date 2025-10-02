import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ImageCarousel from '../Components/Dashboard/ImageCarousel';
import FoundModal from '../Components/Dashboard/FoundModal';
import { getComments, addComment, deleteComment } from '../api';
import './ItemDetail.css';

const ItemDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { item } = location.state || {};
  
  const [showFoundModal, setShowFoundModal] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [replyTo, setReplyTo] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (item) {
      fetchComments();
    }
  }, [item]);

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const data = await getComments(item._id);
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoadingComments(false);
    }
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

  const images = [item.image];

  const handleAddComment = async () => {
    if (comment.trim()) {
      setSubmittingComment(true);
      try {
        const response = await addComment({
          itemId: item._id,
          text: comment,
          parentCommentId: replyTo
        });
        
        // Add new comment to list
        if (replyTo) {
          // It's a reply - refresh to show properly
          await fetchComments();
        } else {
          // It's a top-level comment
          setComments([response.comment, ...comments]);
        }
        
        setComment('');
        setReplyTo(null);
      } catch (error) {
        console.error('Error adding comment:', error);
        alert('Failed to add comment');
      } finally {
        setSubmittingComment(false);
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteComment(commentId);
        await fetchComments();
      } catch (error) {
        console.error('Error deleting comment:', error);
        alert('Failed to delete comment');
      }
    }
  };

  const handleReply = (commentId, userName) => {
    setReplyTo(commentId);
    setComment(`@${userName} `);
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const isOwner = item.createdBy === currentUser.id || item.createdBy?._id === currentUser.id;
  const isFinder = item.foundBy?._id === currentUser.id || item.foundBy === currentUser.id;
  const isFoundItem = item.type === 'found';
  const canClaimItem = !isOwner && !isFoundItem && item.claimStatus !== 'pending';

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
                <span className={`status-badge ${item.type}`}>
                  {item.type === 'lost' ? '🔍 Lost' : '✅ Found'}
                </span>
                {item.urgent && (
                  <span className="urgent-badge pulsing">
                    🔥 Urgent
                  </span>
                )}
                {item.claimStatus === 'pending' && (
                  <span className="pending-badge">
                    ⏳ Claim Pending
                  </span>
                )}
              </div>
            </div>
            
            <div className="reporter-info">
              <div className="avatar-circle">
                {item.reporter?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div>
                <p className="reporter-label">
                  {isFoundItem ? 'Found by' : 'Reported by'}
                </p>
                <p className="reporter-name">{item.reporter || 'Anonymous'}</p>
                <p className="report-time">{item.date} at {item.time}</p>
              </div>
            </div>
          </div>

          <div className="item-info">
            <div className="info-row">
              <span className="info-label">📍 Location {isFoundItem ? 'Found' : 'Last Seen'}:</span>
              <span className="info-value">
                {isFoundItem && item.foundLocation ? item.foundLocation : item.location}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">📅 Date & Time:</span>
              <span className="info-value">
                {isFoundItem && item.foundDate ? 
                  `${item.foundDate} at ${item.foundTime}` : 
                  `${item.date} at ${item.time}`
                }
              </span>
            </div>
            <div className="info-row description">
              <span className="info-label">📝 Description:</span>
              <p className="info-value">{item.description}</p>
            </div>
          </div>

          {/* Action Buttons - Only show for lost items if user is not owner */}
          {!isFoundItem && canClaimItem && (
            <div className="action-buttons">
              <button
                className="action-btn primary"
                onClick={() => setShowFoundModal(true)}
              >
                <span className="btn-icon">✅</span>
                I Found This Item!
              </button>
            </div>
          )}

          {/* Show message if item is found */}
          {isFoundItem && (
            <div className="found-info-box">
              <div className="found-icon">🎉</div>
              <div>
                <h4>This item has been found!</h4>
                <p>Found by <strong>{item.reporter}</strong></p>
                {item.foundLocation && (
                  <p className="found-details">
                    Location: {item.foundLocation} | Date: {item.foundDate} at {item.foundTime}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Show pending claim message */}
          {item.claimStatus === 'pending' && isOwner && (
            <div className="pending-claim-box">
              <div className="pending-icon">⏳</div>
              <div>
                <h4>Pending Claim</h4>
                <p>Someone claims to have found your item. Check your notifications to approve or decline.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        <h3 className="comments-title">
          Community Tips & Updates ({comments.length})
        </h3>
        
        <div className="add-comment">
          <div className="avatar-circle small">
            {currentUser.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="comment-input-container">
            {replyTo && (
              <div className="reply-indicator">
                Replying to a comment
                <button onClick={() => { setReplyTo(null); setComment(''); }}>
                  ✕
                </button>
              </div>
            )}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share any tips or information..."
              className="comment-input"
              disabled={submittingComment}
            />
            <button 
              onClick={handleAddComment} 
              className="comment-submit"
              disabled={submittingComment || !comment.trim()}
            >
              {submittingComment ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>

        <div className="comments-list">
          {loadingComments ? (
            <div className="loading-comments">
              <div className="spinner"></div>
              <p>Loading comments...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="no-comments">
              <p>No comments yet. Be the first to share information!</p>
            </div>
          ) : (
            comments.map(commentItem => (
              <div key={commentItem._id} className="comment-item">
                <div className="avatar-circle small">
                  {commentItem.user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="comment-content">
                  <div className="comment-header">
                    <span className="comment-user">{commentItem.user?.name || 'Anonymous'}</span>
                    <span className="comment-time">{getTimeAgo(commentItem.createdAt)}</span>
                  </div>
                  <p className="comment-text">{commentItem.text}</p>
                  <div className="comment-actions-row">
                    <button 
                      className="reply-btn"
                      onClick={() => handleReply(commentItem._id, commentItem.user?.name)}
                    >
                      💬 Reply
                    </button>
                    {commentItem.user?._id === currentUser.id && (
                      <button 
                        className="delete-comment-btn"
                        onClick={() => handleDeleteComment(commentItem._id)}
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </div>
                  
                  {/* Replies */}
                  {commentItem.replies && commentItem.replies.length > 0 && (
                    <div className="replies-container">
                      {commentItem.replies.map(reply => (
                        <div key={reply._id} className="reply-item">
                          <div className="avatar-circle tiny">
                            {reply.user?.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="reply-content">
                            <div className="reply-header">
                              <span className="reply-user">{reply.user?.name || 'Anonymous'}</span>
                              <span className="reply-time">{getTimeAgo(reply.createdAt)}</span>
                            </div>
                            <p className="reply-text">{reply.text}</p>
                            {reply.user?._id === currentUser.id && (
                              <button 
                                className="delete-reply-btn"
                                onClick={() => handleDeleteComment(reply._id)}
                              >
                                🗑️
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Found Modal */}
      {showFoundModal && (
        <FoundModal
          item={item}
          onClose={() => setShowFoundModal(false)}
          onSuccess={() => {
            navigate('/dashboard');
          }}
        />
      )}
    </div>
  );
};

export default ItemDetail;