// src/WidgetStandalone.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import ChatWidget from './components/ChatWidget';
import './styles/globals.css';

// Get language from window
const language = window.WIDGET_LANGUAGE || 'en';

// Render the ChatWidget directly
const renderWidget = () => {
  const root = document.getElementById('root');
  if (root) {
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
};

// Render the widget when the page loads
document.addEventListener('DOMContentLoaded', renderWidget);

