/**
 * Sky Lagoon Website Style Fix
 * 
 * This script fixes styling issues caused by CSS interactions between
 * the Sky Lagoon chat widget and the main website. Specifically, it addresses:
 * 
 * 1. List bullets and numbers not displaying properly in content areas
 * 2. Paragraph and heading margins being removed
 * 3. Logo alignment issues in the booking flow
 * 
 * Created: April 2025
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
    
    // Fix 4: Fix booking logo alignment
    document.querySelectorAll('img[src*="booking-logo"], img[src*="logo-skylagoon"], .header img').forEach(logo => {
      if (logo.parentElement) {
        logo.parentElement.style.textAlign = 'center';
      }
      logo.style.margin = '0 auto';
      logo.style.display = 'inline-block';
    });
    
    // Fix 5: VERY targeted language selector color fix - ONLY for side menu
    // Only target the overlay/side menu context where "EN" was black
    document.querySelectorAll('.overlay a, .side-menu a, [role="dialog"] a, .drawer a, .modal a').forEach(link => {
      if ((link.textContent.trim() === 'EN' || 
           link.textContent.trim() === 'IS / EN' ||
           link.textContent.includes('EN')) && 
          getComputedStyle(link).color === 'rgb(0, 0, 0)') {  // Only fix if it's black
        link.style.color = '#70744E'; // Sky Lagoon green color
      }
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
    
    /* Logo alignment */
    .header img, [class*="header"] img[src*="logo"] {
      margin: 0 auto !important;
      display: inline-block !important;
    }
    
    .header, [class*="header"] {
      text-align: center !important;
    }
  `;
  document.head.appendChild(fixStyles);
  
})();