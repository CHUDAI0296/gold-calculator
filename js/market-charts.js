/**
 * Gold Calculator - Market Charts
 * Handles the display of historical price charts for precious metals
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize market charts
    initializeMarketCharts();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Update current prices
    updateCurrentPrices();
});

/**
 * Initialize the market charts
 */
function initializeMarketCharts() {
    // Get the chart canvas
    const ctx = document.getElementById('priceHistoryChart');
    
    if (!ctx) return;
    
    // Create the chart
    window.priceHistoryChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], // Will be populated with dates
            datasets: [
                {
                    label: 'Gold (USD/oz)',
                    data: [], // Will be populated with prices
                    borderColor: '#D4AF37',
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    borderWidth: 2,
                    tension: 0.1,
                    pointRadius: 2,
                    pointHoverRadius: 5
                },
                {
                    label: 'Silver (USD/oz)',
                    data: [], // Will be populated with prices
                    borderColor: '#C0C0C0',
                    backgroundColor: 'rgba(192, 192, 192, 0.1)',
                    borderWidth: 2,
                    tension: 0.1,
                    pointRadius: 2,
                    pointHoverRadius: 5
                },
                {
                    label: 'Platinum (USD/oz)',
                    data: [], // Will be populated with prices
                    borderColor: '#E5E4E2',
                    backgroundColor: 'rgba(229, 228, 226, 0.1)',
                    borderWidth: 2,
                    tension: 0.1,
                    pointRadius: 2,
                    pointHoverRadius: 5
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': $' + context.parsed.y.toFixed(2);
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Price (USD/oz)'
                    },
                    beginAtZero: false
                }
            }
        }
    });
    
    // Load initial data (7 days by default)
    loadHistoricalData(7);
}

/**
 * Initialize event listeners for the chart controls
 */
function initializeEventListeners() {
    // Time range buttons
    const timeRangeButtons = document.querySelectorAll('.time-range-btn');
    timeRangeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            timeRangeButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get the selected time range
            const range = parseInt(this.dataset.range);
            
            // Load data for the selected range
            loadHistoricalData(range);
        });
    });
    
    // Metal selection checkboxes
    const metalCheckboxes = document.querySelectorAll('#showGold, #showSilver, #showPlatinum');
    metalCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateChartVisibility);
    });
}

/**
 * Update the visibility of datasets based on checkbox selections
 */
function updateChartVisibility() {
    if (!window.priceHistoryChart) return;
    
    const showGold = document.getElementById('showGold').checked;
    const showSilver = document.getElementById('showSilver').checked;
    const showPlatinum = document.getElementById('showPlatinum').checked;
    
    window.priceHistoryChart.data.datasets[0].hidden = !showGold;
    window.priceHistoryChart.data.datasets[1].hidden = !showSilver;
    window.priceHistoryChart.data.datasets[2].hidden = !showPlatinum;
    
    window.priceHistoryChart.update();
}

/**
 * Load historical price data for the specified number of days
 * @param {number} days - Number of days to load
 */
function loadHistoricalData(days) {
    // In a real implementation, you would fetch data from an API
    // For demo purposes, we'll generate simulated historical data
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const dates = [];
    const goldPrices = [];
    const silverPrices = [];
    const platinumPrices = [];
    
    // Generate data points for each day in the range
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        // Format date as MM/DD/YYYY
        const dateStr = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
        dates.push(dateStr);
        
        // Generate simulated prices
        // Base prices
        const baseGoldPrice = 2000;
        const baseSilverPrice = 25;
        const basePlatinumPrice = 950;
        
        // Add some randomness to simulate price fluctuations
        // The further back in time, the more different the price might be
        const daysDiff = Math.floor((endDate - d) / (1000 * 60 * 60 * 24));
        const trendFactor = daysDiff / days; // 0 to 1, higher for older dates
        
        // Gold: trending up slightly over time
        const goldTrend = -50 * trendFactor; // Lower in the past
        const goldRandom = (Math.random() - 0.3) * 30; // Daily fluctuation
        goldPrices.push(baseGoldPrice + goldTrend + goldRandom);
        
        // Silver: more volatile
        const silverTrend = -3 * trendFactor; // Lower in the past
        const silverRandom = (Math.random() - 0.3) * 2; // Daily fluctuation
        silverPrices.push(baseSilverPrice + silverTrend + silverRandom);
        
        // Platinum: trending down slightly
        const platinumTrend = 30 * trendFactor; // Higher in the past
        const platinumRandom = (Math.random() - 0.3) * 15; // Daily fluctuation
        platinumPrices.push(basePlatinumPrice + platinumTrend + platinumRandom);
    }
    
    // Update chart data
    if (window.priceHistoryChart) {
        window.priceHistoryChart.data.labels = dates;
        window.priceHistoryChart.data.datasets[0].data = goldPrices;
        window.priceHistoryChart.data.datasets[1].data = silverPrices;
        window.priceHistoryChart.data.datasets[2].data = platinumPrices;
        window.priceHistoryChart.update();
    }
    
    // Update price change indicators
    updatePriceChangeIndicators(goldPrices, silverPrices, platinumPrices);
    
    // Update year-to-date and high/low values
    updateYearlyStats(goldPrices, silverPrices, platinumPrices);
}

