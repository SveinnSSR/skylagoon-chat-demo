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
    const [botToken, setBotToken] = useState(null); // Move this inside the component
    const [agentCredentials, setAgentCredentials] = useState(null);
    // New state for tracking message feedback
    const [messageFeedback, setMessageFeedback] = useState({});

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const welcomeMessage = language === 'en' 
            ? "Hello! I'm Sólrún your AI chatbot. I am new here and still learning but, will happily do my best to assist you. What can I do for you today?"
            : "Hæ! Ég heiti Sólrún og er AI spjallmenni. Ég er ný og enn að læra en mun aðstoða þig með glöðu geði. Hvað get ég gert fyrir þig í dag?";
            
        setMessages([{
            type: 'bot',
            content: welcomeMessage,
            id: 'welcome-msg-' + Date.now()
        }]);
    }, [language]);

    // Function to determine if a message should show feedback options
    const shouldShowFeedback = (message) => {
        // Skip feedback for welcome messages
        if (message.content.includes("I'm Sólrún your AI chatbot") || 
            message.content.includes("Ég heiti Sólrún og er AI spjallmenni")) {
            return false;
        }
        
        // Skip feedback for simple acknowledgment messages
        if (message.content.startsWith("What can I tell you about") ||
            message.content.startsWith("Hvað get ég sagt þér um")) {
            return false;
        }
        
        // Skip feedback for agent transfer messages
        if (message.content.includes("connected with a live agent") ||
            message.content.includes("tengd/ur við þjónustufulltrúa")) {
            return false;
        }
        
        // Skip feedback for error messages
        if (message.content.includes("I apologize, but I'm having trouble connecting") ||
            message.content.includes("Ég biðst afsökunar, en ég er að lenda í vandræðum")) {
            return false;
        }
        
        // Skip feedback for very short responses (less than 50 characters)
        if (message.content.length < 70) {
            return false;
        }
        
        // Show feedback for all other substantive responses
        return true;
    };

    const TypingIndicator = () => (
        <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: '16px',
            alignItems: 'flex-start',
            gap: '8px'
        }}>
            <img 
                src="/solrun.png" 
                alt="Sólrún"
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

    // Updated function to handle message feedback
    const handleMessageFeedback = async (messageId, isPositive) => {
        // Prevent multiple submissions for the same message
        if (messageFeedback[messageId]) return;
        
        // Update local state first for immediate UI feedback
        setMessageFeedback(prev => ({
            ...prev,
            [messageId]: { isPositive, submitted: true }
        }));
        
        try {
            // Find the message content
            const message = messages.find(msg => msg.id === messageId);
            const messageContent = message ? message.content : '';
            
            // First, send feedback to your existing endpoint for MongoDB storage
            await fetch(process.env.REACT_APP_WEBHOOK_URL + '/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.REACT_APP_API_KEY
                },
                body: JSON.stringify({
                    messageId,
                    isPositive,
                    messageContent,
                    timestamp: new Date().toISOString(),
                    chatId: chatId,
                    language: language
                })
            });
            
            // NEW: Also send feedback to your analytics system database
            // Using the public-feedback endpoint that doesn't require authentication
            const analyticsResponse = await fetch('https://hysing.svorumstrax.is/api/public-feedback', {
                method: 'POST',
                mode: 'cors', // Add this line
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messageId: messageId,
                    rating: isPositive, // match field name in our Prisma schema
                    comment: messageContent,
                    messageType: determineMessageType(messageContent, language),
                    timestamp: new Date().toISOString(),
                    conversationId: chatId
                })
            });
            
            if (!analyticsResponse.ok) {
                console.error('Failed to send feedback to analytics system');
            }
        } catch (error) {
            console.error('Error sending feedback:', error);
        }
    };
    
    // Add this helper function to determine message types
    const determineMessageType = (content, language) => {
        // Ensure we have content to analyze
        if (!content) return 'unknown';
        
        // Convert to lowercase for easier pattern matching
        const lowerContent = content.toLowerCase();
        const isIcelandic = language === 'is';
        
        // Check for patterns that indicate message type
        if (lowerContent.includes('opening hour') || lowerContent.includes('close') || 
            lowerContent.includes('open') || 
            (isIcelandic && (lowerContent.includes('opnunartím') || lowerContent.includes('lokunartím')))) {
            return 'hours';
        }
        
        if (lowerContent.includes('price') || lowerContent.includes('cost') || lowerContent.includes('fee') || 
            (isIcelandic && (lowerContent.includes('verð') || lowerContent.includes('gjald')))) {
            return 'pricing';
        }
        
        if (lowerContent.includes('ritual') || lowerContent.includes('skjól') || 
            lowerContent.includes('treatment') || 
            (isIcelandic && lowerContent.includes('meðferð'))) {
            return 'ritual';
        }
        
        if (lowerContent.includes('package') || lowerContent.includes('bundle') ||
            (isIcelandic && (lowerContent.includes('pakki') || lowerContent.includes('pakka')))) {
            return 'packages';
        }
        
        if (lowerContent.includes('transport') || lowerContent.includes('bus') || 
            lowerContent.includes('get to') || lowerContent.includes('arrive') ||
            (isIcelandic && (lowerContent.includes('strætó') || lowerContent.includes('komast')))) {
            return 'transportation';
        }
        
        if (lowerContent.includes('restaurant') || lowerContent.includes('food') || 
            lowerContent.includes('eat') || lowerContent.includes('drink') ||
            (isIcelandic && (lowerContent.includes('matur') || lowerContent.includes('veitinga')))) {
            return 'dining';
        }
        
        if (lowerContent.includes('locker') || lowerContent.includes('changing') || 
            lowerContent.includes('shower') || lowerContent.includes('amenities') ||
            (isIcelandic && (lowerContent.includes('skáp') || lowerContent.includes('sturtu')))) {
            return 'facilities';
        }
        
        if (lowerContent.includes('booking') || lowerContent.includes('reservation') || 
            lowerContent.includes('cancel') || 
            (isIcelandic && (lowerContent.includes('bókun') || lowerContent.includes('pöntun')))) {
            return 'booking';
        }
        
        if (lowerContent.includes('northern light') || lowerContent.includes('midnight sun') ||
            (isIcelandic && (lowerContent.includes('norðurljós') || lowerContent.includes('miðnætursól')))) {
            return 'natural_phenomena';
        }
        
        if (lowerContent.includes('weather') || lowerContent.includes('cold') || 
            lowerContent.includes('rain') || lowerContent.includes('snow') ||
            (isIcelandic && (lowerContent.includes('veður') || lowerContent.includes('rigning')))) {
            return 'weather';
        }
        
        if (lowerContent.includes('towel') || lowerContent.includes('swimsuit') || 
            lowerContent.includes('bring') || lowerContent.includes('need to') ||
            (isIcelandic && (lowerContent.includes('handklæði') || lowerContent.includes('sundföt')))) {
            return 'items_needed';
        }
        
        // Default category for messages that don't fit specific patterns
        return 'general';
    };

    const handleSend = async () => {
        if (!inputValue.trim() || isTyping) return;
    
        const messageText = inputValue.trim();
        setInputValue('');
    
        // Always show user message in chat
        setMessages(prev => [...prev, {
            type: 'user',
            content: messageText,
            id: 'user-msg-' + Date.now()
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
                    bot_token: botToken, // Add the bot token if available
                    agent_credentials: agentCredentials,
                    isAgentMode: chatMode === 'agent'
                })
            });   
    
            const data = await response.json();
            setIsTyping(false);
    
            // Handle transfer state
            if (data.transferred && data.chatId) {
                console.log('Transfer initiated with chat ID:', data.chatId);
                
                // Save the bot token if provided
                if (data.bot_token) {
                    console.log('Bot token received');
                    setBotToken(data.bot_token);
                }
                if (data.agent_credentials) {
                    console.log('Agent credentials received');
                    setAgentCredentials(data.agent_credentials);
                }

                // Set chat state to agent mode
                setChatMode('agent');
                setChatId(data.chatId);
                
                // Add the transfer messages to the chat
                setMessages(prev => [...prev, {
                    type: 'bot',
                    content: data.message,
                    id: 'bot-msg-' + Date.now()
                }, {
                    type: 'bot',
                    content: language === 'en' ? 
                        "You are now connected with a live agent. Please continue your conversation here." :
                        "Þú ert núna tengd/ur við þjónustufulltrúa. Vinsamlegast haltu samtalinu áfram hér.",
                    id: 'bot-transfer-' + Date.now()
                }]);
                return;
            }
    
            // Update bot token if provided in agent mode
            if (data.bot_token) {
                setBotToken(data.bot_token);
            }
    
            // If message was suppressed (in agent mode), don't show any response
            if (data.suppressMessage) {
                return;
            }
    
            // Normal bot response handling with unique ID for feedback tracking
            setMessages(prev => [...prev, {
                type: 'bot',
                content: data.message,
                id: 'bot-msg-' + Date.now()
            }]);
        } catch (error) {
            console.error('Error:', error);
            setIsTyping(false);
            setMessages(prev => [...prev, {
                type: 'bot',
                content: language === 'en' ? 
                    "I apologize, but I'm having trouble connecting right now. Please try again shortly." :
                    "Ég biðst afsökunar, en ég er að lenda í vandræðum með tengingu núna. Vinsamlegast reyndu aftur eftir smá stund.",
                id: 'bot-error-' + Date.now()
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
                    src="/solrun.png" 
                    alt="Sólrún" 
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
                        {chatMode === 'agent' ? 'Agent' : 'Sólrún'}
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
                                flexDirection: 'column',
                                alignItems: msg.type === 'user' ? 'flex-end' : 'flex-start',
                                marginBottom: msg.type === 'bot' ? '16px' : '12px',
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                                    alignItems: 'flex-start',
                                    width: '100%',
                                    gap: '8px'
                                }}>
                                    {msg.type === 'bot' && (
                                        <img 
                                            src="/solrun.png" 
                                            alt="Sólrún"
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
                                
                                {/* Feedback buttons - only shown for bot messages that pass the filter */}
                                {msg.type === 'bot' && shouldShowFeedback(msg) && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        marginTop: '4px',
                                        marginLeft: '38px',
                                        gap: '12px'
                                    }}>
                                        {messageFeedback[msg.id] ? (
                                            <div style={{
                                                fontSize: '12px',
                                                color: '#70744E',
                                                fontStyle: 'italic',
                                                opacity: 0.8,
                                                padding: '4px 8px',
                                                borderRadius: '12px',
                                                backgroundColor: 'rgba(112, 116, 78, 0.08)'
                                            }}>
                                                {language === 'en' ? 'Thank you for your feedback!' : 'Takk fyrir endurgjöfina!'}
                                            </div>
                                        ) : (
                                            <>
                                                <button 
                                                    onClick={() => handleMessageFeedback(msg.id, true)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        color: '#70744E',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        fontSize: '12px',
                                                        padding: '4px 8px',
                                                        borderRadius: '12px',
                                                        transition: 'all 0.2s ease',
                                                        opacity: 0.8,
                                                        ":hover": {
                                                            backgroundColor: 'rgba(112, 116, 78, 0.1)',
                                                            opacity: 1
                                                        }
                                                    }}
                                                    onMouseOver={(e) => {
                                                        e.currentTarget.style.backgroundColor = 'rgba(112, 116, 78, 0.1)';
                                                        e.currentTarget.style.opacity = '1';
                                                    }}
                                                    onMouseOut={(e) => {
                                                        e.currentTarget.style.backgroundColor = 'transparent';
                                                        e.currentTarget.style.opacity = '0.8';
                                                    }}
                                                    aria-label={language === 'en' ? 'Helpful' : 'Hjálplegt'}
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#70744E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                    <span>{language === 'en' ? 'Helpful' : 'Hjálplegt'}</span>
                                                </button>
                                                
                                                <button 
                                                    onClick={() => handleMessageFeedback(msg.id, false)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        color: '#70744E',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        fontSize: '12px',
                                                        padding: '4px 8px',
                                                        borderRadius: '12px',
                                                        transition: 'all 0.2s ease',
                                                        opacity: 0.8
                                                    }}
                                                    onMouseOver={(e) => {
                                                        e.currentTarget.style.backgroundColor = 'rgba(112, 116, 78, 0.1)';
                                                        e.currentTarget.style.opacity = '1';
                                                    }}
                                                    onMouseOut={(e) => {
                                                        e.currentTarget.style.backgroundColor = 'transparent';
                                                        e.currentTarget.style.opacity = '0.8';
                                                    }}
                                                    aria-label={language === 'en' ? 'Not helpful' : 'Ekki hjálplegt'}
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M17 2H20C20.5304 2 21.0391 2.21071 21.4142 2.58579C21.7893 2.96086 22 3.46957 22 4V11C22 11.5304 21.7893 12.0391 21.4142 12.4142C21.0391 12.7893 20.5304 13 20 13H17M10 15V19C10 19.7956 10.3161 20.5587 10.8787 21.1213C11.4413 21.6839 12.2044 22 13 22L17 13V2H5.72C5.23964 1.99453 4.77175 2.16359 4.40125 2.47599C4.03075 2.78839 3.78958 3.22309 3.72 3.7L2.34 12.7C2.29651 12.9866 2.31583 13.2793 2.39666 13.5577C2.4775 13.8362 2.61788 14.0937 2.80812 14.3125C2.99836 14.5313 3.23395 14.7061 3.49843 14.8248C3.76291 14.9435 4.05009 15.0033 4.34 15H10Z" stroke="#70744E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                    <span>{language === 'en' ? 'Not helpful' : 'Ekki hjálplegt'}</span>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
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
