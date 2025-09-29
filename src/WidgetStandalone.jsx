import React from 'react';
import ReactDOM from 'react-dom';
import ChatWidget from './components/ChatWidget';
import './styles/globals.css';
import './styles/BookingChangeRequest.css';
import { Analytics } from '@vercel/analytics/react';
import { track } from '@vercel/analytics';

// Export an initialization function
const init = (container, config = {}) => {
  // Ensure the container has our namespace class
  if (!container.classList.contains('sky-lagoon-chat-widget')) {
    container.classList.add('sky-lagoon-chat-widget');
  }

  // Get base URL for assets
  const baseUrl = config.baseUrl || '';
  console.log('Initializing widget with baseUrl:', baseUrl);

  // Only add styles for our own assets, nothing that affects the main site
  const style = document.createElement('style');
  style.textContent = `
    .sky-lagoon-chat-widget img[src="/solrun.png"] {
      content: url("${baseUrl}/solrun.png") !important;
    }
  `;
  document.head.appendChild(style);

  ReactDOM.render(
    <>
      <ChatWidget 
        webhookUrl="https://sky-lagoon-chat-2024.vercel.app/chat"
        apiKey={config.apiKey || "sky-lagoon-secret-2024"}
        language={config.language || "en"}
        isEmbedded={true}
        baseUrl={baseUrl}
      />
      <Analytics />
    </>,
    container
  );

  // Return API for controlling the widget
  return {
    destroy: () => {
      ReactDOM.unmountComponentAtNode(container);
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

// Listen for analytics events from parent page
if (typeof window !== 'undefined') {
  window.addEventListener('message', (evt) => {
    if (evt?.data?.type === 'SKY_CHAT_EVENT' && evt.data.name) {
      // Simple debounce to avoid duplicate events
      if (!window.__skyLastEvtAt) window.__skyLastEvtAt = 0;
      const now = Date.now();
      if (now - window.__skyLastEvtAt > 300) {
        track(evt.data.name);
        console.log('📊 Analytics: Tracked event from parent:', evt.data.name);
        window.__skyLastEvtAt = now;
      }
    }
  });
}

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
export default { init };// Build trigger Mon Aug  4 12:37:48 CEST 2025
