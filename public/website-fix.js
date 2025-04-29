/**
 * Sky Lagoon Website Style Fix
 * 
 * This script fixes styling issues caused by CSS interactions between
 * the Sky Lagoon chat widget and the main website. Specifically, it addresses:
 * 
 * 1. List bullets and numbers not displaying properly
 * 2. Paragraph and heading margins being removed
 * 3. Logo alignment issues in the booking flow
 * 
 * The script uses direct DOM manipulation and targeted CSS to restore
 * proper styling without affecting the chat widget functionality.
 * 
 * Created: April 2025
 */

(function() {
  console.log('Sky Lagoon Website Fix Script Loaded');
  
  // Function to fix specific issues
  function applyWebsiteFixes() {
    console.log('Applying website fixes');
    
    // Fix 1: Restore list bullets and numbering
    document.querySelectorAll('ul:not(.sky-lagoon-chat-widget ul)').forEach(ul => {
      ul.style.listStyleType = 'disc';
      ul.style.paddingLeft = '2em';
      
      ul.querySelectorAll('li').forEach(li => {
        li.style.display = 'list-item';
        li.style.position = 'relative';
      });
    });
    
    document.querySelectorAll('ol:not(.sky-lagoon-chat-widget ol)').forEach(ol => {
      ol.style.listStyleType = 'decimal';
      ol.style.paddingLeft = '2em';
      
      ol.querySelectorAll('li').forEach(li => {
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
    /* High priority fixes */
    body ul:not(.sky-lagoon-chat-widget ul) {
      list-style-type: disc !important;
      padding-left: 2em !important;
    }
    
    body ol:not(.sky-lagoon-chat-widget ol) {
      list-style-type: decimal !important;
      padding-left: 2em !important;
    }
    
    body ul:not(.sky-lagoon-chat-widget ul) li,
    body ol:not(.sky-lagoon-chat-widget ol) li {
      display: list-item !important;
      position: relative !important;
    }
    
    /* Remove any ::before pseudo elements on list items that might be interfering */
    body ul:not(.sky-lagoon-chat-widget ul) li::before,
    body ol:not(.sky-lagoon-chat-widget ol) li::before {
      display: none !important;
      content: none !important;
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