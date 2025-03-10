(function() {
  // FAILSAFE: Set to true to disable the widget completely
  const WIDGET_DISABLED = false;
  
  // If the widget is disabled, exit immediately without showing anything
  if (WIDGET_DISABLED) {
    console.log('Sky Lagoon Chat Widget is currently disabled');
    return;
  }
  
  console.log('Sky Lagoon Chat Widget embed script running');
  
  // Create container element
  const container = document.createElement('div');
  container.id = 'sky-lagoon-chat-root';
  container.style.position = 'fixed';
  container.style.bottom = '20px';
  container.style.right = '20px';
  container.style.zIndex = '999999';
  document.body.appendChild(container);
  
  try {
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
        console.log('Base URL from script:', baseUrl);
      } catch (error) {
        // Fallback URLs based on environment
        baseUrl = 'https://skylagoon-chat-demo.vercel.app';
      }
    } else {
      // Fallback URL for production
      baseUrl = 'https://skylagoon-chat-demo.vercel.app';
    }
    
    // Detect page language
    function detectLanguage() {
      // Check for language in URL
      const isIcelandic = window.location.pathname.includes('/is/') || 
                         window.location.pathname === '/is' || 
                         window.location.pathname.startsWith('/is/');
      
      return isIcelandic ? 'is' : 'en';
    }
    
    // Get language from URL
    const language = detectLanguage();
    console.log('Detected language:', language);
    
    // Full absolute URL to widget bundle
    const scriptUrl = `${baseUrl}/static/js/widget-bundle.js`;
    
    // For monitoring language toggle links
    function setupLanguageToggleListeners() {
      // Look for language toggle links
      const languageLinks = document.querySelectorAll('a[href*="/is"], a[href="/"], .language-selector a');
      
      languageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
          // Don't prevent default - let the navigation happen
          // But store a flag in sessionStorage indicating a language change is happening
          const targetLang = link.href.includes('/is') ? 'is' : 'en';
          console.log('Language change detected, switching to:', targetLang);
          sessionStorage.setItem('skylagoon_language_change', 'true');
          sessionStorage.setItem('skylagoon_target_language', targetLang);
        });
      });
    }
    
    // Load the widget bundle
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.crossOrigin = 'anonymous'; // Add CORS attribute
    
    script.onerror = function(error) {
      container.innerHTML = '<div style="background: #f8d7da; color: #721c24; padding: 10px; border-radius: 4px;">Widget failed to load. Please try again later.</div>';
    };
    
    script.onload = function() {
      try {
        setTimeout(function() {
          if (window.SkyLagoonChat && window.SkyLagoonChat.default) {
            // Initialize the widget with the detected language
            window.SkyLagoonChat.default.init(container, {
              apiKey: 'sky-lagoon-secret-2024',
              language: language,
              baseUrl: baseUrl
            });
            
            // Try to set up language toggle listeners
            try {
              setupLanguageToggleListeners();
            } catch (listenerError) {
              console.error('Error setting up language listeners:', listenerError);
            }
          }
        }, 100); // Small delay to ensure everything is loaded
      } catch (initError) {
        console.error('Error initializing widget:', initError);
      }
    };
    
    document.head.appendChild(script);
    
    // Also handle the page visibility change event to ensure widget is always available
    document.addEventListener('visibilitychange', function() {
      if (document.visibilityState === 'visible' && !document.getElementById('sky-lagoon-chat-root')) {
        // If widget container is missing, recreate it
        const newContainer = document.createElement('div');
        newContainer.id = 'sky-lagoon-chat-root';
        newContainer.style.position = 'fixed';
        newContainer.style.bottom = '20px';
        newContainer.style.right = '20px';
        newContainer.style.zIndex = '999999';
        document.body.appendChild(newContainer);
        
        // Reinitialize if widget object exists
        if (window.SkyLagoonChat && window.SkyLagoonChat.default) {
          window.SkyLagoonChat.default.init(newContainer, {
            apiKey: 'sky-lagoon-secret-2024',
            language: detectLanguage(),
            baseUrl: baseUrl
          });
        }
      }
    });
    
  } catch (error) {
    // Silent fail to prevent affecting the parent site
    console.error('Error loading Sky Lagoon widget:', error);
  }
})();