(function() {
  // FAILSAFE: Set to true to disable the widget completely.
  const WIDGET_DISABLED = false;
  
  // If the widget is disabled, exit immediately
  if (WIDGET_DISABLED) {
    console.log('Sky Lagoon Chat Widget is currently disabled');
    return;
  }
  
  // Create container element
  const container = document.createElement('div');
  container.id = 'sky-lagoon-chat-root';
  container.className = 'sky-lagoon-chat-widget'; // Add namespace class
  container.style.position = 'fixed';
  container.style.bottom = '20px';
  container.style.right = '20px';
  container.style.zIndex = '999999';
  document.body.appendChild(container);
  
  // FIX THE SUN ICON - Direct DOM manipulation
  // This needs to run after a slight delay to ensure the page has loaded
  setTimeout(() => {
    try {
      // Try multiple selectors to find the sun icon
      const sunIconSelectors = [
        'img.content-icon.mb-3',
        'img[src*="icon-sun.svg"]',
        'img[title*="Experience the Heart"]'
      ];
      
      // Try each selector
      for (const selector of sunIconSelectors) {
        const icons = document.querySelectorAll(selector);
        icons.forEach(icon => {
          // Get the parent container (try different levels)
          let parent = icon.parentElement;
          
          // Fix the icon styling
          icon.style.display = 'block';
          icon.style.margin = '0 auto';
          icon.style.float = 'none';
          icon.style.position = 'relative';
          icon.style.left = 'auto';
          icon.style.right = 'auto';
          
          // Also fix the parent container - go up 3 levels to ensure we catch the real container
          for (let i = 0; i < 3; i++) {
            if (parent) {
              parent.style.textAlign = 'center';
              parent.style.display = 'block';
              // Try the next parent
              parent = parent.parentElement;
            }
          }
        });
      }
      
      // Special targeting for the specific container structure seen in your screenshots
      const contentIconContainers = document.querySelectorAll('.col-lg-12, .strip-container');
      contentIconContainers.forEach(container => {
        container.style.textAlign = 'center';
        container.style.display = 'block';
      });
    } catch (e) {
      console.log('Icon centering fix had an error:', e);
      // Non-critical error, continue with widget loading
    }
  }, 500);
  
  // Language detection and update function
  const updateWidgetLanguage = () => {
    // Detect language from various sources
    const isIcelandic = 
      window.location.pathname.includes('/is/') || 
      document.documentElement.lang === 'is' ||
      document.documentElement.lang === 'is-IS';
    
    // Update widget language if API is available
    if (window.SkyLagoonChatAPI && window.SkyLagoonChatAPI.setLanguage) {
      window.SkyLagoonChatAPI.setLanguage(isIcelandic ? 'is' : 'en');
      console.log('Updated chat widget language to:', isIcelandic ? 'is' : 'en');
    }
  };
  
  // Create speech bubble for preview text (initially shown)
  const speechBubble = document.createElement('div');
  speechBubble.id = 'sky-lagoon-chat-preview';
  speechBubble.className = 'sky-lagoon-chat-widget'; // Add namespace to speech bubble too
  
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
  speechBubble.style.cursor = 'pointer'; // NEW: Make it clear it's clickable
  speechBubble.style.userSelect = 'none'; // NEW: Prevent text selection
  
  // Detect language and set appropriate preview text
  const isIcelandic = 
    window.location.pathname.includes('/is/') || 
    document.documentElement.lang === 'is' ||
    document.documentElement.lang === 'is-IS';
  
  if (isIcelandic) {
    speechBubble.textContent = 'Hæ! Ég heiti Sólrún og er AI spjallmenni hjá Sky Lagoon. Hvað get ég gert fyrir þig í dag?';
  } else {
    speechBubble.textContent = 'Hi! I\'m Sólrún, your AI assistant at Sky Lagoon. How can I help you today?';
  }
  
  // NEW: Add click handler to open the chat widget
  speechBubble.addEventListener('click', function(e) {
    // Don't trigger if clicking the close button
    if (e.target === closeButton) {
      return;
    }
    
    console.log('Speech bubble clicked, opening chat...');
    
    // Hide the speech bubble
    speechBubble.style.display = 'none';
    sessionStorage.setItem('skyLagoonChatBubbleClosed', 'true');
    
    // Open the chat widget
    if (window.SkyLagoonChatAPI && window.SkyLagoonChatAPI.openChat) {
      window.SkyLagoonChatAPI.openChat();
    } else {
      // Fallback: trigger click on the chat widget container
      const chatWidget = document.querySelector('#sky-lagoon-chat-root');
      if (chatWidget) {
        chatWidget.click();
      }
    }
  });
  
  // NEW: Add hover effects for better UX
  speechBubble.addEventListener('mouseenter', function() {
    speechBubble.style.transform = 'translateY(-2px)';
    speechBubble.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.12)';
  });
  
  speechBubble.addEventListener('mouseleave', function() {
    speechBubble.style.transform = 'translateY(0)';
    speechBubble.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.08)';
  });
  
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
  closeButton.style.zIndex = '2'; // NEW: Ensure close button is above the bubble content
  
  closeButton.onmouseover = function() {
    closeButton.style.color = '#666';
  };
  
  closeButton.onmouseout = function() {
    closeButton.style.color = '#999';
  };
  
  closeButton.onclick = function(e) {
    e.stopPropagation(); // Prevent the speech bubble click handler from firing
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
  
  // NEW CODE: Load the website fix script first
  console.log('Loading mobile-friendly website fixes');
  const fixScript = document.createElement('script');
  fixScript.src = `${baseUrl}/website-fix.js`;
  fixScript.crossOrigin = 'anonymous';
  
  // Add error handling to ensure widget loads even if fix script fails
  fixScript.onerror = function(error) {
    console.error('Failed to load website fixes script:', error);
    loadWidgetBundle(); // Fallback function that loads the main widget
  };
  
  // Load widget after fix script loads
  fixScript.onload = function() {
    console.log('Website fixes script loaded successfully');
    loadWidgetBundle();
  };
  
  // Start loading the fixes script
  document.head.appendChild(fixScript);
  
  // Function to load the widget bundle
  function loadWidgetBundle() {
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.crossOrigin = 'anonymous';
    
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
            }, 200);
            
            // Hide speech bubble when chat is opened
            container.addEventListener('click', function() {
              speechBubble.style.display = 'none';
            });
            
            // NEW: Enhanced API with openChat method
            const enhancedAPI = {
              ...widgetAPI,
              openChat: function() {
                console.log('Opening chat via API');
                // Trigger click on the chat widget to open it
                const chatWidgetHeader = container.querySelector('div[style*="cursor: pointer"]');
                if (chatWidgetHeader) {
                  chatWidgetHeader.click();
                }
              },
              setLanguage: widgetAPI.setLanguage
            };
            
            // Store enhanced API for potential use later
            window.SkyLagoonChatAPI = enhancedAPI;
            
            // Add window resize listener to update bubble position
            window.addEventListener('resize', positionSpeechBubble);
            
            // Set up language listeners
            const languageButtons = document.querySelectorAll('a[href*="/is"], a[href="/"], .language-selector a');
            languageButtons.forEach(button => {
              button.addEventListener('click', () => {
                // Wait for page to update
                setTimeout(updateWidgetLanguage, 300);
              });
            });
            
            // Watch for URL changes
            let lastPathname = window.location.pathname;
            setInterval(() => {
              if (window.location.pathname !== lastPathname) {
                lastPathname = window.location.pathname;
                updateWidgetLanguage();
              }
            }, 1000);
            
            // Watch for lang attribute changes on HTML element
            const htmlObserver = new MutationObserver((mutations) => {
              mutations.forEach((mutation) => {
                if (mutation.attributeName === 'lang') {
                  updateWidgetLanguage();
                }
              });
            });
            htmlObserver.observe(document.documentElement, { attributes: true });
            
            // Initial language detection
            updateWidgetLanguage();
            
          } else {
            console.error('SkyLagoonChat not found on window after loading');
          }
        } catch (e) {
          console.error('Error initializing chat widget:', e);
        }
      }, 100); // Small delay to ensure everything is loaded
    };
    
    document.head.appendChild(script);
  }
  // END NEW CODE
})();