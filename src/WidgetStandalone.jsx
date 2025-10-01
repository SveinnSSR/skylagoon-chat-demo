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

  // --- NEW: keep a handle to cleanup observers on destroy
  let resizeObserver = null; // <-- added

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

  // --- NEW (optional polish): notify parent when ready and on size changes
  // This helps the parent auto-size the iframe and know widget readiness.
  try {
    const postToParent = (payload) => {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(
          { type: 'SKY_CHAT_IFRAME', ...payload },
          '*'
        );
      }
    };

    // Signal "ready" once mounted
    postToParent({ event: 'ready' });

    // Observe content size and report new height to parent (prevents scrollbars)
    const measureHeight = () => {
      // Prefer documentElement scrollHeight; fallback to body if needed
      const h = Math.max(
        document.documentElement?.scrollHeight || 0,
        document.body?.scrollHeight || 0,
        container?.scrollHeight || 0
      );
      // Clamp to a sensible max if you want (optional): Math.min(h, 720)
      postToParent({ event: 'resize', height: h });
    };

    // Initial measure
    measureHeight();

    // Live observe changes in layout
    resizeObserver = new ResizeObserver(() => {
      // Debounce-ish: micro-batch changes in a frame
      requestAnimationFrame(measureHeight);
    });
    // Observe the root container; you can also observe document.body
    resizeObserver.observe(container);
  } catch (err) {
    console.warn('Parent bridge not available or ResizeObserver failed:', err);
  }

  // Return API for controlling the widget
  return {
    destroy: () => {
      ReactDOM.unmountComponentAtNode(container);
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
      // --- NEW: cleanup the observer to avoid leaks
      try {
        if (resizeObserver) resizeObserver.disconnect();
      } catch (e) {
        // no-op
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
