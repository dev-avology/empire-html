export class SellerCalculator {
    constructor() {
        this.results = {
            salePrice: 0,
            existingMortgage: 0,
            commission: 0,
            settlementFee: 350,
            deedPreparation: 150,
            releaseTracking: 75,
            wireTransfer: 30,
            titleInsurance: 0,
            propertyTaxes: 0,
            otherFees: 0,
            totalClosingCosts: 0,
            totalDeductions: 0,
            netProceeds: 0
        };
        this.formData = {};

        // Add CSS for negative values
        const style = document.createElement('style');
        style.textContent = `
            .negative-value {
                color: red;
                font-weight: bold;
            }
        `;
        document.head.appendChild(style);
    }

    calculate() {
        // Get input values and remove any non-numeric characters except decimal
        const salePrice = parseInt(document.getElementById('sale-price').value.replace(/[^0-9]/g, '')) || 0;
        const existingMortgage = parseInt(document.getElementById('existing-mortgage').value.replace(/[^0-9]/g, '')) || 0;
        const commissionRate = parseFloat(document.getElementById('commission').value) || 0;
        const commission = Math.round(salePrice * (commissionRate / 100));
        const propertyTaxes = parseInt(document.getElementById('property-taxes').value.replace(/[^0-9]/g, '')) || 0;
        const otherFees = parseInt(document.getElementById('other-fees').value.replace(/[^0-9]/g, '')) || 0;

        console.log('Calculation values:', {
            salePrice,
            commissionRate,
            commission,
            calculation: `${salePrice} * (${commissionRate} / 100) = ${commission}`
        });

        // Fixed fees
        const searchFee = 175;
        const recordingFee = 100;

        // Calculate title insurance
        const titleInsurance = this.calculateTitleInsurance(salePrice);

        // Calculate total expenses
        const totalExpenses = existingMortgage + commission + titleInsurance + 
                            this.results.settlementFee + searchFee + recordingFee + 
                            propertyTaxes + otherFees;

        // Calculate net proceeds
        const netProceeds = salePrice - totalExpenses;

        // Store results for later use
        this.results = {
            salePrice,
            existingMortgage,
            commission,
            titleInsurance,
            settlementFee: this.results.settlementFee,
            deedPreparation: this.results.deedPreparation,
            releaseTracking: this.results.releaseTracking,
            wireTransfer: this.results.wireTransfer,
            propertyTaxes,
            otherFees,
            totalClosingCosts: this.results.settlementFee + this.results.deedPreparation + this.results.releaseTracking + this.results.wireTransfer + searchFee + recordingFee,
            totalDeductions: totalExpenses,
            netProceeds
        };

        // Update results display
        this.updateResults(this.results);

        // Show results section
        document.querySelector('.results-section').classList.remove('initially-hidden');
        document.querySelector('.results-section').scrollIntoView({ behavior: 'smooth' });
    }

    updateResults(results) {
        // Store results for PDF generation
        this.results = results;

        // Update all result fields
        document.getElementById('result-salePrice').textContent = this.formatCurrency(results.salePrice);
        document.getElementById('result-totalExpenses').textContent = this.formatCurrency(results.totalDeductions);
        document.getElementById('result-netProceeds').textContent = this.formatCurrency(results.netProceeds);

        // Add print/save button
        const actionButtons = document.querySelector('.action-buttons');
        if (actionButtons) {
            actionButtons.innerHTML = `
                <button id="print-save-btn" class="btn btn-primary">
                    <i class="fas fa-file-pdf"></i> Print/Save Results
                </button>
            `;
            
            // Add click event for print/save button
            document.getElementById('print-save-btn').addEventListener('click', () => {
                this.generatePDF(this.formData);
            });
        }
    }

    camelToKebab(string) {
        return string.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    }

    formatCurrency(amount) {
        const formattedAmount = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(Math.abs(amount));
        return amount < 0 ? '-' + formattedAmount : formattedAmount;
    }

    calculateTitleInsurance(salePrice) {
        // Title insurance calculation logic
        let rate;
        if (salePrice <= 100000) {
            rate = 5.75;
        } else if (salePrice <= 110000) {
            rate = 5.50;
        } else if (salePrice <= 120000) {
            rate = 5.25;
        } else if (salePrice <= 130000) {
            rate = 5.00;
        } else if (salePrice <= 140000) {
            rate = 4.75;
        } else if (salePrice <= 150000) {
            rate = 4.50;
        } else if (salePrice <= 160000) {
            rate = 4.25;
        } else if (salePrice <= 170000) {
            rate = 4.00;
        } else if (salePrice <= 180000) {
            rate = 3.75;
        } else if (salePrice <= 190000) {
            rate = 3.50;
        } else if (salePrice <= 200000) {
            rate = 3.25;
        } else {
            rate = 3.00;
        }
        return (salePrice * rate) / 1000;
    }

    render() {
        return `
            <div class="calculator-container">
                <div class="col-12">
                    <button class="btn btn-link mb-4 back-button" onclick="document.querySelector('.container.mt-5').classList.remove('d-none'); document.getElementById('calculator-container').classList.add('d-none');">
                        <i class="fas fa-arrow-left"></i> Back to Calculators
                    </button>
                </div>
                <div class="col-12 text-center">
                 <h2 class="main-title">Seller Net Sheet Calculator</h2>
                </div>
                <div class="col-12">
                    <form id="sellerForm" class="calculator-form">
                        <div class="form-section row">
                            <div class="col-md-6">
                                <div class="form-group mb-3">
                                    <label for="sale-price">Sale Price</label>
                                    <input type="text" id="sale-price" name="sale-price" class="form-control currency-input" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-3">
                                    <label for="existing-mortgage">Existing Mortgage Balance</label>
                                    <input type="text" id="existing-mortgage" name="existing-mortgage" class="form-control currency-input" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-3">
                                    <label for="property-taxes">Property Taxes Due</label>
                                    <input type="text" id="property-taxes" name="property-taxes" class="form-control currency-input" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-3">
                                    <label for="other-fees">Other Fees</label>
                                    <input type="text" id="other-fees" name="other-fees" class="form-control currency-input" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-3">
                                    <label for="home-warranty">Home Warranty</label>
                                    <input type="text" id="home-warranty" name="home-warranty" class="form-control currency-input" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-3">
                                    <label for="real-estate-commission">Real Estate Commission</label>
                                    <input type="text" id="real-estate-commission" name="real-estate-commission" class="form-control currency-input" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-3">
                                    <label for="real-estate-commission">Real Estate Commission</label>
                                    <input type="text" id="real-estate-commission" name="real-estate-commission" class="form-control currency-input" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-3">
                                    <label for="real-estate-commission">Selling Agent Commission</label>
                                    <input type="text" id="selling-agent-commission" name="selling-agent-commission" class="form-control currency-input" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-3">
                                    <label for="real-estate-commission">Buying Agent Commission</label>
                                    <input type="text" id="buying-agent-commission" name="buying-agent-commission" class="form-control currency-input" required>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-3">
                                    <label for="real-estate-commission">Seller Credit</label>
                                    <input type="text" id="seller-credit" name="seller-credit" class="form-control currency-input" required>
                                </div>
                            </div>
                            <div class="col-md-12 text-center mt-3">
                                 <button type="submit" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop1">Calculate</button>
                            </div>
                        </div>
                    </form>
                </div>


                <!-- Modal -->
                    <div class="modal fade result-mod" id="staticBackdrop1" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header mb-0 pb-0">
                                     <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <div id="results" class="" style="display: none;">
                                        <h3>Results</h3>
                                        <div class="results-grid">
                                            <div class="result-item">
                                                <label>Sale Price:</label>
                                                <span id="result-salePrice"></span>
                                            </div>
                                            <div class="result-item">
                                                <label>Total Expenses:</label>
                                                <span id="result-totalExpenses"></span>
                                            </div>
                                            <div class="result-item">
                                                <label>Net Proceeds:</label>
                                                <span id="result-netProceeds"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <a href="images/seller-net-sheet-template2.pdf" target="blank" type="button" class="btn btn-primary" >Print</a>
                                    <a href="images/seller-net-sheet-template2.pdf" target="blank" type="button" class="btn btn-primary">Save</a>
                                </div>
                            </div>
                        </div>
                    </div>
                <!-- Modal End-->
              

            </div>
        `;
    }

    bindEvents() {
        console.log('Binding events...');
        const form = document.getElementById('sellerForm');
        
        // Add input formatting for all currency inputs
        const currencyInputs = document.querySelectorAll('.currency-input');
        currencyInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                // Remove all non-digits and negative signs
                let value = e.target.value.replace(/[^\d-]/g, '');
                
                // Handle negative signs
                const isNegative = value.startsWith('-');
                // Remove all negative signs from the middle of the number
                value = value.replace(/-/g, '');
                // Add back the negative sign if it was at the start
                if (isNegative) {
                    value = '-' + value;
                }
                
                if (value) {
                    // Convert to number
                    const number = parseInt(value);
                    if (!isNaN(number)) {
                        // Format with commas but no decimals
                        e.target.value = '$' + Math.abs(number).toLocaleString('en-US', {
                            maximumFractionDigits: 0,
                            minimumFractionDigits: 0
                        });
                        // Add negative sign if needed
                        if (number < 0) {
                            e.target.value = '-' + e.target.value;
                            e.target.classList.add('negative-value');
                        } else {
                            e.target.classList.remove('negative-value');
                        }
                    }
                } else {
                    e.target.value = '$0';
                    e.target.classList.remove('negative-value');
                }
            });

            // Handle blur event to ensure empty fields are handled
            input.addEventListener('blur', (e) => {
                if (!e.target.value || e.target.value === '$') {
                    e.target.value = '$0';
                    e.target.classList.remove('negative-value');
                }
            });
        });

        if (form) {
            console.log('Found form, adding submit listener');
            form.addEventListener('submit', (e) => {
                console.log('Form submitted');
                e.preventDefault();
                
                // Get values and remove currency formatting
                const salePrice = parseInt(document.getElementById('sale-price').value.replace(/[^\d-]/g, ''));
                const existingMortgage = parseInt(document.getElementById('existing-mortgage').value.replace(/[^\d-]/g, ''));
                const propertyTaxes = parseInt(document.getElementById('property-taxes').value.replace(/[^\d-]/g, ''));
                const otherFees = parseInt(document.getElementById('other-fees').value.replace(/[^\d-]/g, ''));

                console.log('Values:', { salePrice, existingMortgage, propertyTaxes, otherFees });

                // Calculate totals
                const totalExpenses = existingMortgage + propertyTaxes + otherFees;
                const netProceeds = salePrice - totalExpenses;

                // Update results
                const resultElements = {
                    'result-salePrice': salePrice,
                    'result-totalExpenses': totalExpenses,
                    'result-netProceeds': netProceeds
                };

                // Display results
                Object.entries(resultElements).forEach(([id, value]) => {
                    const element = document.getElementById(id);
                    if (element) {
                        element.textContent = '$' + Math.abs(value).toLocaleString('en-US', {
                            maximumFractionDigits: 0,
                            minimumFractionDigits: 0
                        });
                        if (value < 0) {
                            element.classList.add('negative-value');
                            element.textContent = '-' + element.textContent;
                        } else {
                            element.classList.remove('negative-value');
                        }
                    }
                });

                // Show results section
                document.getElementById('results').style.display = 'block';
            });
        } else {
            console.error('Form not found');
        }
    }

    showContactForm() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'contact-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Contact Information</h3>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="contact-form">
                        <div class="form-group">
                            <label for="name">Name*</label>
                            <input type="text" id="name" name="name" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email*</label>
                            <input type="email" id="email" name="email" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="phone">Phone</label>
                            <input type="tel" id="phone" name="phone" class="form-control">
                        </div>
                        <div class="form-group">
                            <label>Are you working with a Real Estate Agent?</label>
                            <div class="radio-group">
                                <input type="radio" id="agent-yes" name="hasAgent" value="yes">
                                <label for="agent-yes">Yes</label>
                                <input type="radio" id="agent-no" name="hasAgent" value="no">
                                <label for="agent-no">No</label>
                            </div>
                        </div>
                        <div id="agent-info" style="display: none;">
                            <div class="form-group">
                                <label for="agent-name">Agent Name</label>
                                <input type="text" id="agent-name" name="agentName" class="form-control">
                            </div>
                            <div class="form-group">
                                <label for="agent-email">Agent Email</label>
                                <input type="email" id="agent-email" name="agentEmail" class="form-control">
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Show modal with fade effect
        setTimeout(() => modal.classList.add('show'), 10);

        // Close button functionality
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.onclick = () => {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        };

        // Click outside to close
        modal.onclick = (e) => {
            if (e.target === modal) {
                closeBtn.click();
            }
        };

        // Show/hide agent info based on radio selection
        const agentRadios = modal.querySelectorAll('input[name="hasAgent"]');
        const agentInfo = modal.querySelector('#agent-info');
        agentRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                agentInfo.style.display = e.target.value === 'yes' ? 'block' : 'none';
            });
        });

        // Form submission
        const form = modal.querySelector('#contact-form');
        form.onsubmit = (e) => {
            e.preventDefault();
            
            // Remove blur from results
            const resultsSection = document.querySelector('.results-section');
            if (resultsSection) {
                resultsSection.classList.remove('results-blur');
            }

            // Close modal
            closeBtn.click();
            
            // Store form data
            this.formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                isAgent: document.getElementById('agent-yes').checked,
                brokerage: document.getElementById('agent-name').value,
            };
        };
    }

    async generatePDF(formData) {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            const darkRed = '#B22234';
            const darkGray = '#333333';
            const margin = 20;

            // Set default font
            doc.setFont('helvetica');
            
            // Add title
            doc.setFontSize(24);
            doc.setTextColor(darkRed);
            doc.text('SELLER NET SHEET', margin, margin + 10);

            // Transaction Information
            let yPos = margin + 30;
            doc.setFontSize(14);
            doc.setTextColor(darkRed);
            doc.text('TRANSACTION INFORMATION', margin, yPos);
            
            doc.setFontSize(12);
            doc.setTextColor(darkGray);
            yPos += 10;
            doc.text(`Sale Price: ${this.formatCurrency(this.results.salePrice)}`, margin, yPos);
            yPos += 10;
            doc.text(`Existing Mortgage: ${this.formatCurrency(this.results.existingMortgage)}`, margin, yPos);

            // Closing Costs
            yPos += 20;
            doc.setFontSize(14);
            doc.setTextColor(darkRed);
            doc.text('CLOSING COSTS', margin, yPos);
            
            doc.setFontSize(12);
            doc.setTextColor(darkGray);
            yPos += 10;
            doc.text(`Commission: ${this.formatCurrency(this.results.commission)}`, margin, yPos);
            yPos += 10;
            doc.text(`Settlement Fee: ${this.formatCurrency(this.results.settlementFee)}`, margin, yPos);
            yPos += 10;
            doc.text(`Deed Preparation: ${this.formatCurrency(this.results.deedPreparation)}`, margin, yPos);
            yPos += 10;
            doc.text(`Release Tracking: ${this.formatCurrency(this.results.releaseTracking)}`, margin, yPos);
            yPos += 10;
            doc.text(`Wire Transfer: ${this.formatCurrency(this.results.wireTransfer)}`, margin, yPos);
            yPos += 10;
            doc.text(`Title Insurance: ${this.formatCurrency(this.results.titleInsurance)}`, margin, yPos);
            yPos += 10;
            doc.text(`Property Taxes: ${this.formatCurrency(this.results.propertyTaxes)}`, margin, yPos);
            yPos += 10;
            doc.text(`Other Fees: ${this.formatCurrency(this.results.otherFees)}`, margin, yPos);

            // Summary
            yPos += 20;
            doc.setFontSize(14);
            doc.setTextColor(darkRed);
            doc.text('SUMMARY', margin, yPos);
            
            doc.setFontSize(12);
            doc.setTextColor(darkGray);
            yPos += 10;
            doc.text(`Total Closing Costs: ${this.formatCurrency(this.results.totalClosingCosts)}`, margin, yPos);
            yPos += 10;
            doc.text(`Total Deductions: ${this.formatCurrency(this.results.totalDeductions)}`, margin, yPos);
            yPos += 10;
            doc.text(`Net Proceeds: ${this.formatCurrency(this.results.netProceeds)}`, margin, yPos);

            // Footer
            const footerY = doc.internal.pageSize.height - 30;
            doc.setFontSize(10);
            doc.setTextColor(darkGray);
            doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, footerY);
            doc.text('This is an estimate only. Actual proceeds may vary.', margin, footerY + 10);

            // Add contact information if provided
            if (formData.name) {
                doc.setTextColor(darkRed);
                doc.setFontSize(12);
                doc.text(formData.name, doc.internal.pageSize.width - margin - 100, footerY - 15);

                if (formData.isAgent && formData.brokerage) {
                    doc.setTextColor(darkGray);
                    doc.setFontSize(10);
                    doc.text(formData.brokerage, doc.internal.pageSize.width - margin - 100, footerY - 5);
                    if (formData.phone) {
                        doc.text(formData.phone, doc.internal.pageSize.width - margin - 100, footerY + 5);
                    }
                    if (formData.email) {
                        doc.text(formData.email, doc.internal.pageSize.width - margin - 100, footerY + 15);
                    }
                }
            }

            // Create a blob URL for preview
            const pdfBlob = doc.output('blob');
            const blobUrl = URL.createObjectURL(pdfBlob);

            // Open in new window for preview
            window.open(blobUrl, '_blank');

            // Save the file
            const filename = `Empire_Title_Net_Sheet_${formData.name ? formData.name.replace(/\s+/g, '_') : 'Estimate'}.pdf`;
            doc.save(filename);

            return blobUrl;
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('There was an error generating the PDF. Please try again.');
        }
    }
}
