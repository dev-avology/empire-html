import { PDFStyles } from './PDFStyles.js';

export class PDFGenerator {
    constructor(jsPDF) {
        this.styles = PDFStyles;
        this.jsPDF = jsPDF;
    }

    async generateSellerNetSheet(data, formData) {
        const doc = new this.jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        const margin = this.styles.layout.margin;
        const contentWidth = pageWidth - (2 * margin);

        // Set default font
        doc.setFont(this.styles.fonts.content.family);

        try {
            // Add logo
            await this.addLogo(doc);
            
            // Add title
            this.addTitle(doc, 'SELLER NET SHEET');

            // Add sections
            let yPos = 100;
            
            // Transaction Information
            yPos = this.addSection(doc, 'TRANSACTION INFORMATION', yPos);
            yPos = this.addTransactionDetails(doc, data, yPos);

            // Closing Costs
            yPos = this.addSection(doc, 'CLOSING COSTS', yPos + 25);
            yPos = this.addClosingCosts(doc, data, yPos);

            // Summary
            yPos = this.addSection(doc, 'SUMMARY', yPos + 10);
            yPos = this.addSummary(doc, data, yPos);

            // Footer
            if (formData.isAgent) {
                await this.addFooter(doc, formData);
            } else {
                this.addFooterWithoutAgent(doc);
            }

            return doc;
        } catch (error) {
            console.error('Error generating PDF:', error);
            throw error;
        }
    }

