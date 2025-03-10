import React from 'react';
import ReactDOM from 'react-dom';
import ChatWidget from './components/ChatWidget';
import './styles/globals.css';
import './styles/BookingChangeRequest.css';

// Export an initialization function
const init = (container, config = {}) => {
  // Get base URL for assets
  const baseUrl = config.baseUrl || '';
  console.log('Initializing widget with baseUrl:', baseUrl);
  
  // Inject CSS to fix image paths
  const style = document.createElement('style');
  style.textContent = `
    img[src="/solrun.png"] {
      content: url("${baseUrl}/solrun.png") !important;
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
    }
  };
};

// Auto-initialize if running standalone
if (typeof window !== 'undefined' && !window.SkyLagoonChat) {
  window.addEventListener('DOMContentLoaded', () => {
    const rootElement = document.getElementById('root');
    if (rootElement) {
      init(rootElement);
    }
  });
}

// Export for use in embed.js
export default { init };