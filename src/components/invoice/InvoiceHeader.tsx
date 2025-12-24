/**
 * ============================================================================
 * INVOICEHEADER.TSX - INVOICE TITLE AND DATE COMPONENT
 * ============================================================================
 * 
 * This component renders the top section of an invoice, displaying:
 * - The "INVOICE" title
 * - Invoice ID/number
 * - Company logo (uploadable/deletable)
 * - Creation date and due date
 * 
 * EDIT MODE VS PREVIEW MODE:
 * - Edit Mode (isEditing=true): Shows form inputs for modification
 * - Preview Mode (isEditing=false): Shows read-only text display
 * 
 * LOGO FEATURE:
 * - In edit mode: Shows upload button or current logo with delete option
 * - In preview mode: Shows logo only, no controls
 * - Logo is stored as base64 and embedded in PDF exports
 * 
 * WHAT YOU'LL LEARN:
 * - How to define Qwik components with props
 * - Conditional rendering based on state (edit vs preview)
 * - Handling file inputs in Qwik
 * - TypeScript interfaces for component props
 * - The $ suffix on handler props (QRL pattern)
 */

// ============================================================================
// IMPORTS
// ============================================================================

/**
 * component$ - Qwik's component definition function (note the $ suffix)
 * QRL - Qwik Resource Locator, a lazy-loadable function reference
 * 
 * QRL is used for typing callback props that come from the parent.
 * This ensures Qwik can properly serialize and lazy-load the handlers.
 */
import { component$, type QRL } from '@builder.io/qwik';
import type { Invoice } from '../../types/invoice';

// ============================================================================
// PROPS INTERFACE
// ============================================================================

/**
 * InvoiceHeaderProps - TypeScript interface for component props.
 * 
 * BEST PRACTICE: Define explicit interfaces for props instead of using
 * PropsOf<any>. This provides:
 * - Better autocompletion in your IDE
 * - Compile-time type checking
 * - Self-documenting code
 * 
 * QRL<(e: any) => void> - Type for event handler functions passed as props.
 * The QRL wrapper indicates it can be lazy-loaded by Qwik.
 */
interface InvoiceHeaderProps {
  invoice: Invoice;
  isEditing: boolean;
  logoUrl: string | null;           // Base64 data URL or null if no logo
  onLogoUpload$: QRL<(e: any) => void>;  // Handler when user selects a file
  onLogoDelete$: QRL<() => void>;   // Handler when user clicks delete
}

// ============================================================================
// INVOICE HEADER COMPONENT
// ============================================================================

/**
 * InvoiceHeader - Renders the invoice title, ID, logo, and dates.
 * 
 * REACTIVE UPDATES:
 * When using a Qwik store (useStore), any property assignment like
 * `invoice.id = newValue` automatically triggers a re-render of
 * components that depend on that value. This is Qwik's reactivity system.
 * 
 * LOGO RENDERING LOGIC:
 * - If logoUrl exists: Show the logo (with delete button in edit mode)
 * - If no logoUrl AND editing: Show upload button
 * - If no logoUrl AND NOT editing: Show placeholder or nothing
 */
