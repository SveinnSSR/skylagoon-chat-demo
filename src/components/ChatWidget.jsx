// src/components/ChatWidget.jsx
import React, { useState, useEffect } from 'react';
import { theme } from '../styles/theme';
import MessageFormatter from './MessageFormatter';

const ChatWidget = ({ webhookUrl = 'https://sky-lagoon-chat-2024.vercel.app/chat', apiKey, language = 'en' }) => {
    const messagesEndRef = React.useRef(null);
    const [isMinimized, setIsMinimized] = useState(true);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    // New state variables for agent mode
    const [chatMode, setChatMode] = useState('bot');
    const [chatId, setChatId] = useState(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const welcomeMessage = language === 'en' 
            ? "Hello! I'm Rán your AI chatbot. I am new here and still learning but, will happily do my best to assist you. What can I do for you today?"
            : "Hæ! Ég heiti Rán og er AI spjallmenni. Ég er ný og enn að læra en mun aðstoða þig með glöðu geði. Hvað get ég gert fyrir þig í dag?";
            
        setMessages([{
            type: 'bot',
            content: welcomeMessage
        }]);
    }, [language]);

    const TypingIndicator = () => (
        <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: '16px',
            alignItems: 'flex-start',
            gap: '8px'
        }}>
            <img 
                src="/ran.png" 
                alt="Rán"
                style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    marginTop: '4px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
            />
            <div style={{
                padding: '12px 16px',
                borderRadius: '16px',
                backgroundColor: '#f0f0f0',
                display: 'flex',
                gap: '4px',
                alignItems: 'center',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(0, 0, 0, 0.05)'
            }}>
                <span style={{
                    height: '8px',
                    width: '8px',
                    backgroundColor: '#93918f',
                    borderRadius: '50%',
                    opacity: 0.4,
                    animation: 'typing 1s infinite'
                }}/>
                <span style={{
                    height: '8px',
                    width: '8px',
                    backgroundColor: '#93918f',
                    borderRadius: '50%',
                    opacity: 0.4,
                    animation: 'typing 1s infinite',
                    animationDelay: '0.2s'
                }}/>
                <span style={{
                    height: '8px',
                    width: '8px',
                    backgroundColor: '#93918f',
                    borderRadius: '50%',
                    opacity: 0.4,
                    animation: 'typing 1s infinite',
                    animationDelay: '0.4s'
                }}/>
            </div>
        </div>
    );

    const handleSend = async () => {
        if (!inputValue.trim() || isTyping) return;

        const messageText = inputValue.trim();
        setInputValue('');

        setMessages(prev => [...prev, {
            type: 'user',
            content: messageText
        }]);
        
        setIsTyping(true);

        try {
            console.log('Attempting to connect to:', process.env.REACT_APP_WEBHOOK_URL);
            const response = await fetch(process.env.REACT_APP_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.REACT_APP_API_KEY
                },
                body: JSON.stringify({ 
                    message: messageText,
                    language: language,
                    chatId: chatId,
                    isAgentMode: chatMode === 'agent'  // Add this flag
                })
            });   

            const data = await response.json();
            setIsTyping(false);

            // Handle transfer state
            if (data.transferred && data.chatId) {
                console.log('Transfer initiated with chat ID:', data.chatId);
                
                // Set chat state to agent mode
                setChatMode('agent');
                setChatId(data.chatId);
                
                // Add the transfer messages to the chat
                setMessages(prev => [...prev, {
                    type: 'bot',
                    content: data.message
                }, {
                    type: 'bot',
                    content: language === 'en' ? 
                        "You are now connected with a live agent. Please continue your conversation here." :
                        "Þú ert núna tengd/ur við þjónustufulltrúa. Vinsamlegast haltu samtalinu áfram hér."
                }]);
                return;
            }

            // Handle agent responses
            if (chatMode === 'agent' && data.agentResponse) {
                setMessages(prev => [...prev, {
                    type: 'bot',
                    content: data.agentResponse
                }]);
                return;
            }

            // Normal bot response handling
            setMessages(prev => [...prev, {
                type: 'bot',
                content: data.message
            }]);
        } catch (error) {
            console.error('Error:', error);
            setIsTyping(false);
            setMessages(prev => [...prev, {
                type: 'bot',
                content: language === 'en' ? 
                    "I apologize, but I'm having trouble connecting right now. Please try again shortly." :
                    "Ég biðst afsökunar, en ég er að lenda í vandræðum með tengingu núna. Vinsamlegast reyndu aftur eftir smá stund."
            }]);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: isMinimized ? '260px' : '400px',
            backgroundColor: 'rgba(112, 116, 78, 0.95)',
            borderRadius: isMinimized ? '40px' : '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2), 0 0 15px rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontFamily: theme.fonts.body,
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(8px)'
        }}>
            {/* Header */}
            <div 
                onClick={() => setIsMinimized(!isMinimized)}
                style={{
                    padding: isMinimized ? '16px 20px' : '20px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    gap: '12px',
                    backgroundColor: 'rgba(112, 116, 78, 1)',
                    width: '100%',
                    boxSizing: 'border-box',
                    flexDirection: isMinimized ? 'row' : 'column',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
            >
                <img 
                    src="/ran.png" 
                    alt="Rán" 
                    style={{ 
                        height: isMinimized ? '32px' : '60px',
                        width: isMinimized ? '32px' : '60px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}
                />
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isMinimized ? 'flex-start' : 'center',
                    gap: '4px'
                }}>
                    <span style={{ 
                        color: 'white',
                        fontSize: isMinimized ? '15px' : '16px',
                        fontWeight: '500',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                    }}>
                        {chatMode === 'agent' ? 'Agent' : 'Rán'}
                    </span>
                    <span style={{ 
                        color: '#e0e0e0',
                        fontSize: isMinimized ? '13px' : '14px',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                    }}>
                        Sky Lagoon
                    </span>
                    {chatMode === 'agent' && (
                        <div style={{
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            marginTop: '4px'
                        }}>
                            {language === 'en' ? 'Live Agent Connected' : 'Þjónustufulltrúi Tengdur'}
                        </div>
                    )}
                </div>
                <span style={{ 
                    color: 'white',
                    fontSize: '12px',
                    marginLeft: isMinimized ? 'auto' : '0',
                    position: isMinimized ? 'relative' : 'absolute',
                    right: isMinimized ? 'auto' : '16px',
                    top: isMinimized ? 'auto' : '16px',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                }}>
                    {isMinimized ? '△' : '▽'}
                </span>
            </div>

            {/* Chat area */}
            {!isMinimized && (
                <>
                    <div style={{
                        height: '400px',
                        backgroundColor: 'white',
                        overflowY: 'auto',
                        padding: '16px'
                    }}>
                        {messages.map((msg, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                                marginBottom: msg.type === 'bot' ? '16px' : '12px',
                                alignItems: 'flex-start',
                                gap: '8px'
                            }}>
                                {msg.type === 'bot' && (
                                    <img 
                                        src="/ran.png" 
                                        alt="Rán"
                                        style={{
                                            width: '30px',
                                            height: '30px',
                                            borderRadius: '50%',
                                            marginTop: '4px',
                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                )}
                                <div style={{
                                    maxWidth: '70%',
                                    padding: '12px 16px',
                                    borderRadius: '16px',
                                    backgroundColor: msg.type === 'user' ? '#70744E' : '#f0f0f0',
                                    color: msg.type === 'user' ? 'white' : '#333333',
                                    fontSize: '14px',
                                    lineHeight: '1.5',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                    border: msg.type === 'user' ? 
                                        '1px solid rgba(255, 255, 255, 0.1)' : 
                                        '1px solid rgba(0, 0, 0, 0.05)'
                                }}>
                                    {msg.type === 'bot' ? (
                                        <MessageFormatter message={msg.content} />
                                    ) : (
                                        msg.content
                                    )}
                                </div>
                            </div>
                        ))}
                        {isTyping && <TypingIndicator />}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input area */}
                    <div style={{
                        padding: '12px 16px',
                        backgroundColor: 'white',
                        borderTop: '1px solid #eee',
                        display: 'flex',
                        gap: '8px'
                    }}>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !isTyping && handleSend()}
                            placeholder={language === 'en' ? "Type your message..." : "Skrifaðu skilaboð..."}
                            style={{
                                flex: 1,
                                padding: '8px 16px',
                                borderRadius: '20px',
                                border: '1px solid #ddd',
                                outline: 'none',
                                fontSize: '14px',
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                            }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={isTyping}
                            style={{
                                backgroundColor: isTyping ? '#a0a0a0' : '#70744E',
                                color: 'white',
                                border: 'none',
                                padding: '8px 20px',
                                borderRadius: '20px',
                                cursor: isTyping ? 'default' : 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                opacity: isTyping ? 0.7 : 1,
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {language === 'en' ? 'Send' : 'Senda'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ChatWidget;
