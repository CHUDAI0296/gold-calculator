/**
 * Gold Calculator - Precious Metals API
 * Handles fetching and managing precious metal price data
 */

// Metal price API settings
const metalApiSettings = {
    // In a production environment, you would use a real API key and endpoint
    apiKey: 'demo-api-key',
    goldEndpoint: 'https://api.example.com/gold-price',
    silverEndpoint: 'https://api.example.com/silver-price',
    platinumEndpoint: 'https://api.example.com/platinum-price'
};

/**
 * Fetch the current gold price from an API
 * For demo purposes, this uses a simulated price
 * In production, you would connect to a real gold price API
 */
async function fetchGoldPrice() {
    try {
        // In a real implementation, you would fetch from an actual API
        // const response = await fetch(`${metalApiSettings.goldEndpoint}?api_key=${metalApiSettings.apiKey}`);
        // const data = await response.json();
        // return data.price;
        
        // For demo purposes, we'll use a simulated gold price
        const basePrice = 2000;
        const variation = Math.random() * 100 - 50; // Random value between -50 and +50
        return (basePrice + variation).toFixed(2);
    } catch (error) {
        console.error('Error fetching gold price:', error);
        return 2000.00; // Default fallback price
    }
}

/**
 * Fetch the current silver price from an API
 * For demo purposes, this uses a simulated price
 */
async function fetchSilverPrice() {
    try {
        // In a real implementation, you would fetch from an actual API
        // const response = await fetch(`${metalApiSettings.silverEndpoint}?api_key=${metalApiSettings.apiKey}`);
        // const data = await response.json();
        // return data.price;
        
        // For demo purposes, we'll use a simulated silver price
        const basePrice = 25;
        const variation = Math.random() * 2 - 1; // Random value between -1 and +1
        return (basePrice + variation).toFixed(2);
    } catch (error) {
        console.error('Error fetching silver price:', error);
        return 25.00; // Default fallback price
    }
}

/**
 * Fetch the current platinum price from an API
 * For demo purposes, this uses a simulated price
 */
async function fetchPlatinumPrice() {
    try {
        // In a real implementation, you would fetch from an actual API
        // const response = await fetch(`${metalApiSettings.platinumEndpoint}?api_key=${metalApiSettings.apiKey}`);
        // const data = await response.json();
        // return data.price;
        
        // For demo purposes, we'll use a simulated platinum price
        const basePrice = 950;
        const variation = Math.random() * 40 - 20; // Random value between -20 and +20
        return (basePrice + variation).toFixed(2);
    } catch (error) {
        console.error('Error fetching platinum price:', error);
        return 950.00; // Default fallback price
    }
}

/**
 * Get the current gold price, either from localStorage or by fetching fresh data
 * @param {boolean} forceFresh - Whether to force a fresh API call
 * @returns {Promise<number>} - The current gold price
 */
async function getCurrentGoldPrice(forceFresh = false) {
    if (!forceFresh) {
        // Try to get from localStorage first
        const storedPrice = localStorage.getItem('currentGoldPrice');
        const lastUpdated = localStorage.getItem('lastUpdated');
        
        if (storedPrice && lastUpdated) {
            const lastUpdateTime = new Date(lastUpdated).getTime();
            const currentTime = new Date().getTime();
            const timeDiff = currentTime - lastUpdateTime;
            
            // If price was updated in the last hour, use it
            if (timeDiff < 3600000) {
                return parseFloat(storedPrice);
            }
        }
    }
    
    // Fetch fresh price
    const freshPrice = await fetchGoldPrice();
    
    // Store in localStorage
    localStorage.setItem('currentGoldPrice', freshPrice);
    localStorage.setItem('lastUpdated', new Date().toLocaleString());
    
    return parseFloat(freshPrice);
}

/**
 * Get the current silver price, either from localStorage or by fetching fresh data
 * @param {boolean} forceFresh - Whether to force a fresh API call
 * @returns {Promise<number>} - The current silver price
 */