export const InvoiceHeader = component$<InvoiceHeaderProps>(({ 
  invoice, 
  isEditing, 
  logoUrl, 
  onLogoUpload$, 
  onLogoDelete$ 
}) => {
  return (
    // Container: flex layout to position title on left, dates on right
    <div class="flex justify-between items-start mb-8">
      
      {/* LEFT SIDE: Invoice title and ID */}
      <div>
        {/* 
          Main heading - Using semantic <h1> for SEO and accessibility.
          Only one <h1> should exist per page.
        */}
        <h1 class="text-3xl font-bold text-gray-800 tracking-tight">INVOICE</h1>
        
        {/* Invoice ID section with conditional edit/preview rendering */}
        <div class="mt-4 space-y-1 text-sm text-gray-600">
          <div class="flex items-center gap-2">
            <span class="font-medium">Invoice #:</span>
            
            {/*
              CONDITIONAL RENDERING PATTERN
              
              {condition ? (
                <ComponentIfTrue />
              ) : (
                <ComponentIfFalse />
              )}
              
              When isEditing is true: show an input field
              When isEditing is false: show static text
            */}
            {isEditing ? (
              // EDIT MODE: Editable input field
              <input 
                class="border rounded px-2 py-1 w-32"
                value={invoice.id} 
                /*
                  onInput$ - Qwik's event handler (note the $ suffix!)
                  
                  The $ indicates this handler can be lazy-loaded.
                  The handler updates the invoice store directly,
                  which triggers automatic re-rendering.
                  
                  e.target.value contains the new input value.
                */
                onInput$={(e: any) => invoice.id = e.target.value} 
              />
            ) : (
              // PREVIEW MODE: Read-only text display
              <span>{invoice.id}</span>
            )}
          </div>
        </div>
      </div>
      
      {/* RIGHT SIDE: Logo and date fields */}
      <div class="text-right">
        {/*
          LOGO SECTION
          
          Conditional rendering based on:
          1. Whether a logo exists (logoUrl)
          2. Whether we're in edit mode (isEditing)
          
          Three states:
          - Has logo + editing: Show logo with delete button
          - Has logo + preview: Show logo only
          - No logo + editing: Show upload button
          - No logo + preview: Show placeholder
        */}
        <div class="mb-4 ml-auto flex justify-end">
          {logoUrl ? (
            // ----- LOGO EXISTS -----
            <div class="relative group">
              <img 
                src={logoUrl} 
                alt="Company Logo" 
                width={150}
                height={50}
                class="h-12 max-w-[150px] object-contain"
              />
              
              {/* 
                DELETE BUTTON - Only visible in edit mode
                
                Uses group-hover to show on container hover.
                The delete button overlays the logo image.
                Clicking calls the parent's onLogoDelete$ handler.
              */}
              {isEditing && (
                <button
                  onClick$={onLogoDelete$}
                  class="absolute -top-2 -right-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove logo"
                >
                  {/* SVG Trash Icon - Same as LineItems */}
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          ) : isEditing ? (
            // ----- NO LOGO + EDIT MODE: Show upload button -----
            <label class="cursor-pointer flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors">
              {/*
                HIDDEN FILE INPUT PATTERN
                
                The actual <input type="file"> is hidden.
                The <label> wrapping it acts as the clickable element.
                When clicked, it opens the file picker dialog.
                
                accept="image/*" - Only allow image files
                onChange$ - Called when user selects a file
              */}
              <input 
                type="file" 
                accept="image/*" 
                class="hidden" 
                onChange$={onLogoUpload$}
              />
              {/* Upload icon */}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="text-sm font-medium">Add Logo</span>
            </label>
          ) : (
            // ----- NO LOGO + PREVIEW MODE: Empty placeholder -----
            <div class="h-12 w-[150px]" />
          )}
        </div>
        
        {/* Date input fields */}
        <div class="space-y-2 text-sm">
          {/* CREATION DATE */}
          <div class="flex justify-end gap-2 items-center">
            <span>Date:</span>
            <input 
              type="date" 
              /*
                DYNAMIC CLASS BINDING
                
                Template literals allow conditional class application:
                - Base classes always applied: "border rounded px-2 py-1"
                - Conditional classes based on isEditing:
                  If NOT editing, make it look like plain text
              */
              class={`border rounded px-2 py-1 ${!isEditing ? 'bg-transparent border-transparent text-right' : ''}`} 
              value={invoice.createdAt}
              onInput$={(e: any) => invoice.createdAt = e.target.value}
              /*
                disabled={!isEditing} prevents user interaction in preview mode.
                Combined with transparent styling, the input looks like text.
              */
              disabled={!isEditing}
            />
          </div>
          
          {/* DUE DATE - Same pattern as creation date */}
          <div class="flex justify-end gap-2 items-center">
            <span>Due:</span>
            <input 
              type="date" 
              class={`border rounded px-2 py-1 ${!isEditing ? 'bg-transparent border-transparent text-right' : ''}`} 
              value={invoice.dueDate}
              onInput$={(e: any) => invoice.dueDate = e.target.value}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>
    </div>
  );
});
