/**
 * Gold Calculator - Other Metals Calculator Functionality
 * Handles silver and platinum value calculations
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the metals calculator if we're on the metals page
    if (document.getElementById('silver-calculator-form') || document.getElementById('platinum-calculator-form')) {
        initializeMetalsCalculator();
    }
});

/**
 * Initialize the metals calculator functionality
 */
function initializeMetalsCalculator() {
    // Get DOM elements
    const silverCalculatorForm = document.getElementById('silver-calculator-form');
    const platinumCalculatorForm = document.getElementById('platinum-calculator-form');
    const customMetalPriceInput = document.getElementById('custom-metal-price');
    const applyCustomMetalPriceBtn = document.getElementById('apply-custom-metal-price');
    const recalculateBtn = document.getElementById('recalculate-metal-btn');
    const printResultsBtn = document.getElementById('print-metal-results-btn');
    const resultsSection = document.getElementById('metals-results-section');
    
    // Silver specific elements
    const silverPuritySelect = document.getElementById('silver-purity');
    const silverCustomPurityContainer = document.getElementById('silver-custom-purity-container');
    const silverIncludeRefining = document.getElementById('silver-include-refining');
    const silverRefiningOptions = document.getElementById('silver-refining-options');
    
    // Platinum specific elements
    const platinumPuritySelect = document.getElementById('platinum-purity');
    const platinumCustomPurityContainer = document.getElementById('platinum-custom-purity-container');
    const platinumIncludeRefining = document.getElementById('platinum-include-refining');
    const platinumRefiningOptions = document.getElementById('platinum-refining-options');
    
    // Initialize metal prices
    updateAllMetalPrices();
    
    // Event listeners
    if (silverCalculatorForm) {
        silverCalculatorForm.addEventListener('submit', function(event) {
            event.preventDefault();
            handleSilverCalculation();
        });
    }
    
    if (platinumCalculatorForm) {
        platinumCalculatorForm.addEventListener('submit', function(event) {
            event.preventDefault();
            handlePlatinumCalculation();
        });
    }
    
    if (applyCustomMetalPriceBtn) {
        applyCustomMetalPriceBtn.addEventListener('click', applyCustomMetalPrice);
    }
    
    // Toggle custom purity inputs
    if (silverPuritySelect) {
        silverPuritySelect.addEventListener('change', function() {
            silverCustomPurityContainer.style.display = this.value === 'custom' ? 'block' : 'none';
        });
    }
    
    if (platinumPuritySelect) {
        platinumPuritySelect.addEventListener('change', function() {
            platinumCustomPurityContainer.style.display = this.value === 'custom' ? 'block' : 'none';
        });
    }
    
    // Toggle refining options visibility
    if (silverIncludeRefining) {
        silverIncludeRefining.addEventListener('change', function() {
            silverRefiningOptions.style.display = this.checked ? 'flex' : 'none';
        });
    }
    
    if (platinumIncludeRefining) {
        platinumIncludeRefining.addEventListener('change', function() {
            platinumRefiningOptions.style.display = this.checked ? 'flex' : 'none';
        });
    }
    
    if (recalculateBtn) {
        recalculateBtn.addEventListener('click', function() {
            resultsSection.style.display = 'none';
            window.scrollTo({
                top: document.querySelector('.calculator-form').offsetTop - 100,
                behavior: 'smooth'
            });
        });
    }
    
    if (printResultsBtn) {
        printResultsBtn.addEventListener('click', printResults);
    }
}

/**
 * Update all metal prices display
 */
async function updateAllMetalPrices() {
    // Get prices from localStorage or set defaults
    const goldPrice = localStorage.getItem('currentGoldPrice') || '2000.00';
    const silverPrice = localStorage.getItem('currentSilverPrice') || '25.00';
    const platinumPrice = localStorage.getItem('currentPlatinumPrice') || '950.00';
    
    // Update gold price display
    const goldPriceElements = document.querySelectorAll('#current-gold-price');
    goldPriceElements.forEach(element => {
        element.textContent = formatGoldPrice(goldPrice);
    });
    
    // Update silver price display
    const silverPriceElements = document.querySelectorAll('#current-silver-price');
    silverPriceElements.forEach(element => {
        element.textContent = formatGoldPrice(silverPrice);
    });
    
    // Update platinum price display
    const platinumPriceElements = document.querySelectorAll('#current-platinum-price');
    platinumPriceElements.forEach(element => {
        element.textContent = formatGoldPrice(platinumPrice);
    });
    
    // Update timestamp
    const lastUpdatedElements = document.querySelectorAll('#last-updated');
    lastUpdatedElements.forEach(element => {
        element.textContent = localStorage.getItem('lastUpdated') || new Date().toLocaleString();
    });
    
    // Store prices in localStorage if not already set
    if (!localStorage.getItem('currentSilverPrice')) {
        localStorage.setItem('currentSilverPrice', silverPrice);
    }
    
    if (!localStorage.getItem('currentPlatinumPrice')) {
        localStorage.setItem('currentPlatinumPrice', platinumPrice);
    }
}

