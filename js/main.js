import { SellerCalculator } from './calculators/SellerCalculator.js';

// Calculator Factory
class CalculatorFactory {
    static createCalculator(type) {
        switch(type) {
            case 'seller':
                return new SellerCalculator();
            case 'buyer':
                return new SellerCalculator(); // Temporary until we implement BuyerCalculator
            case 'refinance':
                return new SellerCalculator(); // Temporary until we implement RefinanceCalculator
            default:
                throw new Error(`Unknown calculator type: ${type}`);
        }
    }
}

// Base Calculator Class
class Calculator {
    constructor() {
        this.results = {};
    }

    calculate() {
        throw new Error('Calculate method must be implemented');
    }

    render() {
        throw new Error('Render method must be implemented');
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    bindEvents() {
        throw new Error('BindEvents method must be implemented');
    }
}

// Make modal functions globally available
window.showModal = function() {
    document.getElementById('modal-backdrop').classList.remove('d-none');
}

window.closeModal = function() {
    document.getElementById('modal-backdrop').classList.add('d-none');
}

// Handle logo upload
window.handleLogoUpload = function(input) {
    const preview = document.querySelector('.logo-preview');
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Logo preview">`;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const calculatorContainer = document.getElementById('calculator-container');
    const calculatorCards = document.querySelectorAll('.calculator-card');
    const mainContent = document.querySelector('.container.mt-5');
    
    // Handle calculator selection
    calculatorCards.forEach(card => {
        card.addEventListener('click', () => {
            const calculatorType = card.dataset.calculator;
            
            if (calculatorType === 'seller') {
                mainContent.classList.add('d-none');
                calculatorContainer.classList.remove('d-none');
                const calculator = new SellerCalculator();
                calculatorContainer.innerHTML = calculator.render();
                calculator.bindEvents();
                
                // Add currency formatting to all currency inputs
                const currencyInputs = document.querySelectorAll('.currency-input');
                currencyInputs.forEach(input => {
                    // Format on input
                    input.addEventListener('input', (e) => {
                        const cursorPos = e.target.selectionStart;
                        let value = e.target.value.replace(/[^\d.]/g, '');
                        if (value) {
                            const number = parseFloat(value);
                            if (!isNaN(number)) {
                                e.target.value = '$' + number.toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                });
                            }
                        }
                        // Restore cursor position
                        setTimeout(() => e.target.setSelectionRange(cursorPos, cursorPos), 0);
                    });

                    // Format on blur
                    input.addEventListener('blur', (e) => {
                        let value = e.target.value.replace(/[^\d.]/g, '');
                        if (value) {
                            const number = parseFloat(value);
                            if (!isNaN(number)) {
                                e.target.value = '$' + number.toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                });
                            }
                        }
                    });
                });
            }
        });
    });

    // Initialize modal form
    const infoForm = document.getElementById('info-form');
    if (infoForm) {
        // Handle agent fields visibility
        const agentRadios = document.querySelectorAll('input[name="isAgent"]');
        const agentFields = document.getElementById('agent-fields');
        
        agentRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (agentFields) {
                    agentFields.classList.toggle('hidden', e.target.value !== 'yes');
                    
                    // Update required attributes based on visibility
                    const requiredFields = agentFields.querySelectorAll('input[required]');
                    requiredFields.forEach(field => {
                        field.required = e.target.value === 'yes';
                    });
                }
            });
        });

        // Handle logo field visibility
        const logoRadios = document.querySelectorAll('input[name="addLogo"]');
        const logoField = document.getElementById('logo-field');
        
        logoRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (logoField) {
                    logoField.classList.toggle('hidden', e.target.value !== 'yes');
                }
            });
        });

        // Handle form submission
        infoForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            
            try {
                if (window.calculator) {
                    window.calculator.generatePDF(formData);
                }
                window.closeModal();
            } catch (error) {
                console.error('Error generating PDF:', error);
                alert('There was an error generating the PDF. Please try again.');
            }
        });
    }

    // Add currency formatting to all currency inputs
    const currencyInputs = document.querySelectorAll('.currency-input');
    currencyInputs.forEach(input => {
        // Format on input
        input.addEventListener('input', (e) => {
            const cursorPos = e.target.selectionStart;
            let value = e.target.value.replace(/[^\d.]/g, '');
            if (value) {
                const number = parseFloat(value);
                if (!isNaN(number)) {
                    e.target.value = '$' + number.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
                }
            }
            // Restore cursor position
            setTimeout(() => e.target.setSelectionRange(cursorPos, cursorPos), 0);
        });

        // Format on blur
        input.addEventListener('blur', (e) => {
            let value = e.target.value.replace(/[^\d.]/g, '');
            if (value) {
                const number = parseFloat(value);
                if (!isNaN(number)) {
                    e.target.value = '$' + number.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
                }
            }
        });

        // Initial format
        let value = input.value.replace(/[^\d.]/g, '');
        if (value) {
            const number = parseFloat(value);
            if (!isNaN(number)) {
                input.value = '$' + number.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            }
        }
    });
});
