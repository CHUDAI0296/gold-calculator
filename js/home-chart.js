/**
 * Gold Calculator - Home Page Price Chart
 * Displays real-time price trends for precious metals on the homepage
 */

// Global chart instance
let homePriceChart = null;

/**
 * Initialize the home page price chart
 */
function initializeHomeChart() {
    const ctx = document.getElementById('homePriceChart');
    if (!ctx) {
        console.warn('Home price chart canvas not found');
        return;
    }
    
    // Get price history data
    const goldHistory = getPriceHistory('gold', 8); // Last 8 hours
    const silverHistory = getPriceHistory('silver', 8);
    const platinumHistory = getPriceHistory('platinum', 8);
    
    // Prepare chart data
    const labels = goldHistory.map(point => {
        const date = new Date(point.timestamp * 1000);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    });
    
    const config = {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Gold',
                    data: goldHistory.map(point => point.price),
                    borderColor: '#FFD700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    borderWidth: 2,
                    tension: 0.1,
                    pointRadius: 0,
                    pointHoverRadius: 4
                },
                {
                    label: 'Silver',
                    data: silverHistory.map(point => point.price),
                    borderColor: '#C0C0C0',
                    backgroundColor: 'rgba(192, 192, 192, 0.1)',
                    borderWidth: 2,
                    tension: 0.1,
                    pointRadius: 0,
                    pointHoverRadius: 4
                },
                {
                    label: 'Platinum',
                    data: platinumHistory.map(point => point.price),
                    borderColor: '#E5E4E2',
                    backgroundColor: 'rgba(229, 228, 226, 0.1)',
                    borderWidth: 2,
                    tension: 0.1,
                    pointRadius: 0,
                    pointHoverRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: false
                },
                legend: {
                    position: 'top',
                    labels: {
                        color: '#333',
                        usePointStyle: true,
                        padding: 15,
                        font: {
                            size: 11
                        }
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#D4AF37',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label;
                            const value = context.parsed.y;
                            return `${label}: $${value.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: '#666',
                        font: {
                            size: 10
                        }
                    }
                },
                y: {
                    display: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: '#666',
                        font: {
                            size: 10
                        },
                        callback: function(value) {
                            return '$' + value.toFixed(0);
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    };
    
    homePriceChart = new Chart(ctx, config);
    
    // Update last update time
    updateLastUpdateTime();
    
    console.log('Home price chart initialized successfully');
}

/**
 * Update chart with new price data
 */
function updateHomeChart() {
    if (!homePriceChart) {
        console.warn('Home price chart not initialized');
        return;
    }
    
    try {
        // Get updated price history
        const goldHistory = getPriceHistory('gold', 8);
        const silverHistory = getPriceHistory('silver', 8);
        const platinumHistory = getPriceHistory('platinum', 8);
        
        // Update labels
        const labels = goldHistory.map(point => {
            const date = new Date(point.timestamp * 1000);
            return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        });
        
        // Update chart data
        homePriceChart.data.labels = labels;
        homePriceChart.data.datasets[0].data = goldHistory.map(point => point.price);
        homePriceChart.data.datasets[1].data = silverHistory.map(point => point.price);
        homePriceChart.data.datasets[2].data = platinumHistory.map(point => point.price);
        
        // Refresh chart
        homePriceChart.update('none'); // 'none' for no animation
        
        // Update last update time
        updateLastUpdateTime();
        
    } catch (error) {
        console.error('Error updating home chart:', error);
    }
}

/**
 * Update last update time display
 */
function updateLastUpdateTime() {
    const timeElement = document.getElementById('lastUpdateTime');
    if (timeElement) {
        const now = new Date();
        timeElement.textContent = ' - Updated at ' + now.toLocaleTimeString('en-US');
    }
}

/**
 * Listen for price updates and refresh chart
 */
function setupPriceUpdateListener() {
    window.addEventListener('pricesUpdated', function(event) {
        console.log('Price update event received, updating home chart...');
        updateHomeChart();
    });
}

/**
 * Initialize home chart when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for Chart.js to load
    setTimeout(() => {
        if (typeof Chart !== 'undefined') {
            initializeHomeChart();
            setupPriceUpdateListener();
            console.log('Home chart system initialized');
        } else {
            console.warn('Chart.js not available, home chart will not be displayed');
        }
    }, 1000);
});

/**
 * Auto-refresh chart data periodically
 */
setInterval(() => {
    if (homePriceChart && typeof updateHomeChart === 'function') {
        updateHomeChart();
    }
}, 30000); // Update every 30 seconds