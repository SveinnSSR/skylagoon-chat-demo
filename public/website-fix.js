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
    
    /* Fix 8: Black EN language selector color fix - more specific */
    .side-menu a[href*="/en"],
    .hamburger-menu a[href*="/en"],
    .modal a[href*="/en"],
    .overlay a[href*="/en"],
    [role="dialog"] a[href*="/en"] {
      color: #70744E !important; /* Sky Lagoon green color */
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
    div:has(> img.content-icon.mb-3),
    div:has(> img[src*="icon-sun.svg"]),
    div.hero-image,
    .strip-container,
    .col-lg-12 {
      text-align: center !important;
    }
  `;
  document.head.appendChild(fixStyles);
  
  // Targeted, lightweight JS for black EN text
  function applyLightweightFixes() {
    // More aggressive fix for black EN text
    setTimeout(() => {
      // Target all possible containers that might have the black EN text
      document.querySelectorAll('a, span').forEach(el => {
        // Only check visible elements with "EN" text that are black
        if ((el.textContent.trim() === 'EN' || el.textContent.trim() === 'IS / EN') && 
            window.getComputedStyle(el).color === 'rgb(0, 0, 0)') {
          el.style.color = '#70744E'; // Sky Lagoon green color
        }
      });
    }, 500);
  }
  
  // Apply fixes after page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyLightweightFixes);
  } else {
    applyLightweightFixes();
  }
  
  // One additional delayed application to catch any late-loading elements
  setTimeout(applyLightweightFixes, 1000);
})();