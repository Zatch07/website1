// Global Shopping Cart System
// This script should be included on all pages to maintain cart functionality

// Cart data storage using localStorage for persistence
let cart = JSON.parse(localStorage.getItem('zoca-cart')) || {};
let cartTotal = 0;

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeCart();
    initializeHeaderScrollFix();
    initializeCrossTabSync();
});

// Cross-tab synchronization
function initializeCrossTabSync() {
    // Listen for storage changes from other tabs
    window.addEventListener('storage', function(e) {
        if (e.key === 'zoca-cart') {
            // Update cart from other tab's changes
            cart = JSON.parse(e.newValue) || {};
            updateCartUI();
            updateAllMenuButtons();
        }
    });
}

// Function to update all menu buttons across the page
function updateAllMenuButtons() {
    // Update all add buttons and quantity controls
    Object.keys(cart).forEach(itemId => {
        const quantity = cart[itemId].quantity;

        // Find all buttons for this item (both desktop and mobile)
        const addButtons = document.querySelectorAll(`[onclick*="'${itemId}'"]`);

        addButtons.forEach(button => {
            if (button.classList.contains('add-btn')) {
                const controls = button.parentElement;
                const addBtn = controls.querySelector('.add-btn');
                const quantityControls = controls.querySelector('.quantity-controls');
                const quantitySpan = controls.querySelector('.quantity');

                if (quantity > 0) {
                    addBtn.style.display = 'none';
                    quantityControls.style.display = 'flex';
                    if (quantitySpan) {
                        quantitySpan.textContent = quantity;
                    }
                } else {
                    addBtn.style.display = 'flex';
                    quantityControls.style.display = 'none';
                }
            }
        });
    });

    // Reset buttons for items not in cart
    const allAddButtons = document.querySelectorAll('.add-btn');
    allAddButtons.forEach(button => {
        const onclickAttr = button.getAttribute('onclick');
        if (onclickAttr) {
            const itemIdMatch = onclickAttr.match(/'([^']+)'/);
            if (itemIdMatch) {
                const itemId = itemIdMatch[1];
                if (!cart[itemId] || cart[itemId].quantity === 0) {
                    const controls = button.parentElement;
                    const addBtn = controls.querySelector('.add-btn');
                    const quantityControls = controls.querySelector('.quantity-controls');

                    addBtn.style.display = 'flex';
                    quantityControls.style.display = 'none';
                }
            }
        }
    });
}

// Function to save cart and trigger cross-tab sync
function saveCartAndSync() {
    localStorage.setItem('zoca-cart', JSON.stringify(cart));
    // The storage event will automatically trigger in other tabs
}

// Initialize cart system
function initializeCart() {
    // Create cart icon if it doesn't exist
    if (!document.getElementById('cart-icon')) {
        createCartIcon();
    }
    
    // Create cart modal if it doesn't exist
    if (!document.getElementById('cart-modal')) {
        createCartModal();
    }
    
    // Create animation dot if it doesn't exist
    if (!document.getElementById('cart-animation-dot')) {
        createAnimationDot();
    }
    
    // Update cart UI
    updateCartUI();
    
    // Remove any existing back-to-top buttons
    removeBackToTopButtons();
}

// Create cart icon
function createCartIcon() {
    const cartIcon = document.createElement('div');
    cartIcon.id = 'cart-icon';
    cartIcon.className = 'cart-icon';
    cartIcon.onclick = toggleCart;
    cartIcon.innerHTML = `
        <i class="fas fa-shopping-cart"></i>
        <span id="cart-count" class="cart-count">0</span>
    `;
    document.body.appendChild(cartIcon);
}

