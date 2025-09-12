/**
 * Gold Calculator - Print Functions
 * Handles enhanced print functionality and PDF generation
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize print functionality
    initializePrintFunctions();
});

/**
 * Initialize print functionality
 */
function initializePrintFunctions() {
    // Get DOM elements
    const printResultsBtn = document.getElementById('print-results-btn');
    const savePdfBtn = document.getElementById('save-pdf-btn');
    const includeAdditionalInfo = document.getElementById('include-additional-info');
    const additionalInfoOptions = document.getElementById('additional-info-options');
    
    // Additional info toggle
    if (includeAdditionalInfo) {
        includeAdditionalInfo.addEventListener('change', function() {
            if (additionalInfoOptions) {
                additionalInfoOptions.style.display = this.checked ? 'flex' : 'none';
            }
        });
    }
    
    // Print button click handler
    if (printResultsBtn) {
        printResultsBtn.addEventListener('click', function() {
            preparePrintView();
            window.print();
        });
    }
    
    // Save PDF button click handler
    if (savePdfBtn) {
        savePdfBtn.addEventListener('click', function() {
            generatePDF();
        });
    }
}

/**
 * Prepare the view for printing
 */
function preparePrintView() {
    // Update print date
    const printDateElement = document.getElementById('print-date');
    if (printDateElement) {
        const now = new Date();
        printDateElement.textContent = now.toLocaleString();
    }
    
    // Show additional information if provided
    const itemDescription = document.getElementById('item-description');
    const itemReference = document.getElementById('item-reference');
    const itemNotes = document.getElementById('item-notes');
    
    if (itemDescription && itemDescription.value) {
        document.getElementById('result-description').textContent = itemDescription.value;
        document.querySelector('.item-description-row').style.display = 'table-row';
    }
    
    if (itemReference && itemReference.value) {
        document.getElementById('result-reference').textContent = itemReference.value;
        document.querySelector('.item-reference-row').style.display = 'table-row';
    }
    
    if (itemNotes && itemNotes.value) {
        document.getElementById('result-notes').textContent = itemNotes.value;
        document.querySelector('.item-notes-section').style.display = 'block';
    }
    
    // Generate QR code
    generateQRCode();
}

/**
 * Generate QR code for the calculation
 */
function generateQRCode() {
    const qrcodeContainer = document.getElementById('qrcode');
    if (!qrcodeContainer) return;
    
    // Clear previous QR code
    qrcodeContainer.innerHTML = '';
    
    // Get calculation data
    const calculationData = getCalculationData();
    
    // Create a URL with the calculation data
    const baseUrl = window.location.origin + window.location.pathname;
    const dataParams = new URLSearchParams();
    
    // Add parameters
    for (const key in calculationData) {
        if (calculationData[key]) {
            dataParams.append(key, calculationData[key]);
        }
    }
    
    const qrUrl = baseUrl + '?' + dataParams.toString();
    
    // Generate QR code
    try {
        const qr = qrcode(0, 'M');
        qr.addData(qrUrl);
        qr.make();
        qrcodeContainer.innerHTML = qr.createImgTag(4);
    } catch (error) {
        console.error('Error generating QR code:', error);
        qrcodeContainer.innerHTML = '<p>QR code generation failed</p>';
    }
}

/**
 * Get calculation data for QR code and PDF
 * @returns {Object} - Calculation data
 */
function getCalculationData() {
    // Get form values
    const weight = document.getElementById('gold-weight').value;
    const karat = document.getElementById('gold-karat').value;
    const unit = document.getElementById('weight-unit').value;
    const description = document.getElementById('item-description')?.value || '';
    const reference = document.getElementById('item-reference')?.value || '';
    
    // Get calculated values
    const goldPrice = document.getElementById('result-gold-price').textContent.replace('per troy ounce', '').trim();
    const goldValue = document.getElementById('gold-value').textContent;
    const pureGoldContent = document.getElementById('pure-gold-content').textContent;
    const goldPurity = document.getElementById('gold-purity').textContent;
    
    // Get refining values if available
    let refiningFee = '';
    let treatmentCharge = '';
    let accountability = '';
    let finalValue = '';
    
    if (document.getElementById('include-refining')?.checked) {
        refiningFee = document.getElementById('result-refining-fee')?.textContent || '';
        treatmentCharge = document.getElementById('result-treatment-charge')?.textContent || '';
        accountability = document.getElementById('result-accountability')?.textContent || '';
        finalValue = document.getElementById('final-value')?.textContent || '';
    }
    
    // Return data object
    return {
        weight,
        karat,
        unit,
        description,
        reference,
        goldPrice,
        goldValue,
        pureGoldContent,
        goldPurity,
        refiningFee,
        treatmentCharge,
        accountability,
        finalValue,
        timestamp: new Date().toISOString()
    };
}

/**
 * Generate PDF of the calculation results
 */
