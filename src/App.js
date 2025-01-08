import React from 'react';
import './styles/globals.css';
import Layout from './components/Layout';

const WEBHOOK_URL = 'https://sky-lagoon-chatbot-server.vercel.app/chat';
const API_KEY = 'sky-lagoon-secret-2024';

function App() {
  return <Layout webhookUrl={WEBHOOK_URL} apiKey={API_KEY} />;
}

export default App;