async function getCurrentSilverPrice(forceFresh = false) {
    if (!forceFresh) {
        // Try to get from localStorage first
        const storedPrice = localStorage.getItem('currentSilverPrice');
        const lastUpdated = localStorage.getItem('lastUpdated');
        
        if (storedPrice && lastUpdated) {
            const lastUpdateTime = new Date(lastUpdated).getTime();
            const currentTime = new Date().getTime();
            const timeDiff = currentTime - lastUpdateTime;
            
            // If price was updated in the last hour, use it
            if (timeDiff < 3600000) {
                return parseFloat(storedPrice);
            }
        }
    }
    
    // Fetch fresh price
    const freshPrice = await fetchSilverPrice();
    
    // Store in localStorage
    localStorage.setItem('currentSilverPrice', freshPrice);
    
    // Only update lastUpdated if gold price was also updated
    if (forceFresh) {
        localStorage.setItem('lastUpdated', new Date().toLocaleString());
    }
    
    return parseFloat(freshPrice);
}

/**
 * Get the current platinum price, either from localStorage or by fetching fresh data
 * @param {boolean} forceFresh - Whether to force a fresh API call
 * @returns {Promise<number>} - The current platinum price
 */
async function getCurrentPlatinumPrice(forceFresh = false) {
    if (!forceFresh) {
        // Try to get from localStorage first
        const storedPrice = localStorage.getItem('currentPlatinumPrice');
        const lastUpdated = localStorage.getItem('lastUpdated');
        
        if (storedPrice && lastUpdated) {
            const lastUpdateTime = new Date(lastUpdated).getTime();
            const currentTime = new Date().getTime();
            const timeDiff = currentTime - lastUpdateTime;
            
            // If price was updated in the last hour, use it
            if (timeDiff < 3600000) {
                return parseFloat(storedPrice);
            }
        }
    }
    
    // Fetch fresh price
    const freshPrice = await fetchPlatinumPrice();
    
    // Store in localStorage
    localStorage.setItem('currentPlatinumPrice', freshPrice);
    
    // Only update lastUpdated if gold price was also updated
    if (forceFresh) {
        localStorage.setItem('lastUpdated', new Date().toLocaleString());
    }
    
    return parseFloat(freshPrice);
}

/**
 * Update all metal prices at once
 * @param {boolean} forceFresh - Whether to force a fresh API call
 * @returns {Promise<Object>} - Object containing all metal prices
 */
async function updateAllMetalPrices(forceFresh = false) {
    const goldPrice = await getCurrentGoldPrice(forceFresh);
    const silverPrice = await getCurrentSilverPrice(forceFresh);
    const platinumPrice = await getCurrentPlatinumPrice(forceFresh);
    
    // Update lastUpdated timestamp
    localStorage.setItem('lastUpdated', new Date().toLocaleString());
    
    return {
        gold: goldPrice,
        silver: silverPrice,
        platinum: platinumPrice
    };
}

/**
 * Format a price as currency
 * @param {number} price - The price to format
 * @returns {string} - Formatted price string
 */
function formatGoldPrice(price) {
    return '$' + parseFloat(price).toFixed(2);
}

/**
 * Calculate the purity percentage based on karat
 * @param {number} karat - The gold karat (8-24)
 * @returns {number} - Purity percentage (0-1)
 */
function calculatePurity(karat) {
    return karat / 24;
}

/**
 * Convert weight between different units
 * @param {number} weight - The weight value
 * @param {string} fromUnit - The unit to convert from ('g', 'oz', 'dwt')
 * @param {string} toUnit - The unit to convert to ('g', 'oz', 'dwt')
 * @returns {number} - The converted weight
 */
function convertWeight(weight, fromUnit, toUnit) {
    // Convert to grams first
    let grams;
    
    switch (fromUnit) {
        case 'g':
            grams = weight;
            break;
        case 'oz': // Troy ounces
            grams = weight * 31.1035;
            break;
        case 'dwt': // Pennyweight
            grams = weight * 1.55517;
            break;
        default:
            grams = weight;
    }
    
    // Convert from grams to target unit
    switch (toUnit) {
        case 'g':
            return grams;
        case 'oz': // Troy ounces
            return grams / 31.1035;
        case 'dwt': // Pennyweight
            return grams / 1.55517;
        default:
            return grams;
    }
} 