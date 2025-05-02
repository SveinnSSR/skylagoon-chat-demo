/**
 * Sky Lagoon Website Element Fixes
 * 
 * This script directly fixes specific elements on the site without
 * using broad CSS selectors that might affect other elements.
 * 
 * Created: May 2025
 * Last updated: May 3, 2025
 */
(function() {
  console.log('Sky Lagoon Targeted Element Fix Loaded');
  
  // Widget isolation styles - contained to our widget only
  const resetStyles = document.createElement('style');
  resetStyles.id = 'sky-lagoon-widget-reset';
  resetStyles.textContent = `
    /* Reset ONLY applies to elements inside our widget */
    .sky-lagoon-chat-widget {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      box-sizing: border-box;
    }
    
    /* Reset for elements inside our widget */
    .sky-lagoon-chat-widget * {
      box-sizing: border-box;
    }
  `;
  document.head.appendChild(resetStyles);
  
  // TARGETED ELEMENT FIXES
  // This function directly modifies only the specific elements that need fixing
  function fixSpecificElements() {
    // 1. Fix Sun Icon Alignment
    document.querySelectorAll('img.content-icon.mb-3, img[src*="icon-sun.svg"], img[title*="Experience the Heart"]').forEach(icon => {
      if (icon && !icon.closest('.sky-lagoon-chat-widget')) { // Only if not in our widget
        // Store original styles as data attributes
        if (!icon.dataset.originalDisplay) {
          icon.dataset.originalDisplay = icon.style.display || '';
          icon.dataset.originalMargin = icon.style.margin || '';
          icon.dataset.originalFloat = icon.style.float || '';
        }
        
        // Apply direct element fixes
        icon.style.display = 'block';
        icon.style.margin = '0 auto';
        icon.style.float = 'none';
        
        // Fix parent container if needed
        if (icon.parentElement && !icon.parentElement.closest('.sky-lagoon-chat-widget')) {
          icon.parentElement.style.textAlign = 'center';
        }
      }
    });
    
    // 2. Fix Skjól Ritual and Experience Page Text Alignment
    document.querySelectorAll('.hero-text-inner h1.display-3').forEach(heading => {
      if (heading && !heading.closest('.sky-lagoon-chat-widget')) {
        heading.style.textAlign = 'left';
        
        // Fix nearby paragraphs
        const container = heading.closest('.hero-text-inner');
        if (container) {
          container.querySelectorAll('p').forEach(p => {
            p.style.textAlign = 'left';
          });
        }
      }
    });
    
    // 3. Fix Booking Flow Logo/Icons
    document.querySelectorAll('a[title="Logo"]').forEach(logoLink => {
      if (logoLink && !logoLink.closest('.sky-lagoon-chat-widget')) {
        logoLink.style.textAlign = 'center';
        logoLink.style.display = 'block';
        
        // Fix image inside
        const img = logoLink.querySelector('img');
        if (img) {
          img.style.margin = '0 auto';
          img.style.display = 'block';
        }
      }
    });
    
    // 4. Fix "Required Field" text in booking flow
    document.querySelectorAll('div.fs-xs.fw-bold.text-moss.px-3, div.fs-xs.fw-bold.text-moss').forEach(el => {
      if (el && el.textContent && el.textContent.includes('Required Field') && 
          !el.closest('.sky-lagoon-chat-widget')) {
        el.style.textAlign = 'left';
        el.style.justifyContent = 'flex-start';
      }
    });
    
    // 5. Fix list items (ordered and unordered)
    document.querySelectorAll('.strip-content ul li, article ul li, main ul li, .terms-content ul li').forEach(item => {
      if (item && !item.closest('.sky-lagoon-chat-widget')) {
        item.style.display = 'list-item';
        item.style.position = 'relative';
      }
    });
    
    document.querySelectorAll('.strip-content ol li, article ol li, main ol li, .terms-content ol li').forEach(item => {
      if (item && !item.closest('.sky-lagoon-chat-widget')) {
        item.style.display = 'list-item';
        item.style.position = 'relative';
      }
    });
  }
  
  // Apply fixes after page is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixSpecificElements);
  } else {
    fixSpecificElements();
  }
  
  // Reapply fixes after any dynamic content loads
  // This helps with elements loaded by JavaScript
  setTimeout(fixSpecificElements, 1000);
  setTimeout(fixSpecificElements, 2000);
  
  // For booking flow pages, check more frequently
  if (window.location.href.includes('/booking/')) {
    setTimeout(fixSpecificElements, 500);
    setTimeout(fixSpecificElements, 1500);
    setTimeout(fixSpecificElements, 3000);
  }
})();