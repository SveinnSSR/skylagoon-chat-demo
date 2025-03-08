// This script creates an iframe that will load our chat widget
(function() {
  // Ensure Google Fonts are loaded
  if (!document.getElementById('sky-lagoon-fonts')) {
    const fontLink = document.createElement('link');
    fontLink.id = 'sky-lagoon-fonts';
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Caudex:wght@400;700&display=swap';
    document.head.appendChild(fontLink);
  }
  
  // Get language from the page if available
  const pageLanguage = document.documentElement.lang || 'en';
  const language = pageLanguage.includes('is') ? 'is' : 'en';
  
  // Create iframe
  const iframe = document.createElement('iframe');
  
  // Set iframe attributes
  iframe.src = `https://skylagoon-chat-demo.vercel.app/widget-embed.html?language=${language}`;
  iframe.id = 'sky-lagoon-chat-iframe';
  iframe.style.position = 'fixed';
  iframe.style.bottom = '0';
  iframe.style.right = '0';
  iframe.style.width = '80px';
  iframe.style.height = '80px';
  iframe.style.border = 'none';
  iframe.style.outline = 'none';
  iframe.style.backgroundColor = 'transparent';
  iframe.style.zIndex = '9999';
  iframe.style.transition = 'all 0.3s ease';
  iframe.style.overflow = 'hidden';
  iframe.style.borderRadius = '50%';
  iframe.style.boxShadow = 'none';
  
  // Set non-style attributes
  iframe.frameBorder = '0';
  iframe.allowTransparency = true;
  iframe.scrolling = 'no';
  
  // Add the iframe to the container
  const container = document.getElementById('sky-lagoon-chat-container');
  if (container) {
    container.appendChild(iframe);
  }
  
  // Set up message listener for iframe resize
  window.addEventListener('message', function(event) {
    // Make sure message is from our widget
    if (event.origin !== 'https://skylagoon-chat-demo.vercel.app') return;
    
    // Handle widget state changes
    if (event.data && event.data.type === 'resize') {
      iframe.style.width = event.data.width;
      iframe.style.height = event.data.height;
      
      // Update border radius based on minimized state
      if (event.data.width === '70px' || event.data.width === '80px') {
        iframe.style.borderRadius = '50%';
      } else {
        iframe.style.borderRadius = '16px';
      }
    }
  });
})();
