// Global Cart Setup Script
// Include this on all pages to ensure cart persistence and remove back-to-top buttons

document.addEventListener('DOMContentLoaded', function() {
    // Remove back-to-top buttons from all pages
    removeBackToTopButtons();
    
    // Initialize cart system if not already present
    if (!document.getElementById('cart-icon')) {
        // Load cart system files dynamically
        loadCartSystem();
    }
});

// Remove all back-to-top buttons
function removeBackToTopButtons() {
    // Common selectors for back-to-top buttons
    const selectors = [
        '#toTop',
        '.back-to-top',
        '.scroll-to-top',
        '[href="#top"]',
        'a[onclick*="scrollTo"]',
        '.fa-angle-up',
        '.fa-arrow-up',
        '.fa-chevron-up'
    ];
    
    selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            // Check if it's likely a back-to-top button
            const text = element.textContent.toLowerCase();
            const hasUpIcon = element.innerHTML.includes('fa-angle-up') || 
                             element.innerHTML.includes('fa-arrow-up') || 
                             element.innerHTML.includes('fa-chevron-up');
            const isBackToTop = text.includes('top') || 
                               text.includes('up') || 
                               hasUpIcon ||
                               element.id === 'toTop';
            
            if (isBackToTop) {
                element.remove();
                console.log('Removed back-to-top button:', selector);
            }
        });
    });
}

// Load cart system files dynamically
function loadCartSystem() {
    // Determine the correct path based on current page location
    const currentPath = window.location.pathname;
    let basePath = '';
    
    // If we're in a subdirectory, adjust the path
    if (currentPath.includes('/our-menus/') || 
        currentPath.includes('/contact-us/') || 
        currentPath.includes('/gallery/')) {
        basePath = '../';
    }
    
    // Load CSS
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = basePath + 'cart-system.css';
    document.head.appendChild(cssLink);
    
    // Load JavaScript
    const jsScript = document.createElement('script');
    jsScript.src = basePath + 'cart-system.js';
    document.head.appendChild(jsScript);
    
    console.log('Cart system loaded with base path:', basePath);
}

// Export functions for manual use if needed
window.removeBackToTopButtons = removeBackToTopButtons;
window.loadCartSystem = loadCartSystem;
