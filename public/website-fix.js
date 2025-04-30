/**
 * Sky Lagoon Website Style Fix (Mobile-Friendly Version)
 * 
 * This script fixes styling issues caused by CSS interactions between
 * the Sky Lagoon chat widget and the main website, optimized for mobile.
 * 
 * Created: April 2025
 * Last updated: April 30, 2025
 */
(function() {
  console.log('Sky Lagoon Mobile-Friendly Website Fix Loaded');
  
  // Create a CSS style element with all fixes primarily using CSS instead of JS
  const fixStyles = document.createElement('style');
  fixStyles.id = 'sky-lagoon-fixes';
  fixStyles.textContent = `
    /* Fix 1: List bullets and numbers for content areas */
    .strip-content ul:not(.sky-lagoon-chat-widget ul),
    article ul:not(.sky-lagoon-chat-widget ul),
    main ul:not(.sky-lagoon-chat-widget ul),
    .terms-content ul:not(.sky-lagoon-chat-widget ul) {
      list-style-type: disc !important;
      padding-left: 2em !important;
    }
    
    .strip-content ol:not(.sky-lagoon-chat-widget ol),
    article ol:not(.sky-lagoon-chat-widget ol),
    main ol:not(.sky-lagoon-chat-widget ol),
    .terms-content ol:not(.sky-lagoon-chat-widget ol) {
      list-style-type: decimal !important;
      padding-left: 2em !important;
    }
    
    .strip-content ul:not(.sky-lagoon-chat-widget ul) li,
    article ul:not(.sky-lagoon-chat-widget ul) li,
    main ul:not(.sky-lagoon-chat-widget ul) li,
    .terms-content ul:not(.sky-lagoon-chat-widget ul) li,
    .strip-content ol:not(.sky-lagoon-chat-widget ol) li,
    article ol:not(.sky-lagoon-chat-widget ol) li,
    main ol:not(.sky-lagoon-chat-widget ol) li,
    .terms-content ol:not(.sky-lagoon-chat-widget ol) li {
      display: list-item !important;
      position: relative !important;
    }
    
    /* Fix 2: Remove unwanted bullets from navigation elements */
    nav ul, 
    footer ul, 
    .pagination ul,
    header ul,
    .nav-bar ul,
    [class*="language"] ul,
    [class*="menu"] ul,
    [role="navigation"] ul,
    [class*="switcher"] ul,
    .social-links ul {
      list-style-type: none !important;
      padding-left: 0 !important;
    }
    
    nav li, 
    footer li, 
    .pagination li,
    header li,
    .nav-bar li,
    [class*="language"] li,
    [class*="menu"] li,
    [role="navigation"] li,
    [class*="switcher"] li,
    .social-links li {
      display: inline-block !important;
      list-style-type: none !important;
    }
    
    /* Fix 3: Pagination dots at bottom of booking page */
    [role="tablist"] li,
    .dots li,
    .pagination-dots li,
    [class*="slider"] li,
    [class*="carousel"] li,
    [class*="indicators"] li,
    [class*="pagination"] li,
    [class*="dots"] li,
    [class*="step"] li {
      display: inline-block !important;
      list-style-type: none !important;
    }
    
    /* Fix 4: Margins for headings and paragraphs */
    h1:not(.sky-lagoon-chat-widget h1),
    h2:not(.sky-lagoon-chat-widget h2),
    h3:not(.sky-lagoon-chat-widget h3) {
      margin-bottom: 1rem !important;
    }
    
    p:not(.sky-lagoon-chat-widget p) {
      margin-bottom: 1rem !important;
    }
    
    /* Fix 5: Booking logo alignment using simpler selectors */
    .checkout-header img[src*="logo-skylagoon"], 
    .checkout-header img[src*="booking-logo"],
    .checkout-header img[src*="booking-logo-mobile.svg"] {
      display: block !important;
      margin-left: auto !important;
      margin-right: auto !important;
    }
    
    /* Target the header itself with a simpler selector */
    .checkout-header, header[class*="checkout"] {
      text-align: center !important;
    }
    
    /* Fix 6: Keep headers on experience and ritual pages left-aligned */
    .hero-text-header, 
    .experience-header, 
    .ritual-header,
    h1.left-aligned {
      text-align: left !important;
    }
    
    /* Fix 7: Keep TripAdvisor logo centered */
    img[src*="tripadvisor"], 
    img[alt*="tripadvisor"] {
      margin: 0 auto !important;
      display: block !important;
    }
    
    /* Fix for the Sun icon (added back from WidgetStandalone.jsx) */
    img.content-icon.mb-3, 
    img[src*="icon-sun.svg"],
    .content-icon.mb-3,
    img[title*="Experience the Heart of Icelandic Tradition"] {
      display: block !important;
      margin-left: auto !important;
      margin-right: auto !important;
      text-align: center !important;
      float: none !important;
      position: relative !important;
      left: auto !important;
      right: auto !important;
    }
    
    /* Parent containers for sun icon */
    div.hero-image,
    .strip-container,
    .col-lg-12 {
      text-align: center !important;
    }
    
    /* SUPER AGGRESSIVE fix for EN text in the menu */
    a[href*="/en"],
    span:only-child:contains("EN"),
    a:contains("EN"),
    span:contains("EN") {
      color: #70744E !important;
    }
  `;
  document.head.appendChild(fixStyles);
  
  // Handle the black EN text with a more targeted approach
  function fixBlackENText() {
    // Target elements that contain exactly "EN" or "IS / EN" text
    const possibleElements = [
      ...document.querySelectorAll('a'),
      ...document.querySelectorAll('span')
    ];
    
    possibleElements.forEach(el => {
      // Very specific targeting for the menu language switcher
      if (el.textContent.trim() === 'EN' || 
          el.textContent.trim() === 'IS / EN' || 
          el.textContent.includes('/ EN')) {
        
        const style = window.getComputedStyle(el);
        // Check if it's black or dark (covers various black color formats)
        if (style.color === 'rgb(0, 0, 0)' || 
            style.color === '#000' || 
            style.color === 'black' ||
            style.color.startsWith('rgba(0, 0, 0')) {
          
          // Force green color
          el.style.color = '#70744E !important';
          el.setAttribute('style', el.getAttribute('style') + '; color: #70744E !important');
          
          // If it contains both IS and EN, try to wrap just the EN part
          if (el.textContent.includes('IS / EN')) {
            try {
              el.innerHTML = el.innerHTML.replace(
                /EN/g, 
                '<span style="color: #70744E !important;">EN</span>'
              );
            } catch (e) {
              // Fallback - color the whole thing
              el.style.color = '#70744E';
            }
          }
        }
      }
    });
  }
  
  // More aggressive approach - run multiple times with increasing delays
  // This catches elements that might load dynamically
  fixBlackENText();
  setTimeout(fixBlackENText, 500);
  setTimeout(fixBlackENText, 1000);
  setTimeout(fixBlackENText, 2000);
  
  // Set up a very simple, lightweight mutation observer ONLY for the menu area
  // This is much lighter than watching the whole document
  setTimeout(() => {
    try {
      const menuElements = document.querySelectorAll('.overlay, .modal, .side-menu, [role="dialog"]');
      if (menuElements.length > 0) {
        const observer = new MutationObserver(() => {
          fixBlackENText();
        });
        
        menuElements.forEach(menu => {
          observer.observe(menu, { 
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
          });
        });
      }
    } catch (e) {
      console.error('Menu observer setup failed, falling back to timed checks');
    }
  }, 1000);
})();