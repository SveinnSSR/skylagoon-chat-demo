// Simple test embed script
(function() {
  console.log('Test embed script loaded successfully');
  
  // Remove any existing iframe
  const existingIframe = document.getElementById('sky-lagoon-chat-iframe');
  if (existingIframe) {
    existingIframe.remove();
  }
  
  // Create an iframe pointing to our widget
  const iframe = document.createElement('iframe');
  iframe.id = 'sky-lagoon-chat-iframe';
  iframe.src = `file://${window.location.pathname.split('/').slice(0, -1).join('/')}/build/widget-embed.html?language=en`;
  iframe.style.position = 'fixed';
  iframe.style.bottom = '20px';
  iframe.style.right = '20px';
  iframe.style.width = '80px';
  iframe.style.height = '80px';
  iframe.style.border = 'none';
  iframe.style.backgroundColor = 'transparent';
  iframe.style.zIndex = '9999';
  
  document.body.appendChild(iframe);
  
  // Listen for messages from the iframe
  window.addEventListener('message', function(event) {
    console.log('Received message from iframe:', event.data);
    
    if (event.data && event.data.type === 'resize') {
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
