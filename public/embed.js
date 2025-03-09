// Sky Lagoon Chat Widget Embedding Script
(function() {
  // Create container for the chat widget
  const container = document.createElement('div');
  container.id = 'sky-lagoon-chat-container';
  container.style.border = 'none';
  container.style.outline = 'none';
  container.style.backgroundColor = 'transparent';
  container.style.position = 'fixed';  // Ensure container is fixed
  container.style.bottom = '0';        // Position at bottom
  container.style.right = '0';         // Position at right
  container.style.width = '80px';      // Initial width
  container.style.height = '80px';     // Initial height
  container.style.zIndex = '9997';     // Below iframe but still high
  document.body.appendChild(container);
  
  // Get language from the page if available
  const pageLanguage = document.documentElement.lang || 'en';
  const language = pageLanguage.includes('is') ? 'is' : 'en';
  
  // Create iframe
  const iframe = document.createElement('iframe');
  
  // Set iframe attributes
  iframe.src = `https://skylagoon-chat-demo.vercel.app/widget-embed.html?language=${language}`;
  iframe.id = 'sky-lagoon-chat-iframe';
  iframe.style.position = 'fixed';
  iframe.style.bottom = '20px';        // Small margin from bottom
  iframe.style.right = '20px';         // Small margin from right
  iframe.style.width = '80px';
  iframe.style.height = '80px';
  iframe.style.border = 'none';
  iframe.style.outline = 'none';
  iframe.style.backgroundColor = 'transparent';
  iframe.style.zIndex = '9999';
  iframe.style.transition = 'all 0.3s ease';
  iframe.style.overflow = 'hidden';
  iframe.style.borderRadius = '50%';
  iframe.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  iframe.style.display = 'none'; // EMERGENCY FAILSAFE - ADD THIS LINE HERE
  
  iframe.frameBorder = '0';
  iframe.scrolling = 'no';
  iframe.allowTransparency = true;
  
  // Add the iframe to the container
  container.appendChild(iframe);
  
  // Log for debugging
  console.log('Sky Lagoon chat widget initialized');
  
  // Set up message listener for iframe resize
  window.addEventListener('message', function(event) {
    // Make sure message is from our widget
    if (event.origin !== 'https://skylagoon-chat-demo.vercel.app') return;
    
    // Handle widget state changes
    if (event.data && event.data.type === 'resize') {
      console.log('Resize message received:', event.data);
      iframe.style.width = event.data.width;
      iframe.style.height = event.data.height;
      
      if (event.data.width === '80px') {
        iframe.style.borderRadius = '50%';
      } else {
        iframe.style.borderRadius = '16px';
      }
    }
  });
})();
