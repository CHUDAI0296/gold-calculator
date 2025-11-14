/**
 * Gold Calculator - Lightweight Chart Adapter
 * Simplified chart implementation for better performance and reliability
 */

class LightweightChart {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            throw new Error(`Canvas with id "${canvasId}" not found`);
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.options = {
            responsive: true,
            maintainAspectRatio: false,
            backgroundColor: '#ffffff',
            gridColor: '#e0e0e0',
            textColor: '#333333',
            lineColor: '#D4AF37',
            pointColor: '#FFD700',
            ...options
        };
        
        this.data = [];
        this.animationFrame = null;
        this.isAnimating = false;
        
        this.setupCanvas();
    }
    
    setupCanvas() {
        // Set canvas size
        this.resizeCanvas();
        
        // Add resize listener
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.draw();
        });
    }
    
    resizeCanvas() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        // Set canvas dimensions
        this.canvas.width = rect.width;
        this.canvas.height = rect.height || 400;
        
        // Scale for high DPI displays
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.canvas.width * dpr;
        this.canvas.height = this.canvas.height * dpr;
        this.ctx.scale(dpr, dpr);
        
        // Set CSS size
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = (rect.height || 400) + 'px';
    }
    
    setData(data) {
        this.data = data.map((item, index) => ({
            x: index,
            y: parseFloat(item.price || item.y || item.value || 0),
            label: item.time || item.date || item.label || '',
            original: item
        }));
        this.draw();
    }
    
    draw() {
        if (!this.ctx || !this.data.length) return;
        
        const width = this.canvas.width / (window.devicePixelRatio || 1);
        const height = this.canvas.height / (window.devicePixelRatio || 1);
        
        // Clear canvas
        this.ctx.clearRect(0, 0, width, height);
        
        // Draw background
        this.ctx.fillStyle = this.options.backgroundColor;
        this.ctx.fillRect(0, 0, width, height);
        
        // Draw grid
        this.drawGrid(width, height);
        
        // Draw chart
        this.drawChart(width, height);
        
        // Draw labels
        this.drawLabels(width, height);
    }
    
    drawGrid(width, height) {
        this.ctx.strokeStyle = this.options.gridColor;
        this.ctx.lineWidth = 1;
        
        // Horizontal grid lines
        for (let i = 0; i <= 5; i++) {
            const y = (height - 40) * (i / 5) + 20;
            this.ctx.beginPath();
            this.ctx.moveTo(40, y);
            this.ctx.lineTo(width - 20, y);
            this.ctx.stroke();
        }
        
        // Vertical grid lines
        const step = Math.max(1, Math.floor(this.data.length / 6));
        for (let i = 0; i < this.data.length; i += step) {
            const x = 40 + (width - 60) * (i / (this.data.length - 1));
            this.ctx.beginPath();
            this.ctx.moveTo(x, 20);
            this.ctx.lineTo(x, height - 20);
            this.ctx.stroke();
        }
    }
    
    drawChart(width, height) {
        if (this.data.length < 2) return;
        
        const chartWidth = width - 60;
        const chartHeight = height - 60;
        const minPrice = Math.min(...this.data.map(d => d.y));
        const maxPrice = Math.max(...this.data.map(d => d.y));
        const priceRange = maxPrice - minPrice || 1;
        
        // Draw line
        this.ctx.strokeStyle = this.options.lineColor;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        
        this.data.forEach((point, index) => {
            const x = 40 + chartWidth * (index / (this.data.length - 1));
            const y = 30 + chartHeight * (1 - (point.y - minPrice) / priceRange);
            
            if (index === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });
        
        this.ctx.stroke();
        
        // Draw points
        this.ctx.fillStyle = this.options.pointColor;
        this.data.forEach((point, index) => {
            const x = 40 + chartWidth * (index / (this.data.length - 1));
            const y = 30 + chartHeight * (1 - (point.y - minPrice) / priceRange);
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, 3, 0, 2 * Math.PI);
            this.ctx.fill();
        });
    }
    
    drawLabels(width, height) {
        this.ctx.fillStyle = this.options.textColor;
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        
        // X-axis labels (time)
        const step = Math.max(1, Math.floor(this.data.length / 6));
        this.data.forEach((point, index) => {
            if (index % step === 0) {
                const x = 40 + (width - 60) * (index / (this.data.length - 1));
                this.ctx.fillText(point.label, x, height - 5);
            }
        });
        
        // Y-axis labels (price)
        this.ctx.textAlign = 'right';
        const minPrice = Math.min(...this.data.map(d => d.y));
        const maxPrice = Math.max(...this.data.map(d => d.y));
        
        for (let i = 0; i <= 5; i++) {
            const price = minPrice + (maxPrice - minPrice) * (1 - i / 5);
            const y = (height - 40) * (i / 5) + 25;
            this.ctx.fillText('$' + price.toFixed(2), 35, y);
        }
    }
    
    update(newData) {
        this.setData(newData);
    }
    
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        window.removeEventListener('resize', this.resizeCanvas);
    }
}

