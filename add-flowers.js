// Add Additional Flowers to Menu Sections and Optimize Animations
// This script dynamically adds flowers to the specified sections and implements viewport optimization

document.addEventListener('DOMContentLoaded', function() {
    // Only run on menu page
    if (window.location.pathname.includes('/our-menus/') ||
        document.title.toLowerCase().includes('menu')) {
        addAdditionalFlowers();
        setupViewportOptimization();
    }
});

function addAdditionalFlowers() {
    // Define sections that need additional flowers with proper positioning
    const sectionsToAddFlowers = [
        {
            sectionName: 'Starters & Snacks',
            flowers: [
                { id: 'starters-flower1', image: '2.png', width: 200, height: 150, position: { top: '15%', left: '5%' } },
                { id: 'starters-flower2', image: '5.png', width: 180, height: 130, position: { top: '75%', right: '8%' } }
            ]
        },
        {
            sectionName: 'Pizzas',
            flowers: [
                { id: 'pizzas-flower1', image: '1.png', width: 190, height: 140, position: { top: '60%', left: '10%' } }
            ]
        },
        {
            sectionName: 'Momos',
            flowers: [
                { id: 'momos-flower1', image: '9.png', width: 170, height: 120, position: { top: '25%', right: '12%' } }
            ]
        },
        {
            sectionName: 'Indian Curries & Mains',
            flowers: [
                { id: 'curries-flower1', image: '7.png', width: 185, height: 135, position: { top: '45%', left: '8%' } }
            ]
        },
        {
            sectionName: 'Mocktails',
            flowers: [
                { id: 'mocktails-flower1', image: '3.png', width: 175, height: 125, position: { top: '20%', left: '6%' } },
                { id: 'mocktails-flower2', image: '6.png', width: 165, height: 115, position: { top: '70%', right: '10%' } }
            ]
        },
        {
            sectionName: 'Chai, Coffee & Bubble Tea',
            flowers: [
                { id: 'chai-flower1', image: '8.png', width: 180, height: 130, position: { top: '35%', right: '15%' } }
            ]
        },
        {
            sectionName: 'Breads',
            flowers: [
                { id: 'breads-flower1', image: '1.png', width: 170, height: 120, position: { top: '30%', left: '12%' } }
            ]
        }
    ];

    sectionsToAddFlowers.forEach(section => {
        addFlowersToSection(section.sectionName, section.flowers);
    });
}

function addFlowersToSection(sectionName, flowers) {
    // Find the section heading
    const headings = document.querySelectorAll('h2.elementor-heading-title');
    let targetSection = null;

    for (let heading of headings) {
        if (heading.textContent.trim() === sectionName) {
            // Find the parent container - look for the main section container
            let container = heading.closest('.elementor-element');

            // Go up several levels to find the main section container
            for (let i = 0; i < 8; i++) {
                if (container && container.parentElement) {
                    container = container.parentElement;
                    // Look for containers that have existing flower images or are section containers
                    if (container.querySelector('img[src*="flowers/"]') ||
                        container.classList.contains('elementor-section') ||
                        container.style.backgroundImage) {
                        targetSection = container;
                        break;
                    }
                }
            }
            break;
        }
    }

    if (!targetSection) {
        console.log(`Could not find target section for: ${sectionName}`);
        return;
    }

    // Add each flower to the section
    flowers.forEach(flower => {
        const flowerElement = createFlowerElement(flower);
        targetSection.appendChild(flowerElement);
        console.log(`Added flower ${flower.image} to ${sectionName}`);
    });
}

function createFlowerElement(flower) {
    const flowerDiv = document.createElement('div');
    flowerDiv.className = `elementor-element elementor-element-${flower.id} elementor-widget__width-auto elementor-absolute elementor-widget elementor-widget-image`;
    flowerDiv.setAttribute('data-id', flower.id);
    flowerDiv.setAttribute('data-element_type', 'widget');
    flowerDiv.setAttribute('data-settings', JSON.stringify({
        "_position": "absolute",
        "grandrestaurant_ext_link_reservation": "false",
        "grandrestaurant_ext_link_sidemenu": "false",
        "grandrestaurant_ext_link_fullmenu": "false",
        "grandrestaurant_ext_link_closed_fullmenu": "false",
        "grandrestaurant_ext_is_scrollme": "false",
        "grandrestaurant_ext_is_smoove": "false",
        "grandrestaurant_ext_is_parallax_mouse": "false",
        "grandrestaurant_ext_is_infinite": "false",
        "grandrestaurant_ext_is_fadeout_animation": "false",
        "grandrestaurant_ext_mobile_static": "false"
    }));
    flowerDiv.setAttribute('data-widget_type', 'image.default');

    // Apply positioning
    if (flower.position) {
        const style = flowerDiv.style;
        if (flower.position.top) style.top = flower.position.top;
        if (flower.position.bottom) style.bottom = flower.position.bottom;
        if (flower.position.left) style.left = flower.position.left;
        if (flower.position.right) style.right = flower.position.right;
        style.zIndex = '1';
    }

    const containerDiv = document.createElement('div');
    containerDiv.className = 'elementor-widget-container';

    const img = document.createElement('img');
    img.setAttribute('loading', 'lazy');
    img.setAttribute('decoding', 'async');
    img.setAttribute('width', flower.width);
    img.setAttribute('height', flower.height);
    img.setAttribute('src', `..\\images\\flowers\\${flower.image}`);
    img.className = `attachment-full size-full wp-image-${flower.id}`;
    img.setAttribute('alt', '');

    containerDiv.appendChild(img);
    flowerDiv.appendChild(containerDiv);

    return flowerDiv;
}

// Viewport optimization for better performance
function setupViewportOptimization() {
    // Only run on desktop to avoid mobile performance issues
    if (window.innerWidth <= 768) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('flower-in-view');
            } else {
                entry.target.classList.remove('flower-in-view');
            }
        });
    }, {
        rootMargin: '100px' // Start animation 100px before element comes into view
    });

    // Observe all flower containers
    const flowerContainers = document.querySelectorAll('img[src*="flowers/"]');
    flowerContainers.forEach(flower => {
        const container = flower.closest('.elementor-element');
        if (container) {
            observer.observe(container);
        }
    });
}

// Export for manual use if needed
window.addAdditionalFlowers = addAdditionalFlowers;
window.setupViewportOptimization = setupViewportOptimization;
