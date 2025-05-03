/**
 * Sky Lagoon Chat Widget Isolation 
 * 
 * This script ensures the chat widget doesn't affect the main website styling.
 * It does not modify any elements outside of the widget container.
 */
(function() {
  console.log('Sky Lagoon Chat Widget Isolation Loaded');
  
  // No global style modification happens here
  
  // This script only ensures our widget container has the proper class
  function ensureWidgetClass() {
    const widgetRoot = document.getElementById('sky-lagoon-chat-root');
    if (widgetRoot && !widgetRoot.classList.contains('sky-lagoon-chat-widget')) {
      widgetRoot.classList.add('sky-lagoon-chat-widget');
    }
  }
  
  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureWidgetClass);
  } else {
    ensureWidgetClass();
  }
  
  // Also run after a delay to catch dynamic content
  setTimeout(ensureWidgetClass, 1000);
})();