/**
 * Update the current prices display
 */
function updateCurrentPrices() {
    // Get current prices (in a real implementation, these would come from the API)
    getCurrentGoldPrice().then(goldPrice => {
        document.getElementById('current-gold-price').textContent = formatGoldPrice(goldPrice);
    });
    
    getCurrentSilverPrice().then(silverPrice => {
        document.getElementById('current-silver-price').textContent = formatGoldPrice(silverPrice);
    });
    
    getCurrentPlatinumPrice().then(platinumPrice => {
        document.getElementById('current-platinum-price').textContent = formatGoldPrice(platinumPrice);
    });
    
    // Update last updated timestamp
    const lastUpdatedElements = document.querySelectorAll('#last-updated');
    lastUpdatedElements.forEach(element => {
        element.textContent = localStorage.getItem('lastUpdated') || new Date().toLocaleString();
    });
}

/**
 * Update price change indicators
 * @param {Array} goldPrices - Array of gold prices
 * @param {Array} silverPrices - Array of silver prices
 * @param {Array} platinumPrices - Array of platinum prices
 */
function updatePriceChangeIndicators(goldPrices, silverPrices, platinumPrices) {
    if (goldPrices.length < 2 || silverPrices.length < 2 || platinumPrices.length < 2) return;
    
    // Calculate price changes
    const goldChange = goldPrices[goldPrices.length - 1] - goldPrices[goldPrices.length - 2];
    const goldChangePercent = (goldChange / goldPrices[goldPrices.length - 2]) * 100;
    
    const silverChange = silverPrices[silverPrices.length - 1] - silverPrices[silverPrices.length - 2];
    const silverChangePercent = (silverChange / silverPrices[silverPrices.length - 2]) * 100;
    
    const platinumChange = platinumPrices[platinumPrices.length - 1] - platinumPrices[platinumPrices.length - 2];
    const platinumChangePercent = (platinumChange / platinumPrices[platinumPrices.length - 2]) * 100;
    
    // Update gold change indicator
    const goldChangeElement = document.getElementById('gold-price-change');
    if (goldChangeElement) {
        const changeValueElement = goldChangeElement.querySelector('.change-value');
        const changePercentElement = goldChangeElement.querySelector('.change-percent');
        
        if (changeValueElement) {
            changeValueElement.textContent = (goldChange >= 0 ? '+' : '') + formatGoldPrice(goldChange);
            changeValueElement.className = 'change-value ' + (goldChange >= 0 ? 'text-success' : 'text-danger');
        }
        
        if (changePercentElement) {
            changePercentElement.textContent = '(' + (goldChangePercent >= 0 ? '+' : '') + goldChangePercent.toFixed(2) + '%)';
            changePercentElement.className = 'change-percent ' + (goldChangePercent >= 0 ? 'text-success' : 'text-danger');
        }
    }
    
    // Update silver change indicator
    const silverChangeElement = document.getElementById('silver-price-change');
    if (silverChangeElement) {
        const changeValueElement = silverChangeElement.querySelector('.change-value');
        const changePercentElement = silverChangeElement.querySelector('.change-percent');
        
        if (changeValueElement) {
            changeValueElement.textContent = (silverChange >= 0 ? '+' : '') + formatGoldPrice(silverChange);
            changeValueElement.className = 'change-value ' + (silverChange >= 0 ? 'text-success' : 'text-danger');
        }
        
        if (changePercentElement) {
            changePercentElement.textContent = '(' + (silverChangePercent >= 0 ? '+' : '') + silverChangePercent.toFixed(2) + '%)';
            changePercentElement.className = 'change-percent ' + (silverChangePercent >= 0 ? 'text-success' : 'text-danger');
        }
    }
    
    // Update platinum change indicator
    const platinumChangeElement = document.getElementById('platinum-price-change');
    if (platinumChangeElement) {
        const changeValueElement = platinumChangeElement.querySelector('.change-value');
        const changePercentElement = platinumChangeElement.querySelector('.change-percent');
        
        if (changeValueElement) {
            changeValueElement.textContent = (platinumChange >= 0 ? '+' : '') + formatGoldPrice(platinumChange);
            changeValueElement.className = 'change-value ' + (platinumChange >= 0 ? 'text-success' : 'text-danger');
        }
        
        if (changePercentElement) {
            changePercentElement.textContent = '(' + (platinumChangePercent >= 0 ? '+' : '') + platinumChangePercent.toFixed(2) + '%)';
            changePercentElement.className = 'change-percent ' + (platinumChangePercent >= 0 ? 'text-success' : 'text-danger');
        }
    }
}

