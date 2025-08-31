// Menu Navigation System
// This script creates a floating menu navigation button for the menu page

// Menu sections data - extracted from the actual menu page
const menuSections = [
    { name: "Pizzas", id: "pizzas-section" },
    { name: "Burgers & Sandwiches", id: "burgers-section" },
    { name: "Starters & Snacks", id: "starters-section" },
    { name: "Indo-Chinese & Asian", id: "indo-chinese-section" },
    { name: "Rolls & Wraps", id: "rolls-section" },
    { name: "Pasta", id: "pasta-section" },
    { name: "Momos", id: "momos-section" },
    { name: "Sizzlers & Platters", id: "sizzlers-section" },
    { name: "Soups", id: "soups-section" },
    { name: "Indian Curries & Mains", id: "curries-section" },
    { name: "Breads", id: "breads-section" },
    { name: "Rice & Biryani", id: "rice-section" },
    { name: "Sides & Accompaniments", id: "sides-section" },
    { name: "Thalis & Combos", id: "thalis-section" },
    { name: "Mojito", id: "mojito-section" },
    { name: "Mocktails", id: "mocktails-section" },
    { name: "Shakes & Cold Coffee", id: "shakes-section" },
    { name: "Chai, Coffee & Bubble Tea", id: "chai-section" },
    { name: "Cold Drinks & Lassi", id: "drinks-section" },
    { name: "Desserts", id: "desserts-section" }
];

// Initialize menu navigation on page load
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize on menu page
    if (window.location.pathname.includes('/our-menus/') || 
        document.title.toLowerCase().includes('menu')) {
        initializeMenuNavigation();
        addSectionIds();
    }
});

// Initialize menu navigation system
function initializeMenuNavigation() {
    // Create menu navigation icon if it doesn't exist
    if (!document.getElementById('menu-nav-icon')) {
        createMenuNavIcon();
    }
    
    // Create menu navigation modal if it doesn't exist
    if (!document.getElementById('menu-nav-modal')) {
        createMenuNavModal();
    }
}

// Create menu navigation icon
function createMenuNavIcon() {
    const menuNavIcon = document.createElement('div');
    menuNavIcon.id = 'menu-nav-icon';
    menuNavIcon.className = 'menu-nav-icon';
    menuNavIcon.onclick = toggleMenuNav;
    menuNavIcon.innerHTML = `
        <i class="fas fa-utensils"></i>
    `;
    document.body.appendChild(menuNavIcon);
}

