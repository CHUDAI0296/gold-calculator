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
        // Initialize gold price display
        updateGoldPrice();

        // Update the copyright year
        updateCopyrightYear();

        // Preload critical images
        preloadCriticalImages();
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
 * Fetch and update the current gold price
 */
function updateGoldPrice() {
    // For demo purposes, we'll use a simulated gold price
    // In a production environment, you would connect to a real API

    // Simulated gold price (around $2000 with some random variation)
    const basePrice = 2000;
    const variation = Math.random() * 100 - 50; // Random value between -50 and +50
    const goldPrice = (basePrice + variation).toFixed(2);

    // Update all gold price displays on the page
    const goldPriceElements = document.querySelectorAll('#current-gold-price');
    goldPriceElements.forEach(element => {
        if (element) {
            element.textContent = '$' + goldPrice;
        }
    });

    // Update last updated timestamp
    const lastUpdatedElements = document.querySelectorAll('#last-updated');
    const now = new Date();
    const formattedDate = now.toLocaleString();

    lastUpdatedElements.forEach(element => {
        if (element) {
            element.textContent = formattedDate;
        }
    });

    // Store the gold price in local storage for use across pages
    try {
        localStorage.setItem('currentGoldPrice', goldPrice);
        localStorage.setItem('lastUpdated', formattedDate);
    } catch (e) {
        // Handle localStorage errors silently
        console.warn('LocalStorage not available');
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