/**
 * Sky Lagoon Website Style Fix
 * 
 * This script fixes styling issues caused by CSS interactions between
 * the Sky Lagoon chat widget and the main website. Specifically, it addresses:
 * 
 * 1. List bullets and numbers not displaying properly in content areas
 * 2. Paragraph and heading margins being removed
 * 3. Logo alignment issues in the booking flow
 * 4. Language selector color in different contexts
 * 
 * Created: April 2025
 * Last updated: April 29, 2025
 */
(function() {
  console.log('Sky Lagoon Website Fix Script Loaded');
  
  // Function to fix specific issues
  function applyWebsiteFixes() {
    console.log('Applying website fixes');
    
    // Fix 1: Restore list bullets and numbering, but ONLY for content areas
    document.querySelectorAll('.strip-content ul, article ul, main ul, .terms-content ul, .strip-content ol, article ol, main ol, .terms-content ol').forEach(list => {
      list.style.listStyleType = list.tagName === 'UL' ? 'disc' : 'decimal';
      list.style.paddingLeft = '2em';
      
      list.querySelectorAll('li').forEach(li => {
        li.style.display = 'list-item';
        li.style.position = 'relative';
      });
    });
    
    // Fix 2: Add margins to headings
    document.querySelectorAll('h1:not(.sky-lagoon-chat-widget h1), h2:not(.sky-lagoon-chat-widget h2), h3:not(.sky-lagoon-chat-widget h3)').forEach(heading => {
      heading.style.marginBottom = '1rem';
    });
    
    // Fix 3: Ensure paragraphs have margins
    document.querySelectorAll('p:not(.sky-lagoon-chat-widget p)').forEach(p => {
      p.style.marginBottom = '1rem';
    });
    
    // Fix 4: Fix booking logo alignment - REVERTING to previous working approach
    document.querySelectorAll('img[src*="booking-logo"], img[src*="logo-skylagoon"], .checkout-header img').forEach(logo => {
      if (logo.parentElement) {
        logo.parentElement.style.textAlign = 'center';
      }
      logo.style.margin = '0 auto';
      logo.style.display = 'inline-block';
    });
    
    // Fix 5: VERY targeted language selector color fix - ONLY for black EN text
    document.querySelectorAll('.overlay a, .side-menu a, [role="dialog"] a, .drawer a, .modal a, .hamburger-menu a').forEach(link => {
      // Check if it contains "EN" text and is currently black
      if ((link.textContent.trim() === 'EN' || 
           link.textContent.includes('EN') || 
           link.textContent.includes('/ EN')) && 
          getComputedStyle(link).color === 'rgb(0, 0, 0)') {
        
        link.style.color = '#70744E'; // Sky Lagoon green color
      }
    });
    
    // Fix 6: Restore original text alignment on main content headings
    document.querySelectorAll('.hero-text-header, .experience-header, .ritual-header, h1.left-aligned, h1 + p').forEach(el => {
      el.style.textAlign = 'left';
    });
    
    // Fix 7: Ensure TripAdvisor logo stays centered
    document.querySelectorAll('img[src*="tripadvisor"], img[alt*="tripadvisor"]').forEach(logo => {
      if (logo.parentElement) {
        logo.parentElement.style.textAlign = 'center';
      }
      logo.style.margin = '0 auto';
      logo.style.display = 'block';
    });
    
    // Look for elements with bottom-margin-none and override if not in our widget
    document.querySelectorAll('[class*="bottom-margin-none"]').forEach(el => {
      if (!el.closest('.sky-lagoon-chat-widget')) {
        el.style.marginBottom = '1rem';
      }
    });
  }
  
  // Apply fixes immediately
  applyWebsiteFixes();
  
  // Also apply after a short delay to ensure everything has loaded
  setTimeout(applyWebsiteFixes, 500);
  setTimeout(applyWebsiteFixes, 1500);
  
  // Set up a MutationObserver to detect DOM changes and reapply fixes
  const observer = new MutationObserver((mutations) => {
    // Only reapply if there are significant DOM changes
    let shouldReapply = false;
    
    mutations.forEach(mutation => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        shouldReapply = true;
      }
    });
    
    if (shouldReapply) {
      applyWebsiteFixes();
    }
  });
  
  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false
  });
  
  // Create a CSS style element with higher priority fixes
  const fixStyles = document.createElement('style');
  fixStyles.id = 'sky-lagoon-fixes';
  fixStyles.textContent = `
    /* High priority fixes - now more targeted to content areas only */
    body .strip-content ul:not(.sky-lagoon-chat-widget ul),
    body article ul:not(.sky-lagoon-chat-widget ul),
    body main ul:not(.sky-lagoon-chat-widget ul),
    body .terms-content ul:not(.sky-lagoon-chat-widget ul) {
      list-style-type: disc !important;
      padding-left: 2em !important;
    }
    
    body .strip-content ol:not(.sky-lagoon-chat-widget ol),
    body article ol:not(.sky-lagoon-chat-widget ol),
    body main ol:not(.sky-lagoon-chat-widget ol),
    body .terms-content ol:not(.sky-lagoon-chat-widget ol) {
      list-style-type: decimal !important;
      padding-left: 2em !important;
    }
    
    body .strip-content ul:not(.sky-lagoon-chat-widget ul) li,
    body article ul:not(.sky-lagoon-chat-widget ul) li,
    body main ul:not(.sky-lagoon-chat-widget ul) li,
    body .terms-content ul:not(.sky-lagoon-chat-widget ul) li,
    body .strip-content ol:not(.sky-lagoon-chat-widget ol) li,
    body article ol:not(.sky-lagoon-chat-widget ol) li,
    body main ol:not(.sky-lagoon-chat-widget ol) li,
    body .terms-content ol:not(.sky-lagoon-chat-widget ol) li {
      display: list-item !important;
      position: relative !important;
    }
    
    /* Explicitly REMOVE bullets from navigation and UI elements */
    body nav ul, 
    body footer ul, 
    body .pagination ul,
    body header ul,
    body .nav-bar ul,
    body [class*="language"] ul,
    body [class*="menu"] ul,
    body [role="navigation"] ul,
    body [class*="switcher"] ul,
    body .social-links ul {
      list-style-type: none !important;
      padding-left: 0 !important;
    }
    
    body nav li, 
    body footer li, 
    body .pagination li,
    body header li,
    body .nav-bar li,
    body [class*="language"] li,
    body [class*="menu"] li,
    body [role="navigation"] li,
    body [class*="switcher"] li,
    body .social-links li {
      display: inline-block !important;
      list-style-type: none !important;
    }
    
    /* Fix for pagination dots at bottom of booking page */
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
    
    /* Fix margins */
    body h1:not(.sky-lagoon-chat-widget h1),
    body h2:not(.sky-lagoon-chat-widget h2),
    body h3:not(.sky-lagoon-chat-widget h3) {
      margin-bottom: 1rem !important;
    }
    
    body p:not(.sky-lagoon-chat-widget p) {
      margin-bottom: 1rem !important;
    }
    
    /* BOOKING PAGE Logo alignment - REVERTING to previous working approach */
    .checkout-header img, .checkout-header .logo,
    header[class*="checkout"] img,
    img[alt*="Sky Lagoon"] {
      margin: 0 auto !important;
      display: inline-block !important;
      text-align: initial !important;
      float: none !important;
    }
    
    /* Fix loading graphic alignment */
    .checkout-content img,
    img[alt*="loading"] {
      display: inline-block !important;
      float: none !important;
      text-align: initial !important;
    }
    
    /* Ensure headers on experience and ritual pages stay left-aligned */
    .hero-text-header, 
    .experience-header, 
    .ritual-header,
    h1.left-aligned,
    h1 + p {
      text-align: left !important;
    }
    
    /* Keep TripAdvisor logo centered */
    img[src*="tripadvisor"], 
    img[alt*="tripadvisor"] {
      margin: 0 auto !important;
      display: block !important;
    }
    
    /* Specific fix for sidebar menu EN language selector when it's black */
    .side-menu a[href*="/en"]:not([style*="color: rgb(255, 255, 255)"]),
    .hamburger-menu a[href*="/en"]:not([style*="color: rgb(255, 255, 255)"]),
    .modal a[href*="/en"]:not([style*="color: rgb(255, 255, 255)"]) {
      color: #70744E !important;
    }
  `;
  document.head.appendChild(fixStyles);
  
  // Fix for black EN text that dynamically loads
  function fixBlackENLinks() {
    document.querySelectorAll('a, span').forEach(el => {
      if (el.textContent.trim() === 'EN' && 
          window.getComputedStyle(el).color === 'rgb(0, 0, 0)') {
        // Skip if it's inside the chat widget
        if (!el.closest('.sky-lagoon-chat-widget')) {
          el.style.color = '#70744E';
        }
      }
    });
  }
  
  // Run this fix at different times to catch dynamic elements
  setTimeout(fixBlackENLinks, 1000);
  setTimeout(fixBlackENLinks, 2000);
})();