// Create menu navigation modal
function createMenuNavModal() {
    const modal = document.createElement('div');
    modal.id = 'menu-nav-modal';
    modal.className = 'menu-nav-modal';
    
    let menuItemsHTML = '';
    menuSections.forEach(section => {
        menuItemsHTML += `
            <a href="#${section.id}" class="menu-nav-item" onclick="navigateToSection('${section.id}')">${section.name}</a>
        `;
    });
    
    modal.innerHTML = `
        <div class="menu-nav-content">
            <div class="menu-nav-header">
                <h2>Menu Sections</h2>
                <div class="menu-nav-close" onclick="closeMenuNav()"></div>
            </div>
            <div class="menu-nav-items">
                ${menuItemsHTML}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Add IDs to menu sections for navigation
function addSectionIds() {
    const headings = document.querySelectorAll('h2.elementor-heading-title');

    headings.forEach(heading => {
        const text = heading.textContent.trim();
        const section = menuSections.find(s => s.name === text);

        if (section && text !== 'Our Menu') { // Skip the main "Our Menu" heading
            // Find the heading's immediate container first
            let container = heading.closest('.elementor-element');

            // For better navigation, use the heading's container directly
            // This ensures we scroll to the actual heading, not some parent container
            if (container) {
                container.id = section.id;
                container.setAttribute('data-menu-section', section.name);
                console.log(`Added ID "${section.id}" to section: ${section.name}`);
            }
        }
    });
}

// Toggle menu navigation modal
function toggleMenuNav() {
    const modal = document.getElementById('menu-nav-modal');
    if (!modal) return;

    if (modal.style.display === 'block') {
        closeMenuNav();
    } else {
        openMenuNav();
    }
}

// Store scroll position to prevent jump
let scrollPosition = 0;

// Open menu navigation modal
function openMenuNav() {
    const modal = document.getElementById('menu-nav-modal');
    if (!modal) return;

    // Close cart if it's open
    if (typeof closeCart === 'function') {
        closeCart();
    }

    // Store current scroll position
    scrollPosition = window.pageYOffset;

    // Show modal and add body class
    modal.style.display = 'block';
    document.body.classList.add('menu-nav-open');
    document.body.classList.remove('cart-open');

    // Don't change body position - let CSS handle the overflow
}

// Close menu navigation modal
function closeMenuNav() {
    const modal = document.getElementById('menu-nav-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('menu-nav-open');

        // No need to restore scroll position since we didn't change it
    }
}

// Navigate to specific menu section with smooth animation from current position
function navigateToSection(sectionId) {
    closeMenuNav();

    // Wait for modal close animation
    setTimeout(() => {
        let section = document.getElementById(sectionId);

        // If section not found by ID, try to find by data attribute
        if (!section) {
            const sectionData = menuSections.find(s => s.id === sectionId);
            if (sectionData) {
                section = document.querySelector(`[data-menu-section="${sectionData.name}"]`);
            }
        }

        // If still not found, try to find by heading text directly
        if (!section) {
            const sectionData = menuSections.find(s => s.id === sectionId);
            if (sectionData) {
                const headings = document.querySelectorAll('h2.elementor-heading-title');
                for (let heading of headings) {
                    if (heading.textContent.trim() === sectionData.name) {
                        section = heading.closest('.elementor-element');
                        break;
                    }
                }
            }
        }

        if (section) {
            // Get current scroll position
            const currentScroll = window.pageYOffset;

            // Calculate target position with offset for better readability
            const headerOffset = 60; // Offset to make heading easily readable
            const elementPosition = section.getBoundingClientRect().top;
            const targetPosition = elementPosition + currentScroll - headerOffset;

            console.log(`Navigating to ${sectionId}:`, {
                currentScroll,
                elementPosition,
                targetPosition,
                distance: Math.abs(targetPosition - currentScroll)
            });

            // Use custom smooth scrolling with easing for better control
            smoothScrollToPosition(targetPosition, 1200); // 1.2 second duration

        } else {
            console.log('Section not found:', sectionId);
            // Fallback: try to find any heading with the section name
            const sectionData = menuSections.find(s => s.id === sectionId);
            if (sectionData) {
                const allHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
                for (let heading of allHeadings) {
                    if (heading.textContent.trim().includes(sectionData.name)) {
                        const currentScroll = window.pageYOffset;
                        const elementPosition = heading.getBoundingClientRect().top;
                        const targetPosition = elementPosition + currentScroll - 60;
                        smoothScrollToPosition(targetPosition, 1200);
                        break;
                    }
                }
            }
        }
    }, 300); // Wait for modal close animation
}

// Custom smooth scrolling function with easing
function smoothScrollToPosition(targetPosition, duration = 1200) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    // Easing function for smooth animation (ease-in-out)
    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        // Apply easing
        const easedProgress = easeInOutCubic(progress);

        // Calculate current position
        const currentPosition = startPosition + (distance * easedProgress);

        // Scroll to current position
        window.scrollTo(0, currentPosition);

        // Continue animation if not complete
        if (progress < 1) {
            requestAnimationFrame(animation);
        }
    }

    // Start the animation
    requestAnimationFrame(animation);
}

// Close modal when clicking outside the menu content
window.addEventListener('click', function(event) {
    const modal = document.getElementById('menu-nav-modal');
    const menuContent = document.querySelector('.menu-nav-content');
    const menuNavIcon = document.getElementById('menu-nav-icon');

    if (modal && modal.style.display === 'block') {
        // Close if clicking on the modal backdrop (not the content)
        if (event.target === modal) {
            closeMenuNav();
        }
        // Close if clicking outside the menu content but not on the menu nav icon
        else if (menuContent && !menuContent.contains(event.target) &&
                 menuNavIcon && !menuNavIcon.contains(event.target)) {
            closeMenuNav();
        }
    }
});

// Handle escape key to close modal
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeMenuNav();
    }
});

// Unified mobile scroll prevention for both menu nav and cart
let touchStartY = 0;
let touchStartX = 0;

document.addEventListener('touchstart', function(e) {
    if (document.body.classList.contains('menu-nav-open') ||
        document.body.classList.contains('cart-open')) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
    }
}, { passive: false });

document.addEventListener('touchmove', function(e) {
    if (document.body.classList.contains('menu-nav-open') ||
        document.body.classList.contains('cart-open')) {

        const currentY = e.touches[0].clientY;
        const currentX = e.touches[0].clientX;
        const deltaY = touchStartY - currentY;
        const deltaX = touchStartX - currentX;

        // Only handle vertical scrolling
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
            // Find the scrollable content
            const scrollableElement = e.target.closest('.menu-nav-items, .cart-items');

            if (scrollableElement) {
                const scrollTop = scrollableElement.scrollTop;
                const scrollHeight = scrollableElement.scrollHeight;
                const clientHeight = scrollableElement.clientHeight;
                const isScrollable = scrollHeight > clientHeight;

                if (isScrollable) {
                    // At top and trying to scroll up
                    if (scrollTop <= 0 && deltaY < 0) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    // At bottom and trying to scroll down
                    else if (scrollTop + clientHeight >= scrollHeight && deltaY > 0) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                } else {
                    // Content not scrollable, prevent all vertical scrolling
                    e.preventDefault();
                    e.stopPropagation();
                }
            } else {
                // Not in scrollable area, prevent all scrolling
                e.preventDefault();
                e.stopPropagation();
            }
        }
    }
}, { passive: false });

// Prevent background scrolling on mobile devices
function preventBackgroundScroll() {
    // Prevent touchmove on document when modal is open
    document.addEventListener('touchmove', function(e) {
        if (document.body.classList.contains('menu-nav-open') ||
            document.body.classList.contains('cart-open')) {

            // Allow scrolling within modal content
            const modalContent = e.target.closest('.menu-nav-items, .cart-content, .cart-items');
            if (modalContent) {
                // Check if we're at the top or bottom of the scrollable content
                const scrollTop = modalContent.scrollTop;
                const scrollHeight = modalContent.scrollHeight;
                const clientHeight = modalContent.clientHeight;

                // If scrolling up and already at top, prevent
                if (scrollTop === 0 && e.touches[0].clientY > e.touches[0].previousClientY) {
                    e.preventDefault();
                }
                // If scrolling down and already at bottom, prevent
                else if (scrollTop + clientHeight >= scrollHeight && e.touches[0].clientY < e.touches[0].previousClientY) {
                    e.preventDefault();
                }
            } else {
                // Not within modal content, prevent all scrolling
                e.preventDefault();
            }
        }
    }, { passive: false });

    // Store previous touch position for direction detection
    document.addEventListener('touchstart', function(e) {
        if (e.touches.length === 1) {
            e.touches[0].previousClientY = e.touches[0].clientY;
        }
    }, { passive: false });
}

// Initialize background scroll prevention
preventBackgroundScroll();

// Monitor hamburger menu state and hide/show menu nav button accordingly
function monitorHamburgerMenu() {
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const body = document.body;
                const menuNavIcon = document.getElementById('menu-nav-icon');
                
                if (menuNavIcon) {
                    // The hamburger menu adds 'js_nav' class to body when open
                    if (body.classList.contains('js_nav')) {
                        menuNavIcon.style.opacity = '0';
                        menuNavIcon.style.transform = 'translateY(20px)';
                        menuNavIcon.style.pointerEvents = 'none';
                    } else {
                        menuNavIcon.style.opacity = '1';
                        menuNavIcon.style.transform = 'translateY(0)';
                        menuNavIcon.style.pointerEvents = 'auto';
                    }
                }
            }
        });
    });
    
    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
    });
}

// Start monitoring after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(monitorHamburgerMenu, 1000); // Small delay to ensure everything is loaded
});
