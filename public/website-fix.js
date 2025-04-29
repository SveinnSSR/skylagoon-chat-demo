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
    
    // Fix 4: Super-targeted booking logo fix - directly targeting the exact element we see in dev tools
    document.querySelectorAll('img[src*="booking-logo-mobile.svg"], .header img[src*="logo"]').forEach(logo => {
      // Find the header container
      const header = logo.closest('.header') || logo.closest('[class*="header"]');
      if (header) {
        // Make the header itself center-aligned
        header.style.justifyContent = 'center';
        header.style.textAlign = 'center';
        
        // Handle the anchor tag if present
        const anchor = logo.parentElement && logo.parentElement.tagName === 'A' ? logo.parentElement : null;
        if (anchor) {
          anchor.style.display = 'inline-block';
          anchor.style.margin = '0 auto';
        }
        
        // Style the logo itself
        logo.style.margin = '0 auto';
        logo.style.display = 'inline-block';
      }
    });
    
    // Fix 5: VERY targeted language selector color fix
    // First, use attribute selectors for all EN links in overlays
    document.querySelectorAll('.overlay a, .side-menu a, [role="dialog"] a, .drawer a, .modal a, .hamburger-menu a').forEach(link => {
      // Check if it contains "EN" text and is currently black
      if ((link.textContent.trim() === 'EN' || 
           link.textContent.includes('EN') || 
           link.textContent.includes('/ EN')) && 
          getComputedStyle(link).color === 'rgb(0, 0, 0)') {
        
        link.style.color = '#70744E'; // Sky Lagoon green color
        console.log('Fixed black EN link:', link);
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
    
    // SUPER TARGETED fix for black EN in hamburger menu
    // This uses a more aggressive approach to find and fix these specifically
    setTimeout(() => {
      // After a delay, check for all spans and links on the page
      document.querySelectorAll('*').forEach(el => {
        // Only process elements that are visible
        const style = window.getComputedStyle(el);
        if (style.display !== 'none' && style.visibility !== 'hidden') {
          // Check if this contains exactly "EN" text and is black
          if (el.textContent === 'EN' && style.color === 'rgb(0, 0, 0)') {
            el.style.color = '#70744E';
            console.log('Fixed isolated black EN text:', el);
          }
          // Also check for "IS / EN" format
          else if (el.textContent === 'IS / EN' && style.color === 'rgb(0, 0, 0)') {
            // Find the EN part and color it
            Array.from(el.childNodes).forEach(node => {
              if (node.textContent && node.textContent.includes('EN')) {
                if (node.nodeType === Node.TEXT_NODE) {
                  // If it's a text node, wrap it in a span to style it
                  const span = document.createElement('span');
                  span.textContent = node.textContent;
                  span.style.color = '#70744E';
                  node.parentNode.replaceChild(span, node);
                } else {
                  node.style.color = '#70744E';
                }
              }
            });
          }
        }
      });
    }, 1000); // Wait 1 second after page elements have loaded
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
    
    /* SUPER-TARGETED BOOKING PAGE Logo alignment */
    .header img[src*="booking-logo-mobile.svg"],
    .header img[src*="logo"],
    [class*="header"] img[src*="logo"] {
      display: block !important;
      margin: 0 auto !important;
    }
    
    /* Target the direct parent of the booking logo */
    .header a[title="Home"],
    [class*="header"] a[title="Home"] {
      display: block !important;
      margin: 0 auto !important;
      text-align: center !important;
    }
    
    /* Target the header itself */
    .header, [class*="header"] {
      justify-content: center !important;
      text-align: center !important;
      display: flex !important;
      align-items: center !important;
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
    .overlay a[href*="/en"],
    .modal a[href*="/en"],
    .side-menu a[href*="/en"],
    .hamburger-menu a[href*="/en"],
    [role="dialog"] a[href*="/en"] {
      color: #70744E !important;
    }
    
    /* Super specific fix for black EN text */
    [class*="menu"] a:contains("EN"),
    .overlay a:contains("EN"),
    .modal a:contains("EN") {
      color: #70744E !important;
    }
  `;
  document.head.appendChild(fixStyles);
  
  // Add a special fix for :contains which doesn't exist in CSS
  try {
    // Create a stylesheet for JavaScript-based dynamic rules
    const dynamicSheet = document.createElement('style');
    document.head.appendChild(dynamicSheet);
    
    // Use JavaScript to find and fix all black EN links
    function fixBlackENLinks() {
      document.querySelectorAll('a, span, div').forEach(el => {
        if ((el.textContent.trim() === 'EN' || el.textContent.trim() === 'IS / EN') && 
            window.getComputedStyle(el).color === 'rgb(0, 0, 0)') {
          // Skip if it's inside the chat widget
          if (!el.closest('.sky-lagoon-chat-widget')) {
            el.style.color = '#70744E';
            
            // For combined elements like "IS / EN", style just the EN part if possible
            if (el.textContent.trim() === 'IS / EN') {
              el.innerHTML = el.innerHTML.replace(
                /EN/g, 
                '<span style="color: #70744E !important;">EN</span>'
              );
            }
          }
        }
      });
    }
    
    // Run this fix multiple times to catch dynamic elements
    fixBlackENLinks();
    setTimeout(fixBlackENLinks, 1000);
    setTimeout(fixBlackENLinks, 2000);
  } catch (e) {
    console.error('Dynamic EN fix failed:', e);
  }
})();