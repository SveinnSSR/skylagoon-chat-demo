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
  document.getElementById('widget-container').appendChild(container);
  
  // Initially minimized
  let isMinimized = true;
  
  // Chat state
  let messages = [];
  let isTyping = false;
  let inputValue = '';
  
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
    // Either remove the shadow entirely:
    button.style.boxShadow = 'none';
    // OR use a more subtle shadow that won't get cut off:
    // button.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.15)';
    
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
    
    // Header
    const header = document.createElement('div');
    header.style.backgroundColor = 'rgba(112, 116, 78, 1)';
    header.style.padding = '20px 16px';
    header.style.display = 'flex';
    header.style.flexDirection = 'column';
    header.style.alignItems = 'center';
    header.style.cursor = 'pointer';
    
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
    
    // Input area
    const inputArea = document.createElement('div');
    inputArea.style.padding = '12px 16px';
    inputArea.style.backgroundColor = 'white';
    inputArea.style.borderTop = '1px solid #eee';
    inputArea.style.display = 'flex';
    inputArea.style.gap = '8px';
    
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
      const msgEl = document.createElement('div');
      msgEl.style.display = 'flex';
      msgEl.style.justifyContent = msg.type === 'user' ? 'flex-end' : 'flex-start';
      msgEl.style.alignItems = 'flex-start';
      msgEl.style.width = '100%';
      msgEl.style.gap = '8px';
      msgEl.style.marginBottom = '16px';
      
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
      bubble.textContent = msg.content;
      bubble.style.fontFamily = "'system-ui', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      
      msgEl.appendChild(bubble);
      messagesArea.appendChild(msgEl);
    });
    
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
        messages.push({
          type: 'bot',
          content: data.message || "I apologize, but I'm having trouble connecting right now.",
          id: 'bot-msg-' + Date.now()
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
