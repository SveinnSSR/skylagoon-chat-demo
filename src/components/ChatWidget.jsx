// src/components/ChatWidget.jsx
import React, { useState, useEffect, useCallback, Component } from 'react';
import { theme } from '../styles/theme';
import MessageFormatter from './MessageFormatter';
import Pusher from 'pusher-js'; // Add Pusher import
import BookingChangeRequest from './BookingChangeRequest';
import '../styles/BookingChangeRequest.css';

// Define constants for connection messages to ensure consistent checks
const CONNECTION_MESSAGE_EN = "You are now connected with a live agent. Please continue your conversation here.";
const CONNECTION_MESSAGE_IS = "Þú ert núna tengd/ur við þjónustufulltrúa. Vinsamlegast haltu samtalinu áfram hér.";

// Less intrusive error boundary
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Chat error:", error);
  }

  render() {
    if (this.state.hasError) {
      return <div style={{
        padding: '8px',
        backgroundColor: '#f8f8f8',
        border: '1px solid #ddd',
        borderRadius: '4px',
        margin: '8px',
        fontSize: '12px',
        textAlign: 'center'
      }}>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '4px 8px',
            backgroundColor: '#70744E',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reload Chat
        </button>
      </div>;
    }
    return this.props.children;
  }
}

// Message-level error boundary to prevent full widget crashes
class MessageErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Message rendering error:", error);
  }

  render() {
    if (this.state.hasError) {
      // Instead of showing an error message, return null to hide completely
      return null;
    }
    return this.props.children;
  }
}

// Add these constants for session management
const SESSION_ID_KEY = 'skyLagoonChatSessionId';
const SESSION_LAST_ACTIVITY_KEY = 'skyLagoonChatLastActivity';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

