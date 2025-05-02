/**
 * Sky Lagoon Website Targeted Element Fix - Lightweight Version
 * 
 * Temporary fix while we work on tailwindcss-scoped-preflight and only scope widget CSS
 * This file will be removed
 */
(function() {
  console.log('Sky Lagoon Website Targeted Fix Loaded - Lightweight Version');
  
  // Add a class to the body to make site-wide selectors easier
  document.body.classList.add('skylagoon-site');
  
  // Create a collection of CSS fixes that are element-specific
  const cssPatches = document.createElement('style');
  cssPatches.id = 'sky-lagoon-targeted-fixes';
  cssPatches.textContent = `
    /* Only affect specific elements by their exact path - NOT global selectors */
    
    /* 1. Booking logo fixes - using parent container paths */
    .skylagoon-site a[title="Logo"] img {
      margin-left: auto !important;
      margin-right: auto !important;
      display: block !important;
    }
    
    .skylagoon-site a[title="Logo"] {
      text-align: center !important;
      display: block !important;
    }
    
    /* 2. Skjól ritual headings - using parent container paths */
    .skylagoon-site .hero-text-inner h1.display-3 {
      text-align: left !important;
      margin-bottom: 1rem !important;
    }
    
    .skylagoon-site .hero-text-inner p {
      text-align: left !important;
      margin-bottom: 1rem !important;
    }
    
    /* 3. Icon centering for specific image paths */
    .skylagoon-site img.content-icon.mb-3,
    .skylagoon-site img[src*="icon-sun.svg"],
    .skylagoon-site img[title*="Experience the Heart"],
    .skylagoon-site img[src*="Turfhouse.svg"] {
      display: block !important;
      margin-left: auto !important;
      margin-right: auto !important;
    }
    
    /* 4. Required Field text in booking flow */
    .skylagoon-site div.fs-xs.fw-bold.text-moss {
      text-align: left !important;
      justify-content: flex-start !important;
    }
    
    /* 5. List styling for content areas only */
    .skylagoon-site .strip-content ul:not(.sky-lagoon-chat-widget ul),
    .skylagoon-site article ul:not(.sky-lagoon-chat-widget ul),
    .skylagoon-site .terms-content ul:not(.sky-lagoon-chat-widget ul) {
      list-style-type: disc !important;
      padding-left: 2em !important;
    }
    
    .skylagoon-site .strip-content ol:not(.sky-lagoon-chat-widget ol),
    .skylagoon-site article ol:not(.sky-lagoon-chat-widget ol),
    .skylagoon-site .terms-content ol:not(.sky-lagoon-chat-widget ol) {
      list-style-type: decimal !important;
      padding-left: 2em !important;
    }
    
    /* 6. List items in content areas */
    .skylagoon-site .strip-content ul:not(.sky-lagoon-chat-widget ul) li,
    .skylagoon-site article ul:not(.sky-lagoon-chat-widget ul) li,
    .skylagoon-site .terms-content ul:not(.sky-lagoon-chat-widget ul) li,
    .skylagoon-site .strip-content ol:not(.sky-lagoon-chat-widget ol) li,
    .skylagoon-site article ol:not(.sky-lagoon-chat-widget ol) li,
    .skylagoon-site .terms-content ol:not(.sky-lagoon-chat-widget ol) li {
      display: list-item !important;
      position: relative !important;
    }
    
    /* 7. Fix for headings margin */
    .skylagoon-site h1:not(.sky-lagoon-chat-widget h1),
    .skylagoon-site h2:not(.sky-lagoon-chat-widget h2),
    .skylagoon-site h3:not(.sky-lagoon-chat-widget h3) {
      margin-bottom: 1rem !important;
    }
    
    /* 8. Fix for paragraph margin */
    .skylagoon-site p:not(.sky-lagoon-chat-widget p) {
      margin-bottom: 1rem !important;
    }
  `;
  document.head.appendChild(cssPatches);
  
  // Create a tailwind isolation module
  const tailwindIsolation = document.createElement('style');
  tailwindIsolation.id = 'sky-lagoon-tailwind-isolation';
  tailwindIsolation.textContent = `
    /* Reset Tailwind preflight effects on non-widget elements */
    /* This counters Tailwind's global reset effects */
    
    /* Keep border-box for our widget only */
    .sky-lagoon-chat-widget, 
    .sky-lagoon-chat-widget *,
    .sky-lagoon-chat-widget *::before,
    .sky-lagoon-chat-widget *::after {
      box-sizing: border-box !important;
    }
  `;
  document.head.appendChild(tailwindIsolation);
  
  // Functions to check for specific elements - lightweight versions
  function applyElementSpecificFixes() {
    // Only run if we're not in the chat widget
    if (document.querySelector('.sky-lagoon-chat-widget')) {
      return;
    }
    
    // 1. Fix booking logos
    document.querySelectorAll('a[title="Logo"] img').forEach(img => {
      if (!img.closest('.sky-lagoon-chat-widget')) {
        img.style.setProperty('margin-left', 'auto', 'important');
        img.style.setProperty('margin-right', 'auto', 'important');
        img.style.setProperty('display', 'block', 'important');
        
        // Fix parent link
        const logoLink = img.closest('a[title="Logo"]');
        if (logoLink) {
          logoLink.style.setProperty('text-align', 'center', 'important');
          logoLink.style.setProperty('display', 'block', 'important');
        }
      }
    });
    
    // 2. Fix Turf House and content icons
    const iconSelectors = [
      'img.content-icon.mb-3', 
      'img[src*="icon-sun.svg"]',
      'img[title*="Experience the Heart"]',
      'img[src*="Turfhouse.svg"]'
    ];
    
    iconSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(icon => {
        if (!icon.closest('.sky-lagoon-chat-widget')) {
          icon.style.setProperty('display', 'block', 'important');
          icon.style.setProperty('margin-left', 'auto', 'important');
          icon.style.setProperty('margin-right', 'auto', 'important');
          
          // Fix parent as well
          if (icon.parentElement) {
            icon.parentElement.style.setProperty('text-align', 'center', 'important');
          }
        }
      });
    });
    
    // 3. Fix "Required Field" text
    document.querySelectorAll('div.fs-xs.fw-bold.text-moss').forEach(el => {
      if (el && el.textContent && el.textContent.includes('Required Field') &&
          !el.closest('.sky-lagoon-chat-widget')) {
        el.style.setProperty('text-align', 'left', 'important');
        el.style.setProperty('justify-content', 'flex-start', 'important');
      }
    });
  }
  
  // Run only a limited number of times
  // First on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyElementSpecificFixes);
  } else {
    applyElementSpecificFixes();
  }
  
  // Then for dynamic content, with increasing delays
  const intervals = [500, 1000, 2000];
  intervals.forEach(delay => {
    setTimeout(applyElementSpecificFixes, delay);
  });
  
  // Special handling for booking pages
  if (window.location.href.includes('/booking/')) {
    intervals.forEach(delay => {
      setTimeout(applyElementSpecificFixes, delay + 1000);
    });
  }
})();