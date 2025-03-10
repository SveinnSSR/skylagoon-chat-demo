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
      const urlIsIcelandic = window.location.pathname.includes('/is/') || 
                            window.location.pathname.startsWith('/is') ||
                            window.location.hostname.startsWith('is.');
      
      // Check for html lang attribute
      const htmlLang = document.documentElement.lang || '';
      const htmlIsIcelandic = htmlLang.toLowerCase().startsWith('is');
      
      // Check for language selector elements that indicate current language
      const langSelectors = document.querySelectorAll('.lang-selector, .language-switcher, [data-lang], .lang');
      let selectorIndicatesIcelandic = false;
      
      for (let i = 0; i < langSelectors.length; i++) {
        const el = langSelectors[i];
        // Check if the IS/Icelandic option is marked as active/current/selected
        if ((el.textContent.includes('IS') || el.textContent.includes('Íslenska')) && 
            (el.classList.contains('active') || el.classList.contains('current') || 
             el.classList.contains('selected'))) {
          selectorIndicatesIcelandic = true;
          break;
        }
      }
      
      // Return 'is' for Icelandic, 'en' for English
      return (urlIsIcelandic || htmlIsIcelandic || selectorIndicatesIcelandic) ? 'is' : 'en';
    }
    
    // Full absolute URL to widget bundle
    const scriptUrl = `${baseUrl}/static/js/widget-bundle.js`;
    
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
            // Detect current language
            const language = detectLanguage();
            console.log('Detected language:', language);
            
            // Initialize the widget with the detected language
            window.SkyLagoonChat.default.init(container, {
              apiKey: 'sky-lagoon-secret-2024',
              language: language,
              baseUrl: baseUrl
            });
            
            // Set up a language check at regular intervals to handle language switching
            setInterval(function() {
              const currentLang = detectLanguage();
              // If language has changed, re-initialize the widget
              if (window.SkyLagoonChatCurrentLang !== currentLang) {
                console.log('Language changed to:', currentLang);
                window.SkyLagoonChatCurrentLang = currentLang;
                
                // Remove the existing widget
                while (container.firstChild) {
                  container.removeChild(container.firstChild);
                }
                
                // Re-initialize with new language
                window.SkyLagoonChat.default.init(container, {
                  apiKey: 'sky-lagoon-secret-2024',
                  language: currentLang,
                  baseUrl: baseUrl
                });
              }
            }, 2000); // Check every 2 seconds
            
            // Store initial language
            window.SkyLagoonChatCurrentLang = language;
          }
        }, 100); // Small delay to ensure everything is loaded
      } catch (initError) {
        console.error('Error initializing widget:', initError);
      }
    };
    
    document.head.appendChild(script);
  } catch (error) {
    // Silent fail to prevent affecting the parent site
    console.error('Error loading Sky Lagoon widget:', error);
  }
})();