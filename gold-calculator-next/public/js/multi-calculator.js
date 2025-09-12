/**
 * Gold Calculator - Multiple Items Calculator
 * Handles batch calculation of multiple gold items
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the calculator
    initializeMultiCalculator();
});

/**
 * Initialize the multiple items calculator
 */
function initializeMultiCalculator() {
    // Get DOM elements
    const itemForm = document.getElementById('item-form');
    const includeRefining = document.getElementById('include-refining');
    const refiningOptions = document.getElementById('refining-options');
    const calculateAllBtn = document.getElementById('calculate-all-btn');
    const clearAllBtn = document.getElementById('clear-all-btn');
    const recalculateAllBtn = document.getElementById('recalculate-all-btn');
    const printSummaryBtn = document.getElementById('print-summary-btn');
    const savePdfBtn = document.getElementById('save-pdf-btn');
    
    // Import/Export buttons
    const importCsvBtn = document.getElementById('import-csv-btn');
    const exportCsvBtn = document.getElementById('export-csv-btn');
    const saveItemsBtn = document.getElementById('save-items-btn');
    const loadItemsBtn = document.getElementById('load-items-btn');
    
    // Modal elements
    const importCsvModal = new bootstrap.Modal(document.getElementById('import-csv-modal'), {});
    const saveItemsModal = new bootstrap.Modal(document.getElementById('save-items-modal'), {});
    const loadItemsModal = new bootstrap.Modal(document.getElementById('load-items-modal'), {});
    
    // Initialize gold price
    updateGoldPriceDisplay();
    
    // Initialize items array
    window.goldItems = [];
    
    // Event listeners
    if (itemForm) {
        itemForm.addEventListener('submit', function(event) {
            event.preventDefault();
            addNewItem();
        });
    }
    
    // Toggle refining options visibility
    if (includeRefining) {
        includeRefining.addEventListener('change', function() {
            refiningOptions.style.display = this.checked ? 'flex' : 'none';
        });
    }
    
    // Calculate all items
    if (calculateAllBtn) {
        calculateAllBtn.addEventListener('click', calculateAllItems);
    }
    
    // Clear all items
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', clearAllItems);
    }
    
    // Recalculate all items
    if (recalculateAllBtn) {
        recalculateAllBtn.addEventListener('click', function() {
            document.getElementById('summary-section').style.display = 'none';
            window.scrollTo({
                top: document.querySelector('.calculator-form').offsetTop - 100,
                behavior: 'smooth'
            });
        });
    }
    
    // Print summary
    if (printSummaryBtn) {
        printSummaryBtn.addEventListener('click', function() {
            preparePrintView();
            window.print();
        });
    }
    
    // Import CSV
    if (importCsvBtn) {
        importCsvBtn.addEventListener('click', function() {
            importCsvModal.show();
        });
    }
    
    // Export CSV
    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', exportToCsv);
    }
    
    // Save items
    if (saveItemsBtn) {
        saveItemsBtn.addEventListener('click', function() {
            saveItemsModal.show();
        });
    }
    
    // Load items
    if (loadItemsBtn) {
        loadItemsBtn.addEventListener('click', function() {
            loadSavedItemsList();
            loadItemsModal.show();
        });
    }
    
    // Confirm import
    document.getElementById('confirm-import-btn')?.addEventListener('click', importFromCsv);
    
    // Confirm save
    document.getElementById('confirm-save-btn')?.addEventListener('click', saveItems);
    
    // Confirm load
    document.getElementById('confirm-load-btn')?.addEventListener('click', loadItems);
    
    // Delete save
    document.getElementById('delete-save-btn')?.addEventListener('click', deleteSavedItems);
}

/**
 * Update the gold price display
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
 * Add a new item to the list
 */
