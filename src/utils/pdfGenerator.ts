/**
 * ============================================================================
 * PDFGENERATOR.TS - INVOICE PDF GENERATION UTILITY
 * ============================================================================
 * 
 * This utility module generates professional PDF invoices using the jsPDF library.
 * It's designed for server-agnostic usage with dynamic imports.
 * 
 * WHY A SEPARATE UTILITY FILE?
 * - Separation of concerns (UI vs PDF logic)
 * - Reusability (can be called from multiple components)
 * - Testability (easier to unit test isolated code)
 * - Code organization (keeps components cleaner)
 * 
 * LIBRARIES USED:
 * - jsPDF: Core PDF generation library
 * - jspdf-autotable: Plugin for creating formatted tables
 * 
 * DYNAMIC IMPORTS:
 * The import() function loads libraries at runtime rather than build time.
 * Benefits:
 * - Smaller initial bundle size
 * - Faster first page load
 * - Library only loads when user requests PDF
 * 
 * NOTE: This file may have bundling issues on Windows with Vite.
 * See routes/index.tsx for an alternative CDN-based approach.
 * 
 * WHAT YOU'LL LEARN:
 * - Dynamic ES module imports with import()
 * - Creating PDFs with jsPDF
 * - Using jspdf-autotable for professional tables
 * - Coordinate-based positioning in PDFs
 */

// ============================================================================
// IMPORTS
// ============================================================================

/**
 * Invoice type - Only the type is imported (removed at compile time).
 * This keeps the bundle size minimal.
 */
import type { Invoice } from '../types/invoice';

// ============================================================================
// PDF GENERATION FUNCTION
// ============================================================================

/**
 * generateInvoicePDF - Creates and downloads a PDF invoice.
 * 
 * This function:
 * 1. Dynamically loads the PDF libraries (tree-shaking friendly)
 * 2. Constructs a PDF document with header, addresses, table, and notes
 * 3. Triggers a browser download of the generated PDF
 * 
 * COORDINATE SYSTEM:
 * jsPDF uses a coordinate system where:
 * - (0, 0) is the top-left corner
 * - x increases to the right
 * - y increases downward
 * - Default units are millimeters (mm)
 * - A4 page is 210mm × 297mm
 * 
 * @param invoice - The invoice data to render in the PDF
 * @returns Promise that resolves when PDF is downloaded
 */