// Lightweight price fetcher with fallback
class PriceDataFetcher {
    constructor() {
        this.endpoints = [
            {
                name: 'metals.live',
                url: 'https://api.metals.live/v1/spot/gold',
                parser: (data) => data && data[0] ? data[0].price : null
            },
            {
                name: 'metalpriceapi',
                url: 'https://api.metalpriceapi.com/v1/latest?api_key=demo&base=XAU&currencies=USD',
                parser: (data) => data && data.rates && data.rates.USD ? 1 / data.rates.USD : null
            },
            {
                name: 'metals.dev',
                url: 'https://api.metals.dev/v1/latest?api_key=free&base=XAU&symbols=USD',
                parser: (data) => data && data.data && data.data.USD ? data.data.USD : null
            },
            {
                name: 'goldapi.io',
                url: 'https://www.goldapi.io/api/XAU/USD',
                headers: {
                    'x-access-token': 'goldapi-1v2d2ukw1684l4v-io',
                    'Content-Type': 'application/json'
                },
                parser: (data) => data && data.price ? data.price : null
            },
            {
                name: 'forexapi',
                url: 'https://api.forexapi.eu/v1/latest?api_key=demo&base=XAU&symbols=USD',
                parser: (data) => data && data.rates && data.rates.USD ? data.rates.USD : null
            },
            {
                name: 'yahoo.finance',
                url: 'https://query1.finance.yahoo.com/v8/finance/chart/GC=F',
                parser: (data) => {
                    if (data && data.chart && data.chart.result && data.chart.result[0]) {
                        const result = data.chart.result[0];
                        if (result.meta && result.meta.regularMarketPrice) {
                            return result.meta.regularMarketPrice;
                        }
                    }
                    return null;
                }
            }
        ];
        
        this.cache = new Map();
        this.cacheTimeout = 60000; // 1 minute
    }
    
    async fetchCurrentPrice() {
        // Check cache first
        const cached = this.cache.get('current');
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        
        // Try each endpoint
        for (const endpoint of this.endpoints) {
            try {
                // Create abort controller for timeout
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);
                
                const response = await fetch(endpoint.url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'GoldCalculator/1.0',
                        ...(endpoint.headers || {})
                    },
                    signal: controller.signal,
                    mode: 'cors'
                });
                
                clearTimeout(timeoutId);
                
                if (response.ok) {
                    const data = await response.json();
                    const price = endpoint.parser(data);
                    
                    if (price && price > 0) {
                        // Cache the result
                        this.cache.set('current', {
                            data: price,
                            timestamp: Date.now()
                        });
                        
                        console.log(`Successfully fetched price from ${endpoint.name}: $${price}`);
                        return price;
                    }
                }
            } catch (error) {
                console.warn(`Failed to fetch from ${endpoint.name}:`, error.message);
                continue;
            }
        }
        
        // Return cached value if available, otherwise return a reasonable default with small variation
        const basePrice = cached ? cached.data : 2000;
        const variation = (Math.random() - 0.5) * 10; // ±$5 variation
        const fallbackPrice = Math.max(1000, basePrice + variation);
        console.warn('All price endpoints failed, using simulated fallback price:', fallbackPrice);
        
        // If we have simulated chart available, use it instead
        if (window.simulatedMarketChart || window.simulatedHomeChart) {
            console.log('Using simulated chart instead of fallback price');
            return null; // Signal to use simulated chart
        }
        
        return fallbackPrice;
    }
    
    async fetchHistoricalData(days = 30) {
        // Generate mock historical data for demonstration
        // In a real implementation, you would fetch from a historical data API
        const currentPrice = await this.fetchCurrentPrice();
        const data = [];
        const now = new Date();
        
        for (let i = days; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
            const price = currentPrice * (1 + variation);
            
            data.push({
                date: date.toISOString().split('T')[0],
                time: date.toLocaleDateString(),
                price: price,
                label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            });
        }
        
        return data;
    }
}

// Initialize lightweight charts
document.addEventListener('DOMContentLoaded', function() {
    // Initialize market chart
    initializeMarketChart();
    
    // Initialize home chart
    initializeHomeChart();
});