// NEW: Configuration for response effects
const TYPING_SPEED = 20; // Speed in milliseconds per character for character-by-character typing
const CHUNK_REVEAL_DELAY = 250; // Time between chunk reveals in milliseconds
const FADE_IN_DURATION = 300; // Duration of the fade-in animation in milliseconds
const MOBILE_BREAKPOINT = 768; // Pixel width below which we'll use the simple approach

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
    // Add state to persist credentials between requests
    const [storedCredentials, setStoredCredentials] = useState(null);
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
    // Modified state for tracking typing/chunking effects
    const [typingMessages, setTypingMessages] = useState({});
    // Track newly added messages for animation
    const [newMessageIds, setNewMessageIds] = useState([]);
    // Tracking agent message errors to prevent UI crashes
    const [agentMessageErrors, setAgentMessageErrors] = useState(0);
    // NEW: Add connection message tracking ref
    const connectionMessageShownRef = React.useRef(false);
    // NEW: Add a state variable for tracking transfer completion
    const [isTransferComplete, setIsTransferComplete] = useState(false);
    // NEW: Track if we're on a mobile device for rendering approach
    const isMobile = windowWidth <= MOBILE_BREAKPOINT;
    
    // NEW: Streaming-related state and refs
    const eventSourceRef = React.useRef(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [accumulatedStreamContent, setAccumulatedStreamContent] = useState('');
    const currentStreamingMessageIdRef = React.useRef(null);

    // NEW: Add component mount/unmount diagnostic logging
    useEffect(() => {
        // Component mounting diagnostic
        console.log('[DIAGNOSTIC] ChatWidget mounted with session:', sessionId);
        console.log('[ConnectionRef] Initial value:', connectionMessageShownRef.current);
        console.log('[DEVICE] Using ' + (isMobile ? 'mobile' : 'desktop') + ' rendering approach');
        
        return () => {
            console.log('[DIAGNOSTIC] ChatWidget unmounting, last session:', sessionId);
            console.log('[ConnectionRef] Final value on unmount:', connectionMessageShownRef.current);
            
            // NEW: Clean up any active EventSource connections
            if (eventSourceRef.current) {
                console.log('[STREAM] Cleaning up EventSource connection on unmount');
                eventSourceRef.current.close();
                eventSourceRef.current = null;
            }
        };
    }, []);
    
    // NEW: Function to close streaming connections
    const closeStreamConnection = useCallback(() => {
        if (eventSourceRef.current) {
            console.log('[STREAM] Closing EventSource connection');
            eventSourceRef.current.close();
            eventSourceRef.current = null;
            setIsStreaming(false);
        }
    }, []);

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
                        
                        // Start appropriate rendering effect for this message
                        renderMessage(newMessageId, message);
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

    const scrollToBottom = (isDuringTyping = false) => {
        if (messagesEndRef.current) {
            // Simply scroll to the bottom, no special handling that might cause jitter
            const chatContainer = messagesEndRef.current.parentElement;
            if (chatContainer) {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        }
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

    // Listen for agent messages from LiveChat - format-normalized implementation
    // FIXED: Removed 'messages' from dependency array to prevent loops
    useEffect(() => {
        if (pusherChannel) {
            // Explicitly unbind first to prevent duplicate handlers
            console.log('[AgentHandler] Cleaning up previous handlers');
            pusherChannel.unbind('agent-message');
            
            const handleAgentMessage = (data) => {
                try {
                    console.log('[AgentHandler] Received message data:', data);
                    if (typeof data === 'object') {
                        console.log('[AgentHandler] Data structure:', 
                            Object.keys(data).join(', '));
                    }
                    
                    // Basic validation with detailed logging
                    if (!data) {
                        console.log('[AgentHandler] Rejecting: data is null/undefined');
                        return;
                    }
                    
                    if (!data.sessionId) {
                        console.log('[AgentHandler] Rejecting: missing sessionId');
                        return;
                    }
                    
                    if (data.sessionId !== sessionId) {
                        console.log(`[AgentHandler] Rejecting: session mismatch (got ${data.sessionId}, current is ${sessionId})`);
                        return;
                    }
                    
                    // FORMAT NORMALIZATION - critical step for preventing state corruption
                    let content = '';
                    let author = 'Agent';
                    
                    // Message extraction with detailed logging
                    if (data.message) {
                        console.log('[AgentHandler] Found message object:', typeof data.message);
                        
                        if (typeof data.message.content === 'string') {
                            content = data.message.content;
                            console.log(`[AgentHandler] Extracted content (${content.length} chars)`);
                        } else if (data.message.content !== undefined) {
                            console.log('[AgentHandler] Content exists but is not a string:', 
                                typeof data.message.content);
                        }
                        
                        if (typeof data.message.author === 'string') {
                            author = data.message.author;
                            console.log(`[AgentHandler] Extracted author: "${author}"`);
                        }
                    } else if (typeof data.text === 'string') {
                        // Fallback for alternate format
                        content = data.text;
                        console.log(`[AgentHandler] Using fallback text field (${content.length} chars)`);
                    } else {
                        console.log('[AgentHandler] No valid content sources found in data');
                    }
                    
                    // Skip empty messages
                    if (!content.trim()) {
                        console.log('[AgentHandler] Skipping empty content');
                        return;
                    }
                    
                    // NEW: Check if this message is an echo of a recent user message
                    const isEchoOfUserMessage = messages.some(m => 
                        m.type === 'user' && 
                        m.content && 
                        content && 
                        m.content.trim().toLowerCase() === content.trim().toLowerCase() &&
                        (Date.now() - (m.timestamp || 0)) < 10000 // Within 10 seconds
                    );
                    
                    if (isEchoOfUserMessage) {
                        console.log('[AgentHandler] Skipping echo of user message:', content);
                        return;
                    }
                    
                    // Check for duplicate messages (sent in the last few seconds)
                    const isDuplicate = messages.some(m => 
                        m.content === content && 
                        Date.now() - (m.timestamp || 0) < 5000 // 5 seconds threshold
                    );

                    if (isDuplicate) {
                        console.log('[AgentHandler] Skipping duplicate message');
                        return;
                    }

                    // UPDATED: Skip the connection message if we've seen it before (using both state and ref)
                    if (content.includes(CONNECTION_MESSAGE_EN) || 
                        content.includes(CONNECTION_MESSAGE_IS) ||
                        content.includes("connected with a live agent")) {
                        
                        console.log('[ConnectionRef] Checking connection message, ref value:', connectionMessageShownRef.current, 'state:', isTransferComplete);
                        
                        if (connectionMessageShownRef.current || isTransferComplete) {
                            console.log('[ConnectionRef] SKIPPING connection message - already shown');
                            return;
                        }
                        
                        // If we get here, mark it as shown and continue
                        console.log('[ConnectionRef] SHOWING connection message and setting ref/state to true');
                        connectionMessageShownRef.current = true;
                        setIsTransferComplete(true);
                    }
                    
                    // Create consistent message object
                    const id = 'agent-' + Date.now();
                    const newMessage = {
                        type: 'agent',
                        role: 'agent',
                        content: content,
                        sender: author,
                        id: id,
                        timestamp: Date.now()  // Add timestamp for tracking
                    };
                    
                    console.log(`[AgentHandler] Created normalized message object with ID: ${id}`);
                    
                    // Log messages state BEFORE update for debugging
                    console.log('[AgentHandler] Current messages count:', 
                        Array.isArray(messages) ? messages.length : 'not an array');
                    
                    // Update state with normalized message
                    console.log('[AgentHandler] Updating messages state...');
                    setMessages(prev => {
                        // Verify prev is an array
                        if (!Array.isArray(prev)) {
                            console.error('[AgentHandler] Previous messages not an array:', prev);
                            return [newMessage]; // Reset state to just this message
                        }
                        
                        const newMessages = [...prev, newMessage];
                        console.log(`[AgentHandler] New messages count: ${newMessages.length}`);
                        return newMessages;
                    });
                    
                    // Initialize rendering for agent messages
                    renderMessage(id, content);
                    
                    console.log('[AgentHandler] State update triggered');
                } catch (error) {
                    // Log complete error details but don't crash
                    console.error('[AgentHandler] Error processing message:', error);
                    console.error('[AgentHandler] Error stack:', error.stack);
                }
            };
            
            console.log('[AgentHandler] Binding agent-message handler');
            pusherChannel.bind('agent-message', handleAgentMessage);
            
            return () => {
                console.log('[AgentHandler] Cleanup: Unbinding agent-message handler');
                pusherChannel.unbind('agent-message', handleAgentMessage);
            };
        }
    }, [pusherChannel, sessionId, messages, isTransferComplete]); // Added messages and isTransferComplete to deps

    // Add this debugging effect to monitor message state
    useEffect(() => {
        // Only log when messages change, helps identify state consistency issues
        console.log('[DEBUG] Messages state updated:',
            messages.map(m => ({
                type: m.type || 'unknown',
                id: m.id || 'no-id',
                hasContent: Boolean(m.content),
                contentLength: m.content ? m.content.length : 0,
                contentType: typeof m.content
            }))
        );
    }, [messages]);

    // NEW: Device-adaptive message rendering function
    // This is a wrapper that chooses the right rendering approach based on device
    const renderMessage = (messageId, fullText) => {
        // Safety check for undefined text
        if (!fullText) {
            console.warn('Attempted to start rendering effect with empty text');
            return null;
        }
        
        // Normalize fullText to ensure it's a string
        const safeText = typeof fullText === 'string' ? fullText : 
                        (fullText ? String(fullText) : '');
        
        // Choose rendering approach based on device
        if (isMobile) {
            // For mobile: Use simpler approach to ensure stability
            return startSimpleRender(messageId, safeText);
        } else {
            // For desktop: Use premium chunked approach
            return startChunkedReveal(messageId, safeText);
        }
    };

    // APPROACH 1: Simple immediate reveal with a fade-in effect
    // Optimized for mobile where we prioritize reliability over effects
    const startSimpleRender = (messageId, fullText) => {
        try {
            // Initialize with full text, fade-in effect
            setTypingMessages(prev => ({
                ...prev,
                [messageId]: { 
                    text: fullText,
                    visibleChars: fullText.length, // Show all text immediately
                    isComplete: true,              // Mark as complete right away
                    fadeIn: true,                  // But still use fade-in effect
                    renderType: 'simple'           // Track the render type
                }
            }));
            
            // Scroll to bottom to ensure it's visible
            setTimeout(() => {
                scrollToBottom();
            }, 50);
            
            return messageId;
        } catch (error) {
            console.error('Error in simple render effect:', error);
            
            // Recovery: set the message as complete immediately without effects
            try {
                setTypingMessages(prev => ({
                    ...prev,
                    [messageId]: { 
                        text: fullText,
                        visibleChars: fullText.length,
                        isComplete: true,
                        fadeIn: false,
                        renderType: 'simple-fallback'
                    }
                }));
            } catch (recoveryError) {
                console.error('Failed to recover from simple render error:', recoveryError);
            }
            return null;
        }
    };

    // APPROACH 2: Premium chunked reveal with transitions
    // Used on desktop for a premium feel
    const startChunkedReveal = (messageId, fullText) => {
        try {
            // Calculate chunk size based on message length
            let numberOfChunks = 1;
            
            if (fullText.length < 100) {
                // For short messages, show all at once with a fade-in
                numberOfChunks = 1;
            } else if (fullText.length < 300) {
                // For medium messages, use 2 chunks
                numberOfChunks = 2;
            } else {
                // For longer messages, use 3 chunks
                numberOfChunks = 3;
            }
            
            const chunkSize = Math.ceil(fullText.length / numberOfChunks);
            
            // Initialize with empty text but visibility visible (for fade-in effect)
            setTypingMessages(prev => ({
                ...prev,
                [messageId]: { 
                    text: fullText, // Store the full text
                    visibleChars: 0, // Initial visible characters (none)
                    currentChunk: 0, // Track the current chunk
                    totalChunks: numberOfChunks,
                    isComplete: false,
                    fadeIn: true, // Enable fade-in effect
                    renderType: 'chunked' // Track the render type
                }
            }));
            
            // Immediately scroll to bottom to handle container properly
            setTimeout(() => {
                scrollToBottom();
            }, 50);
            
            // Reveal chunks sequentially with smooth transition
            let currentChunk = 0;
            
            const revealNextChunk = () => {
                if (currentChunk < numberOfChunks) {
                    const charsToReveal = Math.min(
                        (currentChunk + 1) * chunkSize,
                        fullText.length
                    );
                    
                    setTypingMessages(prev => ({
                        ...prev,
                        [messageId]: {
                            ...prev[messageId],
                            visibleChars: charsToReveal,
                            currentChunk: currentChunk + 1,
                            isComplete: charsToReveal === fullText.length
                        }
                    }));
                    
                    currentChunk++;
                    
                    // Only scroll when adding new content
                    setTimeout(() => {
                        scrollToBottom();
                    }, 50);
                    
                    // Schedule next chunk if needed
                    if (currentChunk < numberOfChunks) {
                        setTimeout(revealNextChunk, CHUNK_REVEAL_DELAY);
                    } else {
                        // Final scroll and mark as complete
                        setTimeout(() => {
                            scrollToBottom();
                            
                            // Ensure isComplete is set to true
                            setTypingMessages(prev => ({
                                ...prev,
                                [messageId]: {
                                    ...prev[messageId],
                                    isComplete: true
                                }
                            }));
                        }, 100);
                    }
                }
            };
            
            // Start revealing after a small initial delay (feels more natural)
            setTimeout(revealNextChunk, 100);
            
            return messageId; // Return ID for potential cleanup
        } catch (error) {
            // Enhanced error recovery
            console.error('Error in chunked reveal effect:', error);
            
            // Recovery: set the message as complete immediately
            try {
                setTypingMessages(prev => ({
                    ...prev,
                    [messageId]: { 
                        text: fullText,
                        visibleChars: fullText.length,
                        currentChunk: 1,
                        totalChunks: 1,
                        isComplete: true,
                        fadeIn: false, // Disable fade-in for error recovery
                        renderType: 'chunked-fallback'
                    }
                }));
            } catch (recoveryError) {
                console.error('Failed to recover from chunked reveal effect error:', recoveryError);
            }
            return null;
        }
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
        
        // Render welcome message with the device-appropriate approach
        renderMessage(welcomeMessageId, welcomeMessage);

        // Initialize connection message ref and state
        connectionMessageShownRef.current = false;
        setIsTransferComplete(false);
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
                    agent_credentials: agentCredentials || storedCredentials, // Use stored credentials as fallback
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

            // Add confirmation message with device-appropriate rendering
            const confirmMessageId = 'bot-booking-confirm-' + Date.now();
            const confirmMessage = data.message || (currentLanguage === 'en' ? 
                "Thank you for your booking change request. Our team will review it and respond to your email within 24 hours." :
                "Takk fyrir beiðnina um breytingu á bókun. Teymi okkar mun yfirfara hana og svara tölvupóstinum þínum innan 24 klukkustunda.");
            
            setMessages(prev => [...prev, {
                type: 'bot',
                content: confirmMessage,
                id: confirmMessageId
            }]);
            
            // Render confirmation message with the appropriate approach
            renderMessage(confirmMessageId, confirmMessage);

            // Update state
            setBookingRequestSent(true);
            setShowBookingForm(false);
        } catch (error) {
            console.error('Error submitting booking request:', error);
            setIsTyping(false);
            
            // Show error message with device-appropriate rendering
            const errorMessageId = 'bot-booking-error-' + Date.now();
            const errorMessage = currentLanguage === 'en' ? 
                "I'm sorry, we're having trouble submitting your booking change request. Please try again or call us at +354 527 6800." :
                "Því miður erum við að lenda í vandræðum með að senda bókunarbeiðnina þína. Vinsamlegast reyndu aftur eða hringdu í +354 527 6800.";
            
            setMessages(prev => [...prev, {
                type: 'bot',
                content: errorMessage,
                id: errorMessageId
            }]);
            
            // Render error message with the appropriate approach
            renderMessage(errorMessageId, errorMessage);
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
        
        // Render cancellation message with the appropriate approach
        renderMessage(cancelMessageId, cancelMessage);
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

    // Agent typing indicator with branded styling
    const AgentTypingIndicator = () => (
        <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: '16px',
            alignItems: 'flex-start',
            gap: '8px'
        }}>
            <div className="agent-avatar-container">
                <img 
                    src="/agent-avatar.png" 
                    alt="Agent"
                    style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        marginTop: '4px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.parentElement.classList.add('agent-avatar-fallback');
                    }}
                />
                <div className="agent-avatar-fallback-content">A</div>
            </div>
            <div style={{
                padding: '12px 16px',
                borderRadius: '16px',
                backgroundColor: 'rgba(112, 116, 78, 0.15)',
                display: 'flex',
                gap: '4px',
                alignItems: 'center',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(112, 116, 78, 0.2)'
            }}>
                <span style={{
                    height: '8px',
                    width: '8px',
                    backgroundColor: '#70744E',
                    borderRadius: '50%',
                    opacity: 0.6,
                    animation: 'sky-lagoon-chat-typing 1s infinite'
                }}/>
                <span style={{
                    height: '8px',
                    width: '8px',
                    backgroundColor: '#70744E',
                    borderRadius: '50%',
                    opacity: 0.6,
                    animation: 'sky-lagoon-chat-typing 1s infinite',
                    animationDelay: '0.2s'
                }}/>
                <span style={{
                    height: '8px',
                    width: '8px',
                    backgroundColor: '#70744E',
                    borderRadius: '50%',
                    opacity: 0.6,
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

    // MODIFIED: Enhanced send function that supports streaming
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
        
        // Generate a unique ID for this bot message
        const botMessageId = 'bot-msg-' + Date.now();
        currentStreamingMessageIdRef.current = botMessageId;
        
        // Clean up any existing stream connections
        closeStreamConnection();
    
        try {
            console.log('[STREAM] Sending message with streaming enabled');
            
            // First, create POST request using fetch API
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey
                },
                body: JSON.stringify({ 
                    message: messageText,
                    language: currentLanguage,
                    streaming: true, // Request streaming response
                    sessionId: sessionId,
                    chatId: chatId,
                    bot_token: botToken,
                    agent_credentials: agentCredentials || storedCredentials,
                    isAgentMode: chatMode === 'agent'
                })
            });
            
            // Check if response is using SSE format
            const contentType = response.headers.get('Content-Type');
            
            if (contentType && contentType.includes('text/event-stream')) {
                // Handle streaming response
                console.log('[STREAM] Server supports streaming, setting up EventSource');
                setIsStreaming(true);
                
                // Create EventSource connection for the same request
                const streamUrl = new URL(webhookUrl);
                
                // Add necessary query parameters
                streamUrl.searchParams.append('message', messageText);
                streamUrl.searchParams.append('language', currentLanguage);
                streamUrl.searchParams.append('streaming', 'true');
                streamUrl.searchParams.append('sessionId', sessionId);
                
                if (chatId) streamUrl.searchParams.append('chatId', chatId);
                if (botToken) streamUrl.searchParams.append('bot_token', botToken);
                if (agentCredentials) streamUrl.searchParams.append('agent_credentials', agentCredentials);
                if (chatMode === 'agent') streamUrl.searchParams.append('isAgentMode', 'true');
                
                // Create EventSource connection
                const eventSource = new EventSource(streamUrl.toString());
                eventSourceRef.current = eventSource;
                
                // Reset accumulated content for new streaming message
                setAccumulatedStreamContent('');
                
                // Handle connection opened
                eventSource.onopen = () => {
                    console.log('[STREAM] EventSource connection opened');
                };
                
                // Handle connected event
                eventSource.addEventListener('connected', (event) => {
                    console.log('[STREAM] Connected event received:', event.data);
                });
                
                // Handle chunks as they arrive
                eventSource.addEventListener('chunk', (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        console.log('[STREAM] Chunk received:', data.content?.length || 0);
                        
                        if (data.content) {
                            // Append to accumulated content
                            setAccumulatedStreamContent(prevContent => {
                                const newContent = prevContent + data.content;
                                
                                // Check if the message already exists
                                const existingMessage = messages.find(m => m.id === botMessageId);
                                
                                if (existingMessage) {
                                    // Update existing message
                                    setMessages(prev => 
                                        prev.map(m => m.id === botMessageId ? 
                                            { ...m, content: newContent } : m
                                        )
                                    );
                                } else {
                                    // Create a new message if it doesn't exist yet
                                    setMessages(prev => [...prev, {
                                        type: 'bot',
                                        content: newContent,
                                        id: botMessageId
                                    }]);
                                }
                                
                                // Ensure chunk reveal effect is showing the message
                                renderMessage(botMessageId, newContent);
                                
                                return newContent;
                            });
                        }
                    } catch (chunkError) {
                        console.error('[STREAM] Error processing chunk:', chunkError);
                    }
                });
                
                // Handle completion
                eventSource.addEventListener('complete', (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        console.log('[STREAM] Complete event received, final content length:', 
                            data.content?.length || 0);
                        
                        // Store PostgreSQL ID if provided
                        if (data.postgresqlMessageId) {
                            setMessagePostgresqlIds(prev => ({
                                ...prev,
                                [botMessageId]: data.postgresqlMessageId
                            }));
                        }
                        
                        // Ensure the final message is fully displayed
                        if (data.content) {
                            // Update with final content
                            setMessages(prev => 
                                prev.map(m => m.id === botMessageId ? 
                                    { ...m, content: data.content } : m
                                )
                            );
                            
                            // Update the final render
                            setTypingMessages(prev => ({
                                ...prev,
                                [botMessageId]: {
                                    ...prev[botMessageId],
                                    text: data.content,
                                    visibleChars: data.content.length,
                                    isComplete: true
                                }
                            }));
                        }
                        
                        // Clean up
                        closeStreamConnection();
                        setIsTyping(false);
                        setIsStreaming(false);
                        
                        // Final scroll to bottom
                        setTimeout(scrollToBottom, 100);
                    } catch (completeError) {
                        console.error('[STREAM] Error processing complete event:', completeError);
                        
                        // Still clean up even if there's an error
                        closeStreamConnection();
                        setIsTyping(false);
                        setIsStreaming(false);
                    }
                });
                
                // Handle errors
                eventSource.addEventListener('error', (event) => {
                    console.error('[STREAM] EventSource error:', event);
                    
                    // Show error message only if we haven't received any content yet
                    if (!accumulatedStreamContent) {
                        const errorMessage = currentLanguage === 'en' ? 
                            "I apologize, but I'm having trouble connecting right now. Please try again shortly." :
                            "Ég biðst afsökunar, en ég er að lenda í vandræðum með tengingu núna. Vinsamlegast reyndu aftur eftir smá stund.";
                        
                        setMessages(prev => [...prev, {
                            type: 'bot',
                            content: errorMessage,
                            id: botMessageId
                        }]);
                        
                        renderMessage(botMessageId, errorMessage);
                    }
                    
                    // Clean up
                    closeStreamConnection();
                    setIsTyping(false);
                    setIsStreaming(false);
                });
                
                // Generic message handler as fallback for browsers with limited SSE support
                eventSource.onmessage = (event) => {
                    try {
                        console.log('[STREAM] Generic message received:', event.data);
                        
                        if (!event.data) return;
                        
                        // Try to parse the data
                        const data = JSON.parse(event.data);
                        
                        // Process the content similar to chunk handler
                        if (data.content) {
                            setAccumulatedStreamContent(prevContent => {
                                const newContent = prevContent + data.content;
                                
                                // Update message in UI
                                const existingMessage = messages.find(m => m.id === botMessageId);
                                
                                if (existingMessage) {
                                    setMessages(prev => 
                                        prev.map(m => m.id === botMessageId ? 
                                            { ...m, content: newContent } : m
                                        )
                                    );
                                } else {
                                    setMessages(prev => [...prev, {
                                        type: 'bot',
                                        content: newContent,
                                        id: botMessageId
                                    }]);
                                }
                                
                                // Apply chunked reveal effect
                                renderMessage(botMessageId, newContent);
                                
                                return newContent;
                            });
                        }
                        
                        // If message indicates completion, clean up
                        if (data.done) {
                            closeStreamConnection();
                            setIsTyping(false);
                            setIsStreaming(false);
                        }
                    } catch (messageError) {
                        console.error('[STREAM] Error processing generic message:', messageError);
                    }
                };
                
            } else {
                // Server doesn't support streaming, fall back to regular handling
                console.log('[STREAM] Server returned regular response, using fallback');
                
                try {
                    // Parse the regular JSON response
                    const data = await response.json();
                    setIsTyping(false);
                    
                    // Handle special cases (booking form, transfers, etc.)
                    if (data.showBookingChangeForm) {
                        // Handle booking form display - existing logic
                        if (data.chatId) setChatId(data.chatId);
                        if (data.bot_token) setBotToken(data.bot_token);
                        if (data.agent_credentials) {
                            setAgentCredentials(data.agent_credentials);
                            setStoredCredentials(data.agent_credentials);
                        }
                        
                        // Add the bot message
                        setMessages(prev => [...prev, {
                            type: 'bot',
                            content: data.message,
                            id: botMessageId
                        }]);
                        
                        // Render with chunked reveal effect
                        renderMessage(botMessageId, data.message);
                        
                        // Show the booking form
                        setShowBookingForm(true);
                        return;
                    }
                    
                    if (data.transferred && data.chatId) {
                        // Handle agent transfer - existing logic
                        console.log('Transfer initiated with chat ID:', data.chatId);
                        
                        // Save the bot token if provided
                        if (data.bot_token) {
                            console.log('Bot token received');
                            setBotToken(data.bot_token);
                        }
                        
                        // Save agent credentials if provided
                        if (data.agent_credentials) {
                            console.log('Agent credentials received and stored');
                            setAgentCredentials(data.agent_credentials);
                            setStoredCredentials(data.agent_credentials); // Store credentials for reuse
                        }
                
                        // Set chat state to agent mode
                        setChatMode('agent');
                        setChatId(data.chatId);
                        
                        // Add the transfer messages to the chat with device-appropriate rendering
                        const transferMsgId = 'bot-transfer-' + Date.now();
                        
                        // First message
                        setMessages(prev => [...prev, {
                            type: 'bot',
                            content: data.message,
                            id: botMessageId
                        }]);
                        
                        // Render first message with the appropriate approach
                        renderMessage(botMessageId, data.message);
                        
                        // UPDATED: Second message - check if already shown using ref and state
                        setTimeout(() => {
                            console.log('[TRANSFER] Checking connection message state:', isTransferComplete, 'ref:', connectionMessageShownRef.current);
                            
                            // Only show this message if we haven't completed a transfer yet
                            if (!isTransferComplete && !connectionMessageShownRef.current) {
                                console.log('[TRANSFER] First time showing connection message, marking transfer as complete');
                                const transferMessage = currentLanguage === 'en' ? 
                                    CONNECTION_MESSAGE_EN : CONNECTION_MESSAGE_IS;
                                
                                setMessages(prev => [...prev, {
                                    type: 'bot',
                                    content: transferMessage,
                                    id: transferMsgId
                                }]);
                                
                                // Render second message with the appropriate approach
                                renderMessage(transferMsgId, transferMessage);
                                
                                // Mark transfer as complete in both ref and state
                                connectionMessageShownRef.current = true;
                                setIsTransferComplete(true);
                            } else {
                                console.log('[TRANSFER] Transfer already completed, skipping connection message');
                            }
                        }, 1000); // Delay before showing the second message
                        
                        return;
                    }
                    
                    // Update credentials if provided
                    if (data.bot_token) setBotToken(data.bot_token);
                    if (data.agent_credentials) {
                        setAgentCredentials(data.agent_credentials);
                        setStoredCredentials(data.agent_credentials);
                    }
                    
                    // If message was suppressed (in agent mode), don't show response
                    if (data.suppressMessage) return;
                    
                    // Normal bot response handling
                    setMessages(prev => [...prev, {
                        type: 'bot',
                        content: data.message,
                        id: botMessageId
                    }]);
                    
                    // Render with chunked reveal effect
                    renderMessage(botMessageId, data.message);
                    
                    // Store PostgreSQL ID if provided
                    if (data.postgresqlMessageId) {
                        setMessagePostgresqlIds(prev => ({
                            ...prev,
                            [botMessageId]: data.postgresqlMessageId
                        }));
                    }
                } catch (parseError) {
                    console.error('[STREAM] Error parsing response:', parseError);
                    
                    // Show error message
                    const errorMessage = currentLanguage === 'en' ? 
                        "I apologize, but I'm having trouble connecting right now. Please try again shortly." :
                        "Ég biðst afsökunar, en ég er að lenda í vandræðum með tengingu núna. Vinsamlegast reyndu aftur eftir smá stund.";
                    
                    setMessages(prev => [...prev, {
                        type: 'bot',
                        content: errorMessage,
                        id: botMessageId
                    }]);
                    
                    renderMessage(botMessageId, errorMessage);
                    setIsTyping(false);
                }
            }
        } catch (error) {
            console.error('[STREAM] Request error:', error);
            
            // Clean up any existing connections
            closeStreamConnection();
            setIsTyping(false);
            
            // Show error message
            const errorMessage = currentLanguage === 'en' ? 
                "I apologize, but I'm having trouble connecting right now. Please try again shortly." :
                "Ég biðst afsökunar, en ég er að lenda í vandræðum með tengingu núna. Vinsamlegast reyndu aftur eftir smá stund.";
            
            setMessages(prev => [...prev, {
                type: 'bot',
                content: errorMessage,
                id: botMessageId
            }]);
            
            renderMessage(botMessageId, errorMessage);
        }
    };

    return (
        <ErrorBoundary>
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
                            // NEW: Add MessageErrorBoundary around each message
                            <MessageErrorBoundary key={`error-boundary-${index}`}>
                                <div 
                                    key={index} 
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: msg.type === 'user' ? 'flex-end' : 'flex-start',
                                        marginBottom: msg.type === 'bot' || msg.type === 'agent' ? '16px' : '12px',
                                        animation: newMessageIds.includes(msg.id) ? 'sky-lagoon-chat-new-message 0.5s ease-out' : 'none'
                                    }}
                                >
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
                                        {msg.type === 'agent' && (
                                            <div className="agent-avatar-container" style={{
                                                width: '30px',
                                                height: '30px',
                                                borderRadius: '50%',
                                                marginTop: '4px',
                                                position: 'relative',
                                                backgroundColor: '#70744E',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                color: 'white',
                                                fontWeight: 'bold',
                                                fontSize: '14px',
                                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                                overflow: 'hidden'
                                            }}>
                                                <img 
                                                    src="/agent-avatar.png" 
                                                    alt="Agent"
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                    onError={(e) => {
                                                        // Fallback if avatar doesn't load
                                                        e.target.onerror = null;
                                                        e.target.style.display = 'none';
                                                        // First letter of agent name (or "A" if no name)
                                                        e.target.parentElement.innerText = msg.sender ? msg.sender[0].toUpperCase() : 'A';
                                                    }}
                                                />
                                            </div>
                                        )}
                                        <div style={{
                                            maxWidth: '70%',
                                            padding: '12px 16px',
                                            borderRadius: '16px',
                                            backgroundColor: msg.type === 'user' ? '#70744E' : 
                                                        msg.type === 'agent' ? 'rgba(112, 116, 78, 0.15)' : '#f0f0f0',
                                            color: msg.type === 'user' ? 'white' : '#333333',
                                            fontSize: '14px',
                                            lineHeight: '1.5',
                                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                            border: msg.type === 'user' ? 
                                                '1px solid rgba(255, 255, 255, 0.1)' : 
                                                msg.type === 'agent' ?
                                                '1px solid rgba(112, 116, 78, 0.2)' :
                                                '1px solid rgba(0, 0, 0, 0.05)',
                                            position: 'relative',
                                            overflowWrap: 'break-word',
                                            wordWrap: 'break-word',
                                            wordBreak: 'break-word'
                                        }}>
                                            {/* Display agent name if it's an agent message */}
                                            {msg.type === 'agent' && msg.sender && (
                                                <div style={{
                                                    fontSize: '13px',
                                                    fontWeight: '600',
                                                    marginBottom: '6px',
                                                    color: '#70744E',
                                                    letterSpacing: '0.01em'
                                                }}>
                                                    {msg.sender}
                                                </div>
                                            )}
                                            
                                            {msg.type === 'bot' || msg.type === 'agent' ? (
                                                // MODIFIED: Apply different rendering approaches based on device
                                                typingMessages[msg.id] ? (
                                                    <div 
                                                        className="sky-lagoon-message-content"
                                                        style={{ 
                                                            position: 'relative',
                                                            opacity: typingMessages[msg.id].fadeIn && !typingMessages[msg.id].isComplete ? 
                                                                  '0.99' : '1', // Very slight opacity to trigger animation
                                                            transition: `opacity ${FADE_IN_DURATION}ms ease-in-out`
                                                        }}
                                                    >
                                                        {/* Invisible full text to properly size the container */}
                                                        <div style={{ 
                                                            visibility: 'hidden', 
                                                            position: 'absolute', 
                                                            top: 0, 
                                                            left: 0,
                                                            width: '100%',
                                                            height: 0,
                                                            overflow: 'hidden' 
                                                        }}>
                                                            <MessageFormatter message={typingMessages[msg.id].text} />
                                                        </div>
                                                        
                                                        {/* Visible partial/full text with fade-in effect */}
                                                        <div className={`sky-lagoon-message-reveal ${typingMessages[msg.id].fadeIn ? 'sky-lagoon-fade-in' : ''}`}>
                                                            <MessageFormatter 
                                                                message={typingMessages[msg.id].text.substring(0, typingMessages[msg.id].visibleChars)} 
                                                            />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <MessageFormatter message={msg.content} />
                                                )
                                            ) : (
                                                // User messages always show instantly
                                                msg.content
                                            )}
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
                                            gap: '8px'
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
                                                            opacity: 0.8,
                                                            fontWeight: windowWidth <= 768 ? '600' : 'normal',
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
                                                        <span style={{ fontWeight: windowWidth <= 768 ? '600' : 'normal' }}>
                                                            {currentLanguage === 'en' ? 'Helpful' : 'Hjálplegt'}
                                                        </span>
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
                                                            opacity: 0.8,
                                                            fontWeight: windowWidth <= 768 ? '600' : 'normal',
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
                                                        <span style={{ fontWeight: windowWidth <= 768 ? '600' : 'normal' }}>
                                                            {currentLanguage === 'en' ? 'Not helpful' : 'Ekki hjálplegt'}
                                                        </span>
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </MessageErrorBoundary>
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

                        {isTyping && !isStreaming && <TypingIndicator />}
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

                {/* Optional streaming indicator */}
                {isStreaming && !isMinimized && (
                    <div style={{
                        position: 'absolute', 
                        bottom: '60px',
                        right: '16px',
                        backgroundColor: 'rgba(112, 116, 78, 0.2)',
                        borderRadius: '8px',
                        padding: '4px 8px',
                        fontSize: '10px',
                        color: '#70744E'
                    }}>
                        {currentLanguage === 'en' ? 'Receiving...' : 'Móttöku...'}
                    </div>
                )}

                {/* Add keyframes for typing animation, new message animation, and fade-in */}
                <style jsx>{`
                    .message-bubble {
                        max-width: 70%;
                        padding: 12px 16px;
                        border-radius: 16px;
                        color: #333333;
                        font-size: 14px;
                        line-height: 1.5;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                        border: 1px solid rgba(0, 0, 0, 0.05);
                        position: relative;
                        overflow-wrap: break-word;
                        word-wrap: break-word;
                        word-break: break-word;
                    }
                    
                    .agent-avatar-container {
                        position: relative;
                    }
                    
                    .agent-avatar-container.agent-avatar-fallback:before {
                        content: attr(data-initial);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 100%;
                        height: 100%;
                        background-color: #70744E;
                        color: white;
                        font-size: 14px;
                        font-weight: bold;
                    }
                    
                    .agent-avatar-fallback-content {
                        display: none;
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        align-items: center;
                        justify-content: center;
                    }
                    
                    .agent-avatar-container.agent-avatar-fallback .agent-avatar-fallback-content {
                        display: flex;
                    }
                    
                    /* MODIFIED: Tweaked animations for new approach */
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
                    
                    @keyframes sky-lagoon-chat-new-message {
                        0% {
                            opacity: 0;
                            transform: translateY(10px);
                        }
                        100% {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    
                    @keyframes sky-lagoon-chat-fade-in {
                        0% {
                            opacity: 0;
                        }
                        100% {
                            opacity: 1;
                        }
                    }
                    
                    .sky-lagoon-message-reveal {
                        opacity: 1;
                        transition: opacity ${FADE_IN_DURATION}ms ease-in-out;
                    }
                    
                    .sky-lagoon-fade-in {
                        animation: sky-lagoon-chat-fade-in ${FADE_IN_DURATION}ms ease-in-out;
                    }
                    
                    @media (max-width: 768px) {
                        .sky-lagoon-chat-widget input, 
                        .sky-lagoon-chat-widget button {
                            font-size: 16px !important; /* Prevent zoom on mobile */
                        }
                    }
                `}</style>
            </div>
        </ErrorBoundary>
    );
};

export default ChatWidget;