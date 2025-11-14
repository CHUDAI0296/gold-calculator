/**
 * Gold Calculator - Fallback Charts with Simulated Data
 * Ultra-reliable chart implementation that works without external API calls
 */

class SimulatedChart {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.warn(`Canvas with id "${canvasId}" not found`);
            return null;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.options = {
            responsive: true,
            lineColor: '#D4AF37',
            pointColor: '#FFD700',
            backgroundColor: '#ffffff',
            gridColor: '#e0e0e0',
            textColor: '#333333',
            ...options
        };
        
        this.data = [];
        this.basePrice = 2000; // Base price for simulation
        this.isAnimating = false;
        
        this.setupCanvas();
        this.generateInitialData();
    }
    
    setupCanvas() {
        this.resizeCanvas();
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.draw();
        });
    }
    
    resizeCanvas() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        this.canvas.width = rect.width;
        this.canvas.height = rect.height || 400;
        
        // Scale for high DPI displays
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.canvas.width * dpr;
        this.canvas.height = this.canvas.height * dpr;
        this.ctx.scale(dpr, dpr);
        
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = (rect.height || 400) + 'px';
    }
    
    generateInitialData(days = 30) {
        const now = new Date();
        this.data = [];
        
        for (let i = days; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            
            // Generate realistic price movements
            const trend = Math.sin((days - i) / days * Math.PI * 2) * 50; // Cyclical trend
            const noise = (Math.random() - 0.5) * 30; // Random noise
            const price = this.basePrice + trend + noise;
            
            this.data.push({
                date: date.toISOString().split('T')[0],
                time: date.toLocaleDateString(),
                price: Math.max(1000, price),
                label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            });
        }
        
        // Update base price for next generation
        this.basePrice = this.data[this.data.length - 1].price;
    }
    
    updateData() {
        // Add new data point
        const lastDate = new Date(this.data[this.data.length - 1].date);
        const newDate = new Date(lastDate.getTime() + 24 * 60 * 60 * 1000);
        
        // Generate new price with realistic movement
        const lastPrice = this.data[this.data.length - 1].price;
        const change = (Math.random() - 0.5) * 20; // ±$10 change
        const newPrice = Math.max(1000, lastPrice + change);
        
        this.data.push({
            date: newDate.toISOString().split('T')[0],
            time: newDate.toLocaleDateString(),
            price: newPrice,
            label: newDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        });
        
        // Keep only last 30 days
        if (this.data.length > 31) {
            this.data.shift();
        }
        
        this.basePrice = newPrice;
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
        
        // Draw current price indicator
        this.drawCurrentPriceIndicator(width, height);
    }
    
    drawGrid(width, height) {
        this.ctx.strokeStyle = this.options.gridColor;
        this.ctx.lineWidth = 1;
        
        // Horizontal grid lines
        for (let i = 0; i <= 5; i++) {
            const y = (height - 60) * (i / 5) + 30;
            this.ctx.beginPath();
            this.ctx.moveTo(50, y);
            this.ctx.lineTo(width - 20, y);
            this.ctx.stroke();
        }
        
        // Vertical grid lines
        const step = Math.max(1, Math.floor(this.data.length / 6));
        for (let i = 0; i < this.data.length; i += step) {
            const x = 50 + (width - 70) * (i / (this.data.length - 1));
            this.ctx.beginPath();
            this.ctx.moveTo(x, 30);
            this.ctx.lineTo(x, height - 30);
            this.ctx.stroke();
        }
    }
    
    drawChart(width, height) {
        if (this.data.length < 2) return;
        
        const chartWidth = width - 70;
        const chartHeight = height - 80;
        const minPrice = Math.min(...this.data.map(d => d.price));
        const maxPrice = Math.max(...this.data.map(d => d.price));
        const priceRange = maxPrice - minPrice || 1;
        
        // Draw line
        this.ctx.strokeStyle = this.options.lineColor;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        
        this.data.forEach((point, index) => {
            const x = 50 + chartWidth * (index / (this.data.length - 1));
            const y = 40 + chartHeight * (1 - (point.price - minPrice) / priceRange);
            
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
            const x = 50 + chartWidth * (index / (this.data.length - 1));
            const y = 40 + chartHeight * (1 - (point.price - minPrice) / priceRange);
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, 4, 0, 2 * Math.PI);
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
                const x = 50 + (width - 70) * (index / (this.data.length - 1));
                this.ctx.fillText(point.label, x, height - 10);
            }
        });
        
        // Y-axis labels (price)
        this.ctx.textAlign = 'right';
        const minPrice = Math.min(...this.data.map(d => d.price));
        const maxPrice = Math.max(...this.data.map(d => d.price));
        
        for (let i = 0; i <= 5; i++) {
            const price = minPrice + (maxPrice - minPrice) * (1 - i / 5);
            const y = (height - 80) * (i / 5) + 45;
            this.ctx.fillText('$' + price.toFixed(2), 45, y);
        }
    }
    
    drawCurrentPriceIndicator(width, height) {
        if (this.data.length === 0) return;
        
        const currentPrice = this.data[this.data.length - 1].price;
        const minPrice = Math.min(...this.data.map(d => d.price));
        const maxPrice = Math.max(...this.data.map(d => d.price));
        const priceRange = maxPrice - minPrice || 1;
        
        const x = 50 + (width - 70) * ((this.data.length - 1) / (this.data.length - 1));
        const y = 40 + (height - 80) * (1 - (currentPrice - minPrice) / priceRange);
        
        // Draw current price indicator
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.beginPath();
        this.ctx.arc(x, y, 6, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Draw price label
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('$' + currentPrice.toFixed(2), x + 15, y + 5);
    }
    
    update() {
        this.updateData();
    }
    
    destroy() {
        window.removeEventListener('resize', this.resizeCanvas);
    }
}

// Initialize simulated charts
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit to ensure DOM is fully loaded
    setTimeout(() => {
        // Initialize market chart
        const marketCanvas = document.getElementById('priceHistoryChart');
        if (marketCanvas) {
            try {
                window.simulatedMarketChart = new SimulatedChart('priceHistoryChart', {
                    lineColor: '#D4AF37',
                    pointColor: '#FFD700',
                    backgroundColor: '#ffffff',
                    gridColor: '#e0e0e0'
                });
                
                // Auto-update every 30 seconds
                setInterval(() => {
                    if (window.simulatedMarketChart) {
                        window.simulatedMarketChart.update();
                    }
                }, 30000);
                
                console.log('Simulated market chart initialized successfully');
            } catch (error) {
                console.error('Failed to initialize simulated market chart:', error);
            }
        }
        
        // Initialize home chart
        const homeCanvas = document.getElementById('homePriceChart');
        if (homeCanvas) {
            try {
                window.simulatedHomeChart = new SimulatedChart('homePriceChart', {
                    lineColor: '#D4AF37',
                    pointColor: '#FFD700',
                    backgroundColor: '#f8f9fa',
                    gridColor: '#dee2e6',
                    textColor: '#495057'
                });
                
                // Auto-update every 30 seconds for home page
                setInterval(() => {
                    if (window.simulatedHomeChart) {
                        window.simulatedHomeChart.update();
                    }
                }, 30000);
                
                console.log('Simulated home chart initialized successfully');
            } catch (error) {
                console.error('Failed to initialize simulated home chart:', error);
            }
        }
    }, 1000); // Wait 1 second for DOM to be ready
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SimulatedChart;
}