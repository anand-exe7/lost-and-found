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
    const navigate = useNavigate();

    // Mock data for demonstration
    const mockItems = {
      lost: [
        {
          id: 1,
          name: 'iPhone 14 Pro',
          category: 'Electronics',
          description: 'Black iPhone 14 Pro with cracked screen protector',
          location: 'Library 2nd Floor',
          date: '2024-01-15',
          time: '14:30',
          image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
          urgent: true,
          reporter: 'John Doe'
        },
        {
          id: 2,
          name: 'Blue Backpack',
          category: 'Bags',
          description: 'Navy blue Jansport backpack with laptop inside',
          location: 'Cafeteria',
          date: '2024-01-14',
          time: '12:15',
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
          urgent: false,
          reporter: 'Jane Smith'
        },
        {
          id: 3,
          name: 'Car Keys',
          category: 'Keys',
          description: 'Toyota car keys with blue keychain',
          location: 'Parking Lot B',
          date: '2024-01-13',
          time: '16:45',
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
          urgent: true,
          reporter: 'Mike Johnson'
        }
      ],
      found: [
        {
          id: 4,
          name: 'Wallet',
          category: 'Personal',
          description: 'Brown leather wallet with ID cards',
          location: 'Student Center',
          date: '2024-01-16',
          time: '10:20',
          image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400',
          urgent: false,
          reporter: 'Sarah Wilson'
        },
        {
          id: 5,
          name: 'Glasses',
          category: 'Accessories',
          description: 'Black-rimmed prescription glasses',
          location: 'Lecture Hall A',
          date: '2024-01-15',
          time: '09:30',
          image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400',
          urgent: false,
          reporter: 'David Brown'
        }
      ]
    };

 useEffect(() => {
  const fetchItems = async () => {
    const data = await getItems(activeTab);
    setFilteredItems(
      data.filter(
        item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.location?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  fetchItems();

  const handleNewItem = () => fetchItems();
  window.addEventListener("itemAdded", handleNewItem);

  return () => window.removeEventListener("itemAdded", handleNewItem);
}, [activeTab, searchQuery]);


    const handleItemClick = (item) => {
    navigate(`/item/${item._id}`, { state: { item } }); // use backend _id
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
                  
                    <path d="M3 4h18v2l-7 7v6l-4-2v-4l-7-7V4z" stroke="currentColor" strokeWidth="2"/>
                  
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

          {/* Cards Grid */}
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

            {filteredItems.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3>No {activeTab} items found</h3>
                <p>Be the first to report a {activeTab} item!</p>
              </div>
            )}
          </div>

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
          />
        )}
      </div>
    );
  };

  export default Dashboard;