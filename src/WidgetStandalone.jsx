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
  
  // Function to apply fixes to the website
  const applyWebsiteFixes = () => {
    // Create or update the fix stylesheet
    let fixStylesheet = document.getElementById('sky-lagoon-fix-styles');
    if (!fixStylesheet) {
      fixStylesheet = document.createElement('style');
      fixStylesheet.id = 'sky-lagoon-fix-styles';
      document.body.appendChild(fixStylesheet);
    }
    
    fixStylesheet.textContent = `
      /* Fix for list bullets and numbers */
      body ul:not(.sky-lagoon-chat-widget ul) {
        list-style-type: disc !important;
        padding-left: 40px !important;
        margin-left: 0 !important;
      }
      
      body ol:not(.sky-lagoon-chat-widget ol) {
        list-style-type: decimal !important;
        padding-left: 40px !important;
        margin-left: 0 !important;
      }
      
      body ul:not(.sky-lagoon-chat-widget ul) li,
      body ol:not(.sky-lagoon-chat-widget ol) li {
        display: list-item !important;
        list-style: inherit !important;
        padding-left: 0 !important;
      }
      
      body ul:not(.sky-lagoon-chat-widget ul) li::before,
      body ol:not(.sky-lagoon-chat-widget ol) li::before {
        display: none !important;
        content: none !important;
      }
      
      /* Fix for paragraph and heading margins */
      body h1:not(.sky-lagoon-chat-widget h1),
      body h2:not(.sky-lagoon-chat-widget h2),
      body h3:not(.sky-lagoon-chat-widget h3) {
        margin-bottom: 1.5rem !important;
        margin-top: 1.5rem !important;
      }
      
      body p:not(.sky-lagoon-chat-widget p) {
        margin-bottom: 1rem !important;
      }
      
      /* Fix for booking flow logo alignment */
      .checkout-header img,
      .checkout-header .logo,
      img[alt*="Sky Lagoon"],
      img[src*="logo"] {
        margin: auto !important;
        text-align: center !important;
      }
      
      /* Fix for logo image container */
      .checkout-header,
      header[class*="checkout"],
      div[class*="header"] {
        text-align: center !important;
        margin: 0 auto !important;
      }
      
      /* Fix for the sun icon centering */
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
    `;
    
    console.log('Applied website style fixes');
  };
  
  // Inject CSS for our widget
  const style = document.createElement('style');
  style.textContent = `
    .sky-lagoon-chat-widget img[src="/solrun.png"] {
      content: url("${baseUrl}/solrun.png") !important;
    }
    
    /* Reset styles for the widget container to prevent inheritance issues */
    .sky-lagoon-chat-widget {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
  `;
  document.head.appendChild(style);
  
  // Apply fixes immediately
  applyWebsiteFixes();
  
  // Set up an observer to detect DOM changes and reapply fixes
  const observer = new MutationObserver((mutations) => {
    // Reapply fixes when DOM changes
    applyWebsiteFixes();
  });
  
  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style']
  });
  
  // Also apply fixes after a short delay to ensure everything is loaded
  setTimeout(applyWebsiteFixes, 500);
  setTimeout(applyWebsiteFixes, 1500);
  
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
      // Remove the observer when widget is destroyed
      observer.disconnect();
      
      // Remove the fix stylesheet
      const fixStylesheet = document.getElementById('sky-lagoon-fix-styles');
      if (fixStylesheet && fixStylesheet.parentNode) {
        fixStylesheet.parentNode.removeChild(fixStylesheet);
      }
      
      ReactDOM.unmountComponentAtNode(container);
      // Remove the style element we added
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