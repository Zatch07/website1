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
                <span class="menu-nav-close" onclick="closeMenuNav()">&times;</span>
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

        if (section) {
            // Find the main section container - look for the background container
            let container = heading.closest('.elementor-element');

            // Look for the parent container that has background styling
            while (container && container.parentElement) {
                container = container.parentElement;

                // Look for containers with background images or the main section containers
                if (container.classList.contains('elementor-element-1957990') ||
                    container.classList.contains('elementor-element-947b812') ||
                    container.style.backgroundImage ||
                    container.querySelector('.elementor-element-1957990')) {
                    break;
                }
            }

            if (container) {
                container.id = section.id;
                // Add a data attribute for easier identification
                container.setAttribute('data-menu-section', section.name);
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
        modal.style.display = 'block';
    }
}

// Close menu navigation modal
function closeMenuNav() {
    const modal = document.getElementById('menu-nav-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Navigate to specific menu section
function navigateToSection(sectionId) {
    closeMenuNav();

    let section = document.getElementById(sectionId);

    // If section not found by ID, try to find by data attribute
    if (!section) {
        const sectionData = menuSections.find(s => s.id === sectionId);
        if (sectionData) {
            section = document.querySelector(`[data-menu-section="${sectionData.name}"]`);
        }
    }

    // If still not found, try to find by heading text
    if (!section) {
        const sectionData = menuSections.find(s => s.id === sectionId);
        if (sectionData) {
            const headings = document.querySelectorAll('h2.elementor-heading-title');
            for (let heading of headings) {
                if (heading.textContent.trim() === sectionData.name) {
                    section = heading.closest('.elementor-element');
                    // Go up to find a suitable container
                    for (let i = 0; i < 5; i++) {
                        if (section && section.parentElement) {
                            section = section.parentElement;
                        }
                    }
                    break;
                }
            }
        }
    }

    if (section) {
        // Smooth scroll to section with offset for fixed header
        const headerHeight = 120; // Adjust based on your header height
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });

        // Add a brief highlight effect
        section.style.transition = 'background-color 0.3s ease';
        section.style.backgroundColor = 'rgba(227, 218, 198, 0.1)';

        setTimeout(() => {
            section.style.backgroundColor = '';
        }, 1500);
    } else {
        console.log('Section not found:', sectionId);
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('menu-nav-modal');
    if (event.target === modal) {
        closeMenuNav();
    }
});

// Handle escape key to close modal
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeMenuNav();
    }
});

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
