import React from 'react';
import './styles/globals.css';
import Layout from './components/Layout';

// Keep your webhook constants
const WEBHOOK_URL = 'https://sky-lagoon-chatbot-server.vercel.app/chat';
const API_KEY = 'sky-lagoon-secret-2024';

function App() {
    return (
        <div className="App">
            <Layout webhookUrl={WEBHOOK_URL} apiKey={API_KEY} />
        </div>
    );
}

export default App;