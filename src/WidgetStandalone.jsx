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

  // Only inject CSS that's related to our widget resources
  const style = document.createElement('style');
  style.textContent = `
    /* ONLY WIDGET SPECIFIC STYLES - nothing affecting the main site */
    .sky-lagoon-chat-widget img[src="/solrun.png"] {
      content: url("${baseUrl}/solrun.png") !important;
    }
    
    /* Tailwind isolation reset for widget only */
    .sky-lagoon-chat-widget {
      all: initial;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      box-sizing: border-box;
      line-height: normal;
    }
    
    .sky-lagoon-chat-widget * {
      box-sizing: border-box;
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
    setLanguage: (newLanguage) => {
      console.log('Setting widget language to:', newLanguage);
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