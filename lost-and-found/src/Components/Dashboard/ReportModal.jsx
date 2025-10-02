import React, { useState, useEffect } from 'react';
import { addItem } from '../../api';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const categories = [
    'Electronics', 'Bags', 'Keys', 'Accessories', 'Clothing', 
    'Books', 'Personal Items', 'Sports Equipment', 'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Clear error when user types
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      setFormData(prev => ({ ...prev, image: file }));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.name || !formData.category || !formData.description || 
        !formData.location || !formData.date || !formData.time) {
      setError('Please fill out all required fields');
      setLoading(false);
      return;
    }

    try {
      // Create FormData for file upload
      const data = new FormData();
      data.append('name', formData.name);
      data.append('category', formData.category);
      data.append('description', formData.description);
      data.append('location', formData.location);
      data.append('date', formData.date);
      data.append('time', formData.time);
      data.append('type', type); // 'lost' or 'found'
      
      if (formData.image) {
        data.append('image', formData.image);
      }

      await addItem(data);
      
      setSuccess(true);
      
      // Notify parent component to refresh items
      if (onItemAdded) {
        onItemAdded();
      }
      
      // Dispatch custom event for Dashboard to listen
      window.dispatchEvent(new Event('itemAdded'));
      
      // Close modal after short delay
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (err) {
      console.error('Failed to add item:', err);
      setError(
        err.response?.data?.msg || 
        err.response?.data?.errors?.[0]?.msg || 
        'Failed to report item. Please try again.'
      );
    } finally {
      setLoading(false);
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

        {success ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
            <h3>Item Reported Successfully!</h3>
            <p>Your {type} item has been added to the database.</p>
          </div>
        ) : (
          <form className="modal-form" onSubmit={handleSubmit}>
            {error && (
              <div style={{ 
                color: '#ef4444', 
                backgroundColor: '#fee2e2', 
                padding: '0.75rem', 
                borderRadius: '0.5rem', 
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">Item Name *</label>
              <input
                type="text" id="name" name="name"
                value={formData.name} onChange={handleInputChange}
                placeholder="e.g., iPhone 14 Pro" required
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select 
                id="category" name="category" 
                value={formData.category} 
                onChange={handleInputChange} 
                required
                disabled={loading}
              >
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
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location {type === 'lost' ? 'Last Seen' : 'Found'} *</label>
              <input
                type="text" id="location" name="location"
                value={formData.location} onChange={handleInputChange}
                placeholder="e.g., Library 2nd Floor" required
                disabled={loading}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Date *</label>
                <input 
                  type="date" id="date" name="date" 
                  value={formData.date} 
                  onChange={handleInputChange} 
                  required
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="time">Time *</label>
                <input 
                  type="time" id="time" name="time" 
                  value={formData.time} 
                  onChange={handleInputChange} 
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="image">Upload Image (Optional)</label>
              <div className="image-upload">
                <input
                  type="file" id="image" name="image"
                  onChange={handleImageChange} accept="image/*" 
                  className="file-input"
                  disabled={loading}
                />
                <label htmlFor="image" className="file-label">
                  <div className="upload-icon">📷</div>
                  <span>Click to upload image</span>
                  {formData.image && <span className="file-name">{formData.image.name}</span>}
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="btn-cancel" 
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-submit"
                disabled={loading}
                style={{ opacity: loading ? 0.6 : 1 }}
              >
                {loading ? 'Submitting...' : `Report ${type === 'lost' ? 'Lost' : 'Found'} Item`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReportModal;
