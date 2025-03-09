(function() {
  const iframe = document.createElement('iframe');
  
  iframe.src = 'https://skylagoon-chat-demo.vercel.app/widget-embed.html';
  iframe.id = 'sky-lagoon-chat-iframe';
  
  iframe.style.position = 'fixed';
  iframe.style.bottom = '20px';
  iframe.style.right = '20px';
  
  iframe.style.width = '70px';
  iframe.style.height = '70px';
  
  iframe.style.border = 'none';
  iframe.style.borderRadius = '50%';
  iframe.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.15)';
  iframe.style.backgroundColor = '#70744E';
  
  iframe.style.zIndex = '9999';
  iframe.style.transition = 'all 0.3s ease';
  
  iframe.scrolling = 'no';
  iframe.frameBorder = '0';
  
  document.body.appendChild(iframe);
  
  window.addEventListener('message', function(event) {
    if (event.origin !== 'https://skylagoon-chat-demo.vercel.app') return;
    
    if (event.data && event.data.type === 'resize') {
      if (event.data.isMinimized) {
        iframe.style.width = '70px';
        iframe.style.height = '70px';
        iframe.style.borderRadius = '50%';
      } else {
        iframe.style.width = '380px';
        iframe.style.height = '550px';
        iframe.style.borderRadius = '12px';
      }
    }
  });
})();
