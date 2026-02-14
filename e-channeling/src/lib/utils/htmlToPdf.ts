import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Automatically download HTML content as PDF
 * This function converts HTML to canvas, then to PDF and triggers download
 * @param htmlContent - The HTML content to convert
 * @param fileName - The name of the PDF file (without extension)
 */
export const downloadHTMLAsPDF = async (
    htmlContent: string,
    fileName: string = "prescription",
): Promise<void> => {
    try {
        // Create a temporary iframe for complete isolation
        const iframe = document.createElement("iframe");
        iframe.style.position = "fixed";
        iframe.style.left = "-9999px";
        iframe.style.top = "0";
        iframe.style.width = "210mm"; // A4 width
        iframe.style.height = "297mm"; // A4 height
        iframe.style.border = "none";

        document.body.appendChild(iframe);

        // Write HTML content to iframe
        const iframeDoc =
            iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDoc) {
            throw new Error("Unable to access iframe document");
        }

        iframeDoc.open();
        iframeDoc.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body {
                        margin: 0;
                        padding: 20px;
                        background: white;
                        font-family: Arial, sans-serif;
                    }
                </style>
            </head>
            <body>${htmlContent}</body>
            </html>
        `);
        iframeDoc.close();

        // Wait for iframe to load completely
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Get the body element from iframe
        const container = iframeDoc.body;

        // Convert HTML to canvas
        const canvas = await html2canvas(container, {
            scale: 2, // Higher quality
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff",
            windowWidth: container.scrollWidth,
            windowHeight: container.scrollHeight,
        });

        // Remove temporary iframe
        document.body.removeChild(iframe);

        // Calculate PDF dimensions
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Create PDF
        const pdf = new jsPDF({
            orientation: imgHeight > imgWidth ? "portrait" : "portrait",
            unit: "mm",
            format: "a4",
        });

        // Add image to PDF
        const imgData = canvas.toDataURL("image/png");

        // If content is longer than one page, add multiple pages
        let heightLeft = imgHeight;
        let position = 0;
        const pageHeight = 297; // A4 height in mm

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        // Download PDF
        pdf.save(`${fileName}.pdf`);
    } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Failed to generate PDF. Please try again.");
    }
};

/**
 * Open prescription in new window for manual PDF download
 * This gives users more control over the PDF generation
 * @param htmlContent - The HTML content to display
 * @param fileName - The title for the window
 */
export const openPrescriptionForPDF = (
    htmlContent: string,
    fileName: string = "Prescription",
): void => {
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
        alert("Please allow popups to download the prescription");
        return;
    }

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${fileName}</title>
            <style>
                @page {
                    size: A4;
                    margin: 20mm;
                }
                
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 210mm;
                    margin: 0 auto;
                    padding: 20px;
                    background: white;
                }
                
                @media print {
                    body {
                        padding: 0;
                        max-width: 100%;
                    }
                    
                    .no-print {
                        display: none !important;
                    }
                    
                    h1, h2, h3, h4, h5, h6 {
                        page-break-after: avoid;
                    }
                    
                    table, figure {
                        page-break-inside: avoid;
                    }
                }
                
                @media screen {
                    body {
                        background: #f5f5f5;
                        padding: 40px 20px;
                    }
                    
                    .print-button-container {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        z-index: 1000;
                    }
                    
                    .print-button {
                        background: #10b981;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 8px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        transition: all 0.2s;
                    }
                    
                    .print-button:hover {
                        background: #059669;
                        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
                    }
                    
                    .print-button:active {
                        transform: translateY(1px);
                    }
                }
            </style>
        </head>
        <body>
            <div class="print-button-container no-print">
                <button class="print-button" onclick="window.print()">
                    📄 Save as PDF
                </button>
            </div>
            ${htmlContent}
            <script>
                window.focus();
            </script>
        </body>
        </html>
    `);

    printWindow.document.close();
};
