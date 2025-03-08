// This is a simplified version of the ChatWidget that runs in the iframe
(function() {
  // Configuration
  const config = {
    apiUrl: 'https://sky-lagoon-chat-2024.vercel.app/chat',
    apiKey: 'sky-lagoon-secret-2024',
    language: window.WIDGET_LANGUAGE || 'en'
  };
  
  // Create the widget container
  const container = document.createElement('div');
  container.id = 'chat-widget-root';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.border = 'none';
  container.style.outline = 'none';
  document.getElementById('widget-container').appendChild(container);
  
  // Initially minimized
  let isMinimized = true;
  
  // Chat state
  let messages = [];
  let isTyping = false;
  let inputValue = '';
  let messageFeedback = {}; // Add feedback state
  
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
    
    // Skip feedback for error messages
    if (message.content.includes("I apologize, but I'm having trouble connecting") ||
        message.content.includes("Ég biðst afsökunar, en ég er að lenda í vandræðum")) {
      return false;
    }
    
    // Skip feedback for very short responses (less than 70 characters)
    if (message.content.length < 70) {
      return false;
    }
    
    // Show feedback for all substantive responses
    return true;
  };
  
  // Function to handle message feedback
  const handleMessageFeedback = async (messageId, isPositive) => {
    // Prevent multiple submissions for the same message
    if (messageFeedback[messageId]) return;
    
    // Update local state first for immediate UI feedback
    messageFeedback[messageId] = { isPositive, submitted: true };
    
    try {
      // Find the message content
      const message = messages.find(msg => msg.id === messageId);
      const messageContent = message ? message.content : '';
      
      // Send to the feedback endpoint
      const feedbackUrl = config.apiUrl.replace('/chat', '') + '/feedback';
      
      await fetch(feedbackUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey
        },
        body: JSON.stringify({
          messageId,
          isPositive,
          messageContent,
          timestamp: new Date().toISOString(),
          language: config.language
        })
      });
      
      // Re-render to show the thank you message
      createExpandedView();
      
    } catch (error) {
      console.error('Error sending feedback:', error);
    }
  };
  
  // Create the minimized button view
  function createMinimizedView() {
    container.innerHTML = '';
    
    const button = document.createElement('div');
    button.style.width = '100%';
    button.style.height = '100%';
    button.style.backgroundColor = 'rgba(112, 116, 78, 0.95)';
    button.style.borderRadius = '50%';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.style.cursor = 'pointer';
    button.style.boxShadow = 'none';
    button.style.border = 'none';
    button.style.outline = 'none';
    
    const img = document.createElement('img');
    img.src = '/solrun.png';
    img.alt = 'Sólrún';
    img.style.width = '50px';
    img.style.height = '50px';
    img.style.borderRadius = '50%';
    
    button.appendChild(img);
    container.appendChild(button);
    
    button.onclick = function() {
      isMinimized = false;
      createExpandedView();
      window.sendResizeMessage(false);
    };
  }
  
  // Create the expanded chat view
  function createExpandedView() {
    container.innerHTML = '';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.height = '100%';
    container.style.width = '100%';
    container.style.borderRadius = '16px';
    container.style.overflow = 'hidden';
    container.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
    container.style.border = 'none';
    container.style.outline = 'none';
    
    // Header
    const header = document.createElement('div');
    header.style.backgroundColor = 'rgba(112, 116, 78, 1)';
    header.style.padding = '20px 16px';
    header.style.display = 'flex';
    header.style.flexDirection = 'column';
    header.style.alignItems = 'center';
    header.style.cursor = 'pointer';
    header.style.border = 'none';
    
    const headerImg = document.createElement('img');
    headerImg.src = '/solrun.png';
    headerImg.alt = 'Sólrún';
    headerImg.style.width = '60px';
    headerImg.style.height = '60px';
    headerImg.style.borderRadius = '50%';
    
    const headerTitle = document.createElement('div');
    headerTitle.style.color = 'white';
    headerTitle.style.marginTop = '4px';
    headerTitle.style.fontSize = '16px';
    headerTitle.style.fontWeight = '500';
    headerTitle.textContent = 'Sólrún';
    headerTitle.style.fontFamily = "'Caudex', serif";
    
    const headerSubtitle = document.createElement('div');
    headerSubtitle.style.color = '#e0e0e0';
    headerSubtitle.style.fontSize = '14px';
    headerSubtitle.textContent = 'Sky Lagoon';
    headerSubtitle.style.fontFamily = "'system-ui', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    
    header.appendChild(headerImg);
    header.appendChild(headerTitle);
    header.appendChild(headerSubtitle);
    
    // Minimize button
    const minimizeBtn = document.createElement('span');
    minimizeBtn.style.position = 'absolute';
    minimizeBtn.style.right = '16px';
    minimizeBtn.style.top = '16px';
    minimizeBtn.style.color = 'white';
    minimizeBtn.style.fontSize = '12px';
    minimizeBtn.textContent = '▽';
    minimizeBtn.style.cursor = 'pointer';
    
    minimizeBtn.onclick = function(e) {
      e.stopPropagation();
      isMinimized = true;
      createMinimizedView();
      window.sendResizeMessage(true);
    };
    
    header.appendChild(minimizeBtn);
    header.onclick = minimizeBtn.onclick;
    
    // Messages area
    const messagesArea = document.createElement('div');
    messagesArea.style.flex = '1';
    messagesArea.style.backgroundColor = 'white';
    messagesArea.style.overflowY = 'auto';
    messagesArea.style.padding = '16px';
    messagesArea.style.height = '400px';
    messagesArea.style.fontFamily = "'system-ui', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    messagesArea.style.border = 'none';
    messagesArea.style.outline = 'none';
    
    // Input area
    const inputArea = document.createElement('div');
    inputArea.style.padding = '12px 16px';
    inputArea.style.backgroundColor = 'white';
    inputArea.style.borderTop = '1px solid #eee';
    inputArea.style.display = 'flex';
    inputArea.style.gap = '8px';
    inputArea.style.border = 'none';
    inputArea.style.outline = 'none';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = config.language === 'en' ? "Type your message..." : "Skrifaðu skilaboð...";
    input.style.flex = '1';
    input.style.padding = '8px 16px';
    input.style.borderRadius = '20px';
    input.style.border = '1px solid #ddd';
    input.style.outline = 'none';
    input.style.fontSize = '14px';
    input.style.fontFamily = "'system-ui', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    
    const sendBtn = document.createElement('button');
    sendBtn.textContent = config.language === 'en' ? 'Send' : 'Senda';
    sendBtn.style.backgroundColor = '#70744E';
    sendBtn.style.color = 'white';
    sendBtn.style.border = 'none';
    sendBtn.style.padding = '8px 20px';
    sendBtn.style.borderRadius = '20px';
    sendBtn.style.cursor = 'pointer';
    sendBtn.style.fontSize = '14px';
    sendBtn.style.fontWeight = '500';
    sendBtn.style.fontFamily = "'system-ui', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    
    inputArea.appendChild(input);
    inputArea.appendChild(sendBtn);
    
    container.appendChild(header);
    container.appendChild(messagesArea);
    container.appendChild(inputArea);
    
    // Add a welcome message if there are no messages
    if (messages.length === 0) {
      const welcomeMsg = config.language === 'en' 
        ? "Hello! I'm Sólrún your AI chatbot. I am new here and still learning but, will happily do my best to assist you. What can I do for you today?"
        : "Hæ! Ég heiti Sólrún og er AI spjallmenni. Ég er ný og enn að læra en mun aðstoða þig með glöðu geði. Hvað get ég gert fyrir þig í dag?";
      
      messages.push({
        type: 'bot',
        content: welcomeMsg,
        id: 'welcome-msg-' + Date.now()
      });
    }
    
    // Render messages
    messages.forEach(msg => {
      const messageContainer = document.createElement('div');
      messageContainer.style.display = 'flex';
      messageContainer.style.flexDirection = 'column';
      messageContainer.style.alignItems = msg.type === 'user' ? 'flex-end' : 'flex-start';
      messageContainer.style.marginBottom = msg.type === 'bot' ? '16px' : '12px';
      messagesArea.appendChild(messageContainer);
      
      const msgEl = document.createElement('div');
      msgEl.style.display = 'flex';
      msgEl.style.justifyContent = msg.type === 'user' ? 'flex-end' : 'flex-start';
      msgEl.style.alignItems = 'flex-start';
      msgEl.style.width = '100%';
      msgEl.style.gap = '8px';
      messageContainer.appendChild(msgEl);
      
      if (msg.type === 'bot') {
        const avatar = document.createElement('img');
        avatar.src = '/solrun.png';
        avatar.alt = 'Sólrún';
        avatar.style.width = '30px';
        avatar.style.height = '30px';
        avatar.style.borderRadius = '50%';
        avatar.style.marginTop = '4px';
        msgEl.appendChild(avatar);
      }
      
      const bubble = document.createElement('div');
      bubble.style.maxWidth = '70%';
      bubble.style.padding = '12px 16px';
      bubble.style.borderRadius = '16px';
      bubble.style.backgroundColor = msg.type === 'user' ? '#70744E' : '#f0f0f0';
      bubble.style.color = msg.type === 'user' ? 'white' : '#333333';
      bubble.style.fontSize = '14px';
      bubble.style.lineHeight = '1.5';
      bubble.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
      bubble.style.border = 'none';
      bubble.textContent = msg.content;
      bubble.style.fontFamily = "'system-ui', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      
      msgEl.appendChild(bubble);
      
      // Add feedback buttons for bot messages that pass the filter
      if (msg.type === 'bot' && shouldShowFeedback(msg)) {
        const feedbackContainer = document.createElement('div');
        feedbackContainer.style.display = 'flex';
        feedbackContainer.style.alignItems = 'center';
        feedbackContainer.style.marginTop = '4px';
        feedbackContainer.style.marginLeft = '38px';
        feedbackContainer.style.gap = '12px';
        messageContainer.appendChild(feedbackContainer);
        
        if (messageFeedback[msg.id]) {
          // Show thank you message if feedback was given
          const thankYou = document.createElement('div');
          thankYou.style.fontSize = '12px';
          thankYou.style.color = '#70744E';
          thankYou.style.fontStyle = 'italic';
          thankYou.style.opacity = '0.8';
          thankYou.style.padding = '4px 8px';
          thankYou.style.borderRadius = '12px';
          thankYou.style.backgroundColor = 'rgba(112, 116, 78, 0.08)';
          thankYou.textContent = config.language === 'en' ? 'Thank you for your feedback!' : 'Takk fyrir endurgjöfina!';
          feedbackContainer.appendChild(thankYou);
        } else {
          // Show feedback buttons if no feedback given yet
          // Helpful button
          const helpfulBtn = document.createElement('button');
          helpfulBtn.style.background = 'none';
          helpfulBtn.style.border = 'none';
          helpfulBtn.style.cursor = 'pointer';
          helpfulBtn.style.color = '#70744E';
          helpfulBtn.style.display = 'flex';
          helpfulBtn.style.alignItems = 'center';
          helpfulBtn.style.gap = '4px';
          helpfulBtn.style.fontSize = '12px';
          helpfulBtn.style.padding = '4px 8px';
          helpfulBtn.style.borderRadius = '12px';
          helpfulBtn.style.transition = 'all 0.2s ease';
          helpfulBtn.style.opacity = '0.8';
          helpfulBtn.setAttribute('aria-label', config.language === 'en' ? 'Helpful' : 'Hjálplegt');
          
          // Thumbs up icon (simplified SVG as text)
          const thumbsUpIcon = document.createElement('span');
          thumbsUpIcon.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#70744E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>`;
          
          const helpfulText = document.createElement('span');
          helpfulText.textContent = config.language === 'en' ? 'Helpful' : 'Hjálplegt';
          
          helpfulBtn.appendChild(thumbsUpIcon);
          helpfulBtn.appendChild(helpfulText);
          helpfulBtn.addEventListener('mouseover', () => {
            helpfulBtn.style.backgroundColor = 'rgba(112, 116, 78, 0.1)';
            helpfulBtn.style.opacity = '1';
          });
          helpfulBtn.addEventListener('mouseout', () => {
            helpfulBtn.style.backgroundColor = 'transparent';
            helpfulBtn.style.opacity = '0.8';
          });
          helpfulBtn.addEventListener('click', () => handleMessageFeedback(msg.id, true));
          
          // Not helpful button
          const notHelpfulBtn = document.createElement('button');
          notHelpfulBtn.style.background = 'none';
          notHelpfulBtn.style.border = 'none';
          notHelpfulBtn.style.cursor = 'pointer';
          notHelpfulBtn.style.color = '#70744E';
          notHelpfulBtn.style.display = 'flex';
          notHelpfulBtn.style.alignItems = 'center';
          notHelpfulBtn.style.gap = '4px';
          notHelpfulBtn.style.fontSize = '12px';
          notHelpfulBtn.style.padding = '4px 8px';
          notHelpfulBtn.style.borderRadius = '12px';
          notHelpfulBtn.style.transition = 'all 0.2s ease';
          notHelpfulBtn.style.opacity = '0.8';
          notHelpfulBtn.setAttribute('aria-label', config.language === 'en' ? 'Not helpful' : 'Ekki hjálplegt');
          
          // Thumbs down icon (simplified SVG as text)
          const thumbsDownIcon = document.createElement('span');
          thumbsDownIcon.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 2H20C20.5304 2 21.0391 2.21071 21.4142 2.58579C21.7893 2.96086 22 3.46957 22 4V11C22 11.5304 21.7893 12.0391 21.4142 12.4142C21.0391 12.7893 20.5304 13 20 13H17M10 15V19C10 19.7956 10.3161 20.5587 10.8787 21.1213C11.4413 21.6839 12.2044 22 13 22L17 13V2H5.72C5.23964 1.99453 4.77175 2.16359 4.40125 2.47599C4.03075 2.78839 3.78958 3.22309 3.72 3.7L2.34 12.7C2.29651 12.9866 2.31583 13.2793 2.39666 13.5577C2.4775 13.8362 2.61788 14.0937 2.80812 14.3125C2.99836 14.5313 3.23395 14.7061 3.49843 14.8248C3.76291 14.9435 4.05009 15.0033 4.34 15H10Z" stroke="#70744E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>`;
          
          const notHelpfulText = document.createElement('span');
          notHelpfulText.textContent = config.language === 'en' ? 'Not helpful' : 'Ekki hjálplegt';
          
          notHelpfulBtn.appendChild(thumbsDownIcon);
          notHelpfulBtn.appendChild(notHelpfulText);
          notHelpfulBtn.addEventListener('mouseover', () => {
            notHelpfulBtn.style.backgroundColor = 'rgba(112, 116, 78, 0.1)';
            notHelpfulBtn.style.opacity = '1';
          });
          notHelpfulBtn.addEventListener('mouseout', () => {
            notHelpfulBtn.style.backgroundColor = 'transparent';
            notHelpfulBtn.style.opacity = '0.8';
          });
          notHelpfulBtn.addEventListener('click', () => handleMessageFeedback(msg.id, false));
          
          feedbackContainer.appendChild(helpfulBtn);
          feedbackContainer.appendChild(notHelpfulBtn);
        }
      }
    });
    
    // Add typing indicator if needed
    if (isTyping) {
      const typingIndicator = document.createElement('div');
      typingIndicator.style.display = 'flex';
      typingIndicator.style.justifyContent = 'flex-start';
      typingIndicator.style.marginBottom = '16px';
      typingIndicator.style.alignItems = 'flex-start';
      typingIndicator.style.gap = '8px';
      
      const avatar = document.createElement('img');
      avatar.src = '/solrun.png';
      avatar.alt = 'Sólrún';
      avatar.style.width = '30px';
      avatar.style.height = '30px';
      avatar.style.borderRadius = '50%';
      avatar.style.marginTop = '4px';
      avatar.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
      
      const typingBubble = document.createElement('div');
      typingBubble.style.padding = '12px 16px';
      typingBubble.style.borderRadius = '16px';
      typingBubble.style.backgroundColor = '#f0f0f0';
      typingBubble.style.display = 'flex';
      typingBubble.style.gap = '4px';
      typingBubble.style.alignItems = 'center';
      typingBubble.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
      typingBubble.style.border = 'none';
      
      // Create the three dots
      for (let i = 0; i < 3; i++) {
        const dot = document.createElement('span');
        dot.style.height = '8px';
        dot.style.width = '8px';
        dot.style.backgroundColor = '#93918f';
        dot.style.borderRadius = '50%';
        dot.style.opacity = '0.4';
        dot.style.animation = 'typing 1s infinite';
        if (i === 1) dot.style.animationDelay = '0.2s';
        if (i === 2) dot.style.animationDelay = '0.4s';
        typingBubble.appendChild(dot);
      }
      
      typingIndicator.appendChild(avatar);
      typingIndicator.appendChild(typingBubble);
      messagesArea.appendChild(typingIndicator);
    }
    
    // Add animation style element for typing indicator
    if (!document.getElementById('typing-animation-style')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'typing-animation-style';
      styleEl.textContent = `
        @keyframes typing {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }
      `;
      document.head.appendChild(styleEl);
    }
    
    // Send message function
    const sendMessage = async () => {
      const text = input.value.trim();
      if (!text || isTyping) return;
      
      input.value = '';
      
      // Add user message to chat
      messages.push({
        type: 'user',
        content: text,
        id: 'user-msg-' + Date.now()
      });
      
      // Show typing indicator
      isTyping = true;
      
      // Re-render messages
      createExpandedView();
      
      try {
        // Call the API
        const response = await fetch(config.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': config.apiKey
          },
          body: JSON.stringify({ 
            message: text,
            language: config.language
          })
        });
        
        const data = await response.json();
        isTyping = false;
        
        // Add bot response
        const botMessageId = 'bot-msg-' + Date.now();
        messages.push({
          type: 'bot',
          content: data.message || "I apologize, but I'm having trouble connecting right now.",
          id: botMessageId
        });
        
        // Re-render messages
        createExpandedView();
        
      } catch (error) {
        console.error('Error:', error);
        isTyping = false;
        
        // Add error message
        messages.push({
          type: 'bot',
          content: config.language === 'en' 
            ? "I apologize, but I'm having trouble connecting right now. Please try again shortly."
            : "Ég biðst afsökunar, en ég er að lenda í vandræðum með tengingu núna. Vinsamlegast reyndu aftur eftir smá stund.",
          id: 'bot-error-' + Date.now()
        });
        
        // Re-render messages
        createExpandedView();
      }
    };
    
    // Set up event listeners
    sendBtn.onclick = sendMessage;
    input.onkeypress = (e) => {
      if (e.key === 'Enter') sendMessage();
    };
    
    // Focus input
    input.focus();
  }
  
  // Initial render
  createMinimizedView();
})();
