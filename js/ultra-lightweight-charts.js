/**
 * Gold Calculator - Ultra Lightweight Chart Solution
 * Zero-dependency chart implementation that works 100% of the time
 */

class UltraLightweightChart {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.warn(`Canvas with id "${canvasId}" not found`);
            return null;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.options = {
            lineColor: '#D4AF37',
            pointColor: '#FFD700',
            backgroundColor: '#ffffff',
            gridColor: '#e0e0e0',
            textColor: '#333333',
            basePrice: 2000,
            ...options
        };
        
        this.data = [];
        this.isInitialized = false;
        
        this.setupCanvas();
        this.generateData();
        this.draw();
        
        // Auto-update every 30 seconds
        this.updateInterval = setInterval(() => {
            this.updateData();
            this.draw();
        }, 30000);
        
        this.isInitialized = true;
        console.log(`Ultra-lightweight chart initialized for ${canvasId}`);
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
    
    generateData(days = 30) {
        const now = new Date();
        this.data = [];
        
        for (let i = days; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            
            // Generate realistic price movements
            const trend = Math.sin((days - i) / days * Math.PI * 2) * 50;
            const noise = (Math.random() - 0.5) * 30;
            const price = this.options.basePrice + trend + noise;
            
            this.data.push({
                date: date.toISOString().split('T')[0],
                price: Math.max(1000, price),
                label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            });
        }
    }
    
    updateData() {
        // Add new data point
        const lastDate = new Date(this.data[this.data.length - 1].date);
        const newDate = new Date(lastDate.getTime() + 24 * 60 * 60 * 1000);
        
        // Generate new price with realistic movement
        const lastPrice = this.data[this.data.length - 1].price;
        const change = (Math.random() - 0.5) * 20;
        const newPrice = Math.max(1000, lastPrice + change);
        
        this.data.push({
            date: newDate.toISOString().split('T')[0],
            price: newPrice,
            label: newDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        });
        
        // Keep only last 30 days
        if (this.data.length > 31) {
            this.data.shift();
        }
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
        
        // Draw current price
        this.drawCurrentPrice(width, height);
    }
    
    drawGrid(width, height) {
        this.ctx.strokeStyle = this.options.gridColor;
        this.ctx.lineWidth = 1;
        
        // Horizontal grid lines
        for (let i = 0; i <= 5; i++) {
            const y = (height - 80) * (i / 5) + 40;
            this.ctx.beginPath();
            this.ctx.moveTo(60, y);
            this.ctx.lineTo(width - 20, y);
            this.ctx.stroke();
        }
        
        // Vertical grid lines
        const step = Math.max(1, Math.floor(this.data.length / 6));
        for (let i = 0; i < this.data.length; i += step) {
            const x = 60 + (width - 80) * (i / (this.data.length - 1));
            this.ctx.beginPath();
            this.ctx.moveTo(x, 40);
            this.ctx.lineTo(x, height - 40);
            this.ctx.stroke();
        }
    }
    
    drawChart(width, height) {
        if (this.data.length < 2) return;
        
        const chartWidth = width - 80;
        const chartHeight = height - 100;
        const minPrice = Math.min(...this.data.map(d => d.price));
        const maxPrice = Math.max(...this.data.map(d => d.price));
        const priceRange = maxPrice - minPrice || 1;
        
        // Draw line
        this.ctx.strokeStyle = this.options.lineColor;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        
        this.data.forEach((point, index) => {
            const x = 60 + chartWidth * (index / (this.data.length - 1));
            const y = 50 + chartHeight * (1 - (point.price - minPrice) / priceRange);
            
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
            const x = 60 + chartWidth * (index / (this.data.length - 1));
            const y = 50 + chartHeight * (1 - (point.price - minPrice) / priceRange);
            
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
                const x = 60 + (width - 80) * (index / (this.data.length - 1));
                this.ctx.fillText(point.label, x, height - 15);
            }
        });
        
        // Y-axis labels (price)
        this.ctx.textAlign = 'right';
        const minPrice = Math.min(...this.data.map(d => d.price));
        const maxPrice = Math.max(...this.data.map(d => d.price));
        
        for (let i = 0; i <= 5; i++) {
            const price = minPrice + (maxPrice - minPrice) * (1 - i / 5);
            const y = (height - 100) * (i / 5) + 55;
            this.ctx.fillText('$' + price.toFixed(2), 55, y);
        }
    }
    
    drawCurrentPrice(width, height) {
        if (this.data.length === 0) return;
        
        const currentPrice = this.data[this.data.length - 1].price;
        const minPrice = Math.min(...this.data.map(d => d.price));
        const maxPrice = Math.max(...this.data.map(d => d.price));
        const priceRange = maxPrice - minPrice || 1;
        
        const x = 60 + (width - 80) * ((this.data.length - 1) / (this.data.length - 1));
        const y = 50 + (height - 100) * (1 - (currentPrice - minPrice) / priceRange);
        
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
    
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        window.removeEventListener('resize', this.resizeCanvas);
    }
}

// Initialize charts
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        // Market page chart
        const marketCanvas = document.getElementById('priceHistoryChart');
        if (marketCanvas && !window.marketChart) {
            try {
                window.marketChart = new UltraLightweightChart('priceHistoryChart', {
                    lineColor: '#D4AF37',
                    pointColor: '#FFD700',
                    backgroundColor: '#ffffff',
                    gridColor: '#e0e0e0'
                });
            } catch (error) {
                console.error('Failed to initialize market chart:', error);
            }
        }
        
        // Home page chart
        const homeCanvas = document.getElementById('homePriceChart');
        if (homeCanvas && !window.homeChart) {
            try {
                window.homeChart = new UltraLightweightChart('homePriceChart', {
                    lineColor: '#D4AF37',
                    pointColor: '#FFD700',
                    backgroundColor: '#f8f9fa',
                    gridColor: '#dee2e6',
                    textColor: '#495057',
                    basePrice: 1950
                });
            } catch (error) {
                console.error('Failed to initialize home chart:', error);
            }
        }
    }, 500);
});