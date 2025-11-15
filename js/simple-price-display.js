/**
 * Gold Calculator - Simple Price Display
 * Ultra-lightweight price display without external dependencies
 */

class SimplePriceDisplay {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.warn(`Container with id "${containerId}" not found`);
            return;
        }
        
        this.options = {
            updateInterval: 60000, // 1 minute
            fallbackPrice: 2000,
            currency: 'USD',
            ...options
        };
        
        this.currentPrice = this.options.fallbackPrice;
        this.updateTimer = null;
        this.isActive = false;
        
        this.init();
    }
    
    init() {
        this.createDisplay();
        this.startUpdating();
        this.isActive = true;
    }
    
    createDisplay() {
        this.container.innerHTML = `
            <div class="simple-price-display" style="
                text-align: center;
                padding: 1rem;
                background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                border-radius: 8px;
                border: 1px solid #dee2e6;
            ">
                <div style="font-size: 0.9rem; color: #6c757d; margin-bottom: 0.5rem;">
                    Current Gold Price
                </div>
                <div class="price-value" style="
                    font-size: 2rem;
                    font-weight: bold;
                    color: #D4AF37;
                    margin-bottom: 0.5rem;
                ">
                    $${this.currentPrice.toFixed(2)}
                </div>
                <div class="price-status" style="
                    font-size: 0.8rem;
                    color: #28a745;
                ">
                    <i class="fas fa-circle" style="font-size: 0.5rem; margin-right: 0.25rem;"></i>
                    Live Data
                </div>
                <div class="last-update" style="
                    font-size: 0.7rem;
                    color: #6c757d;
                    margin-top: 0.5rem;
                ">
                    Last updated: <span class="update-time">Just now</span>
                </div>
            </div>
        `;
        
        this.priceElement = this.container.querySelector('.price-value');
        this.statusElement = this.container.querySelector('.price-status');
        this.updateTimeElement = this.container.querySelector('.update-time');
    }
    
    updatePrice(newPrice) {
        if (newPrice && newPrice > 0) {
            this.currentPrice = newPrice;
            if (this.priceElement) {
                if (typeof formatGoldPrice === 'function') {
                    this.priceElement.textContent = formatGoldPrice(newPrice);
                } else {
                    this.priceElement.textContent = `$${newPrice.toFixed(2)}`;
                }
            }
            this.updateTimestamp();
        }
    }
    
    updateTimestamp() {
        if (this.updateTimeElement) {
            this.updateTimeElement.textContent = new Date().toLocaleTimeString();
        }
    }
    
    simulatePriceUpdate() {
        // Simulate small price fluctuations
        const change = (Math.random() - 0.5) * 10; // ±$5 change
        const newPrice = Math.max(1000, this.currentPrice + change);
        this.updatePrice(newPrice);
    }
    
    async fetchRealPrice() {
        // Try backend first, then free sources as fallback
        const attempts = [
            async () => {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000);
                const r = await fetch('/api/spot/gold', { headers: { 'Accept':'application/json' }, signal: controller.signal });
                clearTimeout(timeoutId);
                if (!r.ok) throw new Error('backend_fail');
                const d = await r.json();
                return d && d.price ? d.price : null;
            },
            async () => {
                const r = await fetch('https://api.metals.live/v1/spot/gold', { headers: { 'Accept':'application/json' } });
                if (!r.ok) throw new Error('metals_live_fail');
                const d = await r.json();
                const last = Array.isArray(d) ? d[d.length-1] : null;
                if (typeof last === 'number') return last;
                if (last && typeof last === 'object') return last.price || null;
                return null;
            },
            async () => {
                const r = await fetch('https://api.exchangerate.host/latest?base=XAU&symbols=USD', { headers: { 'Accept':'application/json' } });
                if (!r.ok) throw new Error('exchangerate_host_fail');
                const d = await r.json();
                return d && d.rates && d.rates.USD ? d.rates.USD : null;
            }
        ];
        for (const fn of attempts){
            try { const price = await fn(); if (price && price > 0) return price; } catch(e){ continue; }
        }
        return null;
    }
    
    async updateFromAPI() {
        try {
            const realPrice = await this.fetchRealPrice();
            if (realPrice) {
                this.updatePrice(realPrice);
                this.setStatus('connected');
            } else {
                this.setStatus('unavailable');
            }
        } catch (error) {
            console.error('Price update failed:', error);
            this.setStatus('error');
        }
    }
    
    setStatus(status) {
        if (!this.statusElement) return;
        
        const statusConfig = {
            connected: {
                text: '<i class="fas fa-circle" style="font-size: 0.5rem; margin-right: 0.25rem;"></i> Live Data',
                color: '#28a745'
            },
            error: {
                text: '<i class="fas fa-circle" style="font-size: 0.5rem; margin-right: 0.25rem;"></i> Connection Issue',
                color: '#dc3545'
            },
            unavailable: {
                text: '<i class="fas fa-circle" style="font-size: 0.5rem; margin-right: 0.25rem;"></i> Data Unavailable',
                color: '#6c757d'
            }
        };
        
        const config = statusConfig[status] || statusConfig.unavailable;
        this.statusElement.innerHTML = config.text;
        this.statusElement.style.color = config.color;
    }
    
    startUpdating() {
        // Initial update
        this.updateFromAPI();
        
        // Schedule regular updates
        this.updateTimer = setInterval(() => {
            this.updateFromAPI();
        }, this.options.updateInterval);
    }
    
    stopUpdating() {
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
            this.updateTimer = null;
        }
        this.isActive = false;
    }
    
    destroy() {
        this.stopUpdating();
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

// Initialize simple price displays
document.addEventListener('DOMContentLoaded', function() {
    // Initialize market page price display
    const marketContainer = document.getElementById('simplePriceDisplay');
    if (marketContainer) {
        window.marketPriceDisplay = new SimplePriceDisplay('simplePriceDisplay', {
            updateInterval: 60000 // 1 minute
        });
    }
    
    // Initialize home page price display as fallback
    const homeChartContainer = document.getElementById('homePriceChart');
    if (homeChartContainer && !window.homeChart) {
        // Only create if lightweight chart didn't work
        setTimeout(() => {
            if (!window.homeChart) {
                window.homePriceDisplay = new SimplePriceDisplay('homePriceChart', {
                    updateInterval: 30000 // 30 seconds
                });
            }
        }, 2000);
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SimplePriceDisplay;
}