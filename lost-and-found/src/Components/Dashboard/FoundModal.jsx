import React, { useState } from 'react';
import { submitClaim } from '../../api';
import './FoundModal.css';

const FoundModal = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    foundLocation: '',
    foundDate: '',
    foundTime: '',
    additionalDetails: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.foundLocation || !formData.foundDate || !formData.foundTime) {
      setError('Please fill out all required fields');
      setLoading(false);
      return;
    }

    try {
      await submitClaim({
        itemId: item._id,
        ...formData
      });
      
      setSuccess(true);
      
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 2000);
      
    } catch (err) {
      console.error('Failed to submit claim:', err);
      setError(
        err.response?.data?.msg || 
        'Failed to submit claim. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="found-modal-overlay" onClick={onClose}>
      <div className="found-modal" onClick={e => e.stopPropagation()}>
        {success ? (
          <div className="success-content">
            <div className="success-animation">
              <div className="checkmark-circle">
                <svg className="checkmark" viewBox="0 0 52 52">
                  <circle className="checkmark-circle-path" cx="26" cy="26" r="25" fill="none"/>
                  <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
              </div>
            </div>
            <h2>Claim Submitted!</h2>
            <p>The owner will be notified and will review your claim.</p>
          </div>
        ) : (
          <>
            <div className="found-modal-header">
              <div className="header-icon">🎉</div>
              <div>
                <h2>I Found This Item!</h2>
                <p>Help reunite "{item.name}" with its owner</p>
              </div>
              <button className="close-btn" onClick={onClose}>
                ✕
              </button>
            </div>

            <form className="found-modal-form" onSubmit={handleSubmit}>
              {error && (
                <div className="error-alert slide-down">
                  <span className="error-icon">⚠️</span>
                  {error}
                </div>
              )}

              <div className="item-preview">
                <img src={item.image} alt={item.name} />
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p>{item.category}</p>
                </div>
              </div>

              <div className="form-section">
                <h3>Where did you find it?</h3>
                <div className="form-group">
                  <label htmlFor="foundLocation">
                    <span className="label-icon">📍</span>
                    Location Found *
                  </label>
                  <input
                    type="text"
                    id="foundLocation"
                    name="foundLocation"
                    value={formData.foundLocation}
                    onChange={handleInputChange}
                    placeholder="e.g., Library 2nd Floor, near entrance"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>When did you find it?</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="foundDate">
                      <span className="label-icon">📅</span>
                      Date *
                    </label>
                    <input
                      type="date"
                      id="foundDate"
                      name="foundDate"
                      value={formData.foundDate}
                      onChange={handleInputChange}
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="foundTime">
                      <span className="label-icon">⏰</span>
                      Time *
                    </label>
                    <input
                      type="time"
                      id="foundTime"
                      name="foundTime"
                      value={formData.foundTime}
                      onChange={handleInputChange}
                      disabled={loading}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Additional Details</h3>
                <div className="form-group">
                  <label htmlFor="additionalDetails">
                    <span className="label-icon">📝</span>
                    Any other information (Optional)
                  </label>
                  <textarea
                    id="additionalDetails"
                    name="additionalDetails"
                    value={formData.additionalDetails}
                    onChange={handleInputChange}
                    placeholder="Add any relevant details that might help verify ownership..."
                    rows="4"
                    disabled={loading}
                  />
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
                >
                  {loading ? (
                    <>
                      <span className="spinner-small"></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <span>✓</span>
                      Submit Claim
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default FoundModal;