import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Components/Dashboard/Sidebar';
import ItemCard from '../Components/Dashboard/ItemCard';
import ReportModal from '../Components/Dashboard/ReportModal';
import './Dashboard.css';
import { getItems } from "../api";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('lost');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();

    const handleNewItem = () => fetchItems();
    window.addEventListener("itemAdded", handleNewItem);

    return () => window.removeEventListener("itemAdded", handleNewItem);
  }, [activeTab, searchQuery]);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getItems(activeTab);
      
      // Ensure data is an array
      const itemsArray = Array.isArray(data) ? data : [];
      
      // Filter items based on search query
      const filtered = itemsArray.filter(item => {
        if (!searchQuery) return true;
        
        const query = searchQuery.toLowerCase();
        return (
          item.name?.toLowerCase().includes(query) ||
          item.category?.toLowerCase().includes(query) ||
          item.location?.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query)
        );
      });
      
      setFilteredItems(filtered);
    } catch (err) {
      console.error('Error fetching items:', err);
      setError('Failed to load items. Please try again.');
      setFilteredItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (item) => {
    navigate(`/item/${item._id}`, { state: { item } });
  };

  const handleItemAdded = () => {
    fetchItems();
    setShowModal(false);
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <div className="main-content">
        {/* Navbar */}
        <div className="navbar">
          <div className="navbar-left">
            <h1 className="page-title">Dashboard</h1>
            
            {/* Animated Toggle */}
            <div className="toggle-container">
              <div className={`toggle-slider ${activeTab}`}></div>
              <button
                className={`toggle-btn ${activeTab === 'lost' ? 'active' : ''}`}
                onClick={() => setActiveTab('lost')}
              >
                Lost Items
              </button>
              <button
                className={`toggle-btn ${activeTab === 'found' ? 'active' : ''}`}
                onClick={() => setActiveTab('found')}
              >
                Found Items
              </button>
            </div>
          </div>

          <div className="navbar-right">
            {/* Search Bar */}
            <div className="search-container">
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button className="filter-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M3 4h18v2l-7 7v6l-4-2v-4l-7-7V4z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
            </div>

            {/* Action Button */}
            <button
              className="action-btn glow"
              onClick={() => setShowModal(true)}
            >
              <span className="btn-icon">+</span>
              Report {activeTab === 'lost' ? 'Lost' : 'Found'} Item
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#ef4444',
            padding: '1rem',
            borderRadius: '0.5rem',
            margin: '1rem 0',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            fontSize: '1.2rem',
            color: '#666'
          }}>
            Loading items...
          </div>
        )}

        {/* Cards Grid */}
        {!loading && (
          <div className="cards-section">
            <div className="cards-grid">
              {filteredItems.map(item => (
                <ItemCard
                  key={item._id}
                  item={item}
                  onClick={() => handleItemClick(item)}
                />
              ))}
            </div>

            {filteredItems.length === 0 && !loading && !error && (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3>No {activeTab} items found</h3>
                <p>
                  {searchQuery 
                    ? 'Try adjusting your search query'
                    : `Be the first to report a ${activeTab} item!`
                  }
                </p>
              </div>
            )}
          </div>
        )}

        {/* Bottom Report Button */}
        <div className="bottom-action">
          <button
            className="bottom-report-btn"
            onClick={() => setShowModal(true)}
          >
            <span className="btn-gradient">
              Report Another {activeTab === 'lost' ? 'Lost' : 'Found'} Item
            </span>
          </button>
        </div>
      </div>

      {/* Report Modal */}
      {showModal && (
        <ReportModal
          type={activeTab}
          onClose={() => setShowModal(false)}
          onItemAdded={handleItemAdded}
        />
      )}
    </div>
  );
};

export default Dashboard;