// Create cart modal
function createCartModal() {
    const cartModal = document.createElement('div');
    cartModal.id = 'cart-modal';
    cartModal.className = 'cart-modal';
    cartModal.innerHTML = `
        <div class="cart-modal-content">
            <div class="cart-header">
                <h2>Your Cart</h2>
                <span class="cart-close" onclick="toggleCart()">&times;</span>
            </div>
            <div id="cart-items" class="cart-items">
                <p class="empty-cart">Your cart is waiting for some delicious choices! 🌟<br>Browse our menu and add your favorites.</p>
            </div>
            <div class="cart-footer">
                <div class="cart-total">
                    Total: ₹<span id="cart-total">0</span>
                </div>
                <div id="cart-message" class="cart-message">
                    Pass your order to our staff and we'll get busy! 🍽️
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(cartModal);
}

// Create animation dot
function createAnimationDot() {
    const animationDot = document.createElement('div');
    animationDot.id = 'cart-animation-dot';
    animationDot.className = 'cart-animation-dot';
    document.body.appendChild(animationDot);
}

// Remove back-to-top buttons
function removeBackToTopButtons() {
    const backToTopButtons = document.querySelectorAll('#toTop, .back-to-top, [href="#top"]');
    backToTopButtons.forEach(button => {
        if (button.innerHTML.includes('fa-angle-up') || button.innerHTML.includes('top')) {
            button.remove();
        }
    });
}

// Add item to cart
function addToCart(itemId, itemName, itemPrice, buttonElement) {
    // Add to cart data
    if (cart[itemId]) {
        cart[itemId].quantity += 1;
    } else {
        cart[itemId] = {
            name: itemName,
            price: itemPrice,
            quantity: 1
        };
    }

    // Save to localStorage and sync across tabs
    saveCartAndSync();

    // Update UI
    updateCartUI();
    showQuantityControls(buttonElement, itemId);
    animateToCart(buttonElement);
}

// Show quantity controls
function showQuantityControls(buttonElement, itemId) {
    const addBtn = buttonElement;
    const quantityControls = addBtn.nextElementSibling;
    
    if (quantityControls && quantityControls.classList.contains('quantity-controls')) {
        const quantitySpan = quantityControls.querySelector('.quantity');
        
        addBtn.style.display = 'none';
        quantityControls.style.display = 'flex';
        quantitySpan.textContent = cart[itemId].quantity;
    }
}

// Increase quantity
function increaseQuantity(itemId, buttonElement) {
    cart[itemId].quantity += 1;
    saveCartAndSync();
    
    const quantitySpan = buttonElement.parentElement.querySelector('.quantity');
    quantitySpan.textContent = cart[itemId].quantity;
    updateCartUI();
    animateToCart(buttonElement);
}

// Decrease quantity
function decreaseQuantity(itemId, buttonElement) {
    cart[itemId].quantity -= 1;
    
    if (cart[itemId].quantity <= 0) {
        delete cart[itemId];
        hideQuantityControls(buttonElement);
    } else {
        const quantitySpan = buttonElement.parentElement.querySelector('.quantity');
        quantitySpan.textContent = cart[itemId].quantity;
    }
    
    saveCartAndSync();
    updateCartUI();
}

// Hide quantity controls and show add button
function hideQuantityControls(buttonElement) {
    const quantityControls = buttonElement.parentElement;
    const addBtn = quantityControls.previousElementSibling;
    
    quantityControls.style.display = 'none';
    addBtn.style.display = 'flex';
}

// Update cart UI (count and total)
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartTotalElement = document.getElementById('cart-total');
    
    if (!cartCount || !cartTotalElement) return;
    
    let totalItems = 0;
    cartTotal = 0;
    
    for (let itemId in cart) {
        totalItems += cart[itemId].quantity;
        cartTotal += cart[itemId].price * cart[itemId].quantity;
    }
    
    cartCount.textContent = totalItems;
    cartTotalElement.textContent = cartTotal.toFixed(1);
    
    // Update cart modal content
    updateCartModal();
    
    // Update menu item quantities on page load
    updateMenuItemQuantities();
}

// Update menu item quantities on page load
function updateMenuItemQuantities() {
    for (let itemId in cart) {
        const menuButton = document.querySelector(`[onclick*="${itemId}"]`);
        if (menuButton && cart[itemId].quantity > 0) {
            showQuantityControls(menuButton, itemId);
        }
    }
}





// Animate cart icon immediately (no flying dot)
function animateToCart(sourceElement) {
    const cartIcon = document.getElementById('cart-icon');

    if (!cartIcon) return;

    // Bounce cart icon immediately
    cartIcon.style.transform = 'scale(1.2)';
    cartIcon.style.transition = 'transform 0.2s ease';

    setTimeout(() => {
        cartIcon.style.transform = '';
    }, 200);
}

// Toggle cart modal
function toggleCart() {
    const modal = document.getElementById('cart-modal');
    if (!modal) return;

    if (modal.style.display === 'block') {
        closeCart();
    } else {
        openCart();
    }
}

// Store scroll position to prevent jump
let cartScrollPosition = 0;

// Open cart modal
function openCart() {
    const modal = document.getElementById('cart-modal');
    if (!modal) return;

    // Close menu nav if it's open
    if (typeof closeMenuNav === 'function') {
        closeMenuNav();
    }

    // Store current scroll position
    cartScrollPosition = window.pageYOffset;

    // Show modal and add body class
    modal.style.display = 'block';
    document.body.classList.add('cart-open');
    document.body.classList.remove('menu-nav-open');

    // Don't change body position - let CSS handle the overflow

    updateCartModal();
}

// Close cart modal
function closeCart() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('cart-open');

        // No need to restore scroll position since we didn't change it
    }
}

// Update cart modal content
function updateCartModal() {
    const cartItems = document.getElementById('cart-items');
    const cartMessage = document.getElementById('cart-message');
    if (!cartItems) return;

    if (Object.keys(cart).length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is waiting for some delicious choices! 🌟<br>Browse our menu and add your favorites.</p>';
        if (cartMessage) cartMessage.style.display = 'none';
        return;
    }

    if (cartMessage) cartMessage.style.display = 'block';

    let html = '';
    for (let itemId in cart) {
        const item = cart[itemId];
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₹${item.price.toFixed(1)} each</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" onclick="updateCartItem('${itemId}', -1)">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" onclick="updateCartItem('${itemId}', 1)">+</button>
                    </div>
                </div>
            </div>
        `;
    }

    cartItems.innerHTML = html;
}