/**
 * Update yearly statistics (YTD, high, low)
 * @param {Array} goldPrices - Array of gold prices
 * @param {Array} silverPrices - Array of silver prices
 * @param {Array} platinumPrices - Array of platinum prices
 */
function updateYearlyStats(goldPrices, silverPrices, platinumPrices) {
    // Calculate YTD changes (using first and last price in the array)
    if (goldPrices.length > 0) {
        const goldYtdChange = ((goldPrices[goldPrices.length - 1] / goldPrices[0]) - 1) * 100;
        document.getElementById('gold-ytd').textContent = (goldYtdChange >= 0 ? '+' : '') + goldYtdChange.toFixed(1) + '%';
        document.getElementById('gold-ytd').className = goldYtdChange >= 0 ? 'text-success' : 'text-danger';
    }
    
    if (silverPrices.length > 0) {
        const silverYtdChange = ((silverPrices[silverPrices.length - 1] / silverPrices[0]) - 1) * 100;
        document.getElementById('silver-ytd').textContent = (silverYtdChange >= 0 ? '+' : '') + silverYtdChange.toFixed(1) + '%';
        document.getElementById('silver-ytd').className = silverYtdChange >= 0 ? 'text-success' : 'text-danger';
    }
    
    if (platinumPrices.length > 0) {
        const platinumYtdChange = ((platinumPrices[platinumPrices.length - 1] / platinumPrices[0]) - 1) * 100;
        document.getElementById('platinum-ytd').textContent = (platinumYtdChange >= 0 ? '+' : '') + platinumYtdChange.toFixed(1) + '%';
        document.getElementById('platinum-ytd').className = platinumYtdChange >= 0 ? 'text-success' : 'text-danger';
    }
    
    // Calculate high and low prices
    if (goldPrices.length > 0) {
        const goldHigh = Math.max(...goldPrices);
        const goldLow = Math.min(...goldPrices);
        document.getElementById('gold-high').textContent = formatGoldPrice(goldHigh);
        document.getElementById('gold-low').textContent = formatGoldPrice(goldLow);
    }
    
    if (silverPrices.length > 0) {
        const silverHigh = Math.max(...silverPrices);
        const silverLow = Math.min(...silverPrices);
        document.getElementById('silver-high').textContent = formatGoldPrice(silverHigh);
        document.getElementById('silver-low').textContent = formatGoldPrice(silverLow);
    }
    
    if (platinumPrices.length > 0) {
        const platinumHigh = Math.max(...platinumPrices);
        const platinumLow = Math.min(...platinumPrices);
        document.getElementById('platinum-high').textContent = formatGoldPrice(platinumHigh);
        document.getElementById('platinum-low').textContent = formatGoldPrice(platinumLow);
    }
} 