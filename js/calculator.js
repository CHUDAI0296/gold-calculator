/**
 * Gold Calculator - Calculator Functionality
 * Handles the gold value calculations
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the calculator if we're on the calculator page
    if (document.getElementById('gold-calculator-form')) {
        initializeCalculator();
    }
});

/**
 * Initialize the calculator functionality
 */
function initializeCalculator() {
    // Get DOM elements
    const calculatorForm = document.getElementById('gold-calculator-form');
    const customPriceInput = document.getElementById('custom-gold-price');
    const applyCustomPriceBtn = document.getElementById('apply-custom-price');
    const recalculateBtn = document.getElementById('recalculate-btn');
    const printResultsBtn = document.getElementById('print-results-btn');
    const resultsSection = document.getElementById('results-section');
    const includeRefining = document.getElementById('include-refining');
    const refiningOptions = document.getElementById('refining-options');
    
    // Initialize gold price
    updateGoldPriceDisplay();
    
    // Event listeners
    calculatorForm.addEventListener('submit', handleCalculation);
    applyCustomPriceBtn.addEventListener('click', applyCustomPrice);
    
    // Toggle refining options visibility
    if (includeRefining) {
        includeRefining.addEventListener('change', function() {
            refiningOptions.style.display = this.checked ? 'flex' : 'none';
        });
    }
    
    if (recalculateBtn) {
        recalculateBtn.addEventListener('click', function() {
            resultsSection.style.display = 'none';
            
            // Reset additional info display
            document.querySelector('.item-description-row').style.display = 'none';
            document.querySelector('.item-reference-row').style.display = 'none';
            document.querySelector('.item-notes-section').style.display = 'none';
            
            window.scrollTo({
                top: document.querySelector('.calculator-form').offsetTop - 100,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Update the gold price display on the calculator page
 */
async function updateGoldPriceDisplay() {
    const goldPrice = await getCurrentGoldPrice();
    
    // Update display
    const goldPriceElements = document.querySelectorAll('#current-gold-price');
    goldPriceElements.forEach(element => {
        element.textContent = formatGoldPrice(goldPrice);
    });
    
    // Update timestamp
    const lastUpdatedElements = document.querySelectorAll('#last-updated');
    lastUpdatedElements.forEach(element => {
        element.textContent = localStorage.getItem('lastUpdated') || new Date().toLocaleString();
    });
}

/**
 * Apply a custom gold price
 */
function applyCustomPrice() {
    const customPriceInput = document.getElementById('custom-gold-price');
    const customPrice = parseFloat(customPriceInput.value);
    
    if (isNaN(customPrice) || customPrice <= 0) {
        alert('Please enter a valid price');
        return;
    }
    
    // Update localStorage and display
    localStorage.setItem('currentGoldPrice', customPrice.toFixed(2));
    localStorage.setItem('lastUpdated', new Date().toLocaleString() + ' (Custom)');
    
    // Update display
    updateGoldPriceDisplay();
    
    // Clear input
    customPriceInput.value = '';
    
    // Show confirmation
    alert('Custom gold price applied successfully');
}

/**
 * Handle the calculation form submission
 * @param {Event} event - The form submit event
 */
async function handleCalculation(event) {
    event.preventDefault();
    
    // Get form values
    const weight = parseFloat(document.getElementById('gold-weight').value);
    const karat = parseInt(document.getElementById('gold-karat').value);
    const unit = document.getElementById('weight-unit').value;
    
    // Validate inputs
    if (isNaN(weight) || weight <= 0 || isNaN(karat) || karat <= 0) {
        alert('Please enter valid weight and karat values');
        return;
    }
    
    // Get current gold price
    const goldPrice = await getCurrentGoldPrice();
    
    // Check if refining should be included
    const includeRefining = document.getElementById('include-refining') && 
                           document.getElementById('include-refining').checked;
    
    // Get refining parameters if needed
    let refiningParams = null;
    if (includeRefining) {
        refiningParams = {
            refiningFee: parseFloat(document.getElementById('refining-fee').value) / 100,
            treatmentCharge: parseFloat(document.getElementById('treatment-charge').value),
            accountability: parseFloat(document.getElementById('accountability').value) / 100
        };
    }
    
    // Calculate gold value
    const result = calculateGoldValue(weight, karat, unit, goldPrice, refiningParams);
    
    // Display results
    displayResults(result, includeRefining);

    try {
        if (typeof gtag === 'function') {
            gtag('event', 'calculator_submit', {
                event_category: 'calculator',
                value_usd: includeRefining ? result.finalValue : result.rawValue,
                weight: weight,
                karat: karat,
                unit: unit,
                include_refining: includeRefining ? 'yes' : 'no',
                gold_price: goldPrice
            });
        }
    } catch (e) {}
}

/**
 * Calculate the value of gold based on inputs
 * @param {number} weight - The weight of the gold
 * @param {number} karat - The karat rating (purity)
 * @param {string} unit - The unit of weight ('g', 'oz', 'dwt')
 * @param {number} goldPrice - The current gold price per troy ounce
 * @param {Object} refiningParams - Optional refining parameters
 * @returns {Object} - Calculation results
 */
function calculateGoldValue(weight, karat, unit, goldPrice, refiningParams = null) {
    // Convert weight to troy ounces
    const weightInOz = convertWeight(weight, unit, 'oz');
    
    // Calculate purity factor
    const purity = calculatePurity(karat);
    
    // Calculate pure gold content in troy ounces
    const pureGoldContent = weightInOz * purity;
    
    // Calculate raw value
    const rawValue = pureGoldContent * goldPrice;
    
    // Initialize result object
    const result = {
        inputWeight: weight,
        inputUnit: unit,
        inputKarat: karat,
        goldPrice: goldPrice,
        weightInOz: weightInOz,
        purity: purity,
        pureGoldContent: pureGoldContent,
        rawValue: rawValue,
        finalValue: rawValue // Default if no refining
    };
    
    // If refining params are provided, calculate final value after refining
    if (refiningParams) {
        // Calculate payable gold content based on accountability
        const payableGoldContent = pureGoldContent * refiningParams.accountability;
        
        // Calculate refining fee
        const refiningFeeAmount = payableGoldContent * goldPrice * refiningParams.refiningFee;
        
        // Calculate final value
        const finalValue = (payableGoldContent * goldPrice) - refiningFeeAmount - refiningParams.treatmentCharge;
        
        // Add refining details to result
        result.refiningParams = refiningParams;
        result.payableGoldContent = payableGoldContent;
        result.refiningFeeAmount = refiningFeeAmount;
        result.treatmentCharge = refiningParams.treatmentCharge;
        result.finalValue = Math.max(0, finalValue); // Ensure value is not negative
    }
    
    return result;
}

/**
 * Display calculation results
 * @param {Object} result - The calculation results
 * @param {boolean} includeRefining - Whether refining details should be displayed
 */
function displayResults(result, includeRefining = false) {
    const resultsSection = document.getElementById('results-section');
    const refiningResults = document.getElementById('refining-results');
    
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
    document.getElementById('result-weight').textContent = `${result.inputWeight} ${unitLabel}`;
    document.getElementById('result-karat').textContent = `${result.inputKarat}K`;
    document.getElementById('result-gold-price').textContent = formatGoldPrice(result.goldPrice) + ' per troy ounce';
    document.getElementById('pure-gold-content').textContent = `${result.pureGoldContent.toFixed(4)} troy ounces`;
    document.getElementById('gold-purity').textContent = `${(result.purity * 100).toFixed(1)}% (${result.inputKarat}K)`;
    
    // Update value display
    if (includeRefining) {
        document.getElementById('gold-value').textContent = formatGoldPrice(result.finalValue);
        document.getElementById('value-description').textContent = 'Final Estimated Value After Refining';
    } else {
        document.getElementById('gold-value').textContent = formatGoldPrice(result.rawValue);
        document.getElementById('value-description').textContent = 'Raw Gold Value';
    }
    
    // Handle refining results if included
    if (includeRefining && refiningResults) {
        // Show refining section
        refiningResults.style.display = 'block';
        
        // Update refining details
        document.getElementById('result-refining-fee').textContent = `${(result.refiningParams.refiningFee * 100).toFixed(1)}% (${formatGoldPrice(result.refiningFeeAmount)})`;
        document.getElementById('result-treatment-charge').textContent = formatGoldPrice(result.refiningParams.treatmentCharge);
        document.getElementById('result-accountability').textContent = `${(result.refiningParams.accountability * 100).toFixed(1)}%`;
        
        document.getElementById('raw-gold-value').textContent = formatGoldPrice(result.rawValue);
        document.getElementById('payable-gold-content').textContent = `${result.payableGoldContent.toFixed(4)} troy ounces`;
        document.getElementById('final-value').textContent = formatGoldPrice(result.finalValue);
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