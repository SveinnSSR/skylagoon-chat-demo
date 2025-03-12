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
  // Track if resize button is added
  let resizeButtonAdded = false;
  // Track the chat state (minimized/expanded)
  let isChatMinimized = false;
  
  // Function to find the chat header
  function findChatHeader() {
    // Look for elements that might be the header (green background with Sólrún's name)
    const possibleSelectors = [
      // First look for elements with expected class names
      '#sky-lagoon-chat-root div[class*="header" i]',
      '#sky-lagoon-chat-root div[class*="Header" i]',
      
      // Then look for elements that might be styled as headers
      '#sky-lagoon-chat-root > div > div:first-child', 
      '#sky-lagoon-chat-root div[style*="background-color:#7A8A65"]',
      '#sky-lagoon-chat-root div[style*="background:#7A8A65"]',
      
      // Look for elements containing Sólrún or Sky Lagoon text
      '#sky-lagoon-chat-root div:has(h2:contains("Sólrún"))',
      '#sky-lagoon-chat-root div:has(div:contains("Sólrún"))'
    ];
    
    // Try each selector
    for (const selector of possibleSelectors) {
      try {
        const element = document.querySelector(selector);
        if (element) {
          const styles = window.getComputedStyle(element);
          
          // Check if it looks like the header (green background, appropriate height)
          const hasReasonableHeight = element.offsetHeight > 20 && element.offsetHeight < 120;
          
          // Check if it's at the top of the chat
          const isAtTop = element.getBoundingClientRect().top < 200;
          
          if (hasReasonableHeight && isAtTop) {
            console.log('Found chat header:', element);
            return element;
          }
        }
      } catch (e) {
        // Ignore errors for this selector and try the next one
        continue;
      }
    }
    
    // Fallback: Try to find by scanning the DOM for a green background element
    try {
      const allElements = document.querySelectorAll('#sky-lagoon-chat-root div');
      for (const element of allElements) {
        if (element.textContent.includes('Sólrún') || element.textContent.includes('Sky Lagoon')) {
          console.log('Found chat header by text content:', element);
          return element;
        }
      }
    } catch (e) {
      console.error('Error finding header by text:', e);
    }
    
    return null;
  }
  
  // Check if the chat is minimized
  function isChatCurrentlyMinimized() {
    try {
      // Try to find the chat container (the main chat window)
      const chatContainer = document.querySelector('#sky-lagoon-chat-root > div');
      
      // If we can't find it, we can't determine
      if (!chatContainer) return false;
      
      // Get the header element
      const header = findChatHeader();
      if (!header) return false;
      
      // Check if only the header is visible (minimized)
      // This works by comparing the height of the container to the header
      const containerHeight = chatContainer.offsetHeight;
      const headerHeight = header.offsetHeight;
      
      // If the container is roughly the same height as the header, it's minimized
      // Allow for small differences in height due to borders, margins, etc.
      return containerHeight <= headerHeight + 20;
      
    } catch (e) {
      console.error('Error checking minimized state:', e);
      return false;
    }
  }
  
  // Function to add the resize button
  function addResizeButton() {
    if (resizeButtonAdded) return;
    
    // First check if the chat is minimized - don't add if minimized
    if (isChatCurrentlyMinimized()) {
      console.log('Chat is minimized, not adding resize button yet');
      isChatMinimized = true;
      return false;
    }
    
    const chatHeader = findChatHeader();
    if (!chatHeader) {
      console.log('Could not find chat header, will retry');
      return false;
    }
    
    // Create the resize button
    const resizeBtn = document.createElement('div');
    resizeBtn.id = 'sky-lagoon-resize-btn';
    resizeBtn.setAttribute('aria-label', isIcelandic ? 'Stækka spjallglugga' : 'Expand chat window');
    resizeBtn.setAttribute('role', 'button');
    resizeBtn.setAttribute('tabindex', '0');
    
    // Style the button to match the existing UI
    resizeBtn.style.position = 'absolute';
    resizeBtn.style.top = '12px';
    resizeBtn.style.left = '12px';
    resizeBtn.style.width = '24px';
    resizeBtn.style.height = '24px';
    resizeBtn.style.cursor = 'pointer';
    resizeBtn.style.zIndex = '999995';
    resizeBtn.style.backgroundColor = 'transparent';
    resizeBtn.style.border = '1px solid rgba(255,255,255,0.5)';
    resizeBtn.style.borderRadius = '4px';
    resizeBtn.style.display = 'flex';
    resizeBtn.style.alignItems = 'center';
    resizeBtn.style.justifyContent = 'center';
    
    // Create arrow that matches the existing down arrow style (just pointing up-right)
    // This is based on the style seen in Image 3
    resizeBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 12L12 4M12 4H6M12 4V10" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    
    // Track expanded state and original dimensions
    let isExpanded = false;
    let originalWidth, originalHeight;
    let originalStyles = {};
    
    // Function to toggle chat size
    function toggleChatSize(e) {
      e.stopPropagation(); // Prevent header click
      
      // Get main chat container
      const chatContainer = document.querySelector('#sky-lagoon-chat-root > div');
      if (!chatContainer) return;
      
      // Find message container and input area
      const messageContainer = document.querySelector('#sky-lagoon-chat-root [class*="message" i], #sky-lagoon-chat-root [class*="conversation" i]');
      const inputArea = document.querySelector('#sky-lagoon-chat-root input, #sky-lagoon-chat-root textarea');
      const bottomBar = document.querySelector('#sky-lagoon-chat-root div:last-child > div:last-child');
      
      if (!isExpanded) {
        // Save original dimensions before expanding
        originalWidth = chatContainer.offsetWidth;
        originalHeight = chatContainer.offsetHeight;
        
        // Save original styles
        originalStyles.container = chatContainer.style.cssText;
        if (messageContainer) originalStyles.messageContainer = messageContainer.style.cssText;
        if (inputArea) originalStyles.inputArea = inputArea.style.cssText;
        if (bottomBar) originalStyles.bottomBar = bottomBar.style.cssText;
        
        // Expand the chat window
        chatContainer.style.width = Math.min(600, window.innerWidth - 40) + 'px';
        chatContainer.style.height = Math.min(700, window.innerHeight - 40) + 'px';
        
        // Increase message container height
        if (messageContainer) {
          messageContainer.style.height = 'calc(100% - 160px)';
          messageContainer.style.maxHeight = 'none';
        }
        
        // Remove the green bottom bar in expanded mode
        if (bottomBar && bottomBar.style.backgroundColor && 
            (bottomBar.style.backgroundColor.includes('rgb(122, 138, 101)') || 
             bottomBar.style.backgroundColor.includes('#7A8A65'))) {
          bottomBar.style.backgroundColor = 'transparent';
        }
        
        // Change button to collapse icon
        resizeBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4L4 12M4 12H10M4 12V6" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `;
        resizeBtn.setAttribute('aria-label', isIcelandic ? 'Minnka spjallglugga' : 'Collapse chat window');
        
      } else {
        // Restore original dimensions
        chatContainer.style.cssText = originalStyles.container;
        
        if (messageContainer && originalStyles.messageContainer) {
          messageContainer.style.cssText = originalStyles.messageContainer;
        }
        
        if (inputArea && originalStyles.inputArea) {
          inputArea.style.cssText = originalStyles.inputArea;
        }
        
        if (bottomBar && originalStyles.bottomBar) {
          bottomBar.style.cssText = originalStyles.bottomBar;
        }
        
        // Change back to expand icon
        resizeBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 12L12 4M12 4H6M12 4V10" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `;
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
    
    // Make sure the header has position relative for absolute positioning
    chatHeader.style.position = 'relative';
    
    // Add the button to the header
    chatHeader.appendChild(resizeBtn);
    
    console.log('Resize button successfully added');
    resizeButtonAdded = true;
    return true;
  }
  
  // Function to check chat state and manage resize button
  function manageResizeButton() {
    // Check current minimized state
    const currentlyMinimized = isChatCurrentlyMinimized();
    
    // If state changed from minimized to expanded
    if (isChatMinimized && !currentlyMinimized) {
      console.log('Chat expanded, adding resize button');
      isChatMinimized = false;
      // Give it a moment for the UI to settle
      setTimeout(() => {
        resizeButtonAdded = false; // Reset so we can add a new one
        addResizeButton();
      }, 300);
    } 
    // If state changed from expanded to minimized
    else if (!isChatMinimized && currentlyMinimized) {
      console.log('Chat minimized, removing resize button');
      isChatMinimized = true;
      
      // Remove the button if it exists
      const resizeBtn = document.getElementById('sky-lagoon-resize-btn');
      if (resizeBtn && resizeBtn.parentNode) {
        resizeBtn.parentNode.removeChild(resizeBtn);
        resizeButtonAdded = false;
      }
    }
    // If expanded and button doesn't exist, add it
    else if (!isChatMinimized && !resizeButtonAdded) {
      addResizeButton();
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
          
          // Initial check for button after a delay
          setTimeout(() => {
            manageResizeButton();
          }, 1000);
          
          // Set up a mutation observer to watch for changes to the chat UI
          const observer = new MutationObserver(function(mutations) {
            // When DOM changes, check if we need to add/remove the resize button
            manageResizeButton();
          });
          
          // Start observing the container for changes
          observer.observe(container, { 
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
          });
          
          // Also set a regular interval check as a backup
          setInterval(manageResizeButton, 1000);
          
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