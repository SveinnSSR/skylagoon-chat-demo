(function() {
  // FAILSAFE: Set to true to disable the widget completely
  const WIDGET_DISABLED = false;
  
  // If the widget is disabled, exit immediately
  if (WIDGET_DISABLED) {
    console.log('Sky Lagoon Chat Widget is currently disabled');
    return;
  }
  
  // Create container element
  const container = document.createElement('div');
  container.id = 'sky-lagoon-chat-root';
  container.style.position = 'fixed';
  container.style.bottom = '20px';
  container.style.right = '20px';
  container.style.zIndex = '999999';
  document.body.appendChild(container);
  
  // Create speech bubble for preview text (initially shown)
  const speechBubble = document.createElement('div');
  speechBubble.id = 'sky-lagoon-chat-preview';
  
  // Position the speech bubble - using a function that will be called after widget is loaded
  const positionSpeechBubble = () => {
    // Get the position of the chat widget icon (once it's loaded)
    const chatIconElement = document.querySelector('#sky-lagoon-chat-root > div');
    
    if (chatIconElement) {
      // Get the bounding rect of the chat icon
      const rect = chatIconElement.getBoundingClientRect();
      
      // Set speech bubble position to be above the icon
      speechBubble.style.position = 'fixed';
      speechBubble.style.bottom = (window.innerHeight - rect.top + 20) + 'px';
      speechBubble.style.right = '20px';
    } else {
      // Fallback positioning if we can't find the chat icon
      speechBubble.style.position = 'fixed';
      speechBubble.style.bottom = '140px'; // Increased to account for higher position
      speechBubble.style.right = '20px';
    }
  };
  
  // Set other speech bubble styles
  speechBubble.style.backgroundColor = 'white';
  speechBubble.style.color = '#4d5a41'; // Sky Lagoon olive green color
  speechBubble.style.padding = '14px 18px';
  speechBubble.style.borderRadius = '12px';
  speechBubble.style.maxWidth = '280px';
  speechBubble.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.08)';
  speechBubble.style.zIndex = '999998';
  speechBubble.style.fontSize = '14px';
  speechBubble.style.lineHeight = '1.5';
  speechBubble.style.fontFamily = 'Arial, sans-serif';
  speechBubble.style.transition = 'opacity 0.3s ease-in-out';
  speechBubble.style.border = '1px solid rgba(0,0,0,0.05)';
  
  // Detect language and set appropriate preview text
  const isIcelandic = 
    window.location.pathname.includes('/is/') || 
    document.documentElement.lang === 'is' ||
    document.documentElement.lang === 'is-IS';
  
  if (isIcelandic) {
    speechBubble.textContent = 'Hæ! Ég heiti Sólrún og er AI spjallmenni hjá Sky Lagoon. Hvað get ég gert fyrir þig í dag?';
  } else {
    speechBubble.textContent = 'Hi! I\'m Sólrún, your chat assistant at Sky Lagoon. How can I help you today?';
  }
  
  // Add small triangle/pointer at the bottom
  const pointer = document.createElement('div');
  pointer.style.position = 'absolute';
  pointer.style.bottom = '-8px';
  pointer.style.right = '28px'; // Positioned to align with the chat icon
  pointer.style.width = '0';
  pointer.style.height = '0';
  pointer.style.borderLeft = '8px solid transparent';
  pointer.style.borderRight = '8px solid transparent';
  pointer.style.borderTop = '8px solid white';
  pointer.style.zIndex = '1';
  speechBubble.appendChild(pointer);
  
  // Also add a border for the pointer to match the bubble border
  const pointerBorder = document.createElement('div');
  pointerBorder.style.position = 'absolute';
  pointerBorder.style.bottom = '-9px';
  pointerBorder.style.right = '28px';
  pointerBorder.style.width = '0';
  pointerBorder.style.height = '0';
  pointerBorder.style.borderLeft = '8px solid transparent';
  pointerBorder.style.borderRight = '8px solid transparent';
  pointerBorder.style.borderTop = '8px solid rgba(0,0,0,0.05)';
  pointerBorder.style.zIndex = '0';
  speechBubble.appendChild(pointerBorder);
  
  // Add close button for the speech bubble
  const closeButton = document.createElement('div');
  closeButton.textContent = '×';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '8px';
  closeButton.style.right = '10px';
  closeButton.style.cursor = 'pointer';
  closeButton.style.fontSize = '18px';
  closeButton.style.fontWeight = 'normal';
  closeButton.style.color = '#999';
  closeButton.style.lineHeight = '14px';
  closeButton.style.width = '16px';
  closeButton.style.height = '16px';
  closeButton.style.textAlign = 'center';
  closeButton.style.borderRadius = '50%';
  
  closeButton.onmouseover = function() {
    closeButton.style.color = '#666';
  };
  
  closeButton.onmouseout = function() {
    closeButton.style.color = '#999';
  };
  
  closeButton.onclick = function(e) {
    e.stopPropagation();
    speechBubble.style.display = 'none';
    // Store in session that bubble was closed
    sessionStorage.setItem('skyLagoonChatBubbleClosed', 'true');
  };
  
  speechBubble.appendChild(closeButton);
  
  // Only show if not closed in this session
  if (sessionStorage.getItem('skyLagoonChatBubbleClosed') === 'true') {
    speechBubble.style.display = 'none';
  }
  
  document.body.appendChild(speechBubble);
  
  // Initial positioning (will be updated when chat loads)
  positionSpeechBubble();
  
  // Find this script in the document
  const scripts = document.getElementsByTagName('script');
  let currentScript = null;
  for (let i = 0; i < scripts.length; i++) {
    if (scripts[i].src && scripts[i].src.includes('embed.js')) {
      currentScript = scripts[i];
      break;
    }
  }
  
  // Extract domain from script src or use fallback
  let baseUrl;
  if (currentScript && currentScript.src) {
    try {
      const srcUrl = new URL(currentScript.src);
      baseUrl = srcUrl.origin; // Get the origin (protocol + domain + port)
    } catch (error) {
      // Fallback URL for production
      baseUrl = 'https://skylagoon-chat-demo.vercel.app';
    }
  } else {
    // Fallback URL for production
    baseUrl = 'https://skylagoon-chat-demo.vercel.app';
  }
  
  // Full absolute URL to widget bundle
  const scriptUrl = `${baseUrl}/static/js/widget-bundle.js`;
  
  // Load the widget bundle
  const script = document.createElement('script');
  script.src = scriptUrl;
  script.crossOrigin = 'anonymous'; // Add CORS attribute
  
  script.onerror = function(error) {
    console.error('Failed to load widget bundle:', error);
    container.innerHTML = '<div style="background: #f8d7da; color: #721c24; padding: 10px; border-radius: 4px;">Widget failed to load. Please try again later.</div>';
  };
  
  script.onload = function() {
    setTimeout(function() {
      try {
        if (window.SkyLagoonChat && window.SkyLagoonChat.default) {
          // Store a reference to the widget API
          const widgetAPI = window.SkyLagoonChat.default.init(container, {
            apiKey: 'sky-lagoon-secret-2024',
            language: isIcelandic ? 'is' : 'en',
            baseUrl: baseUrl
          });
          
          // Position speech bubble relative to the chat icon (with a slight delay to ensure DOM is ready)
          setTimeout(() => {
            positionSpeechBubble();
            
            // ACCESSIBILITY ENHANCEMENT: Add resize functionality
            addResizeButton();
          }, 200);
          
          // Hide speech bubble when chat is opened
          container.addEventListener('click', function() {
            speechBubble.style.display = 'none';
          });
          
          // Store API for potential use later
          window.SkyLagoonChatAPI = widgetAPI;
          
          // Add window resize listener to update bubble position
          window.addEventListener('resize', positionSpeechBubble);
        } else {
          console.error('SkyLagoonChat not found on window after loading');
        }
      } catch (e) {
        console.error('Error initializing chat widget:', e);
      }
    }, 100); // Small delay to ensure everything is loaded
  };
  
  document.head.appendChild(script);
  
  // Function to add the resize button to the chat widget
  function addResizeButton() {
    // Wait for the chat widget to be fully loaded
    setTimeout(() => {
      // First, find the chat window header (the green bar with Sólrún's name)
      const chatHeaderElement = document.querySelector('#sky-lagoon-chat-root .ChatHeader');
      
      if (!chatHeaderElement) {
        console.warn('Chat header element not found, retrying...');
        // Try again after a short delay
        setTimeout(addResizeButton, 500);
        return;
      }
      
      // Create the resize button
      const resizeButton = document.createElement('div');
      resizeButton.className = 'chat-resize-button';
      resizeButton.setAttribute('aria-label', isIcelandic ? 'Stækka spjallglugga' : 'Expand chat window');
      resizeButton.setAttribute('role', 'button');
      resizeButton.setAttribute('tabindex', '0');
      
      // Set the button styles
      resizeButton.style.position = 'absolute';
      resizeButton.style.top = '10px';
      resizeButton.style.left = '10px';
      resizeButton.style.width = '24px';
      resizeButton.style.height = '24px';
      resizeButton.style.cursor = 'pointer';
      resizeButton.style.zIndex = '10';
      resizeButton.style.display = 'flex';
      resizeButton.style.alignItems = 'center';
      resizeButton.style.justifyContent = 'center';
      
      // Create the arrow SVG icon for expanding
      resizeButton.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.5 12.5L12.5 3.5M12.5 3.5H6.5M12.5 3.5V9.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
      
      // Store original size values
      const chatContainer = document.querySelector('#sky-lagoon-chat-root > div');
      let isExpanded = false;
      let originalWidth, originalHeight;
      let originalStyles = {};
      
      // Function to toggle between expanded and normal size
      function toggleSize() {
        const chatElement = document.querySelector('#sky-lagoon-chat-root > div');
        const chatBody = document.querySelector('#sky-lagoon-chat-root .ChatBody');
        const messageArea = document.querySelector('#sky-lagoon-chat-root .MessageContainer');
        
        if (!chatElement) return;
        
        if (!isExpanded) {
          // Save original dimensions before expanding
          originalWidth = chatElement.offsetWidth;
          originalHeight = chatElement.offsetHeight;
          
          // Save original styles
          if (chatElement) originalStyles.chatElement = chatElement.style.cssText;
          if (chatBody) originalStyles.chatBody = chatBody.style.cssText;
          if (messageArea) originalStyles.messageArea = messageArea.style.cssText;
          
          // Expand the chat
          chatElement.style.width = Math.min(600, window.innerWidth - 40) + 'px';
          chatElement.style.height = Math.min(700, window.innerHeight - 40) + 'px';
          
          if (chatBody) {
            chatBody.style.height = 'calc(100% - 140px)';
          }
          
          if (messageArea) {
            messageArea.style.maxHeight = 'calc(100% - 30px)';
          }
          
          // Update the icon to show collapse
          resizeButton.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 3.5L3.5 12.5M3.5 12.5H9.5M3.5 12.5V6.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          `;
          
          // Update button tooltip
          resizeButton.setAttribute('aria-label', isIcelandic ? 'Minnka spjallglugga' : 'Collapse chat window');
          
        } else {
          // Restore original size
          if (originalStyles.chatElement) chatElement.style.cssText = originalStyles.chatElement;
          if (chatBody && originalStyles.chatBody) chatBody.style.cssText = originalStyles.chatBody;
          if (messageArea && originalStyles.messageArea) messageArea.style.cssText = originalStyles.messageArea;
          
          // Update the icon back to expand
          resizeButton.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.5 12.5L12.5 3.5M12.5 3.5H6.5M12.5 3.5V9.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          `;
          
          // Update button tooltip
          resizeButton.setAttribute('aria-label', isIcelandic ? 'Stækka spjallglugga' : 'Expand chat window');
        }
        
        isExpanded = !isExpanded;
      }
      
      // Add click event listeners
      resizeButton.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent the header click from minimizing
        toggleSize();
      });
      
      // Add keyboard accessibility
      resizeButton.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleSize();
        }
      });
      
      // Add the button to the header
      chatHeaderElement.appendChild(resizeButton);
      
      // Make sure the header click to minimize still works
      // We don't need to modify this as the stopPropagation on our button
      // prevents interference with existing functionality
      
      console.log('Resize button added successfully');
    }, 500); // Wait for chat widget to be fully initialized
  }
})();