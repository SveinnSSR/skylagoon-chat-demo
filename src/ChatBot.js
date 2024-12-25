import React, { useState, useEffect } from 'react';

const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    
    const WEBHOOK_URL = 'https://sky-lagoon-chatbot-server.vercel.app/chat';
    const API_KEY = 'sky-lagoon-secret-2024'; // Make sure this matches your server

    useEffect(() => {
        // Add welcome message when component mounts
        setMessages([{
            text: "Welcome to Sky Lagoon! How may I assist you today?",
            sender: 'bot'
        }]);
    }, []);

    const sendMessage = async () => {
        if (!inputMessage.trim()) return;

        // Add user message
        setMessages(prev => [...prev, {
            text: inputMessage,
            sender: 'user'
        }]);

        // Clear input
        setInputMessage('');

        try {
            // Add loading message
            setMessages(prev => [...prev, {
                text: "...",
                sender: 'bot',
                loading: true
            }]);

            // Send to webhook
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY
                },
                body: JSON.stringify({ message: inputMessage })
            });

            const data = await response.json();

            // Remove loading message and add bot response
            setMessages(prev => {
                const filteredMessages = prev.filter(msg => !msg.loading);
                return [...filteredMessages, {
                    text: data.message || "I apologize, but I'm having trouble processing your request.",
                    sender: 'bot'
                }];
            });

        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => {
                const filteredMessages = prev.filter(msg => !msg.loading);
                return [...filteredMessages, {
                    text: "I apologize, but I'm having trouble connecting right now.",
                    sender: 'bot'
                }];
            });
        }
    };

    return (
        <div className="chat-widget">
            <div className="chat-header">
                <img 
                    src="https://www.skylagoon.com/wp-content/themes/skylagoon/assets/img/logo.svg" 
                    alt="Sky Lagoon Logo" 
                    className="logo"
                />
                <h2>Sky Lagoon Assistant</h2>
            </div>

            <div className="chat-messages">
                {messages.map((message, index) => (
                    <div 
                        key={index} 
                        className={`message ${message.sender}-message ${message.loading ? 'loading-message' : ''}`}
                    >
                        {message.text}
                    </div>
                ))}
            </div>

            <div className="chat-input-area">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your message..."
                    className="chat-input"
                />
                <button onClick={sendMessage} className="chat-button">
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatBot;