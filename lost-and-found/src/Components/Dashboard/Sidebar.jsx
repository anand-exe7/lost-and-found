import React, { useState } from 'react';

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'lost', label: 'Lost Items', icon: '🔍' },
    { id: 'found', label: 'Found Items', icon: '✅' },
    { id: 'reports', label: 'My Reports', icon: '📋' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">🔍</div>
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
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="sidebar-bottom">
          <div className="user-profile">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face"
              alt="Profile"
              className="profile-avatar"
            />
            <div className="profile-info">
              <p className="profile-name">John Doe</p>
              <p className="profile-role">Student</p>
            </div>
          </div>
          
          <div className="bottom-actions">
            <button className="sidebar-btn profile-btn">
              <span className="btn-icon">👤</span>
              Profile
            </button>
            <button className="sidebar-btn logout-btn">
              <span className="btn-icon">🚪</span>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;