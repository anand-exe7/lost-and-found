import React, { useState } from 'react';

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('dashboard');
    const [user, setUser] = useState({ name: "Anand Sivaram" });

   const getInitials = (name) => {
    if (!name) return "";
    const parts = name.split(" ");
    let initials = parts[0].charAt(0).toUpperCase();
    if (parts.length > 1) {
      initials += parts[1].charAt(0).toUpperCase();
    }
    return initials;
  };

  // Simulated login function
  const handleLogin = () => {
    // After successful login, set the user's name dynamically
    const loggedInUser = {
      name: "Jane Doe"
    };
    setUser(loggedInUser);
  };

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
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="sidebar-bottom">
          <div className="user-profile">
            
            
            <div className="profile-info">
              <div className="avatar">{getInitials(user.name)}</div>

              <p className="profile-name">Anand Sivaram</p>
            </div>
            <p className="profile-role">Student</p>
          </div>            
            

          
          <div className="bottom-actions">
            
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