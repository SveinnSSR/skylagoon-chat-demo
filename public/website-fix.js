/**
 * Sky Lagoon Chat Widget Isolation Fix
 * 
 * This script ensures the chat widget doesn't affect the main website styling.
 * It focuses ONLY on resetting styles within the widget container.
 * 
 * Created: May 2025
 * Last updated: May 3, 2025
 */
(function() {
  console.log('Sky Lagoon Chat Widget Isolation Fix Loaded');
  
  // Create a reset style that ONLY applies to our widget elements
  const resetStyles = document.createElement('style');
  resetStyles.id = 'sky-lagoon-widget-reset';
  resetStyles.textContent = `
    /* Reset ONLY applies to elements inside our widget */
    .sky-lagoon-chat-widget {
      /* Base reset for the widget container */
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      box-sizing: border-box;
    }
    
    /* Reset for elements inside our widget to prevent inheritance */
    .sky-lagoon-chat-widget * {
      box-sizing: border-box;
    }
    
    /* Typography resets for headings within our widget */
    .sky-lagoon-chat-widget h1,
    .sky-lagoon-chat-widget h2,
    .sky-lagoon-chat-widget h3,
    .sky-lagoon-chat-widget h4,
    .sky-lagoon-chat-widget h5,
    .sky-lagoon-chat-widget h6 {
      margin-top: 0;
      font-weight: 500;
      line-height: 1.2;
    }
    
    /* Paragraph reset within our widget */
    .sky-lagoon-chat-widget p {
      margin-top: 0;
      margin-bottom: 1rem;
    }
    
    /* List resets within our widget */
    .sky-lagoon-chat-widget ul,
    .sky-lagoon-chat-widget ol {
      margin-top: 0;
      margin-bottom: 1rem;
      padding-left: 2rem;
    }
    
    /* Button resets within our widget */
    .sky-lagoon-chat-widget button {
      cursor: pointer;
      font-family: inherit;
    }
    
    /* Input resets within our widget */
    .sky-lagoon-chat-widget input,
    .sky-lagoon-chat-widget textarea {
      font-family: inherit;
      margin: 0;
    }
  `;
  document.head.appendChild(resetStyles);
  
  // Note: We are NOT adding any code that targets elements outside our widget
  
  // Optional: Monitor for any CSS issues within our widget only
  function monitorWidgetStyles() {
    // This only runs if widget elements exist on the page
    const widgetContainer = document.querySelector('.sky-lagoon-chat-widget');
    if (!widgetContainer) return;
    
    // All operations scoped to our widget container
    console.log('Widget container found, monitoring styles');
  }
  
  // Run the monitor function when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', monitorWidgetStyles);
  } else {
    monitorWidgetStyles();
  }
})();