// Update cart item from modal
function updateCartItem(itemId, change) {
    cart[itemId].quantity += change;

    if (cart[itemId].quantity <= 0) {
        delete cart[itemId];
        // Also update the menu item UI
        updateMenuItemUI(itemId);
    } else {
        // Update quantity display on menu items
        updateMenuItemQuantityDisplay(itemId, cart[itemId].quantity);
    }

    saveCartAndSync();
    updateCartUI();
}

// Update quantity display on menu items
function updateMenuItemQuantityDisplay(itemId, quantity) {
    const menuItems = document.querySelectorAll(`[onclick*="${itemId}"]`);

    menuItems.forEach(menuItem => {
        let container = menuItem.closest('.add-to-cart-controls');
        if (!container) {
            container = menuItem.parentElement;
        }

        if (container) {
            const quantitySpan = container.querySelector('.quantity');
            if (quantitySpan) {
                quantitySpan.textContent = quantity;
            }
        }
    });
}

// Update menu item UI when item is removed from cart
function updateMenuItemUI(itemId) {
    // Find ALL instances of this item (both in header and mobile price containers)
    const menuItems = document.querySelectorAll(`[onclick*="${itemId}"]`);

    menuItems.forEach(menuItem => {
        // Find the parent container that has both add button and quantity controls
        let container = menuItem.closest('.add-to-cart-controls');
        if (!container) {
            container = menuItem.parentElement;
        }

        if (container) {
            const quantityControls = container.querySelector('.quantity-controls');
            const addBtn = container.querySelector('.add-btn');

            if (quantityControls && addBtn) {
                quantityControls.style.display = 'none';
                addBtn.style.display = 'flex';

                // Reset quantity display to 1
                const quantitySpan = quantityControls.querySelector('.quantity');
                if (quantitySpan) {
                    quantitySpan.textContent = '1';
                }
            }
        }
    });
}



