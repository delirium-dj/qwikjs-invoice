/**
 * ============================================================================
 * ROUTES/INDEX.TSX - MAIN INVOICE PAGE
 * ============================================================================
 * 
 * This is the main page of the invoice application, accessible at the root URL (/).
 * It demonstrates a complete Qwik application with:
 * - State management using useStore and useSignal
 * - Component composition with child components
 * - Event handling with $ functions
 * - Dynamic PDF generation using external libraries
 * 
 * FILE-BASED ROUTING:
 * In QwikCity, the file location determines the URL:
 * - src/routes/index.tsx → /
 * - src/routes/about/index.tsx → /about
 * - src/routes/invoices/[id]/index.tsx → /invoices/:id
 * 
 * WHAT YOU'LL LEARN:
 * - useStore vs useSignal: complex objects vs simple values
 * - Computed/derived state (subtotal, tax, total)
 * - Async event handlers with $()
 * - Dynamic script injection for PDF generation
 * - Component composition and prop drilling
 */

// ============================================================================
// IMPORTS
// ============================================================================

/**
 * component$ - Qwik's lazy-loadable component definition
 * useStore - Creates a reactive object store for complex state
 * useSignal - Creates a reactive wrapper for single values
 * $ - Creates a QRL (lazy-loadable function reference)
 * 
 * KEY DIFFERENCE:
 * - useSignal: For single values (string, number, boolean)
 *   Example: const count = useSignal(0); // access via count.value
 * 
 * - useStore: For objects with multiple properties
 *   Example: const form = useStore({ name: '', email: '' });
 *   Access directly: form.name, form.email
 */
import { component$, useStore, useSignal, $ } from '@builder.io/qwik';

/**
 * Invoice type - Imported for TypeScript type safety.
 * Using `type` import ensures it's removed at compile time.
 */
import type { Invoice } from '../types/invoice';

// Component imports - These are our reusable UI building blocks
import { InvoiceHeader } from '../components/invoice/InvoiceHeader';
import { AddressSection } from '../components/invoice/AddressSection';
import { LineItems } from '../components/invoice/LineItems';

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

/**
 * Default export - This makes it a "page" in QwikCity.
 * The default export from a route file is rendered when that URL is visited.
 * 
 * Named exports have special meanings in QwikCity:
 * - export const head = {...} - SEO metadata
 * - export const onGet = {...} - Server-side data loading
 * - export const onPost = {...} - Server-side form handling
 */
