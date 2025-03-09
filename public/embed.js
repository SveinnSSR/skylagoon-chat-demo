// Widget Embed Script
(function() {
  return; // <-- ADD THIS LINE TO COMPLETELY PREVENT THE WIDGET FROM LOADING
  const iframe = document.createElement('iframe');
  
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
  iframe.src = 'https://skylagoon-chat-demo.vercel.app/widget.html';
  iframe.frameBorder = '0';
  iframe.scrolling = 'no';
  
  // failsafe: keep commented out
  iframe.style.display = 'none !important';
  document.body.appendChild(iframe);
  
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