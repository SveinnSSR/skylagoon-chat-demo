import React from 'react';
import ReactDOM from 'react-dom';
import ChatWidget from './components/ChatWidget';
import './styles/globals.css';
import './styles/BookingChangeRequest.css';

// Export an initialization function
const init = (container, config = {}) => {
  // Ensure the container has our namespace class
  if (!container.classList.contains('sky-lagoon-chat-widget')) {
    container.classList.add('sky-lagoon-chat-widget');
  }
  
  // Get base URL for assets
  const baseUrl = config.baseUrl || '';
  console.log('Initializing widget with baseUrl:', baseUrl);
  
  // Inject CSS to fix image paths and counter style leakage
  const style = document.createElement('style');
  style.textContent = `
    .sky-lagoon-chat-widget img[src="/solrun.png"] {
      content: url("${baseUrl}/solrun.png") !important;
    }
    
    /* Reset styles for the widget container to prevent inheritance issues */
    .sky-lagoon-chat-widget {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    
    /* Fix for the Sun icon centering */
    img.content-icon.mb-3, 
    img[src*="icon-sun.svg"],
    .content-icon.mb-3,
    img[title*="Experience the Heart of Icelandic Tradition"] {
      display: block !important;
      margin-left: auto !important;
      margin-right: auto !important;
      text-align: center !important;
      float: none !important;
      position: relative !important;
      left: auto !important;
      right: auto !important;
    }
    
    /* Fix for parent container alignment */
    div:has(> img.content-icon.mb-3),
    div:has(> img[src*="icon-sun.svg"]) {
      text-align: center !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
    }
    
    /* NEW FIXES FOR JOHN'S ISSUES */
    
    /* Fix 1: Restore list bullets and numbers */
    :not(.sky-lagoon-chat-widget) ul {
      list-style-type: disc !important;
      margin-left: 1em !important;
      padding-left: 1em !important;
    }
    
    :not(.sky-lagoon-chat-widget) ol {
      list-style-type: decimal !important;
      margin-left: 1em !important;
      padding-left: 1em !important;
    }
    
    :not(.sky-lagoon-chat-widget) li {
      display: list-item !important;
    }
    
    :not(.sky-lagoon-chat-widget) li::before {
      display: none !important;
    }
    
    /* Fix 2: Restore paragraph and heading margins */
    :not(.sky-lagoon-chat-widget) p {
      margin-bottom: 1rem !important;
    }
    
    :not(.sky-lagoon-chat-widget) h1, 
    :not(.sky-lagoon-chat-widget) h2, 
    :not(.sky-lagoon-chat-widget) h3, 
    :not(.sky-lagoon-chat-widget) h4, 
    :not(.sky-lagoon-chat-widget) h5, 
    :not(.sky-lagoon-chat-widget) h6 {
      margin-bottom: 0.5rem !important;
    }
    
    /* Fix 3: Booking flow logo alignment */
    .checkout-header img, 
    .checkout-header .logo,
    img[alt*="Sky Lagoon"] {
      margin: 0 !important;
      display: inline-block !important;
      text-align: initial !important;
      float: none !important;
    }
    
    /* Fix loading graphic alignment */
    .checkout-content img,
    img[alt*="loading"] {
      display: inline-block !important;
      float: none !important;
      text-align: initial !important;
    }
    
    /* General fixes to prevent further alignment issues */
    body:not(.sky-lagoon-chat-widget) img {
      display: inline-block !important;
    }
    
    /* Restore center alignment for specific elements */
    .text-center img,
    .center img,
    .centered img,
    [class*="center"] img {
      display: block !important;
      margin-left: auto !important;
      margin-right: auto !important;
    }
  `;
  document.head.appendChild(style);
  
  ReactDOM.render(
    <ChatWidget 
      webhookUrl="https://sky-lagoon-chat-2024.vercel.app/chat"
      apiKey={config.apiKey || "sky-lagoon-secret-2024"}
      language={config.language || "en"}
      isEmbedded={true}
      baseUrl={baseUrl}
    />,
    container
  );
  
  // Return API for controlling the widget
  return {
    destroy: () => {
      ReactDOM.unmountComponentAtNode(container);
      // Also remove the style element we added
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    },
    // Add language change method
    setLanguage: (newLanguage) => {
      console.log('Setting widget language to:', newLanguage);
      // Create a custom event for language change
      const event = new CustomEvent('sky-lagoon-language-change', { 
        detail: { language: newLanguage } 
      });
      document.dispatchEvent(event);
    }
  };
};

// Auto-initialize if running standalone
if (typeof window !== 'undefined' && !window.SkyLagoonChat) {
  window.addEventListener('DOMContentLoaded', () => {
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.classList.add('sky-lagoon-chat-widget');
      init(rootElement);
    }
  });
}

// Export for use in embed.js
export default { init };