import React, { useState, useEffect } from 'react';
import { theme } from '../styles/theme';
import MessageFormatter from './MessageFormatter';

const ChatWidget = ({ webhookUrl = 'https://sky-lagoon-chat-2024.vercel.app/chat', apiKey, language = 'en' }) => {
    const messagesEndRef = React.useRef(null);
    const [isMinimized, setIsMinimized] = useState(true);
    const [messages, setMessages] = useState([{
        type: 'bot',
        content: language === 'en' ? 
            "Hello! I'd be happy to assist you. Would you like to know about our unique geothermal lagoon experience, our Sér and Saman packages, or how to get here?" :
            "Hæ! Hvernig get ég aðstoðað þig?"
    }]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const TypingIndicator = () => (
        <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: '16px',
            alignItems: 'flex-start',
            gap: '8px'
        }}>
            <img 
                src="/skybot.png" 
                alt="Skybot"
                style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    marginTop: '4px'
                }}
            />
            <div style={{
                padding: '12px 16px',
                borderRadius: '16px',
                backgroundColor: '#f0f0f0',
                display: 'flex',
                gap: '4px',
                alignItems: 'center'
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
        if (!inputValue.trim()) return;

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
                    language: language
                })
            });   

            const data = await response.json();
            setIsTyping(false);
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
            backgroundColor: '#4D5645',
            borderRadius: isMinimized ? '40px' : '12px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.15)',
            fontFamily: theme.fonts.body,
            overflow: 'hidden',
            transition: 'all 0.3s ease'
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
                    backgroundColor: '#4D5645',
                    width: '100%',
                    boxSizing: 'border-box',
                    flexDirection: isMinimized ? 'row' : 'column'
                }}
            >
                <img 
                    src="/skybot.png" 
                    alt="Skybot" 
                    style={{ 
                        height: isMinimized ? '32px' : '60px',
                        width: isMinimized ? '32px' : '60px',
                        borderRadius: '50%',
                        objectFit: 'cover'
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
                        fontWeight: '500'
                    }}>
                        Skybot
                    </span>
                    <span style={{ 
                        color: '#e0e0e0',
                        fontSize: isMinimized ? '13px' : '14px'
                    }}>
                        Sky Lagoon
                    </span>
                </div>
                <span style={{ 
                    color: 'white',
                    fontSize: '12px',
                    marginLeft: isMinimized ? 'auto' : '0',
                    position: isMinimized ? 'relative' : 'absolute',
                    right: isMinimized ? 'auto' : '16px',
                    top: isMinimized ? 'auto' : '16px'
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
                                        src="/skybot.png" 
                                        alt="Skybot"
                                        style={{
                                            width: '30px',
                                            height: '30px',
                                            borderRadius: '50%',
                                            marginTop: '4px'
                                        }}
                                    />
                                )}
                                <div style={{
                                    maxWidth: '70%',
                                    padding: '12px 16px',
                                    borderRadius: '16px',
                                    backgroundColor: msg.type === 'user' ? '#4D5645' : '#f0f0f0',
                                    color: msg.type === 'user' ? 'white' : '#333333',
                                    fontSize: '14px',
                                    lineHeight: '1.5'
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
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={language === 'en' ? "Type your message..." : "Skrifaðu skilaboð..."}
                            style={{
                                flex: 1,
                                padding: '8px 16px',
                                borderRadius: '20px',
                                border: '1px solid #ddd',
                                outline: 'none',
                                fontSize: '14px'
                            }}
                        />
                        <button
                            onClick={handleSend}
                            style={{
                                backgroundColor: '#4D5645',
                                color: 'white',
                                border: 'none',
                                padding: '8px 20px',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500'
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
