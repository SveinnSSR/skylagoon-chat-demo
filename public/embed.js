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
  speechBubble.style.position = 'fixed';
  speechBubble.style.bottom = '100px'; // Increased spacing from chat icon
  speechBubble.style.right = '20px';
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
          
          // Hide speech bubble when chat is opened
          container.addEventListener('click', function() {
            speechBubble.style.display = 'none';
          });
          
          // Store API for potential use later
          window.SkyLagoonChatAPI = widgetAPI;
        } else {
          console.error('SkyLagoonChat not found on window after loading');
        }
      } catch (e) {
        console.error('Error initializing chat widget:', e);
      }
    }, 100); // Small delay to ensure everything is loaded
  };
  
  document.head.appendChild(script);
})();