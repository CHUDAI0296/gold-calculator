/**
 * Gold Calculator - Main JavaScript
 * Handles general functionality across the site
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize gold price display
    updateGoldPrice();
    
    // Update the copyright year
    updateCopyrightYear();
});

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
        element.textContent = '$' + goldPrice;
    });
    
    // Update last updated timestamp
    const lastUpdatedElements = document.querySelectorAll('#last-updated');
    const now = new Date();
    const formattedDate = now.toLocaleString();
    
    lastUpdatedElements.forEach(element => {
        element.textContent = formattedDate;
    });
    
    // Store the gold price in local storage for use across pages
    localStorage.setItem('currentGoldPrice', goldPrice);
    localStorage.setItem('lastUpdated', formattedDate);
}

/**
 * Update the copyright year in the footer
 */
function updateCopyrightYear() {
    const currentYear = new Date().getFullYear();
    const copyrightElements = document.querySelectorAll('footer .mt-4 p:first-child');
    
    copyrightElements.forEach(element => {
        element.textContent = `© ${currentYear} Gold Calculator. All rights reserved.`;
    });
} 