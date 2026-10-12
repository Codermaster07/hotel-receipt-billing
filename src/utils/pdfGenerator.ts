import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

export async function generatePDF(
  elementId: string,
  filename: string
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Bill preview element not found');
  }

  // Store original styles
  const originalOverflow = element.style.overflow;
  const originalHeight = element.style.height;
  const originalMaxHeight = element.style.maxHeight;
  const originalWidth = element.style.width;

  // Temporarily expand to full content and lock width to A4
  element.style.overflow = 'visible';
  element.style.height = 'auto';
  element.style.maxHeight = 'none';
  element.style.width = '794px';

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 794,
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Use JPEG to avoid jsPDF PNG signature errors with large canvases
    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    if (imgHeight <= pageHeight) {
      // Single page — fits on A4
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
    } else {
      // Multi-page support
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }
    }

    // Sanitize filename
    const sanitized = filename.replace(/[^a-zA-Z0-9_\-\.]/g, '_');
    pdf.save(`${sanitized}.pdf`);
  } finally {
    // Restore original styles
    element.style.overflow = originalOverflow;
    element.style.height = originalHeight;
    element.style.maxHeight = originalMaxHeight;
    element.style.width = originalWidth;
  }
}

export function printBill(elementId: string): void {
  const element = document.getElementById(elementId);
  if (!element) return;

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  // Collect all stylesheets from the current page
  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map((el) => el.outerHTML)
    .join('\n');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Bill</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap" rel="stylesheet" />
        ${styles}
        <style>
          @page {
            size: A4 portrait;
            margin: 0;
          }
          html, body {
            margin: 0;
            padding: 0;
            background: white;
          }
          /* Override: show only the bill, sized for A4 */
          .bill-page {
            width: 210mm;
            min-height: 297mm;
            padding: 17mm 16mm 17mm 16mm;
            box-shadow: none;
            margin: 0;
          }
          .bill-border {
            min-height: calc(297mm - 34mm);
          }
          /* Force exact color printing */
          * {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        </style>
      </head>
      <body>
        ${element.outerHTML}
      </body>
    </html>
  `);

  printWindow.document.close();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 800);
}
