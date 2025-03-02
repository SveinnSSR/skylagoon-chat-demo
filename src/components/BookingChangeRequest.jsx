import React, { useState } from 'react';

const BookingChangeRequest = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    bookingRef: '',
    fullName: '',
    email: '',
    currentDate: '',
    requestedDate: '',
    additionalInfo: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.bookingRef.trim()) {
      newErrors.bookingRef = 'Booking reference is required';
    }
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.currentDate.trim()) {
      newErrors.currentDate = 'Current booking date is required';
    }
    
    if (!formData.requestedDate.trim()) {
      newErrors.requestedDate = 'Requested new date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      // Format the message for LiveChat
      const formattedMessage = `
BOOKING CHANGE REQUEST:
Reference: ${formData.bookingRef}
Name: ${formData.fullName}
Email: ${formData.email}
Current Date: ${formData.currentDate}
Requested Date: ${formData.requestedDate}
Additional Info: ${formData.additionalInfo || 'None provided'}
      `.trim();
      
      // Call the parent component's onSubmit function
      await onSubmit(formattedMessage);
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="booking-change-success">
        <div className="success-icon">✓</div>
        <h3>Change Request Submitted</h3>
        <p>
          Thank you for your booking change request. Our team will review it and
          respond to you via email within 24 hours.
        </p>
        <p>
          For urgent matters, please call us at +354 527 6800.
        </p>
      </div>
    );
  }

  return (
    <div className="booking-change-form">
      <h3>Booking Change Request</h3>
      <p className="form-intro">
        Please provide the following details to request a booking change:
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="bookingRef">Booking Reference *</label>
          <input
            type="text"
            id="bookingRef"
            name="bookingRef"
            value={formData.bookingRef}
            onChange={handleChange}
            placeholder="e.g., SKY12345"
            className={errors.bookingRef ? 'error' : ''}
          />
          {errors.bookingRef && <span className="error-message">{errors.bookingRef}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="fullName">Full Name *</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="e.g., John Smith"
            className={errors.fullName ? 'error' : ''}
          />
          {errors.fullName && <span className="error-message">{errors.fullName}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g., email@example.com"
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="currentDate">Current Booking Date/Time *</label>
          <input
            type="text"
            id="currentDate"
            name="currentDate"
            value={formData.currentDate}
            onChange={handleChange}
            placeholder="e.g., Dec 1, 2025 at 2:00 PM"
            className={errors.currentDate ? 'error' : ''}
          />
          {errors.currentDate && <span className="error-message">{errors.currentDate}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="requestedDate">Requested New Date/Time *</label>
          <input
            type="text"
            id="requestedDate"
            name="requestedDate"
            value={formData.requestedDate}
            onChange={handleChange}
            placeholder="e.g., Jan 19, 2025 at 3:00 PM"
            className={errors.requestedDate ? 'error' : ''}
          />
          {errors.requestedDate && <span className="error-message">{errors.requestedDate}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="additionalInfo">Additional Information</label>
          <textarea
            id="additionalInfo"
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
            placeholder="Any other details about your booking change request..."
            rows="3"
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-btn" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
        
        <p className="form-disclaimer">
          * Required fields. Please note that all booking changes are subject to availability.
          Our team will review your request and respond via email within 24 hours.
        </p>
      </form>
    </div>
  );
};

export default BookingChangeRequest;