/**
 * Apply a custom metal price
 */
function applyCustomMetalPrice() {
    const metalSelect = document.getElementById('metal-price-select');
    const customPriceInput = document.getElementById('custom-metal-price');
    const metal = metalSelect.value;
    const customPrice = parseFloat(customPriceInput.value);
    
    if (isNaN(customPrice) || customPrice <= 0) {
        alert('Please enter a valid price');
        return;
    }
    
    // Update localStorage and display based on selected metal
    switch (metal) {
        case 'silver':
            localStorage.setItem('currentSilverPrice', customPrice.toFixed(2));
            break;
        case 'gold':
            localStorage.setItem('currentGoldPrice', customPrice.toFixed(2));
            break;
        case 'platinum':
            localStorage.setItem('currentPlatinumPrice', customPrice.toFixed(2));
            break;
    }
    
    localStorage.setItem('lastUpdated', new Date().toLocaleString() + ' (Custom)');
    
    // Update display
    updateAllMetalPrices();
    
    // Clear input
    customPriceInput.value = '';
    
    // Show confirmation
    alert(`Custom ${metal} price applied successfully`);
}

/**
 * Handle silver calculation
 */
async function handleSilverCalculation() {
    // Get form values
    const weight = parseFloat(document.getElementById('silver-weight').value);
    const puritySelect = document.getElementById('silver-purity');
    let purity;
    
    if (puritySelect.value === 'custom') {
        purity = parseFloat(document.getElementById('silver-custom-purity').value) / 100;
    } else {
        purity = parseFloat(puritySelect.value);
    }
    
    const unit = document.getElementById('silver-weight-unit').value;
    
    // Validate inputs
    if (isNaN(weight) || weight <= 0 || isNaN(purity) || purity <= 0) {
        alert('Please enter valid weight and purity values');
        return;
    }
    
    // Get current silver price
    const silverPrice = parseFloat(localStorage.getItem('currentSilverPrice') || '25.00');
    
    // Check if refining should be included
    const includeRefining = document.getElementById('silver-include-refining') && 
                           document.getElementById('silver-include-refining').checked;
    
    // Get refining parameters if needed
    let refiningParams = null;
    if (includeRefining) {
        refiningParams = {
            refiningFee: parseFloat(document.getElementById('silver-refining-fee').value) / 100,
            treatmentCharge: parseFloat(document.getElementById('silver-treatment-charge').value),
            accountability: parseFloat(document.getElementById('silver-accountability').value) / 100
        };
    }
    
    // Calculate silver value
    const result = calculateMetalValue(weight, purity, unit, silverPrice, refiningParams);
    
    // Display results
    displayMetalResults(result, includeRefining, 'Silver');
}

/**
 * Handle platinum calculation
 */
async function handlePlatinumCalculation() {
    // Get form values
    const weight = parseFloat(document.getElementById('platinum-weight').value);
    const puritySelect = document.getElementById('platinum-purity');
    let purity;
    
    if (puritySelect.value === 'custom') {
        purity = parseFloat(document.getElementById('platinum-custom-purity').value) / 100;
    } else {
        purity = parseFloat(puritySelect.value);
    }
    
    const unit = document.getElementById('platinum-weight-unit').value;
    
    // Validate inputs
    if (isNaN(weight) || weight <= 0 || isNaN(purity) || purity <= 0) {
        alert('Please enter valid weight and purity values');
        return;
    }
    
    // Get current platinum price
    const platinumPrice = parseFloat(localStorage.getItem('currentPlatinumPrice') || '950.00');
    
    // Check if refining should be included
    const includeRefining = document.getElementById('platinum-include-refining') && 
                           document.getElementById('platinum-include-refining').checked;
    
    // Get refining parameters if needed
    let refiningParams = null;
    if (includeRefining) {
        refiningParams = {
            refiningFee: parseFloat(document.getElementById('platinum-refining-fee').value) / 100,
            treatmentCharge: parseFloat(document.getElementById('platinum-treatment-charge').value),
            accountability: parseFloat(document.getElementById('platinum-accountability').value) / 100
        };
    }
    
    // Calculate platinum value
    const result = calculateMetalValue(weight, purity, unit, platinumPrice, refiningParams);
    
    // Display results
    displayMetalResults(result, includeRefining, 'Platinum');
}

/**
 * Calculate the value of a metal based on inputs
 * @param {number} weight - The weight of the metal
 * @param {number} purity - The purity as a decimal (0-1)
 * @param {string} unit - The unit of weight ('g', 'oz', 'dwt')
 * @param {number} metalPrice - The current metal price per troy ounce
 * @param {Object} refiningParams - Optional refining parameters
 * @returns {Object} - Calculation results
 */