    addFooterWithoutAgent(doc) {
        const layout = this.styles.layout;
        const footerY = doc.internal.pageSize.height - layout.footer.bottomMargin;

        // Add generation date and disclaimer
        doc.setFontSize(this.styles.fonts.footer.size);
        doc.setTextColor(this.styles.colors.darkGray);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, layout.margin + 5, footerY);
        doc.text('This is an estimate only. Actual proceeds may vary.', layout.margin + 5, footerY + 10);
    }

    async addFooter(doc, formData) {
        const layout = this.styles.layout;
        const pageWidth = doc.internal.pageSize.width;
        const footerY = doc.internal.pageSize.height - layout.footer.bottomMargin;

        // Add generation date and disclaimer
        doc.setFontSize(this.styles.fonts.footer.size);
        doc.setTextColor(this.styles.colors.darkGray);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, layout.margin + 5, footerY);
        doc.text('This is an estimate only. Actual proceeds may vary.', layout.margin + 5, footerY + 10);

        // Add agent info if applicable
        const photoWidth = layout.footer.photo.width;
        const photoHeight = layout.footer.photo.height;

        // Add agent photo
        try {
            await new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    doc.addImage(
                        img, 'JPEG',
                        pageWidth - layout.margin - photoWidth,
                        footerY - 20,
                        photoWidth,
                        photoHeight
                    );
                    resolve();
                };
                img.onerror = reject;
                img.src = this.styles.images.agentPhoto;
            });

            // Add agent contact info
            doc.setTextColor(this.styles.colors.empireRed);
            doc.setFontSize(this.styles.fonts.agentName.size);
            doc.text('Missy Horner', pageWidth - layout.margin - photoWidth, footerY + photoHeight - 15);

            doc.setTextColor(this.styles.colors.darkGray);
            doc.setFontSize(this.styles.fonts.footer.size);
            doc.text('Empire Title Services Inc.', pageWidth - layout.margin - photoWidth, footerY + photoHeight - 5);
            doc.text('(765) 935-9966', pageWidth - layout.margin - photoWidth, footerY + photoHeight + 5);
            doc.text('missy@empiretitleservice.com', pageWidth - layout.margin - photoWidth, footerY + photoHeight + 15);
        } catch (error) {
            console.error('Error adding agent photo:', error);
            // Continue without the photo
            this.addFooterWithoutAgent(doc);
        }
    }

    async addLogo(doc) {
        const layout = this.styles.layout;
        const img = new Image();
        
        return new Promise((resolve, reject) => {
            img.onload = () => {
                doc.addImage(
                    img, 'JPEG',
                    layout.margin,
                    layout.header.logo.topMargin,
                    layout.header.logo.width,
                    layout.header.logo.height
                );
                resolve();
            };
            img.onerror = reject;
            img.src = this.styles.images.empireLogo;
        });
    }

    addTitle(doc, title) {
        const layout = this.styles.layout;
        const fonts = this.styles.fonts;
        const pageWidth = doc.internal.pageSize.width;

        doc.setFontSize(fonts.title.size);
        doc.setTextColor(this.styles.colors.empireRed);
        doc.text(title, pageWidth / 2, layout.header.title.topMargin, { align: 'center' });
    }

    addSection(doc, title, yPos) {
        const layout = this.styles.layout;
        const pageWidth = doc.internal.pageSize.width;
        const contentWidth = pageWidth - (2 * layout.margin);

        // Add colored rectangle
        doc.setFillColor(this.styles.colors.empireRed);
        doc.rect(layout.margin, yPos, contentWidth, layout.sectionHeader.height, 'F');

        // Add section title
        doc.setTextColor(this.styles.colors.white);
        doc.setFontSize(this.styles.fonts.sectionHeader.size);
        doc.text(title, layout.margin + layout.sectionHeader.padding, yPos + 7);

        return yPos + 20;
    }

    addTransactionDetails(doc, data, yPos) {
        const layout = this.styles.layout;
        const pageWidth = doc.internal.pageSize.width;

        doc.setTextColor(this.styles.colors.darkGray);
        doc.setFontSize(this.styles.fonts.content.size);

        // Sale Price
        doc.text('Sale Price', layout.margin + 5, yPos);
        doc.text(this.formatCurrency(data.salePrice), pageWidth - layout.margin - 5, yPos, { align: 'right' });
        yPos += layout.content.lineHeight;

        // Existing Mortgage
        doc.text('Existing Mortgage', layout.margin + 5, yPos);
        doc.text(this.formatCurrency(data.existingMortgage), pageWidth - layout.margin - 5, yPos, { align: 'right' });

        return yPos;
    }

    addClosingCosts(doc, data, yPos) {
        const layout = this.styles.layout;
        const pageWidth = doc.internal.pageSize.width;

        doc.setTextColor(this.styles.colors.darkGray);
        doc.setFontSize(this.styles.fonts.content.size);

        const costs = [
            ['Real Estate Commission', data.commission],
            ['Settlement Fee', 350],
            ['Title Insurance', data.titleInsurance],
            ['Deed Preparation', 150],
            ['Release Tracking', 75],
            ['Wire Transfer', 30],
            ['Property Taxes', data.propertyTaxes],
            ['Other Fees', data.otherFees]
        ];

        costs.forEach(([label, value]) => {
            doc.text(label, layout.margin + 5, yPos);
            doc.text(this.formatCurrency(value), pageWidth - layout.margin - 5, yPos, { align: 'right' });
            yPos += layout.content.lineHeight;
        });

        return yPos;
    }

    addSummary(doc, data, yPos) {
        const layout = this.styles.layout;
        const pageWidth = doc.internal.pageSize.width;

        doc.setTextColor(this.styles.colors.darkGray);
        doc.setFontSize(this.styles.fonts.content.size);

        // Total Closing Costs
        doc.text('Total Closing Costs', layout.margin + 5, yPos);
        doc.text(this.formatCurrency(data.totalExpenses), pageWidth - layout.margin - 5, yPos, { align: 'right' });
        yPos += layout.content.lineHeight;

        // Total Deductions
        doc.text('Total Deductions', layout.margin + 5, yPos);
        doc.text(this.formatCurrency(data.totalExpenses), pageWidth - layout.margin - 5, yPos, { align: 'right' });

        return yPos;
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(value);
    }
}
