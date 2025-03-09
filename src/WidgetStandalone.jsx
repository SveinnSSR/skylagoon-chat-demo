import React from 'react';
import ReactDOM from 'react-dom';
import ChatWidget from './components/ChatWidget';
import './styles/globals.css';
import './styles/BookingChangeRequest.css';

// Enhanced debugging
console.log('WidgetStandalone.jsx loaded');

// Render when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM content loaded, preparing to render ChatWidget');
  const root = document.getElementById('root');
  
  if (root) {
    // Get language from URL if available
    const urlParams = new URLSearchParams(window.location.search);
    const language = urlParams.get('language') || 'en';
    console.log('Language detected:', language);
    
    // Force styles to apply even in iframe context
    document.body.style.background = 'transparent';
    
    // Render the ChatWidget directly
    console.log('Rendering ChatWidget with isEmbedded=true');
    ReactDOM.render(
      <ChatWidget 
        webhookUrl="https://sky-lagoon-chat-2024.vercel.app/chat"
        apiKey="sky-lagoon-secret-2024"
        language={language}
        isEmbedded={true}
      />,
      root
    );
  } else {
    console.error('Root element not found!');
  }
});