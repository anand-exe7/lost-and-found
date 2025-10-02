import React, { useState, useEffect } from 'react';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, approveClaim, rejectClaim } from '../../api';
import './NotificationPanel.css';

const NotificationPanel = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      setNotifications(prev =>
        prev.filter(notif => notif._id !== notificationId)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleApproveClaim = async (claimId, notificationId) => {
    setProcessing(notificationId);
    try {
      await approveClaim(claimId);
      await handleDelete(notificationId);
      // Refresh items in dashboard
      window.dispatchEvent(new Event('itemAdded'));
    } catch (error) {
      console.error('Error approving claim:', error);
      alert('Failed to approve claim');
    } finally {
      setProcessing(null);
    }
  };

  const handleRejectClaim = async (claimId, notificationId) => {
    setProcessing(notificationId);
    try {
      await rejectClaim(claimId);
      await handleDelete(notificationId);
    } catch (error) {
      console.error('Error rejecting claim:', error);
      alert('Failed to reject claim');
    } finally {
      setProcessing(null);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'found_claim': return '🔍';
      case 'claim_approved': return '✅';
      case 'claim_rejected': return '❌';
      case 'comment': return '💬';
      case 'item_update': return '📢';
      default: return '🔔';
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={`notification-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
      <div className={`notification-panel ${isOpen ? 'open' : ''}`} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="notification-header">
          <div className="header-left">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount}</span>
            )}
          </div>
          <div className="header-actions">
            {unreadCount > 0 && (
              <button onClick={handleMarkAllAsRead} className="mark-all-btn">
                Mark all read
              </button>
            )}
            <button onClick={onClose} className="close-panel-btn">
              ✕
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="notifications-list">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="empty-notifications">
              <div className="empty-icon">🔔</div>
              <h4>No notifications yet</h4>
              <p>We'll notify you when something happens</p>
            </div>
          ) : (
            notifications.map((notification, index) => (
              <div
                key={notification._id}
                className={`notification-item ${!notification.read ? 'unread' : ''} slide-in`}
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => !notification.read && handleMarkAsRead(notification._id)}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="notification-content">
                  <div className="notification-header-row">
                    <p className="notification-message">{notification.message}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notification._id);
                      }}
                      className="delete-notification-btn"
                    >
                      🗑️
                    </button>
                  </div>
                  
                  {notification.additionalInfo && (
                    <p className="notification-details">{notification.additionalInfo}</p>
                  )}
                  
                  <div className="notification-footer">
                    <span className="notification-time">
                      {getTimeAgo(notification.createdAt)}
                    </span>
                    {notification.sender && (
                      <span className="notification-sender">
                        From: {notification.sender.name}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons for Claims */}
                  {notification.actionRequired && notification.claimId && (
                    <div className="notification-actions">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApproveClaim(notification.claimId, notification._id);
                        }}
                        className="approve-btn"
                        disabled={processing === notification._id}
                      >
                        {processing === notification._id ? 'Processing...' : '✓ Approve'}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRejectClaim(notification.claimId, notification._id);
                        }}
                        className="reject-btn"
                        disabled={processing === notification._id}
                      >
                        {processing === notification._id ? 'Processing...' : '✗ Decline'}
                      </button>
                    </div>
                  )}
                </div>
                
                {!notification.read && <div className="unread-indicator"></div>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;