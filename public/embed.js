// Sky Lagoon Chat Widget Test Script
(function() {
  console.log("Test embed script loading");
  
  // Create container for the chat widget
  const container = document.createElement('div');
  container.id = 'sky-lagoon-chat-container';
  container.style.border = 'none';
  container.style.outline = 'none';
  container.style.backgroundColor = 'transparent';
  document.body.appendChild(container);
  
  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.src = 'https://skylagoon-chat-demo.vercel.app/widget-test.html';
  iframe.id = 'sky-lagoon-chat-iframe';
  iframe.style.position = 'fixed';
  iframe.style.bottom = '0';
  iframe.style.right = '0';
  iframe.style.width = '70px';
  iframe.style.height = '70px';
  iframe.style.border = 'none';
  iframe.style.outline = 'none';
  iframe.style.backgroundColor = 'transparent';
  iframe.style.zIndex = '9999';
  iframe.style.transition = 'all 0.3s ease';
  iframe.style.overflow = 'hidden';
  iframe.style.borderRadius = '50%';
  iframe.frameBorder = '0';
  iframe.allowTransparency = true;
  
  // Add the iframe to the container
  container.appendChild(iframe);
  
  // Set up message listener for iframe resize
  window.addEventListener('message', function(event) {
    if (event.origin !== 'https://skylagoon-chat-demo.vercel.app') return;
    
    if (event.data && event.data.type === 'resize') {
      iframe.style.width = event.data.width;
      iframe.style.height = event.data.height;
      
      if (event.data.width === '70px') {
        iframe.style.borderRadius = '50%';
      } else {
        iframe.style.borderRadius = '16px';
      }
    }
  });
  
  // Log test message
  console.log("Test embed script loaded successfully");
})();