function addNewItem() {
    // Get form values
    const description = document.getElementById('item-description').value;
    const reference = document.getElementById('item-reference').value || '';
    const weight = parseFloat(document.getElementById('item-weight').value);
    const karat = parseInt(document.getElementById('item-karat').value);
    const unit = document.getElementById('item-weight-unit').value;
    const notes = document.getElementById('item-notes').value || '';
    
    // Validate inputs
    if (!description || isNaN(weight) || weight <= 0 || isNaN(karat) || karat <= 0) {
        alert('Please enter valid item details');
        return;
    }
    
    // Create new item object
    const newItem = {
        id: Date.now(), // Use timestamp as unique ID
        description,
        reference,
        weight,
        karat,
        unit,
        notes
    };
    
    // Add item to array
    window.goldItems.push(newItem);
    
    // Update table
    updateItemsTable();
    
    // Clear form
    document.getElementById('item-form').reset();
    
    // Focus on description field for next item
    document.getElementById('item-description').focus();
}

/**
 * Update the items table
 */
function updateItemsTable() {
    const tableBody = document.getElementById('items-table-body');
    const noItemsRow = document.querySelector('.no-items-row');
    
    // Clear table
    tableBody.innerHTML = '';
    
    // Check if there are items
    if (window.goldItems.length === 0) {
        tableBody.appendChild(noItemsRow);
        
        // Update totals
        document.getElementById('total-pure-gold').textContent = '0.0000 oz';
        document.getElementById('total-value').textContent = '$0.00';
        return;
    }
    
    // Get current gold price
    const goldPrice = parseFloat(localStorage.getItem('currentGoldPrice') || '2000.00');
    
    let totalPureGold = 0;
    let totalValue = 0;
    
    // Add items to table
    window.goldItems.forEach(item => {
        const row = document.createElement('tr');
        
        // Calculate pure gold content
        const weightInOz = convertWeight(item.weight, item.unit, 'oz');
        const purity = calculatePurity(item.karat);
        const pureGoldContent = weightInOz * purity;
        const value = pureGoldContent * goldPrice;
        
        // Update totals
        totalPureGold += pureGoldContent;
        totalValue += value;
        
        // Format unit label
        let unitLabel;
        switch (item.unit) {
            case 'g': unitLabel = 'g'; break;
            case 'oz': unitLabel = 'oz'; break;
            case 'dwt': unitLabel = 'dwt'; break;
            default: unitLabel = 'g';
        }
        
        // Create row content
        row.innerHTML = `
            <td>${item.description}</td>
            <td>${item.reference}</td>
            <td>${item.weight} ${unitLabel}</td>
            <td>${item.karat}K</td>
            <td>${pureGoldContent.toFixed(4)} oz</td>
            <td>${formatGoldPrice(value)}</td>
            <td>
                <button class="btn btn-sm btn-outline-danger delete-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        // Add delete event listener
        row.querySelector('.delete-item').addEventListener('click', function() {
            deleteItem(item.id);
        });
        
        tableBody.appendChild(row);
    });
    
    // Update totals
    document.getElementById('total-pure-gold').textContent = totalPureGold.toFixed(4) + ' oz';
    document.getElementById('total-value').textContent = formatGoldPrice(totalValue);
}

/**
 * Delete an item from the list
 * @param {number} id - The item ID to delete
 */
function deleteItem(id) {
    window.goldItems = window.goldItems.filter(item => item.id !== id);
    updateItemsTable();
}

/**
 * Calculate all items and display summary
 */
function calculateAllItems() {
    // Check if there are items
    if (!window.goldItems || window.goldItems.length === 0) {
        alert('Please add at least one item first');
        return;
    }
    
    // Get current gold price
    const goldPrice = parseFloat(localStorage.getItem('currentGoldPrice') || '2000.00');
    
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
    
    // Calculate totals
    let totalWeight = 0;
    let totalWeightGrams = 0;
    let totalPureGold = 0;
    let totalKaratPoints = 0;
    
    window.goldItems.forEach(item => {
        const weightInOz = convertWeight(item.weight, item.unit, 'oz');
        const weightInGrams = convertWeight(item.weight, item.unit, 'g');
        const purity = calculatePurity(item.karat);
        const pureGoldContent = weightInOz * purity;
        
        totalWeight += item.weight;
        totalWeightGrams += weightInGrams;
        totalPureGold += pureGoldContent;
        totalKaratPoints += item.karat;
    });
    
    // Calculate average karat
    const averageKarat = Math.round(totalKaratPoints / window.goldItems.length);
    
    // Calculate raw value
    const rawValue = totalPureGold * goldPrice;
    
    // Update summary
    document.getElementById('summary-total-items').textContent = window.goldItems.length;
    document.getElementById('summary-total-weight').textContent = totalWeightGrams.toFixed(3) + ' g';
    document.getElementById('summary-average-karat').textContent = averageKarat + 'K';
    document.getElementById('summary-pure-gold').textContent = totalPureGold.toFixed(4) + ' troy oz';
    document.getElementById('summary-gold-price').textContent = formatGoldPrice(goldPrice) + ' per troy oz';
    
    // Handle refining if included
    const refiningSummary = document.getElementById('refining-summary');
    
    if (includeRefining && refiningParams) {
        // Calculate payable gold content
        const payableGoldContent = totalPureGold * refiningParams.accountability;
        
        // Calculate refining fee
        const refiningFeeAmount = payableGoldContent * goldPrice * refiningParams.refiningFee;
        
        // Calculate final value
        const finalValue = (payableGoldContent * goldPrice) - refiningFeeAmount - refiningParams.treatmentCharge;
        
        // Update refining summary
        document.getElementById('summary-refining-fee').textContent = (refiningParams.refiningFee * 100).toFixed(1) + '%';
        document.getElementById('summary-treatment-charge').textContent = formatGoldPrice(refiningParams.treatmentCharge);
        document.getElementById('summary-accountability').textContent = (refiningParams.accountability * 100).toFixed(1) + '%';
        document.getElementById('summary-raw-value').textContent = formatGoldPrice(rawValue);
        document.getElementById('summary-payable-gold').textContent = payableGoldContent.toFixed(4) + ' troy oz';
        document.getElementById('summary-final-value').textContent = formatGoldPrice(Math.max(0, finalValue));
        document.getElementById('summary-total-value').textContent = formatGoldPrice(Math.max(0, finalValue));
        
        // Show refining summary
        refiningSummary.style.display = 'block';
    } else {
        // Hide refining summary
        if (refiningSummary) {
            refiningSummary.style.display = 'none';
        }
        
        // Update total value with raw value
        document.getElementById('summary-total-value').textContent = formatGoldPrice(rawValue);
    }
    
    // Show summary section
    document.getElementById('summary-section').style.display = 'block';
    
    // Scroll to summary
    window.scrollTo({
        top: document.getElementById('summary-section').offsetTop - 50,
        behavior: 'smooth'
    });
}

/**
 * Clear all items from the list
 */
function clearAllItems() {
    if (window.goldItems.length === 0) return;
    
    if (confirm('Are you sure you want to clear all items?')) {
        window.goldItems = [];
        updateItemsTable();
        document.getElementById('summary-section').style.display = 'none';
    }
}

/**
 * Export items to CSV
 */
function exportToCsv() {
    if (window.goldItems.length === 0) {
        alert('No items to export');
        return;
    }
    
    // Create CSV content
    let csvContent = 'Description,Reference,Weight,Karat,Unit,Notes\n';
    
    window.goldItems.forEach(item => {
        csvContent += `"${item.description}","${item.reference}",${item.weight},${item.karat},${item.unit},"${item.notes}"\n`;
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'gold_items.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Import items from CSV
 */
function importFromCsv() {
    const fileInput = document.getElementById('csv-file');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select a CSV file');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(event) {
        const csvData = event.target.result;
        const lines = csvData.split('\n');
        
        // Skip header line
        if (lines.length < 2) {
            alert('Invalid CSV format');
            return;
        }
        
        // Parse CSV data
        const newItems = [];
        
        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            // Parse CSV line (handle quoted values)
            const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
            
            if (values && values.length >= 5) {
                const description = values[0].replace(/"/g, '');
                const reference = values[1].replace(/"/g, '');
                const weight = parseFloat(values[2]);
                const karat = parseInt(values[3]);
                const unit = values[4].replace(/"/g, '');
                const notes = values.length > 5 ? values[5].replace(/"/g, '') : '';
                
                if (!isNaN(weight) && !isNaN(karat)) {
                    newItems.push({
                        id: Date.now() + i, // Use timestamp + index as unique ID
                        description,
                        reference,
                        weight,
                        karat,
                        unit,
                        notes
                    });
                }
            }
        }
        
        if (newItems.length === 0) {
            alert('No valid items found in CSV');
            return;
        }
        
        // Add new items to existing items
        window.goldItems = window.goldItems.concat(newItems);
        
        // Update table
        updateItemsTable();
        
        // Close modal
        const importCsvModal = bootstrap.Modal.getInstance(document.getElementById('import-csv-modal'));
        importCsvModal.hide();
        
        // Reset file input
        fileInput.value = '';
        
        // Show success message
        alert(`Successfully imported ${newItems.length} items`);
    };
    
    reader.readAsText(file);
}

/**
 * Save items to localStorage
 */
function saveItems() {
    if (window.goldItems.length === 0) {
        alert('No items to save');
        return;
    }
    
    const saveName = document.getElementById('save-name').value.trim();
    
    if (!saveName) {
        alert('Please enter a name for this save');
        return;
    }
    
    // Get existing saves
    const savedItems = JSON.parse(localStorage.getItem('goldCalculatorSavedItems') || '{}');
    
    // Add new save
    savedItems[saveName] = {
        items: window.goldItems,
        date: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('goldCalculatorSavedItems', JSON.stringify(savedItems));
    
    // Close modal
    const saveItemsModal = bootstrap.Modal.getInstance(document.getElementById('save-items-modal'));
    saveItemsModal.hide();
    
    // Reset input
    document.getElementById('save-name').value = '';
    
    // Show success message
    alert(`Successfully saved ${window.goldItems.length} items as "${saveName}"`);
}

/**
 * Load saved items list
 */
function loadSavedItemsList() {
    const savedItemsList = document.getElementById('saved-items-list');
    
    // Clear list
    savedItemsList.innerHTML = '';
    
    // Get saved items
    const savedItems = JSON.parse(localStorage.getItem('goldCalculatorSavedItems') || '{}');
    
    // Check if there are saved items
    if (Object.keys(savedItems).length === 0) {
        savedItemsList.innerHTML = '<option value="" disabled selected>No saved items found</option>';
        return;
    }
    
    // Add saved items to list
    Object.keys(savedItems).forEach(saveName => {
        const option = document.createElement('option');
        option.value = saveName;
        option.textContent = `${saveName} (${savedItems[saveName].items.length} items, ${new Date(savedItems[saveName].date).toLocaleDateString()})`;
        savedItemsList.appendChild(option);
    });
}

/**
 * Load saved items
 */
function loadItems() {
    const savedItemsList = document.getElementById('saved-items-list');
    const saveName = savedItemsList.value;
    
    if (!saveName) {
        alert('Please select a saved item set');
        return;
    }
    
    // Get saved items
    const savedItems = JSON.parse(localStorage.getItem('goldCalculatorSavedItems') || '{}');
    
    if (!savedItems[saveName]) {
        alert('Selected save not found');
        return;
    }
    
    // Confirm if there are existing items
    if (window.goldItems.length > 0) {
        if (!confirm('This will replace your current items. Continue?')) {
            return;
        }
    }
    
    // Load items
    window.goldItems = savedItems[saveName].items;
    
    // Update table
    updateItemsTable();
    
    // Close modal
    const loadItemsModal = bootstrap.Modal.getInstance(document.getElementById('load-items-modal'));
    loadItemsModal.hide();
    
    // Show success message
    alert(`Successfully loaded ${window.goldItems.length} items from "${saveName}"`);
}

/**
 * Delete saved items
 */
function deleteSavedItems() {
    const savedItemsList = document.getElementById('saved-items-list');
    const saveName = savedItemsList.value;
    
    if (!saveName) {
        alert('Please select a saved item set');
        return;
    }
    
    if (!confirm(`Are you sure you want to delete "${saveName}"?`)) {
        return;
    }
    
    // Get saved items
    const savedItems = JSON.parse(localStorage.getItem('goldCalculatorSavedItems') || '{}');
    
    if (!savedItems[saveName]) {
        alert('Selected save not found');
        return;
    }
    
    // Delete save
    delete savedItems[saveName];
    
    // Save to localStorage
    localStorage.setItem('goldCalculatorSavedItems', JSON.stringify(savedItems));
    
    // Reload saved items list
    loadSavedItemsList();
    
    // Show success message
    alert(`Successfully deleted "${saveName}"`);
} 