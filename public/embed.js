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
  
  // ACCESSIBILITY FEATURE: Add resize functionality
  // This will be used to track if we've already added the resize button
  let resizeButtonAdded = false;
  
  // Utility function to find the chat header element with multiple possible selectors
  function findChatHeader() {
    // Try several possible selectors for the header
    const possibleSelectors = [
      '#sky-lagoon-chat-root [class*="header" i]', // Any element with "header" in class name
      '#sky-lagoon-chat-root [class*="head" i]',  // Any element with "head" in class name 
      '#sky-lagoon-chat-root > div > div:first-child', // First child of main container
      '#sky-lagoon-chat-root div[style*="background-color"]', // Element with background-color
      '#sky-lagoon-chat-root div[style*="background:#"][style*="color:white"]', // Element with background and white text
      '#sky-lagoon-chat-root div:has(> img)', // Element containing an image
      '#sky-lagoon-chat-root div:has(> [alt*="profile"])', // Element containing a profile image
      // For the green header area shown in the screenshot
      '#sky-lagoon-chat-root > div > div:first-child' 
    ];
    
    // Try each selector
    for (const selector of possibleSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        // Check if this looks like a header (green background, contains text, at the top, etc.)
        const styles = window.getComputedStyle(element);
        const bgColor = styles.backgroundColor;
        
        // Check for common header characteristics
        const isGreenish = bgColor.includes('rgb(77') || bgColor.includes('rgb(93'); // Common Sky Lagoon green shades
        const hasReasonableHeight = element.offsetHeight > 20 && element.offsetHeight < 100;
        const isAtTop = element.getBoundingClientRect().top < 150;
        
        // If it looks like a header, return it
        if (hasReasonableHeight && isAtTop) {
          console.log('Found chat header element:', element);
          return element;
        }
      }
    }
    
    // Fallback: find any green-colored div that contains "Sólrún" text
    const allDivs = document.querySelectorAll('#sky-lagoon-chat-root div');
    for (const div of allDivs) {
      if (div.textContent.includes('Sólrún') || div.textContent.includes('Sky Lagoon')) {
        const styles = window.getComputedStyle(div);
        if (styles.backgroundColor.includes('rgb')) { // Has a background color set
          console.log('Found header by text content:', div);
          return div;
        }
      }
    }
    
    return null;
  }
  
  // Function to add the resize button
  function addResizeButton() {
    if (resizeButtonAdded) return; // Prevent adding multiple buttons
    
    const chatHeader = findChatHeader();
    if (!chatHeader) {
      console.log('Could not find chat header element, will retry');
      return false; // Will retry
    }
    
    // Create resize button
    const resizeBtn = document.createElement('div');
    resizeBtn.className = 'sky-lagoon-resize-btn';
    resizeBtn.setAttribute('aria-label', isIcelandic ? 'Stækka spjallglugga' : 'Expand chat window');
    resizeBtn.setAttribute('role', 'button');
    resizeBtn.setAttribute('tabindex', '0');
    
    // Style the button
    resizeBtn.style.position = 'absolute';
    resizeBtn.style.top = '15px';
    resizeBtn.style.left = '15px';
    resizeBtn.style.width = '20px';
    resizeBtn.style.height = '20px';
    resizeBtn.style.cursor = 'pointer';
    resizeBtn.style.zIndex = '999999';
    resizeBtn.style.backgroundColor = 'transparent';
    resizeBtn.style.border = 'none';
    resizeBtn.style.padding = '0';
    resizeBtn.style.display = 'flex';
    resizeBtn.style.alignItems = 'center';
    resizeBtn.style.justifyContent = 'center';
    
    // Create arrow SVG for the resize button
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "16");
    svg.setAttribute("height", "16");
    svg.setAttribute("viewBox", "0 0 16 16");
    svg.setAttribute("fill", "none");
    
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", "M3.5 12.5L12.5 3.5M12.5 3.5H6.5M12.5 3.5V9.5");
    path.setAttribute("stroke", "white");
    path.setAttribute("stroke-width", "1.5");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    
    svg.appendChild(path);
    resizeBtn.appendChild(svg);
    
    // Track expanded state and original dimensions
    let isExpanded = false;
    let originalWidth, originalHeight;
    let originalStyles = {};
    
    // Function to toggle chat size
    function toggleChatSize(e) {
      e.stopPropagation(); // Prevent header click from closing the chat
      
      // Get main chat container
      const chatContainer = document.querySelector('#sky-lagoon-chat-root > div');
      if (!chatContainer) return;
      
      // Find message container and input area
      const messageContainer = document.querySelector('#sky-lagoon-chat-root [class*="message" i], #sky-lagoon-chat-root [class*="conversation" i]');
      const inputArea = document.querySelector('#sky-lagoon-chat-root input, #sky-lagoon-chat-root textarea');
      
      if (!isExpanded) {
        // Save original dimensions before expanding
        originalWidth = chatContainer.offsetWidth;
        originalHeight = chatContainer.offsetHeight;
        
        // Save original styles
        originalStyles.container = chatContainer.style.cssText;
        if (messageContainer) originalStyles.messageContainer = messageContainer.style.cssText;
        if (inputArea) originalStyles.inputArea = inputArea.style.cssText;
        
        // Expand
        chatContainer.style.width = Math.min(600, window.innerWidth - 40) + 'px';
        chatContainer.style.height = Math.min(700, window.innerHeight - 40) + 'px';
        
        if (messageContainer) {
          messageContainer.style.height = 'calc(100% - 160px)';
          messageContainer.style.maxHeight = 'none';
        }
        
        // Update button icon to collapse
        path.setAttribute("d", "M12.5 3.5L3.5 12.5M3.5 12.5H9.5M3.5 12.5V6.5");
        resizeBtn.setAttribute('aria-label', isIcelandic ? 'Minnka spjallglugga' : 'Collapse chat window');
      } else {
        // Restore original size
        chatContainer.style.cssText = originalStyles.container;
        
        if (messageContainer && originalStyles.messageContainer) {
          messageContainer.style.cssText = originalStyles.messageContainer;
        }
        
        if (inputArea && originalStyles.inputArea) {
          inputArea.style.cssText = originalStyles.inputArea;
        }
        
        // Restore button icon to expand
        path.setAttribute("d", "M3.5 12.5L12.5 3.5M12.5 3.5H6.5M12.5 3.5V9.5");
        resizeBtn.setAttribute('aria-label', isIcelandic ? 'Stækka spjallglugga' : 'Expand chat window');
      }
      
      isExpanded = !isExpanded;
    }
    
    // Add event listeners
    resizeBtn.addEventListener('click', toggleChatSize);
    resizeBtn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleChatSize(e);
      }
    });
    
    // Add the button to the header
    chatHeader.style.position = 'relative'; // Ensure we can position absolutely within it
    chatHeader.appendChild(resizeBtn);
    
    console.log('Resize button successfully added');
    resizeButtonAdded = true;
    return true;
  }
  
  // Function to check if the chat is loaded and add the resize button
  function addResizeButtonWhenReady() {
    // Only proceed if the button hasn't been added yet
    if (!resizeButtonAdded) {
      const success = addResizeButton();
      if (!success) {
        // Retry after a delay if not successful
        setTimeout(addResizeButtonWhenReady, 500);
      }
    }
  }
  
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
          }, 200);
          
          // Hide speech bubble when chat is opened
          container.addEventListener('click', function() {
            speechBubble.style.display = 'none';
          });
          
          // Store API for potential use later
          window.SkyLagoonChatAPI = widgetAPI;
          
          // Add window resize listener to update bubble position
          window.addEventListener('resize', positionSpeechBubble);
          
          // Add the resize button with a delay to ensure the chat UI is loaded
          setTimeout(addResizeButtonWhenReady, 1000);
          
          // Also add a mutation observer to detect when the chat UI changes
          // This helps catch when the chat is opened/closed or dynamically modified
          const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
              if (mutation.type === 'childList' && !resizeButtonAdded) {
                // Try to add the resize button if chat UI structure changed
                addResizeButtonWhenReady();
              }
            });
          });
          
          // Start observing the container
          observer.observe(container, { 
            childList: true,
            subtree: true 
          });
          
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