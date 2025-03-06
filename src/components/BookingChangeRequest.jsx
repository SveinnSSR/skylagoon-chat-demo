import React, { useState } from 'react';

const BookingChangeRequest = ({ onSubmit, onCancel, language = 'en' }) => {
  const isIcelandic = language === 'is';
  
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

  // Translations
  const translations = {
    title: isIcelandic ? 'Beiðni um breytingu á bókun' : 'Booking Change Request',
    intro: isIcelandic 
      ? 'Vinsamlegast fylltu út eftirfarandi upplýsingar til að óska eftir breytingu á bókun:' 
      : 'Please provide the following details to request a booking change:',
    bookingRef: isIcelandic ? 'Bókunarnúmer *' : 'Booking Reference *',
    bookingRefPlaceholder: isIcelandic ? 't.d., 7730900' : 'e.g., 7730900',
    bookingRefError: isIcelandic ? 'Bókunarnúmer er nauðsynlegt' : 'Booking reference is required',
    fullName: isIcelandic ? 'Fullt nafn *' : 'Full Name *',
    fullNamePlaceholder: isIcelandic ? 't.d., Jón Jónsson' : 'e.g., John Smith',
    fullNameError: isIcelandic ? 'Fullt nafn er nauðsynlegt' : 'Full name is required',
    email: isIcelandic ? 'Netfang *' : 'Email Address *',
    emailPlaceholder: isIcelandic ? 't.d., netfang@dæmi.is' : 'e.g., email@example.com',
    emailError: isIcelandic ? 'Netfang er nauðsynlegt' : 'Email is required',
    emailInvalidError: isIcelandic ? 'Netfang er ógilt' : 'Email is invalid',
    currentDate: isIcelandic ? 'Núverandi bókunardagur/tími *' : 'Current Booking Date/Time *',
    currentDatePlaceholder: isIcelandic ? 't.d., 1. des, 2025 kl. 14:00' : 'e.g., Dec 1, 2025 at 2:00 PM',
    currentDateError: isIcelandic ? 'Núverandi bókunardagur er nauðsynlegur' : 'Current booking date is required',
    requestedDate: isIcelandic ? 'Óskað eftir nýjum degi/tíma *' : 'Requested New Date/Time *',
    requestedDatePlaceholder: isIcelandic ? 't.d., 19. jan, 2025 kl. 15:00' : 'e.g., Jan 19, 2025 at 3:00 PM',
    requestedDateError: isIcelandic ? 'Nýr bókunardagur er nauðsynlegur' : 'Requested new date is required',
    additionalInfo: isIcelandic ? 'Viðbótarupplýsingar' : 'Additional Information',
    additionalInfoPlaceholder: isIcelandic 
      ? 'Aðrar upplýsingar um beiðni þína um breytingu á bókun...' 
      : 'Any other details about your booking change request...',
    cancelButton: isIcelandic ? 'Hætta við' : 'Cancel',
    submitButton: isIcelandic ? 'Senda beiðni' : 'Submit Request',
    submittingButton: isIcelandic ? 'Sendir...' : 'Submitting...',
    requiredFields: isIcelandic ? '* Nauðsynlegir reitir' : '* Required fields',
    disclaimer: isIcelandic 
      ? 'Vinsamlegast athugið að allar breytingar á bókun eru háðar framboði. Teymi okkar mun fara yfir beiðni þína og svara í gegnum tölvupóst innan 24 klukkustunda.' 
      : 'Please note that all booking changes are subject to availability. Our team will review your request and respond via email within 24 hours.',
    successTitle: isIcelandic ? 'Beiðni um breytingu send' : 'Change Request Submitted',
    successMessage: isIcelandic 
      ? 'Takk fyrir beiðnina um breytingu á bókun. Teymi okkar mun fara yfir hana og svara þér í gegnum tölvupóst innan 24 klukkustunda.' 
      : 'Thank you for your booking change request. Our team will review it and respond to you via email within 24 hours.',
    urgentMessage: isIcelandic 
      ? 'Fyrir áríðandi mál, vinsamlegast hringdu í +354 527 6800.' 
      : 'For urgent matters, please call us at +354 527 6800.'
  };

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
      newErrors.bookingRef = translations.bookingRefError;
    }
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = translations.fullNameError;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = translations.emailError;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = translations.emailInvalidError;
    }
    
    if (!formData.currentDate.trim()) {
      newErrors.currentDate = translations.currentDateError;
    }
    
    if (!formData.requestedDate.trim()) {
      newErrors.requestedDate = translations.requestedDateError;
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
Additional Info: ${(formData.additionalInfo || 'None provided').replace(/\n/g, ' ')}
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
        <h3>{translations.successTitle}</h3>
        <p>
          {translations.successMessage}
        </p>
        <p>
          {translations.urgentMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="booking-change-form">
      <h3>{translations.title}</h3>
      <p className="form-intro">
        {translations.intro}
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="bookingRef">{translations.bookingRef}</label>
          <input
            type="text"
            id="bookingRef"
            name="bookingRef"
            value={formData.bookingRef}
            onChange={handleChange}
            placeholder={translations.bookingRefPlaceholder}
            className={errors.bookingRef ? 'error' : ''}
          />
          {errors.bookingRef && <span className="error-message">{errors.bookingRef}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="fullName">{translations.fullName}</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder={translations.fullNamePlaceholder}
            className={errors.fullName ? 'error' : ''}
          />
          {errors.fullName && <span className="error-message">{errors.fullName}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">{translations.email}</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={translations.emailPlaceholder}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="currentDate">{translations.currentDate}</label>
          <input
            type="text"
            id="currentDate"
            name="currentDate"
            value={formData.currentDate}
            onChange={handleChange}
            placeholder={translations.currentDatePlaceholder}
            className={errors.currentDate ? 'error' : ''}
          />
          {errors.currentDate && <span className="error-message">{errors.currentDate}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="requestedDate">{translations.requestedDate}</label>
          <input
            type="text"
            id="requestedDate"
            name="requestedDate"
            value={formData.requestedDate}
            onChange={handleChange}
            placeholder={translations.requestedDatePlaceholder}
            className={errors.requestedDate ? 'error' : ''}
          />
          {errors.requestedDate && <span className="error-message">{errors.requestedDate}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="additionalInfo">{translations.additionalInfo}</label>
          <textarea
            id="additionalInfo"
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
            placeholder={translations.additionalInfoPlaceholder}
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
            {translations.cancelButton}
          </button>
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={isSubmitting}
          >
            {isSubmitting ? translations.submittingButton : translations.submitButton}
          </button>
        </div>
        
        <p className="form-disclaimer">
          {translations.requiredFields}. {translations.disclaimer}
        </p>
      </form>
    </div>
  );
};

export default BookingChangeRequest;
