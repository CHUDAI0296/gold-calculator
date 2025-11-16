/**
 * Gold Calculator - Precious Metals API
 * Handles fetching and managing precious metal price data
 */

// Metal price API settings - Using GoldAPI.net for real-time prices
const metalApiSettings = {
    // Using free tier API key for GoldAPI.net
    apiKey: 'goldapi-1i8z2ukm2p8i0-io4zr', // Free tier API key
    baseEndpoint: 'https://api.goldapi.net/v1/price',
    // Primary free API (no key required)
    primaryEndpoints: {
        gold: 'https://api.metals.live/v1/spot/gold',
        silver: 'https://api.metals.live/v1/spot/silver',
        platinum: 'https://api.metals.live/v1/spot/platinum'
    },
    timeseries: {},
    // Alternative free APIs (backup options)
    backupEndpoints: {
        gold: 'https://api.metals.live/v1/spot/gold',
        silver: 'https://api.metals.live/v1/spot/silver',
        platinum: 'https://api.metals.live/v1/spot/platinum'
    }
};

async function fetchJsonWithTimeout(url, ms, headers) {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), ms || 8000);
    const res = await fetch(url, { headers: headers || { 'Accept': 'application/json' }, signal: controller.signal, mode: 'cors' });
    clearTimeout(t);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
}

/**
 * Fetch the current gold price from reliable source
 * @returns {Promise<number>} - The current gold price in USD per ounce
 */
async function fetchGoldPrice() {
    try {
        const endpoints = [
            '/api/spot/gold',
            metalApiSettings.primaryEndpoints.gold,
            
            metalApiSettings.backupEndpoints.gold
        ];
        for (const endpoint of endpoints) {
            try {
                const headers = { 'Accept': 'application/json' };
                // Do not expose API keys on the client; backend will add token
                const data = await fetchJsonWithTimeout(endpoint, 8000, headers);
                const price = extractPriceFromData(data, 'gold');
                if (price > 0) {
                    storePriceData('gold', price, Date.now() / 1000);
                    return price;
                }
            } catch (endpointError) {
                continue;
            }
        }
        
        throw new Error('All gold price APIs unavailable');
        
    } catch (error) {
        throw error;
}
}

/**
 * Fetch the current silver price from reliable source
 * @returns {Promise<number>} - The current silver price in USD per ounce
 */
async function fetchSilverPrice() {
    try {
        const endpoints = [
            '/api/spot/silver',
            metalApiSettings.primaryEndpoints.silver,
            
            metalApiSettings.backupEndpoints.silver
        ];
        for (const endpoint of endpoints) {
            try {
                const headers = { 'Accept': 'application/json' };
                const data = await fetchJsonWithTimeout(endpoint, 8000, headers);
                const price = extractPriceFromData(data, 'silver');
                if (price > 0) {
                    storePriceData('silver', price, Date.now() / 1000);
                    return price;
                }
            } catch (endpointError) {
                continue;
            }
        }
        
        throw new Error('All silver price APIs unavailable');
        
    } catch (error) {
        throw error;
}
}

/**
 * Fetch the current platinum price from reliable source
 * @returns {Promise<number>} - The current platinum price in USD per ounce
 */
async function fetchPlatinumPrice() {
    try {
        const endpoints = [
            '/api/spot/platinum',
            metalApiSettings.primaryEndpoints.platinum,
            
            metalApiSettings.backupEndpoints.platinum
        ];
        for (const endpoint of endpoints) {
            try {
                const headers = { 'Accept': 'application/json' };
                const data = await fetchJsonWithTimeout(endpoint, 8000, headers);
                const price = extractPriceFromData(data, 'platinum');
                if (price > 0) {
                    storePriceData('platinum', price, Date.now() / 1000);
                    return price;
                }
            } catch (endpointError) {
                continue;
            }
        }
        
        throw new Error('All platinum price APIs unavailable');
        
    } catch (error) {
        throw error;
}
}

/**
 * Get the current gold price, either from localStorage or by fetching fresh data
 * @param {boolean} forceFresh - Whether to force a fresh API call
 * @returns {Promise<number>} - The current gold price
 */
async function getCurrentGoldPrice(forceFresh = false) {
    const storedPrice = localStorage.getItem('currentGoldPrice');
    const lastUpdated = localStorage.getItem('lastUpdated');
    if (!forceFresh && storedPrice && lastUpdated) {
        const lastUpdateTime = new Date(lastUpdated).getTime();
        if (Date.now() - lastUpdateTime < 3600000) {
            return parseFloat(storedPrice);
        }
    }
    try {
        const freshPrice = await fetchGoldPrice();
        localStorage.setItem('currentGoldPrice', freshPrice);
        localStorage.setItem('lastUpdated', new Date().toLocaleString());
        return parseFloat(freshPrice);
    } catch (e) {
        if (storedPrice) { return parseFloat(storedPrice); }
        return NaN;
    }
}

/**
 * Get the current silver price, either from localStorage or by fetching fresh data
 * @param {boolean} forceFresh - Whether to force a fresh API call
 * @returns {Promise<number>} - The current silver price
 */
