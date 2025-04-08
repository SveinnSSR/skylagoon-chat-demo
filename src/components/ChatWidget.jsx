// src/components/ChatWidget.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { theme } from '../styles/theme';
import MessageFormatter from './MessageFormatter';
import Pusher from 'pusher-js'; // Add Pusher import
import BookingChangeRequest from './BookingChangeRequest';
import '../styles/BookingChangeRequest.css';

// Add these constants for session management
const SESSION_ID_KEY = 'skyLagoonChatSessionId';
const SESSION_LAST_ACTIVITY_KEY = 'skyLagoonChatLastActivity';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
const TYPING_SPEED = 20; // Speed in milliseconds per character

const ChatWidget = ({ webhookUrl = 'https://sky-lagoon-chat-2024.vercel.app/chat', apiKey, language = 'en', isEmbedded = false, baseUrl }) => {
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
    // Add state to track PostgreSQL IDs for messages
    const [messagePostgresqlIds, setMessagePostgresqlIds] = useState({});
    // Add Pusher state
    const [pusherChannel, setPusherChannel] = useState(null);
    // Add state for booking change form
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [bookingRequestSent, setBookingRequestSent] = useState(false);
    // Add window width tracking for responsive design
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
    // Add session ID state
    const [sessionId, setSessionId] = useState('');
    // Add current language state to track language changes
    const [currentLanguage, setCurrentLanguage] = useState(language);
    // Add state for character-by-character typing effect
    const [typingMessages, setTypingMessages] = useState({});

    // Add this near your other useEffect hooks
    useEffect(() => {
    if (isEmbedded && typeof window !== 'undefined' && window.sendResizeMessage) {
      window.sendResizeMessage(isMinimized);
    }
    }, [isMinimized, isEmbedded]);

    // Update internal language state when prop changes
    useEffect(() => {
        setCurrentLanguage(language);
    }, [language]);

    // Listen for language change events
    useEffect(() => {
        if (isEmbedded && typeof window !== 'undefined') {
            const handleLanguageChange = (event) => {
                if (event.detail && event.detail.language) {
                    console.log('Language change event received:', event.detail.language);
                    setCurrentLanguage(event.detail.language);
                    
                    // Optional: Show a message about language change
                    if (event.detail.language !== currentLanguage) {
                        const message = event.detail.language === 'en' 
                            ? "Switching to English..."
                            : "Skipta yfir í íslensku...";
                        
                        const newMessageId = 'bot-lang-' + Date.now();
                        
                        // Add the message to both messages and typing messages
                        setMessages(prev => [...prev, {
                            type: 'bot',
                            content: message,
                            id: newMessageId
                        }]);
                        
                        // Start typing effect for this message
                        startTypingEffect(newMessageId, message);
                    }
                }
            };
            
            // Add event listener to the document
            document.addEventListener('sky-lagoon-language-change', handleLanguageChange);
            
            return () => {
                document.removeEventListener('sky-lagoon-language-change', handleLanguageChange);
            };
        }
    }, [isEmbedded, currentLanguage]);

    // Add window resize listener for responsive design
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, showBookingForm, typingMessages]);

    // Functions for session management
    const generateSessionId = useCallback(() => {
        return `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    }, []);
    
    const checkSessionTimeout = useCallback(() => {
        const lastActivity = localStorage.getItem(SESSION_LAST_ACTIVITY_KEY);
        
        if (lastActivity && Date.now() - parseInt(lastActivity) > SESSION_TIMEOUT) {
            console.log('Session timed out, generating new session ID');
            const newSessionId = generateSessionId();
            localStorage.setItem(SESSION_ID_KEY, newSessionId);
            setSessionId(newSessionId);
        }
        
        // Update last activity time
        localStorage.setItem(SESSION_LAST_ACTIVITY_KEY, Date.now().toString());
    }, [generateSessionId]);
    
    const initializeSession = useCallback(() => {
        // Check if there's an existing session ID
        let existingSessionId = localStorage.getItem(SESSION_ID_KEY);
        
        if (!existingSessionId) {
            // Generate a new session ID if none exists
            existingSessionId = generateSessionId();
            localStorage.setItem(SESSION_ID_KEY, existingSessionId);
            console.log('Generated new session ID:', existingSessionId);
        } else {
            console.log('Using existing session ID:', existingSessionId);
        }
        
        // Check for session timeout
        const lastActivity = localStorage.getItem(SESSION_LAST_ACTIVITY_KEY);
        if (lastActivity && Date.now() - parseInt(lastActivity) > SESSION_TIMEOUT) {
            console.log('Session timed out, generating new session ID');
            existingSessionId = generateSessionId();
            localStorage.setItem(SESSION_ID_KEY, existingSessionId);
        }
        
        // Set the session ID in state
        setSessionId(existingSessionId);
        
        // Update last activity timestamp
        localStorage.setItem(SESSION_LAST_ACTIVITY_KEY, Date.now().toString());
    }, [generateSessionId]);
    
    // Initialize session on component mount
    useEffect(() => {
        initializeSession();
        
        // Optional: Periodically check for session timeout (every minute)
        const intervalId = setInterval(checkSessionTimeout, 60000);
        
        return () => {
            clearInterval(intervalId);
        };
    }, [initializeSession, checkSessionTimeout]);

    // Initialize Pusher
    useEffect(() => {
        // Initialize Pusher connection
        const pusher = new Pusher('cc7d062dcbb73c0ecbe3', {
            cluster: 'eu'
        });

        const channel = pusher.subscribe('chat-channel');
        
        // Save the channel for later use
        setPusherChannel(channel);

        // Clean up on unmount
        return () => {
            channel.unbind_all();
            pusher.unsubscribe('chat-channel');
            pusher.disconnect();
        };
    }, []);

    // Character-by-character typing effect function
    const startTypingEffect = (messageId, fullText) => {
        // Initialize with empty string
        setTypingMessages(prev => ({
            ...prev,
            [messageId]: { text: '', isComplete: false }
        }));
        
        let charIndex = 0;
        
        const typingInterval = setInterval(() => {
            if (charIndex <= fullText.length) {
                setTypingMessages(prev => ({
                    ...prev,
                    [messageId]: {
                        text: fullText.substring(0, charIndex),
                        isComplete: charIndex === fullText.length
                    }
                }));
                charIndex++;
                scrollToBottom();
            } else {
                clearInterval(typingInterval);
                // When typing is complete, mark as complete and remove cursor
                setTimeout(() => {
                    setTypingMessages(prev => ({
                        ...prev,
                        [messageId]: { text: fullText, isComplete: true }
                    }));
                }, 500); // Remove cursor after 500ms of completing the text
            }
        }, TYPING_SPEED);
        
        // Store the interval ID to clear it if needed
        return typingInterval;
    };

    useEffect(() => {
        const welcomeMessage = currentLanguage === 'en' 
            ? "Hello! I'm Sólrún your AI chatbot. I am new here and still learning but, will happily do my best to assist you. What can I do for you today?"
            : "Hæ! Ég heiti Sólrún og er AI spjallmenni. Ég er ný og enn að læra en mun aðstoða þig með glöðu geði. Hvað get ég gert fyrir þig í dag?";
        
        const welcomeMessageId = 'welcome-msg-' + Date.now();
        
        setMessages([{
            type: 'bot',
            content: welcomeMessage,
            id: welcomeMessageId
        }]);
        
        // Start typing effect for welcome message
        startTypingEffect(welcomeMessageId, welcomeMessage);
    }, [currentLanguage]);

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
        
        // Show feedback for all substantive responses
        return true;
    };

    // Handle booking form submission
    const handleBookingFormSubmit = async (formattedMessage) => {
        setIsTyping(true);
        
        try {
            // Convert formattedMessage to structured data
            const formLines = formattedMessage.split('\n');
            const formData = {};
            
            // Parse each line into key-value pairs
            formLines.forEach(line => {
                if (line.includes(':')) {
                    const [key, value] = line.split(':').map(part => part.trim());
                    if (key && value) {
                        formData[key.toLowerCase().replace(/\s(.)/g, (match, group) => group.toUpperCase())] = value;
                    }
                }
            });
            
            // Send the booking change request
            console.log('Sending booking form data:', formData);
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey
                },
                body: JSON.stringify({
                    message: formattedMessage,
                    formData: JSON.stringify(formData),
                    language: currentLanguage,
                    chatId: chatId,
                    bot_token: botToken,
                    agent_credentials: agentCredentials,
                    isBookingChangeRequest: true,
                    sessionId: sessionId // Include session ID
                })
            });

            const data = await response.json();
            setIsTyping(false);

            // Add user's formatted request to chat
            setMessages(prev => [...prev, {
                type: 'user',
                content: formattedMessage,
                id: 'user-booking-' + Date.now()
            }]);

            // Add confirmation message with typing effect
            const confirmMessageId = 'bot-booking-confirm-' + Date.now();
            const confirmMessage = data.message || (currentLanguage === 'en' ? 
                "Thank you for your booking change request. Our team will review it and respond to your email within 24 hours." :
                "Takk fyrir beiðnina um breytingu á bókun. Teymi okkar mun yfirfara hana og svara tölvupóstinum þínum innan 24 klukkustunda.");
            
            setMessages(prev => [...prev, {
                type: 'bot',
                content: confirmMessage,
                id: confirmMessageId
            }]);
            
            // Start typing effect for the confirmation message
            startTypingEffect(confirmMessageId, confirmMessage);

            // Update state
            setBookingRequestSent(true);
            setShowBookingForm(false);
        } catch (error) {
            console.error('Error submitting booking request:', error);
            setIsTyping(false);
            
            // Show error message with typing effect
            const errorMessageId = 'bot-booking-error-' + Date.now();
            const errorMessage = currentLanguage === 'en' ? 
                "I'm sorry, we're having trouble submitting your booking change request. Please try again or call us at +354 527 6800." :
                "Því miður erum við að lenda í vandræðum með að senda bókunarbeiðnina þína. Vinsamlegast reyndu aftur eða hringdu í +354 527 6800.";
            
            setMessages(prev => [...prev, {
                type: 'bot',
                content: errorMessage,
                id: errorMessageId
            }]);
            
            // Start typing effect for the error message
            startTypingEffect(errorMessageId, errorMessage);
        }
    };

    // Handle booking form cancellation
    const handleBookingFormCancel = () => {
        setShowBookingForm(false);
        
        const cancelMessageId = 'bot-booking-cancel-' + Date.now();
        const cancelMessage = currentLanguage === 'en' ? 
            "I've cancelled the booking change request. Is there anything else I can help you with?" :
            "Ég hef hætt við bókunarbreytingabeiðnina. Er eitthvað annað sem ég get aðstoðað þig með?";
        
        setMessages(prev => [...prev, {
            type: 'bot',
            content: cancelMessage,
            id: cancelMessageId
        }]);
        
        // Start typing effect for the cancellation message
        startTypingEffect(cancelMessageId, cancelMessage);
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
                    animation: 'sky-lagoon-chat-typing 1s infinite'
                }}/>
                <span style={{
                    height: '8px',
                    width: '8px',
                    backgroundColor: '#93918f',
                    borderRadius: '50%',
                    opacity: 0.4,
                    animation: 'sky-lagoon-chat-typing 1s infinite',
                    animationDelay: '0.2s'
                }}/>
                <span style={{
                    height: '8px',
                    width: '8px',
                    backgroundColor: '#93918f',
                    borderRadius: '50%',
                    opacity: 0.4,
                    animation: 'sky-lagoon-chat-typing 1s infinite',
                    animationDelay: '0.4s'
                }}/>
            </div>
        </div>
    );

    // Updated function to handle message feedback
    const handleMessageFeedback = async (messageId, isPositive) => {
        // Prevent multiple submissions for the same message
        if (messageFeedback[messageId]) return;
        
        console.log('Starting feedback submission for message:', messageId);
        console.log('Current webhook URL:', webhookUrl);
        console.log('API key available:', !!apiKey);
        
        // Update local state first for immediate UI feedback
        setMessageFeedback(prev => ({
            ...prev,
            [messageId]: { isPositive, submitted: true }
        }));
        
        try {
            // Find the message content
            const message = messages.find(msg => msg.id === messageId);
            const messageContent = message ? message.content : '';
            
            // Get PostgreSQL ID if we have one stored
            const postgresqlId = messagePostgresqlIds[messageId];
            console.log('PostgreSQL ID for this message:', postgresqlId || 'Not available');
            
            console.log('Sending feedback to backend:', { messageId, postgresqlId, isPositive });
            
            // 1. ORIGINAL ENDPOINT - Send to your backend (using props instead of env vars)
            const feedbackUrl = webhookUrl.replace('/chat', '') + '/feedback';
            console.log('External Feedback URL:', feedbackUrl);
            
            const externalResponse = await fetch(feedbackUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey
                },
                body: JSON.stringify({
                    messageId,
                    postgresqlId, // Include PostgreSQL ID if available
                    isPositive,
                    messageContent,
                    timestamp: new Date().toISOString(),
                    chatId: chatId,
                    language: currentLanguage,
                    sessionId: sessionId // Include session ID
                })
            });
            
            console.log('External feedback response status:', externalResponse.status);
            
            // 2. NEW ENDPOINT - Also send to our analytics system for proper ID linking
            console.log('Sending feedback to analytics system for ID linking');
            
            try {
                const analyticsResponse = await fetch('/api/feedback/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        messageId,
                        postgresqlId, // Include PostgreSQL ID if available
                        rating: isPositive,
                        content: messageContent,
                        timestamp: new Date().toISOString(),
                        language: currentLanguage,
                        sessionId: sessionId // Include session ID
                    })
                });
                
                console.log('Analytics feedback response status:', analyticsResponse.status);
                
                if (analyticsResponse.ok) {
                    const analyticsData = await analyticsResponse.json();
                    console.log('Analytics feedback response:', analyticsData);
                } else {
                    console.log('Analytics feedback submission failed, but original feedback was sent');
                }
            } catch (analyticsError) {
                // Don't fail the overall feedback if analytics submission fails
                console.error('Error sending feedback to analytics:', analyticsError);
            }
            
            if (!externalResponse.ok) {
                const data = await externalResponse.json();
                console.error('Failed to send feedback:', data);
            } else {
                console.log('Successfully sent feedback to backend');
            }
        } catch (error) {
            console.error('Error sending feedback:', error);
            console.error('Error details:', error.message);
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
        
        // Check for session timeout before sending
        checkSessionTimeout();
    
        try {
            // Use props instead of environment variables
            console.log('Sending message to:', webhookUrl);
            console.log('Using session ID:', sessionId);
            
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey
                },
                body: JSON.stringify({ 
                    message: messageText,
                    language: currentLanguage,
                    chatId: chatId,
                    bot_token: botToken, // Add the bot token if available
                    agent_credentials: agentCredentials,
                    isAgentMode: chatMode === 'agent',
                    sessionId: sessionId // Include session ID with every request
                })
            });   
    
            const data = await response.json();
            setIsTyping(false);
            
            // Handle booking change request form
            if (data.showBookingChangeForm) {
                console.log('Booking change request detected, showing form');
                
                // Save the chat ID and tokens if provided
                if (data.chatId) setChatId(data.chatId);
                if (data.bot_token) setBotToken(data.bot_token);
                if (data.agent_credentials) setAgentCredentials(data.agent_credentials);
                
                // Add the bot message with typing effect
                const botMsgId = 'bot-msg-' + Date.now();
                setMessages(prev => [...prev, {
                    type: 'bot',
                    content: data.message,
                    id: botMsgId
                }]);
                
                // Start typing effect for this message
                startTypingEffect(botMsgId, data.message);
                
                // Show the booking form
                setShowBookingForm(true);
                return;
            }
    
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
                
                // Add the transfer messages to the chat with typing effect
                const botMsgId = 'bot-msg-' + Date.now();
                const transferMsgId = 'bot-transfer-' + Date.now();
                
                // First message
                setMessages(prev => [...prev, {
                    type: 'bot',
                    content: data.message,
                    id: botMsgId
                }]);
                
                // Start typing effect for first message
                startTypingEffect(botMsgId, data.message);
                
                // Second message (after a delay to simulate sequential typing)
                setTimeout(() => {
                    const transferMessage = currentLanguage === 'en' ? 
                        "You are now connected with a live agent. Please continue your conversation here." :
                        "Þú ert núna tengd/ur við þjónustufulltrúa. Vinsamlegast haltu samtalinu áfram hér.";
                    
                    setMessages(prev => [...prev, {
                        type: 'bot',
                        content: transferMessage,
                        id: transferMsgId
                    }]);
                    
                    // Start typing effect for second message
                    startTypingEffect(transferMsgId, transferMessage);
                }, 1000); // Delay before showing the second message
                
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
            const botMessageId = 'bot-msg-' + Date.now();
            setMessages(prev => [...prev, {
                type: 'bot',
                content: data.message,
                id: botMessageId
            }]);
            
            // Start typing effect for this message
            startTypingEffect(botMessageId, data.message);

            // Store PostgreSQL ID if provided in response
            if (data.postgresqlMessageId) {
                setMessagePostgresqlIds(prev => ({
                    ...prev,
                    [botMessageId]: data.postgresqlMessageId
                }));
                console.log(`Stored PostgreSQL ID mapping: ${botMessageId} -> ${data.postgresqlMessageId}`);
            }
        } catch (error) {
            console.error('Error:', error);
            setIsTyping(false);
            
            // Error message with typing effect
            const errorMsgId = 'bot-error-' + Date.now();
            const errorMessage = currentLanguage === 'en' ? 
                "I apologize, but I'm having trouble connecting right now. Please try again shortly." :
                "Ég biðst afsökunar, en ég er að lenda í vandræðum með tengingu núna. Vinsamlegast reyndu aftur eftir smá stund.";
            
            setMessages(prev => [...prev, {
                type: 'bot',
                content: errorMessage,
                id: errorMsgId
            }]);
            
            // Start typing effect for error message
            startTypingEffect(errorMsgId, errorMessage);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: isMinimized ? (windowWidth <= 768 ? '60px' : '70px') : '400px',
            height: isMinimized ? (windowWidth <= 768 ? '60px' : '70px') : 'auto',
            maxHeight: isMinimized ? 'auto' : 'calc(100vh - 40px)',
            backgroundColor: isMinimized ? 'rgba(112, 116, 78, 0.95)' : 'rgba(112, 116, 78, 1)', // Change to match header color
            borderRadius: isMinimized ? '50%' : '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2), 0 0 15px rgba(255, 255, 255, 0.1)',
            border: 'none', // Remove the border
            fontFamily: theme.fonts.body,
            overflow: 'hidden',
            transformOrigin: 'bottom right',
            transition: 'all 0.3s ease', // Simpler transition
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            maxWidth: isMinimized ? 'auto' : '90vw'
        }}>
            {/* Header */}
            <div 
                onClick={() => setIsMinimized(!isMinimized)}
                style={{
                    padding: isMinimized ? '0' : '20px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isMinimized ? 'center' : 'flex-start',
                    cursor: 'pointer',
                    gap: '12px',
                    backgroundColor: 'rgba(112, 116, 78, 1)',
                    width: '100%',
                    height: isMinimized ? '100%' : 'auto',
                    boxSizing: 'border-box',
                    flexDirection: isMinimized ? 'row' : 'column',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
            >
                <img 
                    src="/solrun.png" 
                    alt="Sólrún" 
                    style={{ 
                        height: isMinimized ? (windowWidth <= 768 ? '40px' : '50px') : '60px',
                        width: isMinimized ? (windowWidth <= 768 ? '40px' : '50px') : '60px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        boxShadow: isMinimized ? '0 1px 3px rgba(0, 0, 0, 0.1)' : '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}
                />
                {!isMinimized && (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px'
                    }}>
                        <span style={{ 
                            color: 'white',
                            fontSize: '16px',
                            fontWeight: '500',
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                        }}>
                            {chatMode === 'agent' ? 'Agent' : 'Sólrún'}
                        </span>
                        <span style={{ 
                            color: '#e0e0e0',
                            fontSize: '14px',
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
                                {currentLanguage === 'en' ? 'Live Agent Connected' : 'Þjónustufulltrúi Tengdur'}
                            </div>
                        )}
                        {bookingRequestSent && (
                            <div style={{
                                backgroundColor: '#70744E',
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                marginTop: '4px'
                            }}>
                                {currentLanguage === 'en' ? 'Booking Change Requested' : 'Bókunarbreyting umbeðin'}
                            </div>
                        )}
                    </div>
                )}
                {!isMinimized && (
                    <span style={{ 
                        color: 'white',
                        fontSize: '12px',
                        position: 'absolute',
                        right: '16px',
                        top: '16px',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                    }}>
                        ▽
                    </span>
                )}
            </div>

            {/* Chat area */}
            {!isMinimized && (
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
                                        // Apply typing effect only for bot messages
                                        typingMessages[msg.id] ? 
                                            <MessageFormatter message={typingMessages[msg.id].text} /> :
                                            <MessageFormatter message={msg.content} />
                                    ) : (
                                        // User messages always show instantly
                                        msg.content
                                    )}
                                    {/* Cursor has been removed for cleaner look */}
                                </div>
                            </div>
                            
                            {/* Feedback buttons - only shown for bot messages that pass the filter */}
                            {msg.type === 'bot' && 
                             typingMessages[msg.id] && 
                             typingMessages[msg.id].isComplete && 
                             shouldShowFeedback(msg) && (
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
                                            {currentLanguage === 'en' ? 'Thank you for your feedback!' : 'Takk fyrir endurgjöfina!'}
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
                                                aria-label={currentLanguage === 'en' ? 'Helpful' : 'Hjálplegt'}
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#70744E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                                <span>{currentLanguage === 'en' ? 'Helpful' : 'Hjálplegt'}</span>
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
                                                aria-label={currentLanguage === 'en' ? 'Not helpful' : 'Ekki hjálplegt'}
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M17 2H20C20.5304 2 21.0391 2.21071 21.4142 2.58579C21.7893 2.96086 22 3.46957 22 4V11C22 11.5304 21.7893 12.0391 21.4142 12.4142C21.0391 12.7893 20.5304 13 20 13H17M10 15V19C10 19.7956 10.3161 20.5587 10.8787 21.1213C11.4413 21.6839 12.2044 22 13 22L17 13V2H5.72C5.23964 1.99453 4.77175 2.16359 4.40125 2.47599C4.03075 2.78839 3.78958 3.22309 3.72 3.7L2.34 12.7C2.29651 12.9866 2.31583 13.2793 2.39666 13.5577C2.4775 13.8362 2.61788 14.0937 2.80812 14.3125C2.99836 14.5313 3.23395 14.7061 3.49843 14.8248C3.76291 14.9435 4.05009 15.0033 4.34 15H10Z" stroke="#70744E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                                <span>{currentLanguage === 'en' ? 'Not helpful' : 'Ekki hjálplegt'}</span>
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Show booking form if requested */}
                    {showBookingForm && !bookingRequestSent && (
                        <div className="message bot">
                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                                width: '100%',
                                gap: '8px',
                                marginBottom: '16px'
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
                                <div className="bubble form-container" style={{
                                    maxWidth: '90%',
                                    padding: '0',
                                    borderRadius: '16px',
                                    backgroundColor: '#f0f0f0',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                    border: '1px solid rgba(0, 0, 0, 0.05)',
                                    overflow: 'hidden'
                                }}>
                                    <BookingChangeRequest 
                                        onSubmit={handleBookingFormSubmit}
                                        onCancel={handleBookingFormCancel}
                                        language={currentLanguage === 'is' ? 'is' : 'en'} // Ensure proper language format
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {isTyping && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                </div>
            )}

            {/* Input area */}
            {!isMinimized && (
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
                        placeholder={currentLanguage === 'en' ? "Type your message..." : "Skrifaðu skilaboð..."}
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
                        {currentLanguage === 'en' ? 'Send' : 'Senda'}
                    </button>
                </div>
            )}

            {/* Add keyframes for typing animation - renamed to be unique */}
            <style jsx>{`
                @keyframes sky-lagoon-chat-typing {
                    0% {
                        opacity: 0.4;
                    }
                    50% {
                        opacity: 1;
                    }
                    100% {
                        opacity: 0.4;
                    }
                }
                
                @media (max-width: 768px) {
                    .sky-lagoon-chat-widget input, 
                    .sky-lagoon-chat-widget button {
                        font-size: 16px !important; /* Prevent zoom on mobile */
                    }
                }
            `}</style>
        </div>
    );
};

export default ChatWidget;