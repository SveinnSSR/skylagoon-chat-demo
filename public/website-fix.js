/**
 * Sky Lagoon Website Style Fix
 * 
 * This script fixes styling issues caused by CSS interactions between
 * the Sky Lagoon chat widget and the main website, addressing only the
 * specific issues reported by John.
 * 
 * Created: April 2025
 */
(function() {
  console.log('Sky Lagoon Website Fix Script Loaded');
  
  // Function to fix specific issues
  function applyWebsiteFixes() {
    console.log('Applying website fixes');
    
    // Fix 1: Restore list bullets and numbering ONLY in content areas
    document.querySelectorAll('.strip-content ul, article ul, main ul, .terms-content ul, .strip-content ol, article ol, main ol, .terms-content ol').forEach(list => {
      list.style.listStyleType = list.tagName === 'UL' ? 'disc' : 'decimal';
      list.style.paddingLeft = '2em';
      
      list.querySelectorAll('li').forEach(li => {
        li.style.display = 'list-item';
        li.style.position = 'relative';
      });
    });
    
    // Fix 2: Add margins to headings and paragraphs
    document.querySelectorAll('h1:not(.sky-lagoon-chat-widget h1), h2:not(.sky-lagoon-chat-widget h2), h3:not(.sky-lagoon-chat-widget h3)').forEach(heading => {
      heading.style.marginBottom = '1rem';
    });
    
    document.querySelectorAll('p:not(.sky-lagoon-chat-widget p)').forEach(p => {
      p.style.marginBottom = '1rem';
    });
    
    // Fix 3: Fix booking logo alignment
    document.querySelectorAll('img[src*="booking-logo"], img[src*="logo-skylagoon"], .checkout-header img').forEach(logo => {
      if (logo.parentElement) {
        logo.parentElement.style.textAlign = 'center';
      }
      logo.style.margin = '0 auto';
      logo.style.display = 'inline-block';
    });
    
    // Fix 4: Fix black EN in menus - ONLY target black EN links
    document.querySelectorAll('a, span').forEach(el => {
      if (el.textContent.trim() === 'EN' && 
          window.getComputedStyle(el).color === 'rgb(0, 0, 0)') {
        el.style.color = '#70744E'; // Sky Lagoon green color
      }
    });
  }
  
  // Apply fixes after a delay to ensure the page is loaded
  setTimeout(applyWebsiteFixes, 300);
  setTimeout(applyWebsiteFixes, 1000);
  
  // Create a CSS style element with minimal fixes
  const fixStyles = document.createElement('style');
  fixStyles.id = 'sky-lagoon-fixes';
  fixStyles.textContent = `
    /* Content list styling fixes */
    .strip-content ul, article ul, main ul, .terms-content ul {
      list-style-type: disc !important;
      padding-left: 2em !important;
    }
    
    .strip-content ol, article ol, main ol, .terms-content ol {
      list-style-type: decimal !important;
      padding-left: 2em !important;
    }
    
    .strip-content li, article li, main li, .terms-content li {
      display: list-item !important;
    }
    
    /* Fix margins */
    h1:not(.sky-lagoon-chat-widget h1),
    h2:not(.sky-lagoon-chat-widget h2),
    h3:not(.sky-lagoon-chat-widget h3) {
      margin-bottom: 1rem !important;
    }
    
    p:not(.sky-lagoon-chat-widget p) {
      margin-bottom: 1rem !important;
    }
    
    /* Fix for pagination dots at bottom of booking page */
    [role="tablist"] li,
    .pagination li,
    .dots li {
      display: inline-block !important;
      list-style-type: none !important;
    }
    
    /* Booking logo alignment */
    .checkout-header img {
      margin: 0 auto !important;
      display: inline-block !important;
    }
  `;
  document.head.appendChild(fixStyles);
})();