export default component$(() => {
  // ==========================================================================
  // STATE MANAGEMENT
  // ==========================================================================

  /**
   * isEditing - Toggle between edit and preview mode.
   * 
   * useSignal is perfect for simple boolean/number/string values.
   * Access the value with .value: isEditing.value
   * 
   * Signals are automatically tracked - any component accessing
   * isEditing.value will re-render when it changes.
   */
  const isEditing = useSignal(true);
  
  /**
   * isSending - Loading state for the "Send Invoice" action.
   * Set to true during the async operation, false when complete.
   */
  const isSending = useSignal(false);

  /**
   * logoUrl - Stores the company logo as a base64 data URL.
   * 
   * WHY BASE64?
   * - Can be displayed directly in <img src> tags
   * - Can be embedded into PDF documents
   * - No need to manage file uploads to a server
   * - Works entirely client-side
   * 
   * Value is null when no logo is set, or a data URL string like:
   * "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg..."
   */
  const logoUrl = useSignal<string | null>(null);

  /**
   * invoice - The main invoice data store.
   * 
   * useStore creates a deeply reactive object where:
   * - Any property can be modified directly (no setState needed)
   * - Changes auto-trigger re-renders of dependent components
   * - Nested objects/arrays are also reactive
   * 
   * The generic <Invoice> provides TypeScript type checking.
   * All properties must match the Invoice interface.
   */
  const invoice = useStore<Invoice>({
    // Generate a unique ID: "INV-" + year + random number
    id: `INV-${new Date().getFullYear()}${Math.floor(Math.random() * 10000)}`,
    
    // Today's date in YYYY-MM-DD format (for HTML date inputs)
    createdAt: new Date().toISOString().split('T')[0],
    
    // Due date: 14 days from now
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    
    // "Bill From" - Sender address
    from: {
      name: 'My Company LLC',
      email: 'hello@mycompany.com',
      address: '123 Tech Blvd, San Francisco, CA 94107',
    },
    
    // "Bill To" - Recipient address
    to: {
      name: 'Client Name',
      email: 'client@business.com',
      address: '456 Market St, New York, NY 10001',
    },
    
    // Initial line items (billable services/products)
    items: [
      { id: 1, description: 'Web Development Services', quantity: 10, price: 85.00 },
      { id: 2, description: 'Server Setup', quantity: 2, price: 150.00 }
    ],
    
    // Footer notes
    notes: 'Payment is due within 14 days.\nThis document remains valid even without a signature.\nThank you for your business!',
    
    // Tax rate as percentage
    taxRate: 8
  });

  // ==========================================================================
  // DERIVED/COMPUTED STATE
  // ==========================================================================

  /**
   * CALCULATED VALUES (not stored, computed on each render)
   * 
   * These values are recalculated whenever invoice.items or invoice.taxRate
   * changes. In Qwik, you don't need special computed properties -
   * just calculate inline and Qwik's reactivity handles updates.
   * 
   * reduce() - Array method that "reduces" an array to a single value.
   * Here it sums up all (quantity × price) for each item.
   * 
   * Example with items [{qty: 2, price: 100}, {qty: 1, price: 50}]:
   * - Start with sum = 0
   * - Item 1: sum = 0 + (2 × 100) = 200
   * - Item 2: sum = 200 + (1 × 50) = 250
   * - Final subtotal = 250
   */
  const subtotal = invoice.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  
  // Tax amount: subtotal × (taxRate / 100)
  // Example: $1000 × (8 / 100) = $80 tax
  const taxAmount = subtotal * (invoice.taxRate / 100);
  
  // Total: subtotal + tax
  const total = subtotal + taxAmount;

  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================

  /**
   * handleSend$ - Simulates sending the invoice via email.
   * 
   * ASYNC HANDLERS:
   * The $() wrapper works with async functions too.
   * Just add async before the arrow function.
   * 
   * LOADING STATE PATTERN:
   * 1. Set loading flag to true
   * 2. Do async work (API call, etc.)
   * 3. Set loading flag to false (in finally block ideally)
   * 
   * In production, you'd replace the setTimeout with an actual API call
   * to your email service (Resend, SendGrid, etc.)
   */
  const handleSend$ = $(async () => {
    isSending.value = true;
    
    // Simulate API call delay (replace with real API in production)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Show success message (consider using a toast notification instead)
    alert(`Invoice sent successfully to ${invoice.to.email}!`);
    
    isSending.value = false;
  });

  /**
   * handleLogoUpload$ - Converts an uploaded image to base64 and stores it.
   * 
   * FILE READER API:
   * The FileReader is a browser API for reading file contents.
   * readAsDataURL() converts the file to a base64 data URL that can
   * be used directly in <img src> or embedded in PDFs.
   * 
   * FLOW:
   * 1. User selects a file via <input type="file">
   * 2. FileReader reads the file asynchronously
   * 3. onload callback fires with result as data URL
   * 4. We store the data URL in our signal
   */
  const handleLogoUpload$ = $((e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      logoUrl.value = reader.result as string;
    };
    reader.readAsDataURL(file);
  });

  /**
   * handleLogoDelete$ - Removes the logo by setting the signal to null.
   * Simple state reset - Qwik automatically updates all components
   * that depend on logoUrl.value.
   */
  const handleLogoDelete$ = $(() => {
    logoUrl.value = null;
  });

  /**
   * handleDownload$ - Generates and downloads the invoice as a PDF.
   * 
   * DYNAMIC SCRIPT LOADING:
   * This function loads jsPDF and jsPDF-AutoTable from a CDN at runtime.
   * Why not import at build time?
   * - Smaller initial bundle (PDF libs are ~150KB)
   * - Only loads when user needs it
   * - Avoids Vite bundling issues with UMD libraries on Windows
   * 
   * SCRIPT INJECTION PATTERN:
   * 1. Check if library already loaded (win.jspdf)
   * 2. If not, create <script> element with CDN URL
   * 3. Wait for load with Promise
   * 4. Use the library from window object
   * 
   * ⚠️ ALTERNATIVE APPROACH (recommended for production):
   * Use the pdfGenerator.ts utility with proper ES module imports.
   * This inline approach is a fallback for Windows bundling issues.
   */
  const handleDownload$ = $(async () => {
    try {
      // Cast window to any to access dynamically loaded libraries
      const win = window as any;

      // ----- STEP 1: Load jsPDF library if not already loaded -----
      if (!win.jspdf) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          // Using v2.5.1 (Stable UMD build) - matches our package.json
          script.src = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load jsPDF'));
          document.body.appendChild(script);
        });
      }

      // ----- STEP 2: Load autoTable plugin if not already loaded -----
      if (!win.jspdf || !win.jspdf.autoTable) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          // AutoTable version compatible with jsPDF v2.5.1
          script.src = 'https://cdn.jsdelivr.net/npm/jspdf-autotable@3.5.29/dist/jspdf.plugin.autotable.min.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load autoTable'));
          document.body.appendChild(script);
        });
      }

      // ----- STEP 3: Generate the PDF document -----
      const { jsPDF } = win.jspdf;
      const doc = new jsPDF();

      // --- PDF HEADER ---
      doc.setFontSize(22);
      doc.setTextColor(40, 40, 40);
      doc.text('INVOICE', 14, 20);

      // --- LOGO (if uploaded) ---
      // jsPDF can embed images using base64 data URLs
      if (logoUrl.value) {
        try {
          // addImage(imageData, format, x, y, width, height)
          // Position in top-right corner of the document
          doc.addImage(logoUrl.value, 'PNG', 150, 10, 45, 15);
        } catch (err) {
          console.warn('Could not embed logo in PDF:', err);
        }
      }

      // Invoice metadata
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Invoice #${invoice.id}`, 14, 30);
      doc.text(`Date: ${invoice.createdAt}`, 14, 35);
      doc.text(`Due Date: ${invoice.dueDate}`, 14, 40);

      // --- ADDRESS PRINTING HELPER ---
      // Inner function to print FROM and TO addresses
      const printAddress = (label: string, data: any, xPos: number) => {
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(label, xPos, 55);
        
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        doc.text(data.name, xPos, 62);
        doc.text(data.email, xPos, 67);
        
        // splitTextToSize wraps long addresses into multiple lines
        const splitAddress = doc.splitTextToSize(data.address, 80);
        doc.text(splitAddress, xPos, 72);
      };

      // Print both addresses
      printAddress('FROM:', invoice.from, 14);
      printAddress('TO:', invoice.to, 120);

      // --- LINE ITEMS TABLE ---
      // Transform invoice items into table format
      const tableBody = invoice.items.map((item) => [
        item.description,
        item.quantity.toString(),
        `$${item.price.toFixed(2)}`,
        `$${(item.quantity * item.price).toFixed(2)}`,
      ]);

      // AutoTable generates a formatted table in the PDF
      (doc as any).autoTable({
        startY: 95,
        head: [['Description', 'Qty', 'Price', 'Total']],
        body: tableBody,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] }, // Tailwind Blue-500
        foot: [
          ['', '', 'Subtotal', `$${subtotal.toFixed(2)}`],
          ['', '', `Tax (${invoice.taxRate}%)`, `$${taxAmount.toFixed(2)}`],
          ['', '', 'Total', `$${total.toFixed(2)}`],
        ],
        footStyles: { fillColor: [241, 245, 249], textColor: [0, 0, 0], fontStyle: 'bold' }
      });

      // --- NOTES SECTION ---
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('Notes:', 14, finalY);
      doc.text(invoice.notes, 14, finalY + 5);

      // ----- STEP 4: Download the PDF -----
      // This triggers a file download in the browser
      doc.save(`${invoice.id}.pdf`);

    } catch (error) {
      // Log error for debugging and show user-friendly message
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Check console for details.');
    }
  });

  // ==========================================================================
  // COMPONENT RENDER
  // ==========================================================================

  return (
    // Page container with light gray background and padding
    <div class="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 font-sans text-gray-900">
      
      {/* 
        INVOICE CARD
        White card with shadow, centered on the page.
        max-w-4xl limits width on large screens.
        overflow-hidden clips the child elements to the rounded corners.
      */}
      <div class="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        
        {/* 
          ========================================
          TOOLBAR - Action buttons at the top
          ========================================
        */}
        <div class="bg-gray-100 border-b border-gray-200 p-4 flex justify-between items-center">
          
          {/* LEFT SIDE: Edit/Preview toggle */}
          <div class="flex gap-2">
            <button 
              onClick$={() => isEditing.value = !isEditing.value}
              /*
                DYNAMIC CLASSES:
                Ternary expression swaps styles based on isEditing state:
                - Editing: Dark background (active state)
                - Previewing: Light outlined button
              */
              class={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                isEditing.value 
                ? 'bg-gray-800 text-white hover:bg-gray-900' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {/* Button label changes based on mode */}
              {isEditing.value ? 'Preview Mode' : 'Edit Invoice'}
            </button>
          </div>
          
          {/* RIGHT SIDE: Download and Send buttons */}
          <div class="flex gap-2">
            {/* Download PDF Button */}
            <button 
              onClick$={handleDownload$}
              class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              {/* Download icon (SVG) */}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PDF
            </button>
            
            {/* Send Invoice Button with loading state */}
            <button 
              onClick$={handleSend$}
              disabled={isSending.value}
              class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 disabled:opacity-70 transition-colors"
            >
              {/* Text changes based on loading state */}
              {isSending.value ? 'Sending...' : 'Send Invoice'}
            </button>
          </div>
        </div>

        {/* 
          ========================================
          INVOICE CONTENT
          ========================================
        */}
        <div class="p-8 md:p-12">
          
          {/* 
            INVOICE HEADER
            Displays title, invoice number, logo, and dates.
            Props are passed down to the child component.
          */}
          <InvoiceHeader 
            invoice={invoice} 
            isEditing={isEditing.value}
            logoUrl={logoUrl.value}
            onLogoUpload$={handleLogoUpload$}
            onLogoDelete$={handleLogoDelete$}
          />

          {/* 
            ADDRESS SECTIONS
            Grid layout: 1 column on mobile, 2 columns on desktop (md breakpoint).
            
            COMPONENT REUSE:
            Same AddressSection component used twice with different data.
            This is the power of component composition!
          */}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <AddressSection 
              title="Bill From" 
              data={invoice.from} 
              isEditing={isEditing.value} 
            />
            <AddressSection 
              title="Bill To" 
              data={invoice.to} 
              isEditing={isEditing.value} 
            />
          </div>

          {/* 
            LINE ITEMS TABLE
            Displays all billable items with add/remove capabilities.
            The items array is passed by reference (Qwik store reactivity).
          */}
          <LineItems items={invoice.items} isEditing={isEditing.value} />

          {/* 
            ========================================
            TOTALS SECTION
            ========================================
            Displays subtotal, tax, and grand total.
            Positioned to the right side on larger screens.
          */}
          <div class="flex flex-col items-end mt-8">
            <div class="w-full md:w-1/2 space-y-2">
              
              {/* Subtotal row */}
              <div class="flex justify-between text-gray-600">
                <span>Subtotal</span>
                {/* toFixed(2) ensures 2 decimal places (e.g., $100.00) */}
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              {/* Tax row with editable percentage */}
              <div class="flex justify-between text-gray-600 items-center">
                <span>Tax (%)</span>
                {isEditing ? (
                  <input 
                    type="number" 
                    class="w-16 border rounded p-1 text-right text-sm" 
                    value={invoice.taxRate} 
                    onInput$={$((e: any) => invoice.taxRate = Number(e.target.value || 0))}
                  />
                ) : (
                  <span>{invoice.taxRate}%</span>
                )}
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              
              {/* Grand total row - emphasized with larger text and border */}
              <div class="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200 mt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* 
            ========================================
            NOTES SECTION
            ========================================
            Additional instructions, payment terms, or thank-you message.
          */}
          <div class="mt-12 pt-8 border-t border-gray-100">
            <h4 class="text-sm font-bold text-gray-500 uppercase mb-2">Notes</h4>
            {isEditing ? (
              /* 
                TEXTAREA for notes editing.
                min-h-[100px] ensures a minimum height for better UX.
              */
              <textarea 
                class="w-full border rounded p-3 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                value={invoice.notes}
                onInput$={$((e: any) => invoice.notes = e.target.value)}
              />
            ) : (
              /* 
                READ-ONLY display of notes.
                whitespace-pre-line preserves user-entered line breaks.
              */
              <p class="text-gray-700 whitespace-pre-line text-sm">{invoice.notes}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});