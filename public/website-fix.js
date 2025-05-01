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
    
    /* Fix 5: ULTRA-SPECIFIC Booking logo alignment based on actual DOM structure */
    .col.text-center a[title="Logo"],
    .header a[title="Logo"],
    .col.text-center a[href="/"],
    div[class*="header"] a[title="Logo"] {
      display: block !important;
      text-align: center !important;
      width: 100% !important;
    }
    
    /* Super specific logo image selectors based on your screenshots */
    img[src*="booking-logo-dark.svg"],
    img[src*="logo-white.svg"],
    img[src*="booking-logo-mobile.svg"],
    .col.text-center img[alt*="Logo"],
    .header img[alt*="Logo"] {
      display: block !important;
      margin-left: auto !important;
      margin-right: auto !important;
    }
    
    /* Fix the parent containers of the logo */
    .row.d-none.d-lg-flex,
    .container-fluid,
    .header.position-absolute,
    div[class*="col"].text-center {
      text-align: center !important;
    }
    
    /* Fix 6: ENHANCED - Keep headers on experience and ritual pages left-aligned */
    .hero-text-header, 
    .experience-header, 
    .ritual-header,
    h1.left-aligned,
    h1.display-3,
    .display-3,
    h1 + p,
    .strip-container h1,
    .strip-container .h1,
    .strip-skjol h1,
    .strip h1,
    [class*="hero-text"] h1,
    [class*="hero-text"] .h1,
    [class*="hero-text"] p {
      text-align: left !important;
      justify-content: flex-start !important;
    }
    
    /* Fix 7: Keep TripAdvisor logo centered */
    img[src*="tripadvisor"], 
    img[alt*="tripadvisor"] {
      margin: 0 auto !important;
      display: block !important;
    }
    
    /* Fix 8: Black EN language selector color fix - more specific */
    .cultures-list a.active[href="/en"],
    ul.cultures-list li a[href="/en"],
    a[aria-label="EN"],
    a[href="/en"],
    .navbar a[href="/en"],
    .side-menu a[href*="/en"],
    .hamburger-menu a[href*="/en"],
    .modal a[href*="/en"],
    .overlay a[href*="/en"],
    [role="dialog"] a[href*="/en"] {
      color: #70744E !important; /* Sky Lagoon green color */
    }
    
    /* Fix 9: Required Field text alignment */
    .fs-xs.fw-bold.text-moss.px-3,
    div[class*="fs-xs"][class*="fw-bold"][class*="text-moss"],
    div[class*="text-center"][class*="py-2"],
    div[class*="fs-xs"] {
      text-align: left !important;
      justify-content: flex-start !important;
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
  
  // Targeted, lightweight JS for specific fixes
  function applyLightweightFixes() {
    // Fix 1: Black EN text fix
    document.querySelectorAll('a[href="/en"], a[aria-label="EN"], ul.cultures-list a').forEach(el => {
      if (window.getComputedStyle(el).color === 'rgb(0, 0, 0)') {
        el.style.setProperty('color', '#70744E', 'important');
      }
    });
    
    // Fix 2: Booking logo centering (super specific)
    document.querySelectorAll('a[title="Logo"]').forEach(logoLink => {
      logoLink.style.setProperty('text-align', 'center', 'important');
      logoLink.style.setProperty('display', 'block', 'important');
      logoLink.style.setProperty('width', '100%', 'important');
      
      // Get the image inside
      const logoImg = logoLink.querySelector('img');
      if (logoImg) {
        logoImg.style.setProperty('margin-left', 'auto', 'important');
        logoImg.style.setProperty('margin-right', 'auto', 'important');
        logoImg.style.setProperty('display', 'block', 'important');
      }
      
      // Get parent container and set its alignment too
      if (logoLink.parentElement) {
        logoLink.parentElement.style.setProperty('text-align', 'center', 'important');
      }
    });
    
    // Fix 3: Skjól Ritual and Experience page headers
    document.querySelectorAll('h1.display-3, .display-3, [class*="hero-text"] h1, [class*="hero-text"] p').forEach(el => {
      el.style.setProperty('text-align', 'left', 'important');
      el.style.setProperty('justify-content', 'flex-start', 'important');
    });
    
    // Fix 4: Required Field text
    document.querySelectorAll('div').forEach(el => {
      if (el.textContent && el.textContent.includes('Required Field')) {
        el.style.setProperty('text-align', 'left', 'important');
        el.style.setProperty('justify-content', 'flex-start', 'important');
        
        // Also fix parent container if needed
        if (el.parentElement) {
          el.parentElement.style.setProperty('text-align', 'left', 'important');
          el.parentElement.style.setProperty('justify-content', 'flex-start', 'important');
        }
      }
    });
  }
  
  // Apply fixes after page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyLightweightFixes);
  } else {
    applyLightweightFixes();
  }
  
  // Apply multiple times with increasing delays to catch dynamic changes
  setTimeout(applyLightweightFixes, 500);
  setTimeout(applyLightweightFixes, 1000);
  
  // Only on booking and experience pages, add extra checks
  if (window.location.href.includes('/booking/') || 
      window.location.href.includes('/experience/') || 
      window.location.href.includes('/ritual/')) {
    setTimeout(applyLightweightFixes, 1500);
    setTimeout(applyLightweightFixes, 2000);
  }
})();