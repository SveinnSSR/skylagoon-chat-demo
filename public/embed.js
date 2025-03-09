// Simplified embed.js for testing
(function() {
  // Create iframe for the chat widget
  const iframe = document.createElement('iframe');
  
  iframe.src = 'https://skylagoon-chat-demo.vercel.app/widget.html';
  iframe.style.position = 'fixed';
  iframe.style.bottom = '20px';
  iframe.style.right = '20px';
  iframe.style.width = '80px';
  iframe.style.height = '80px';
  iframe.style.border = 'none';
  iframe.style.zIndex = '9999';
  iframe.style.borderRadius = '50%';
  
  // Add iframe to page
  document.body.appendChild(iframe);
  
  // Log for debugging
  console.log('Sky Lagoon Chat Widget initialized');
})();