export const generateInvoicePDF = async (invoice: Invoice) => {
  // ==========================================================================
  // DYNAMIC IMPORTS
  // ==========================================================================

  /**
   * Dynamic import - Loads jsPDF only when this function is called.
   * 
   * Syntax: const { export } = await import('module');
   * 
   * The await pauses execution until the module is loaded.
   * This is different from static imports at the top of the file.
   */
  const { jsPDF } = await import('jspdf');
  
  /**
   * jspdf-autotable exports a default function that adds the autoTable
   * method to jsPDF document instances.
   */
  const { default: autoTable } = await import('jspdf-autotable');

  // ==========================================================================
  // CREATE PDF DOCUMENT
  // ==========================================================================

  /**
   * Create a new PDF document.
   * Default settings: A4 size, portrait orientation, mm units.
   * 
   * Options available:
   * - new jsPDF('l') - Landscape
   * - new jsPDF({ unit: 'pt' }) - Points instead of mm
   * - new jsPDF({ format: 'letter' }) - US Letter size
   */
  const doc = new jsPDF();

  // ==========================================================================
  // 1. HEADER SECTION
  // ==========================================================================

  /**
   * Set font size for the main title.
   * Size is in points (pt), not mm.
   */
  doc.setFontSize(22);
  
  /**
   * Set text color using RGB values (0-255 each).
   * (40, 40, 40) is a soft black color.
   */
  doc.setTextColor(40, 40, 40);
  
  /**
   * Add text at position (x=14mm, y=20mm).
   * The y position is measured from the top of the page.
   */
  doc.text('INVOICE', 14, 20);

  // Invoice metadata in smaller, grayed text
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Invoice #${invoice.id}`, 14, 30);
  doc.text(`Date: ${invoice.createdAt}`, 14, 35);
  doc.text(`Due Date: ${invoice.dueDate}`, 14, 40);

  // ==========================================================================
  // 2. ADDRESSES SECTION
  // ==========================================================================

  /**
   * printAddress - Helper function to print an address block.
   * 
   * HELPER FUNCTIONS IN PDF GENERATION:
   * When you have repetitive patterns (like two address blocks),
   * extract them into helper functions to keep code DRY.
   * 
   * @param label - Section label ("FROM:" or "TO:")
   * @param data - Address object with name, email, address
   * @param xPos - X coordinate to start printing
   */
  const printAddress = (label: string, data: any, xPos: number) => {
    // Section label
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black
    doc.text(label, xPos, 55);
    
    // Address content in gray
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text(data.name, xPos, 62);
    doc.text(data.email, xPos, 67);
    
    /**
     * splitTextToSize() - Wraps long text to fit within a max width.
     * Returns an array of lines that fit within the specified width.
     * 
     * This is essential for addresses that might be too long.
     * Width of 80mm is usually good for half-page layouts.
     */
    const splitAddress = doc.splitTextToSize(data.address, 80);
    doc.text(splitAddress, xPos, 72);
  };

  // Print both addresses side by side
  printAddress('FROM:', invoice.from, 14);   // Left side
  printAddress('TO:', invoice.to, 120);      // Right side

  // ==========================================================================
  // 3. LINE ITEMS TABLE
  // ==========================================================================

  /**
   * Transform invoice items into table row format.
   * autoTable expects a 2D array: [[col1, col2, ...], [col1, col2, ...]]
   * 
   * Each inner array represents one row of data.
   */
  const tableBody = invoice.items.map((item) => [
    item.description,
    item.quantity.toString(),
    `$${item.price.toFixed(2)}`,
    `$${(item.quantity * item.price).toFixed(2)}`,
  ]);

  // Calculate totals for the table footer
  const subtotal = invoice.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
  const taxAmount = subtotal * (invoice.taxRate / 100);
  const total = subtotal + taxAmount;

  /**
   * autoTable() - Generates a formatted table in the PDF.
   * 
   * CONFIGURATION OPTIONS:
   * - startY: Where to start the table (Y coordinate)
   * - head: Header row(s) - array of arrays
   * - body: Data rows - array of arrays
   * - foot: Footer row(s) - for totals
   * - theme: Visual style ('striped', 'grid', 'plain')
   * - headStyles: Custom styling for header
   * - footStyles: Custom styling for footer
   * 
   * The plugin handles page breaks automatically if needed!
   */
  autoTable(doc, {
    startY: 95,
    head: [['Description', 'Qty', 'Price', 'Total']],
    body: tableBody,
    theme: 'striped',  // Alternating row colors
    headStyles: { fillColor: [59, 130, 246] }, // Tailwind Blue-500
    foot: [
      ['', '', 'Subtotal', `$${subtotal.toFixed(2)}`],
      ['', '', `Tax (${invoice.taxRate}%)`, `$${taxAmount.toFixed(2)}`],
      ['', '', 'Total', `$${total.toFixed(2)}`],
    ],
    footStyles: { 
      fillColor: [241, 245, 249],  // Light gray background
      textColor: [0, 0, 0],        // Black text
      fontStyle: 'bold'            // Bold text
    }
  });

  // ==========================================================================
  // 4. NOTES SECTION
  // ==========================================================================

  /**
   * lastAutoTable.finalY - The Y position where the table ended.
   * Use this to position content after the table.
   * 
   * Adding 10mm padding below the table for the notes section.
   */
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('Notes:', 14, finalY);
  doc.text(invoice.notes, 14, finalY + 5);

  // ==========================================================================
  // 5. SAVE/DOWNLOAD PDF
  // ==========================================================================

  /**
   * doc.save() - Triggers a file download in the browser.
   * 
   * The filename includes the invoice ID for easy identification.
   * Example: "INV-2024-1234.pdf"
   * 
   * ALTERNATIVES:
   * - doc.output('blob') - Get as Blob for API upload
   * - doc.output('arraybuffer') - Get as ArrayBuffer
   * - doc.output('datauristring') - Get as base64 data URI
   */
  doc.save(`${invoice.id}.pdf`);
};