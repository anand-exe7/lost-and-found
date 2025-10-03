import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationPanel from './NotificationPanel';
import { getUnreadCount } from '../../api';

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchUnreadCount();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    
    // Listen for item added events to refresh notifications
    window.addEventListener('itemAdded', fetchUnreadCount);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('itemAdded', fetchUnreadCount);
    };
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    let initials = parts[0].charAt(0).toUpperCase();
    if (parts.length > 1) {
      initials += parts[1].charAt(0).toUpperCase();
    }
    return initials;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  };

  const handleNotificationClick = () => {
    setShowNotifications(true);
    fetchUnreadCount(); // Refresh count when opening
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'lost', label: 'Lost Items', icon: '🔍' },
    { id: 'found', label: 'Found Items', icon: '✅' },
  
  ];

  return (
    <>
      <div className="sidebar">
        <div className="sidebar-content">
          {/* Logo */}
          <div className="sidebar-logo">
            <div className="logo-icon"></div>
            <h2 className="logo-text">Lost & Found</h2>
          </div>

          {/* Navigation */}
          <nav className="sidebar-nav">
            <ul className="nav-list">
              {menuItems.map(item => (
                <li key={item.id} className="nav-item">
                  <button
                    className={`nav-link ${activeItem === item.id ? 'active' : ''}`}
                    onClick={() => setActiveItem(item.id)}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                    <div className="nav-indicator"></div>
                  </button>
                </li>
              ))}
              
              {/* Notifications Item */}
              <li className="nav-item">
                <button
                  className="nav-link notification-link"
                  onClick={handleNotificationClick}
                >
                  <span className="nav-icon notification-icon">
                    🔔
                    {unreadCount > 0 && (
                      <span className="notification-badge">{unreadCount}</span>
                    )}
                  </span>
                  <span className="nav-label">Notifications</span>
                  <div className="nav-indicator"></div>
                </button>
              </li>
            </ul>
          </nav>

          {/* Bottom Section */}
          <div className="sidebar-bottom">
            <div className="user-profile enhanced-profile">
              <div className="profile-info">
                <div className="avatar-bounce">
                  <div className="avatar">{getInitials(user.name)}</div>
              </div>
               <div className="profile-text">
                 <p className="profile-name">{user.name || 'User'}</p>
                 <p className="profile-role">Student</p>
               </div>
             </div>
            </div>


            <div className="bottom-actions">
              <button className="sidebar-btn logout-btn" onClick={handleLogout}>
                <span className="btn-icon">🚪</span>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={showNotifications} 
        onClose={() => {
          setShowNotifications(false);
          fetchUnreadCount(); // Refresh count when closing
        }} 
      />
    </>
  );
};

export default Sidebar;