// Fix header interactability when scrolled out of view
function initializeHeaderScrollFix() {
    const headerElements = [
        // Main header containers
        document.querySelector('.elementor-element-cb73338'),
        document.querySelector('.elementor-element-36eaf0d'),
        // REMOVED .elementor-148 - this is the navigation menu container!
        document.querySelector('#elementor-header'), // THE MISSING CULPRIT!
        document.querySelector('.main-menu-wrapper'), // Alternative selector
        // Correct header elements (found the right IDs!)
        document.querySelector('.elementor-element-9c402bf'), // Menu Button (hamburger)
        document.querySelector('.elementor-element-2df9abe'), // Logo
        document.querySelector('.elementor-element-d816994'), // RSVP Button
        document.querySelector('.elementor-element-5133fca'), // Logo container
        document.querySelector('.elementor-element-ea80152'), // RSVP container
        document.querySelector('.elementor-element-ab4359f'), // Menu button container
        // Full menu elements
        document.querySelector('.elementor-element-74166a6'), // Full menu logo
        document.querySelector('.elementor-element-03cf286'), // Full menu RSVP
        document.querySelector('.elementor-element-1a659ab')  // Full menu RSVP button
    ];

    function checkHeaderVisibility() {
        headerElements.forEach((header, index) => {
            if (!header) return;

            const rect = header.getBoundingClientRect();
            const style = window.getComputedStyle(header);

            // Check if header is scrolled out of view or hidden
            const isScrolledOut = rect.bottom < 0 || rect.top > window.innerHeight;
            const isHidden = style.opacity === '0' ||
                           style.visibility === 'hidden' ||
                           style.display === 'none' ||
                           style.transform.includes('translateY(-') ||
                           parseFloat(style.opacity) < 0.1; // Also catch very low opacity

            // More aggressive detection - check parent opacity too
            let parentElement = header.parentElement;
            let parentHidden = false;
            while (parentElement && parentElement !== document.body) {
                const parentStyle = window.getComputedStyle(parentElement);
                if (parseFloat(parentStyle.opacity) < 0.1 ||
                    parentStyle.visibility === 'hidden' ||
                    parentStyle.display === 'none' ||
                    parentStyle.transform.includes('translateY(-')) {
                    parentHidden = true;
                    break;
                }
                parentElement = parentElement.parentElement;
            }

            if (isScrolledOut || isHidden || parentHidden) {
                header.style.pointerEvents = 'none';
                // Also disable child elements
                const clickableChildren = header.querySelectorAll('*');
                clickableChildren.forEach(child => {
                    child.style.pointerEvents = 'none';
                });
            } else {
                header.style.pointerEvents = '';
                // Re-enable child elements
                const clickableChildren = header.querySelectorAll('*');
                clickableChildren.forEach(child => {
                    child.style.pointerEvents = '';
                });
            }
        });
    }

    // Check on scroll and resize
    window.addEventListener('scroll', checkHeaderVisibility);
    window.addEventListener('resize', checkHeaderVisibility);

    // Initial check
    checkHeaderVisibility();

    // Also check periodically in case of dynamic changes
    setInterval(checkHeaderVisibility, 500);

    // Additional targeted fix for header blocking
    function targetedHeaderFix() {
        const scrollY = window.scrollY;

        if (scrollY > 80) {
            // Target only the main header container and its immediate area
            const mainHeader = document.querySelector('.elementor-element-36eaf0d');
            if (mainHeader) {
                const rect = mainHeader.getBoundingClientRect();

                // If header is not visible (scrolled out or hidden)
                if (rect.bottom <= 10 || rect.top >= window.innerHeight) {
                    // Find all elements that might be in the header area
                    const allElements = document.querySelectorAll('*');

                    allElements.forEach(element => {
                        const elementRect = element.getBoundingClientRect();

                        // Only target elements in the top 100px area
                        if (elementRect.top < 100 && elementRect.bottom > -10) {
                            const style = window.getComputedStyle(element);

                            // Only target elements that are likely header-related
                            if (style.position === 'fixed' ||
                                style.position === 'sticky' ||
                                element.closest('.elementor-element-36eaf0d') ||
                                element.closest('#elementor-header') ||
                                element.classList.contains('elementor-element-36eaf0d') ||
                                element.classList.contains('elementor-element-897d875') ||
                                element.classList.contains('elementor-element-9c402bf') ||
                                element.classList.contains('elementor-element-2df9abe') ||
                                element.classList.contains('elementor-element-d816994') ||
                                element.classList.contains('elementor-element-5133fca') ||
                                element.classList.contains('elementor-element-ea80152') ||
                                element.id === 'elementor-header' ||
                                element.classList.contains('main-menu-wrapper')) {

                                element.style.pointerEvents = 'none';
                            }
                        }
                    });
                }
            }
        } else {
            // Re-enable elements when at top
            const elementsToRestore = document.querySelectorAll('[style*="pointer-events: none"]');
            elementsToRestore.forEach(element => {
                // Only restore header-related elements
                if (element.closest('.elementor-element-36eaf0d') ||
                    element.closest('#elementor-header') ||
                    element.classList.contains('elementor-element-36eaf0d') ||
                    element.classList.contains('elementor-element-897d875') ||
                    element.classList.contains('elementor-element-9c402bf') ||
                    element.classList.contains('elementor-element-2df9abe') ||
                    element.classList.contains('elementor-element-d816994') ||
                    element.classList.contains('elementor-element-5133fca') ||
                    element.classList.contains('elementor-element-ea80152') ||
                    element.id === 'elementor-header' ||
                    element.classList.contains('main-menu-wrapper')) {

                    element.style.pointerEvents = '';
                }
            });
        }
    }

    // Run targeted fix on scroll
    window.addEventListener('scroll', targetedHeaderFix);
    targetedHeaderFix(); // Run immediately
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('cart-modal');
    if (event.target === modal) {
        closeCart();
    }
});