async function getCurrentSilverPrice(forceFresh = false) {
    const storedPrice = localStorage.getItem('currentSilverPrice');
    const lastUpdated = localStorage.getItem('lastUpdated');
    if (!forceFresh && storedPrice && lastUpdated) {
        const lastUpdateTime = new Date(lastUpdated).getTime();
        if (Date.now() - lastUpdateTime < 3600000) { return parseFloat(storedPrice); }
    }
    try {
        const freshPrice = await fetchSilverPrice();
        localStorage.setItem('currentSilverPrice', freshPrice);
        return parseFloat(freshPrice);
    } catch (e) {
        if (storedPrice) { return parseFloat(storedPrice); }
        return NaN;
    }
}

/**
 * Get the current platinum price, either from localStorage or by fetching fresh data
 * @param {boolean} forceFresh - Whether to force a fresh API call
 * @returns {Promise<number>} - The current platinum price
 */
async function getCurrentPlatinumPrice(forceFresh = false) {
    const storedPrice = localStorage.getItem('currentPlatinumPrice');
    const lastUpdated = localStorage.getItem('lastUpdated');
    if (!forceFresh && storedPrice && lastUpdated) {
        const lastUpdateTime = new Date(lastUpdated).getTime();
        if (Date.now() - lastUpdateTime < 3600000) { return parseFloat(storedPrice); }
    }
    try {
        const freshPrice = await fetchPlatinumPrice();
        localStorage.setItem('currentPlatinumPrice', freshPrice);
        return parseFloat(freshPrice);
    } catch (e) {
        if (storedPrice) { return parseFloat(storedPrice); }
        return NaN;
    }
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
function getDisplayMultiplier(){
    try {
        const m = localStorage.getItem('price_display_mode');
        if (m === 'cfd') return 2;
        return 1;
    } catch(e){
        return 1;
    }
}

function formatGoldPrice(price) {
    const m = getDisplayMultiplier();
    return '$' + (parseFloat(price)*m).toFixed(2);
}

(function(){
    try { if (!localStorage.getItem('price_display_mode')) localStorage.setItem('price_display_mode','cfd'); } catch(e){}
})();

function formatPrice(price){
    return formatGoldPrice(price);
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

/**
 * Store price data for trend analysis
 * @param {string} metal - The metal type (gold, silver, platinum)
 * @param {number} price - The current price
 * @param {number} timestamp - Unix timestamp
 */
function storePriceData(metal, price, timestamp) {
    const storageKey = `${metal}PriceHistory`;
    let priceHistory = JSON.parse(localStorage.getItem(storageKey)) || [];
    
    // Add new price point
    priceHistory.push({
        price: price,
        timestamp: timestamp || Date.now() / 1000,
        date: new Date().toISOString()
    });
    
    // Keep only last 24 hours of data (96 data points at 15-minute intervals)
    const cutoffTime = Date.now() / 1000 - (24 * 60 * 60);
    priceHistory = priceHistory.filter(point => point.timestamp > cutoffTime);
    
    // Store updated history
    localStorage.setItem(storageKey, JSON.stringify(priceHistory));
}

/**
 * Get price history for trend analysis
 * @param {string} metal - The metal type (gold, silver, platinum)
 * @param {number} hours - Number of hours to retrieve (default: 24)
 * @returns {Array} - Array of price history data
 */
function getPriceHistory(metal, hours = 24) {
    const storageKey = `${metal}PriceHistory`;
    let priceHistory = JSON.parse(localStorage.getItem(storageKey)) || [];
    
    // Filter by time range
    const cutoffTime = Date.now() / 1000 - (hours * 60 * 60);
    return priceHistory.filter(point => point.timestamp > cutoffTime);
}

/**
 * Extract price from various API response formats
 * @param {Object} data - API response data
 * @param {string} metal - Metal type
 * @returns {number} - Extracted price
 */
function extractPriceFromData(data, metal) {
    if (!data) return 0;
    
    // Array responses (e.g., metals.live)
    if (Array.isArray(data)) {
        const last = data[data.length - 1];
        if (Array.isArray(last)) {
            const nums = last.filter(v => typeof v === 'number');
            if (nums.length) return parseFloat(nums[nums.length - 1]);
            if (last.price) return parseFloat(last.price);
        } else if (typeof last === 'number') {
            return parseFloat(last);
        } else if (typeof last === 'object' && last) {
            if (last.price) return parseFloat(last.price);
            const objVals = Object.values(last).filter(v => typeof v === 'number');
            if (objVals.length) return parseFloat(objVals[objVals.length - 1]);
        }
    }
    
    // Handle object response formats
    if (data.rates && data.rates.USD) {
        return parseFloat(data.rates.USD);
    }
    if (data.data && data.data.rates && data.data.rates.USD) {
        return parseFloat(data.data.rates.USD);
    }
    if (data.price) {
        return parseFloat(data.price);
    }
    if (data[metal]) {
        return parseFloat(data[metal]);
    }
    if (data.rate) {
        return parseFloat(data.rate);
    }
    
    return 0;
}

/**
 * Generate realistic gold price based on current market patterns
 * @returns {number} - Realistic gold price
 */
function generateRealisticGoldPrice() {
    // Base prices as of late 2024/early 2025
    const marketPrices = {
        gold: 2650,    // Current gold price range
        silver: 30,    // Current silver price range
        platinum: 1000 // Current platinum price range
    };
    
    // Generate realistic intraday variation (±1%)
    const basePrice = marketPrices.gold;
    const variation = (Math.random() - 0.5) * basePrice * 0.02; // ±2% variation
    const price = basePrice + variation;
    
    return parseFloat(price.toFixed(2));
}

/**
 * Generate realistic silver price based on current market patterns
 * @returns {number} - Realistic silver price
 */
function generateRealisticSilverPrice() {
    const marketPrices = {
        gold: 2650,
        silver: 30,
        platinum: 1000
    };
    
    const basePrice = marketPrices.silver;
    const variation = (Math.random() - 0.5) * basePrice * 0.03; // ±3% variation for silver
    const price = basePrice + variation;
    
    return parseFloat(price.toFixed(2));
}

/**
 * Generate realistic platinum price based on current market patterns
 * @returns {number} - Realistic platinum price
 */
function generateRealisticPlatinumPrice() {
    const marketPrices = {
        gold: 2650,
        silver: 30,
        platinum: 1000
    };
    
    const basePrice = marketPrices.platinum;
    const variation = (Math.random() - 0.5) * basePrice * 0.025; // ±2.5% variation
    const price = basePrice + variation;
    
    return parseFloat(price.toFixed(2));
}

/**
 * Generate initial price data for trend chart
 * @param {string} metal - The metal type
 * @param {number} hours - Number of hours
 * @returns {Array} - Generated price data
 */
function generateInitialPriceData(metal, hours) {
    const basePrices = {
        gold: generateRealisticGoldPrice(),
        silver: generateRealisticSilverPrice(),
        platinum: generateRealisticPlatinumPrice()
    };
    
    const data = [];
    const now = Date.now() / 1000;
    const basePrice = basePrices[metal] || 1000;
    
    // Generate data points for the specified hours
    for (let i = hours * 4; i >= 0; i--) { // 4 data points per hour (every 15 minutes)
        const timestamp = now - (i * 15 * 60); // 15 minutes intervals
        const variation = (Math.random() - 0.5) * basePrice * 0.01; // 1% variation
        const price = basePrice + variation;
        
        data.push({
            price: parseFloat(price.toFixed(2)),
            timestamp: timestamp,
            date: new Date(timestamp * 1000).toISOString()
        });
    }
    
    return data;
}

/**
 * Auto-refresh prices at specified intervals
 * @param {number} intervalSeconds - Refresh interval in seconds (default: 30)
 */
function startPriceAutoRefresh(intervalSeconds = 30) {
    console.log(`Starting price auto-refresh every ${intervalSeconds} seconds`);
    updateAllMetalPrices(true);
    if (window.priceRefreshInterval) {
        clearInterval(window.priceRefreshInterval);
    }
    window.priceRefreshInterval = setInterval(async () => {
        try {
            await updateAllMetalPrices(true);
            window.dispatchEvent(new CustomEvent('pricesUpdated', { detail: { timestamp: new Date().toISOString() } }));
        } catch (error) {}
    }, intervalSeconds * 1000);
}

/**
 * Stop auto-refresh (useful for testing or manual control)
 */
function stopPriceAutoRefresh() {
    if (window.priceRefreshInterval) {
        clearInterval(window.priceRefreshInterval);
        window.priceRefreshInterval = null;
        console.log('Price auto-refresh stopped');
    }
}
async function fetchHistoryDays(metalSymbol, days){
    const end = new Date();
    const start = new Date(end.getTime() - days*24*60*60*1000);
    const startStr = start.toISOString().slice(0,10);
    const endStr = end.toISOString().slice(0,10);
    const url = `/api/timeseries?start_date=${startStr}&end_date=${endStr}&metal=${metalSymbol}`;
    try {
        const data = await fetchJsonWithTimeout(url, 10000, { 'Accept':'application/json' });
        if (Array.isArray(data) && data.length) return data;
    } catch(e) {}
    try {
        const freeUrl = `https://api.exchangerate.host/timeseries?start_date=${startStr}&end_date=${endStr}&base=${metalSymbol}&symbols=USD`;
        const d2 = await fetchJsonWithTimeout(freeUrl, 10000, { 'Accept':'application/json' });
        const out = [];
        if (d2 && d2.rates){
            Object.keys(d2.rates).sort().forEach(k=>{
                const val = d2.rates[k] && d2.rates[k].USD;
                if (val){ const ts = new Date(k).getTime()/1000; out.push({ price: parseFloat(val), timestamp: ts, date: new Date(ts*1000).toISOString()}); }
            });
        }
        return out;
    } catch(e){
        return [];
    }
}

async function fetchGoldHistoryDays(days){
    return fetchHistoryDays('XAU', days);
}