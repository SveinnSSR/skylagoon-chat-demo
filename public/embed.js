(function() {
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
            window.SkyLagoonChat.default.init(container, {
              apiKey: 'sky-lagoon-secret-2024',
              language: 'en',
              baseUrl: baseUrl // Pass baseUrl for loading assets like images
            });
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