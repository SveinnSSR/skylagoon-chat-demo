import React from 'react';
import ReactDOM from 'react-dom';
import ChatWidget from './components/ChatWidget';
import './styles/globals.css';
import './styles/BookingChangeRequest.css';

// Render when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  
  if (root) {
    // Get language from URL if available
    const urlParams = new URLSearchParams(window.location.search);
    const language = urlParams.get('language') || 'en';
    
    // Render the ChatWidget directly
    ReactDOM.render(
      <ChatWidget 
        webhookUrl="https://sky-lagoon-chat-2024.vercel.app/chat"
        apiKey="sky-lagoon-secret-2024"
        language={language}
        isEmbedded={true}
      />,
      root
    );
  }
});
