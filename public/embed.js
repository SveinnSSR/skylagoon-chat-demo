// Widget Embed Script
(function() {
  // REMOVED failsafe return line
  
  // Preload React dependencies
  const preloadReact = document.createElement('link');
  preloadReact.rel = 'preload';
  preloadReact.href = 'https://unpkg.com/react@18/umd/react.production.min.js';
  preloadReact.as = 'script';
  preloadReact.crossOrigin = 'anonymous';
  document.head.appendChild(preloadReact);

  const preloadReactDOM = document.createElement('link');
  preloadReactDOM.rel = 'preload';
  preloadReactDOM.href = 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js';
  preloadReactDOM.as = 'script';
  preloadReactDOM.crossOrigin = 'anonymous';
  document.head.appendChild(preloadReactDOM);
  
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
  iframe.allow = "clipboard-read; clipboard-write";
  
  // REMOVED failsafe line
  
  document.body.appendChild(iframe);
  
  window.addEventListener('message', function(event) {
    if (event.origin !== 'https://skylagoon-chat-demo.vercel.app') return;
    
    console.log('Parent received message:', event.data);
    
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