function generatePDF() {
    // Show loading indicator
    const savePdfBtn = document.getElementById('save-pdf-btn');
    const originalText = savePdfBtn.textContent;
    savePdfBtn.textContent = 'Generating PDF...';
    savePdfBtn.disabled = true;
    
    // Prepare print view
    preparePrintView();
    
    // Get the results section
    const resultsSection = document.getElementById('results-section');
    
    // Wait for QR code to render
    setTimeout(() => {
        // Use html2canvas to capture the results section
        html2canvas(resultsSection, {
            scale: 2, // Higher scale for better quality
            useCORS: true,
            allowTaint: true,
            scrollX: 0,
            scrollY: 0,
            windowWidth: document.documentElement.offsetWidth,
            windowHeight: document.documentElement.offsetHeight
        }).then(canvas => {
            // Create PDF
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            // Calculate dimensions to fit the page
            const imgData = canvas.toDataURL('image/png');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const canvasRatio = canvas.height / canvas.width;
            const imgWidth = pageWidth - 20; // 10mm margin on each side
            const imgHeight = imgWidth * canvasRatio;
            
            // Add title
            pdf.setFontSize(16);
            pdf.text('Gold Value Calculation Report', pageWidth / 2, 10, { align: 'center' });
            
            // Add image of the results
            pdf.addImage(imgData, 'PNG', 10, 20, imgWidth, imgHeight);
            
            // Add print tips if they fit on the first page
            const tipsSection = document.querySelector('.print-tips');
            if (tipsSection && 20 + imgHeight + 30 < pageHeight) {
                html2canvas(tipsSection, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true
                }).then(tipsCanvas => {
                    const tipsImgData = tipsCanvas.toDataURL('image/png');
                    const tipsRatio = tipsCanvas.height / tipsCanvas.width;
                    const tipsWidth = pageWidth - 20;
                    const tipsHeight = tipsWidth * tipsRatio;
                    
                    // Add tips image below results
                    pdf.addImage(tipsImgData, 'PNG', 10, 25 + imgHeight, tipsWidth, tipsHeight);
                    
                    // Add footer
                    addPdfFooter(pdf);
                    
                    // Save the PDF
                    savePDF(pdf);
                });
            } else {
                // Add footer
                addPdfFooter(pdf);
                
                // Save the PDF
                savePDF(pdf);
            }
        }).catch(error => {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
            savePdfBtn.textContent = originalText;
            savePdfBtn.disabled = false;
        });
    }, 500); // Small delay to ensure QR code is rendered
}

/**
 * Add footer to PDF
 * @param {Object} pdf - jsPDF instance
 */
function addPdfFooter(pdf) {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Generated by Gold Calculator | www.goldcalculator.com', pageWidth / 2, pageHeight - 10, { align: 'center' });
    pdf.text('This report is for informational purposes only and does not constitute a formal appraisal.', pageWidth / 2, pageHeight - 7, { align: 'center' });
}

/**
 * Save the PDF with a formatted filename
 * @param {Object} pdf - jsPDF instance
 */
function savePDF(pdf) {
    // Generate filename
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
    
    // Get item description or default to "Gold"
    let itemDesc = document.getElementById('item-description')?.value || 'Gold';
    // Clean up filename by removing special characters
    itemDesc = itemDesc.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
    
    const filename = `Gold_Calculation_${itemDesc}_${dateStr}_${timeStr}.pdf`;
    
    // Save the PDF
    pdf.save(filename);
    
    // Reset button state
    const savePdfBtn = document.getElementById('save-pdf-btn');
    savePdfBtn.textContent = 'Save as PDF';
    savePdfBtn.disabled = false;
}

/**
 * Load calculation from URL parameters (for QR code scanning)
 */
function loadCalculationFromUrl() {
    // Check if we have URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.size === 0) return;
    
    // Get form elements
    const weightInput = document.getElementById('gold-weight');
    const karatSelect = document.getElementById('gold-karat');
    const unitSelect = document.getElementById('weight-unit');
    const descriptionInput = document.getElementById('item-description');
    const referenceInput = document.getElementById('item-reference');
    const includeRefining = document.getElementById('include-refining');
    const includeAdditionalInfo = document.getElementById('include-additional-info');
    
    // Set form values from URL parameters
    if (urlParams.has('weight')) weightInput.value = urlParams.get('weight');
    if (urlParams.has('karat')) karatSelect.value = urlParams.get('karat');
    if (urlParams.has('unit')) unitSelect.value = urlParams.get('unit');
    
    // Handle additional info
    if (urlParams.has('description') || urlParams.has('reference')) {
        includeAdditionalInfo.checked = true;
        document.getElementById('additional-info-options').style.display = 'flex';
        
        if (urlParams.has('description')) descriptionInput.value = urlParams.get('description');
        if (urlParams.has('reference')) referenceInput.value = urlParams.get('reference');
    }
    
    // Handle refining options
    if (urlParams.has('refiningFee') || urlParams.has('treatmentCharge') || urlParams.has('accountability')) {
        includeRefining.checked = true;
        document.getElementById('refining-options').style.display = 'flex';
        
        if (urlParams.has('refiningFee')) document.getElementById('refining-fee').value = parseFloat(urlParams.get('refiningFee'));
        if (urlParams.has('treatmentCharge')) document.getElementById('treatment-charge').value = parseFloat(urlParams.get('treatmentCharge'));
        if (urlParams.has('accountability')) document.getElementById('accountability').value = parseFloat(urlParams.get('accountability'));
    }
    
    // Auto-submit the form to calculate
    setTimeout(() => {
        document.getElementById('gold-calculator-form').dispatchEvent(new Event('submit'));
    }, 500);
}

// Check for URL parameters on page load
document.addEventListener('DOMContentLoaded', loadCalculationFromUrl); 