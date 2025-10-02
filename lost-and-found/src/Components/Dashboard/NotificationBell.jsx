import React, { useState, useEffect } from 'react';
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead, approveClaim, rejectClaim } from '../../api';
import './NotificationBell.css';

const NotificationBell = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const data = await getUnreadCount();
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Failed to fetch unread count');
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
      );
      fetchUnreadCount();
    } catch (error) {
      console.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read');
    }
  };

  const handleApproveClaim = async (notificationId) => {
    try {
      await approveClaim(notificationId);
      fetchNotifications();
      fetchUnreadCount();
      window.dispatchEvent(new Event('itemUpdated'));
    } catch (error) {
      alert('Failed to approve claim');
    }
  };

  const handleRejectClaim = async (notificationId) => {
    try {
      await rejectClaim(notificationId);
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      alert('Failed to reject claim');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'found_claim': return '🔍';
      case 'claim_approved': return '✅';
      case 'claim_rejected': return '❌';
      case 'comment': return '💬';
      default: return '📢';
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="notification-bell-container">
      <button
        className="notification-bell-btn"
        onClick={() => {
          setShowDropdown(!showDropdown);
          if (!showDropdown) fetchNotifications();
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M18 8A6 6 0 1 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2"/>
        </svg>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllAsRead} className="mark-all-read">
                Mark all read
              </button>
            )}
          </div>

          <div className="notification-list">
            {loading ? (
              <div className="notification-loading">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="notification-empty">
                <span className="empty-icon">🔔</span>
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification._id}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => !notification.read && handleMarkAsRead(notification._id)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-text">
                      <strong>{notification.sender?.name}</strong>
                      <p>{notification.message}</p>
                      {notification.foundLocation && (
                        <p className="found-location">📍 Found at: {notification.foundLocation}</p>
                      )}
                    </div>
                    <span className="notification-time">{getTimeAgo(notification.createdAt)}</span>

                    {notification.type === 'found_claim' && notification.status === 'pending' && (
                      <div className="notification-actions">
                        <button
                          className="approve-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApproveClaim(notification._id);
                          }}
                        >
                          Approve
                        </button>
                        <button
                          className="reject-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRejectClaim(notification._id);
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {notification.status === 'approved' && (
                      <span className="status-badge approved">Approved</span>
                    )}
                    {notification.status === 'rejected' && (
                      <span className="status-badge rejected">Rejected</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;