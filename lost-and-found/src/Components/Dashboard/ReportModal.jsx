import React, { useState, useEffect } from 'react';
import { addItem } from '../../api'; // Import the addItem API function

const ReportModal = ({ type, onClose, onItemAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    location: '',
    date: '',
    time: '',
    image: null,
  });
  const [userEmail, setUserEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Get user email from localStorage (set during login)
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.email) {
      setUserEmail(user.email);
    }
  }, []);

  const categories = [
    'Electronics', 'Bags', 'Keys', 'Accessories', 'Clothing', 
    'Books', 'Personal Items', 'Sports Equipment', 'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!userEmail) {
        setError('Could not find user email. Please log in again.');
        return;
    }

    // Basic validation
    for (const key in formData) {
        if (!formData[key] && key !== 'image') { // Image can be optional
            setError(`Please fill out the ${key} field.`);
            return;
        }
    }

    // Backend expects 'name' as 'title', and contact email
    const itemData = {
      title: formData.name,
      description: formData.description,
      category: formData.category,
      location: formData.location,
      date: formData.date,
      time: formData.time,
      contactEmail: userEmail,
      type: type, // 'lost' or 'found'
    };
    
    // Note: For real image uploads, you'd typically use FormData
    // const data = new FormData();
    // Object.keys(itemData).forEach(key => data.append(key, itemData[key]));
    // if (formData.image) {
    //   data.append('image', formData.image);
    // }

    try {
      await addItem(itemData);
      onItemAdded(); // Callback to refresh the items list in the dashboard
    } catch (err) {
      console.error('Failed to add item:', err);
      setError('Failed to report item. Please try again.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="report-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            Report {type === 'lost' ? 'Lost' : 'Found'} Item
          </h2>
          <button className="close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          <div className="form-group">
            <label htmlFor="name">Item Name *</label>
            <input
              type="text" id="name" name="name"
              value={formData.name} onChange={handleInputChange}
              placeholder="e.g., iPhone 14 Pro" required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select id="category" name="category" value={formData.category} onChange={handleInputChange} required>
              <option value="">Select category</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description" name="description"
              value={formData.description} onChange={handleInputChange}
              placeholder="Provide detailed description..." rows="3" required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location {type === 'lost' ? 'Last Seen' : 'Found'} *</label>
            <input
              type="text" id="location" name="location"
              value={formData.location} onChange={handleInputChange}
              placeholder="e.g., Library 2nd Floor" required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date *</label>
              <input type="date" id="date" name="date" value={formData.date} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="time">Time *</label>
              <input type="time" id="time" name="time" value={formData.time} onChange={handleInputChange} required />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="image">Upload Image</label>
            <div className="image-upload">
              <input
                type="file" id="image" name="image"
                onChange={handleImageChange} accept="image/*" className="file-input"
              />
              <label htmlFor="image" className="file-label">
                <div className="upload-icon">📷</div>
                <span>Click to upload image</span>
                {formData.image && <span className="file-name">{formData.image.name}</span>}
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit">
              Report {type === 'lost' ? 'Lost' : 'Found'} Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;