function initializeMarketChart() {
    // Only initialize if canvas elements exist
    const chartCanvas = document.getElementById('priceHistoryChart');
    if (!chartCanvas) return;
    
    try {
        // Create lightweight chart instance
        window.lightweightChart = new LightweightChart('priceHistoryChart', {
            lineColor: '#D4AF37',
            pointColor: '#FFD700',
            backgroundColor: '#ffffff',
            gridColor: '#e0e0e0'
        });
        
        // Initialize data fetcher
        const fetcher = new PriceDataFetcher();
        
        // Load initial data
        loadMarketChartData();
        
        // Auto-refresh every 60 seconds
        setInterval(loadMarketChartData, 60000);
        
        async function loadMarketChartData() {
            try {
                const currentPrice = await fetcher.fetchCurrentPrice();
                
                // If API returned null (signal to use simulated data), fall back to simulated chart
                if (currentPrice === null && window.simulatedMarketChart) {
                    console.log('Falling back to simulated market chart');
                    return;
                }
                
                const data = await fetcher.fetchHistoricalData(30);
                window.lightweightChart.update(data);
                updatePriceDisplay(currentPrice);
            } catch (error) {
                console.error('Failed to load market chart data:', error);
                // Fall back to simulated chart if available
                if (window.simulatedMarketChart) {
                    console.log('Falling back to simulated market chart due to error');
                }
            }
        }
        
        function updatePriceDisplay(price) {
            const priceElement = document.getElementById('currentGoldPrice');
            if (priceElement) {
                priceElement.textContent = `$${price.toFixed(2)}`;
            }
        }
        
        console.log('Market lightweight chart system initialized successfully');
        
    } catch (error) {
        console.error('Failed to initialize market lightweight chart:', error);
        
        // Fallback: show a simple price display without chart
        showFallbackDisplay();
    }
}

function initializeHomeChart() {
    // Only initialize if home chart canvas exists
    const homeChartCanvas = document.getElementById('homePriceChart');
    if (!homeChartCanvas) return;
    
    try {
        // Create home chart instance
        window.homeChart = new LightweightChart('homePriceChart', {
            lineColor: '#D4AF37',
            pointColor: '#FFD700',
            backgroundColor: '#f8f9fa',
            gridColor: '#dee2e6',
            textColor: '#495057'
        });
        
        // Initialize data fetcher
        const fetcher = new PriceDataFetcher();
        
        // Load initial data
        loadHomeChartData();
        
        // Auto-refresh every 30 seconds for home page
        setInterval(loadHomeChartData, 30000);
        
        async function loadHomeChartData() {
            try {
                const data = await fetcher.fetchHistoricalData(7); // 7 days for home page
                window.homeChart.update(data);
                
                // Update last update time
                updateLastUpdateTime();
            } catch (error) {
                console.error('Failed to load home chart data:', error);
            }
        }
        
        function updateLastUpdateTime() {
            const timeElement = document.getElementById('lastUpdateTime');
            if (timeElement) {
                const now = new Date();
                timeElement.textContent = ' - Updated ' + now.toLocaleTimeString();
            }
        }
        
        console.log('Home lightweight chart system initialized successfully');
        
    } catch (error) {
        console.error('Failed to initialize home lightweight chart:', error);
        
        // Fallback: show a simple message
        showHomeFallbackDisplay();
    }
}

function showFallbackDisplay() {
    const chartContainer = document.querySelector('.chart-container');
    const chartCanvas = document.getElementById('priceHistoryChart');
    const simpleDisplay = document.getElementById('simplePriceDisplay');
    
    if (chartCanvas && simpleDisplay) {
        // Hide chart canvas
        chartCanvas.style.display = 'none';
        
        // Show simple price display
        simpleDisplay.style.display = 'block';
        
        // Initialize simple price display if not already done
        if (!window.marketPriceDisplay) {
            window.marketPriceDisplay = new SimplePriceDisplay('simplePriceDisplay', {
                updateInterval: 60000
            });
        }
    } else if (chartContainer) {
        // Fallback to basic HTML display
        chartContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <h3>Current Gold Price</h3>
                <div style="font-size: 2rem; color: #D4AF37; margin: 1rem 0;">
                    Loading...
                </div>
                <p style="color: #666;">Chart temporarily unavailable</p>
            </div>
        `;
        
        // Try to fetch and display current price
        const fetcher = new PriceDataFetcher();
        fetcher.fetchCurrentPrice().then(price => {
            const priceElement = chartContainer.querySelector('div[style*="font-size: 2rem"]');
            if (priceElement) {
                priceElement.textContent = `$${price.toFixed(2)}`;
            }
        }).catch(error => {
            console.error('Failed to fetch fallback price:', error);
        });
    }
}

function showHomeFallbackDisplay() {
    const chartContainer = document.getElementById('homePriceChart');
    if (chartContainer && chartContainer.parentElement) {
        chartContainer.parentElement.innerHTML = `
            <div style="text-align: center; padding: 1rem;">
                <div style="font-size: 1.5rem; color: #D4AF37; margin: 1rem 0;">
                    Live Price Data
                </div>
                <p style="color: #666; font-size: 0.9rem;">Chart loading...</p>
                <div style="margin-top: 1rem;">
                    <a href="market.html" class="btn btn-sm btn-outline-primary">View Full Charts</a>
                </div>
            </div>
        `;
    }
}