function calculateMetalValue(weight, purity, unit, metalPrice, refiningParams = null) {
    // Convert weight to troy ounces
    const weightInOz = convertWeight(weight, unit, 'oz');
    
    // Calculate pure metal content in troy ounces
    const pureMetalContent = weightInOz * purity;
    
    // Calculate raw value
    const rawValue = pureMetalContent * metalPrice;
    
    // Initialize result object
    const result = {
        inputWeight: weight,
        inputUnit: unit,
        inputPurity: purity,
        metalPrice: metalPrice,
        weightInOz: weightInOz,
        pureMetalContent: pureMetalContent,
        rawValue: rawValue,
        finalValue: rawValue // Default if no refining
    };
    
    // If refining params are provided, calculate final value after refining
    if (refiningParams) {
        // Calculate payable metal content based on accountability
        const payableMetalContent = pureMetalContent * refiningParams.accountability;
        
        // Calculate refining fee
        const refiningFeeAmount = payableMetalContent * metalPrice * refiningParams.refiningFee;
        
        // Calculate final value
        const finalValue = (payableMetalContent * metalPrice) - refiningFeeAmount - refiningParams.treatmentCharge;
        
        // Add refining details to result
        result.refiningParams = refiningParams;
        result.payableMetalContent = payableMetalContent;
        result.refiningFeeAmount = refiningFeeAmount;
        result.treatmentCharge = refiningParams.treatmentCharge;
        result.finalValue = Math.max(0, finalValue); // Ensure value is not negative
    }
    
    return result;
}

/**
 * Display metal calculation results
 * @param {Object} result - The calculation results
 * @param {boolean} includeRefining - Whether refining details should be displayed
 * @param {string} metalType - The type of metal (Silver, Platinum)
 */
function displayMetalResults(result, includeRefining = false, metalType = 'Metal') {
    const resultsSection = document.getElementById('metals-results-section');
    const refiningResults = document.getElementById('metal-refining-results');
    
    // Format unit label
    let unitLabel;
    switch (result.inputUnit) {
        case 'g':
            unitLabel = 'gram(s)';
            break;
        case 'oz':
            unitLabel = 'troy ounce(s)';
            break;
        case 'dwt':
            unitLabel = 'pennyweight(s)';
            break;
        default:
            unitLabel = 'unit(s)';
    }
    
    // Update basic result fields
    document.getElementById('result-metal-type').textContent = metalType;
    document.getElementById('result-metal-weight').textContent = `${result.inputWeight} ${unitLabel}`;
    document.getElementById('result-metal-purity').textContent = `${(result.inputPurity * 100).toFixed(1)}%`;
    document.getElementById('result-metal-price').textContent = formatGoldPrice(result.metalPrice) + ' per troy ounce';
    document.getElementById('pure-metal-content').textContent = `${result.pureMetalContent.toFixed(4)} troy ounces`;
    
    // Update value display
    if (includeRefining) {
        document.getElementById('metal-value').textContent = formatGoldPrice(result.finalValue);
        document.getElementById('metal-value-description').textContent = `Final Estimated ${metalType} Value After Refining`;
    } else {
        document.getElementById('metal-value').textContent = formatGoldPrice(result.rawValue);
        document.getElementById('metal-value-description').textContent = `Raw ${metalType} Value`;
    }
    
    // Handle refining results if included
    if (includeRefining && refiningResults) {
        // Show refining section
        refiningResults.style.display = 'block';
        
        // Update refining details
        document.getElementById('result-metal-refining-fee').textContent = `${(result.refiningParams.refiningFee * 100).toFixed(1)}% (${formatGoldPrice(result.refiningFeeAmount)})`;
        document.getElementById('result-metal-treatment-charge').textContent = formatGoldPrice(result.refiningParams.treatmentCharge);
        document.getElementById('result-metal-accountability').textContent = `${(result.refiningParams.accountability * 100).toFixed(1)}%`;
        
        document.getElementById('raw-metal-value').textContent = formatGoldPrice(result.rawValue);
        document.getElementById('payable-metal-content').textContent = `${result.payableMetalContent.toFixed(4)} troy ounces`;
        document.getElementById('final-metal-value').textContent = formatGoldPrice(result.finalValue);
    } else if (refiningResults) {
        // Hide refining section if not included
        refiningResults.style.display = 'none';
    }
    
    // Show results section
    resultsSection.style.display = 'block';
    
    // Scroll to results
    window.scrollTo({
        top: resultsSection.offsetTop - 50,
        behavior: 'smooth'
    });
}

/**
 * Print the calculation results
 */
function printResults() {
    window.print();
} 