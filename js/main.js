/**
 * Gold Calculator - Main JavaScript
 * Handles general functionality across the site
 */

// Register Service Worker for caching and offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);

                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New content available, prompt user to refresh
                            if (confirm('New content is available! Click OK to refresh.')) {
                                window.location.reload();
                            }
                        }
                    });
                });
            })
            .catch(error => {
                console.log('SW registration failed: ', error);
            });
    });
}

// Use requestIdleCallback for better performance
function scheduleWork(callback) {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(callback);
    } else {
        setTimeout(callback, 1);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Schedule non-critical work
    scheduleWork(() => {
        // Initialize gold price display with real API data
        initializeRealTimePrices();

        // Update the copyright year
        updateCopyrightYear();

        // Preload critical images
        preloadCriticalImages();
        
        // Start price auto-refresh (every 30 seconds)
        startPriceAutoRefresh(30);
    });
});

/**
 * Preload critical images for better performance
 */
function preloadCriticalImages() {
    const criticalImages = [
        '/images/logo.svg',
        '/images/favicon.svg'
    ];

    criticalImages.forEach(imageSrc => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = imageSrc;
        document.head.appendChild(link);
    });
}

/**
 * Initialize real-time prices using actual API data
 */
async function initializeRealTimePrices() {
    try {
        // Fetch real-time prices from API
        const prices = await updateAllMetalPrices();
        
        // Update all price displays on the page
        updatePriceDisplays(prices);
        
        console.log('Real-time prices initialized successfully');
    } catch (error) {
        console.error('Error initializing real-time prices:', error);
        setTimeout(async () => {
            try {
                const retryPrices = await updateAllMetalPrices(true);
                updatePriceDisplays(retryPrices);
            } catch (e) {}
        }, 5000);
    }
}

/**
 * Update price displays with real API data
 * @param {Object} prices - Price data object
 */
function updatePriceDisplays(prices) {
    if (!prices) return;
    
    // Update gold price displays
    const goldPriceElements = document.querySelectorAll('#current-gold-price');
    goldPriceElements.forEach(element => {
        if (element && prices.gold) {
            element.textContent = (typeof formatGoldPrice==='function'?formatGoldPrice(prices.gold):('$'+prices.gold.toFixed(2)));
        }
    });
    
    // Update silver price displays
    const silverPriceElements = document.querySelectorAll('#current-silver-price');
    silverPriceElements.forEach(element => {
        if (element && prices.silver) {
            element.textContent = (typeof formatGoldPrice==='function'?formatGoldPrice(prices.silver):('$'+prices.silver.toFixed(2)));
        }
    });
    
    // Update platinum price displays
    const platinumPriceElements = document.querySelectorAll('#current-platinum-price');
    platinumPriceElements.forEach(element => {
        if (element && prices.platinum) {
            element.textContent = (typeof formatGoldPrice==='function'?formatGoldPrice(prices.platinum):('$'+prices.platinum.toFixed(2)));
        }
    });
    
    // Update last updated timestamp
    const lastUpdatedElements = document.querySelectorAll('#last-updated');
    const formattedDate = localStorage.getItem('lastUpdated') || '';
    lastUpdatedElements.forEach(element => {
        if (element && formattedDate) {
            element.textContent = formattedDate;
        }
    });
}

/**
 * Fetch and update the current gold price (legacy function for fallback)
 */
async function updateGoldPrice() {
    try {
        const price = await getCurrentGoldPrice();
        const goldPriceElements = document.querySelectorAll('#current-gold-price');
        goldPriceElements.forEach(element => { if (element && price) { element.textContent = '$' + price.toFixed(2); } });
        const lastUpdatedElements = document.querySelectorAll('#last-updated');
        const formattedDate = localStorage.getItem('lastUpdated') || new Date().toLocaleString();
        lastUpdatedElements.forEach(element => { if (element) { element.textContent = formattedDate; } });
    } catch(e) {
        console.warn('Failed to update gold price from API');
    }
}

/**
 * Update the copyright year in the footer
 */
function updateCopyrightYear() {
    const currentYear = new Date().getFullYear();

    // Try the new footer structure first (with id)
    const copyrightYearElement = document.getElementById('copyright-year');
    if (copyrightYearElement) {
        copyrightYearElement.textContent = currentYear;
        return;
    }

    // Fallback to the old footer structure
    const copyrightElements = document.querySelectorAll('footer .mt-4 p:first-child');
    copyrightElements.forEach(element => {
        if (element) {
            element.textContent = `© ${currentYear} Gold Calculator. All rights reserved.`;
        }
    });
}