// Sky Lagoon Chat Widget Embed Script
(function() {
  // Create iframe for the chat widget
  const iframe = document.createElement('iframe');
  
  // Set iframe attributes with !important to override any site styles
  iframe.style.cssText = `
    position: fixed !important;
    bottom: 20px !important;
    right: 20px !important;
    width: 80px !important; 
    height: 80px !important;
    border: none !important;
    outline: none !important;
    background-color: transparent !important;
    z-index: 999999 !important;
    overflow: hidden !important;
    border-radius: 50% !important;
    transition: all 0.3s ease !important;
  `;
  
  iframe.id = 'sky-lagoon-chat-iframe';
  iframe.src = 'https://skylagoon-chat-demo-git-test-reac-d54b8a-svorum-straxs-projects.vercel.app/widget.html';
  iframe.frameBorder = '0';
  iframe.scrolling = 'no';
  
  // Add iframe to page
  document.body.appendChild(iframe);
  
  // Listen for resize events
  window.addEventListener('message', function(event) {
    if (event.origin !== 'https://skylagoon-chat-demo.vercel.app') return;
    
    if (event.data && event.data.type === 'resize') {
      if (event.data.isMinimized) {
        iframe.style.cssText = `
          position: fixed !important;
          bottom: 20px !important;
          right: 20px !important;
          width: 80px !important;
          height: 80px !important;
          border: none !important;
          outline: none !important;
          background-color: transparent !important;
          z-index: 999999 !important;
          overflow: hidden !important;
          border-radius: 50% !important;
          transition: all 0.3s ease !important;
        `;
      } else {
        iframe.style.cssText = `
          position: fixed !important;
          bottom: 20px !important;
          right: 20px !important;
          width: 380px !important;
          height: 550px !important;
          border: none !important;
          outline: none !important;
          background-color: transparent !important;
          z-index: 999999 !important;
          overflow: hidden !important;
          border-radius: 12px !important;
          transition: all 0.3s ease !important;
        `;
      }
    }
  });
})();
