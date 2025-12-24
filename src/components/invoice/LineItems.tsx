/**
 * ============================================================================
 * LINEITEMS.TSX - INVOICE LINE ITEMS TABLE COMPONENT
 * ============================================================================
 * 
 * This component displays and manages the billable items on an invoice.
 * It renders a table with columns for: Description, Quantity, Price, and Total.
 * 
 * KEY FEATURES:
 * - Edit mode: Editable inputs for each field
 * - Preview mode: Read-only display
 * - Add new items dynamically
 * - Remove items with a delete button
 * - Automatic line total calculation
 * 
 * WHAT YOU'LL LEARN:
 * - Working with arrays in Qwik stores
 * - The $ dollar sign pattern for event handlers
 * - Using map() to render lists from arrays
 * - Handling numeric inputs with parseFloat
 * - Accessible delete button patterns
 */

// ============================================================================
// IMPORTS
// ============================================================================

/**
 * component$ - Qwik component definition
 * $ - QRL (Qwik Resource Locator) creator for inline functions
 * 
 * The $ function wraps code that should be lazy-loadable.
 * This is crucial for Qwik's code-splitting and performance.
 */
import { component$, $ } from '@builder.io/qwik';

/**
 * LineItem - TypeScript interface for invoice line items
 * Imported as `type` to ensure it's removed at compile time
 */
import type { LineItem } from '../../types/invoice';

// ============================================================================
// LINE ITEMS COMPONENT
// ============================================================================

/**
 * LineItems - Displays and manages the table of invoice items.
 * 
 * PROPS:
 * - items: Array of LineItem objects (from parent's useStore)
 * - isEditing: Boolean controlling edit/preview mode
 * 
 * ARRAY REACTIVITY IN QWIK:
 * Unlike regular JavaScript arrays, Qwik store arrays are proxied.
 * When you call push(), splice(), or modify elements, Qwik:
 * 1. Intercepts the operation
 * 2. Tracks which components depend on the array
 * 3. Schedules re-renders for affected components
 * 
 * This means you can mutate arrays directly - no need for spread operators!
 */
export const LineItems = component$(({ items, isEditing }: { items: LineItem[], isEditing: boolean }) => {
  
  /**
   * addItem$ - Adds a new blank line item to the invoice.
   * 
   * THE $ PATTERN:
   * Wrapping with $() creates a QRL - a lazy-loadable function reference.
   * This function's code is NOT sent to the browser until it's needed.
   * 
   * UNIQUE ID GENERATION:
   * Date.now() gives milliseconds since 1970 - unique enough for our needs.
   * In production, consider UUIDs for true uniqueness.
   * 
   * DIRECT MUTATION:
   * items.push() works because `items` comes from a Qwik store.
   * The store's proxy intercepts push() and triggers re-renders.
   */
  const addItem$ = $(() => {
    items.push({
      id: Date.now(),        // Unique identifier for this item
      description: '',       // Empty - user will fill in
      quantity: 1,           // Default to 1 unit
      price: 0               // Default to $0 - user will set price
    });
  });

  /**
   * removeItem$ - Removes an item from the invoice by index.
   * 
   * PARAMETERIZED QRL:
   * This QRL takes an index parameter, allowing us to remove any item.
   * 
   * Array.splice(index, count):
   * - index: Starting position (0-based)
   * - count: Number of elements to remove (1 in our case)
   * 
   * The splice automatically triggers a re-render.
   */
  const removeItem$ = $((index: number) => {
    items.splice(index, 1);
  });

  return (
    <div class="mb-8">
      {/* 
        TABLE STRUCTURE
        
        Using a full HTML table for proper semantic structure.
        - border-collapse: Removes double borders between cells
        - text-left: Left-aligns all text
      */}
      <table class="w-full text-left border-collapse">
        {/* 
          TABLE HEADER
          Defines column titles and widths.
        */}
        <thead>
          <tr class="text-xs text-gray-500 border-b border-gray-200">
            <th class="pb-2 pl-2">Item</th>
            {/* Fixed widths for numeric columns ensure consistent layout */}
            <th class="pb-2 w-24">Quantity</th>
            <th class="pb-2 w-32">Price</th>
            <th class="pb-2 w-32 text-right">Total</th>
            {/* 
              CONDITIONAL COLUMN HEADER
              Only show delete button column when editing.
              
              The && pattern short-circuits:
              - If isEditing is false, nothing renders
              - If isEditing is true, the <th> renders
            */}
            {isEditing && <th class="pb-2 w-10"></th>}
          </tr>
        </thead>
        
        {/* 
          TABLE BODY
          Renders each line item as a row.
        */}
        <tbody>
          {/*
            LIST RENDERING WITH map()
            
            items.map((item, index) => ...) creates a row for each item.
            
            The key={item.id} is CRITICAL for:
            - Helping Qwik track which items changed
            - Preventing re-renders of unchanged rows
            - Maintaining input focus during updates
            
            Always use a unique, stable ID as the key!
          */}
          {items.map((item, index) => (
            <tr key={item.id} class="group">
              {/* DESCRIPTION COLUMN */}
              <td class="py-3 pl-2 align-top">
                {isEditing ? (
                  /* 
                    TEXTAREA for description - allows longer text.
                    
                    rows={1} sets initial height; resize-none prevents resizing.
                    focus:ring-2 adds a highlight when focused for accessibility.
                  */
                  <textarea 
                    class="w-full border rounded p-2 text-sm resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                    rows={1}
                    value={item.description}
                    onInput$={(e: any) => item.description = e.target.value}
                  />
                ) : (
                  <span class="text-gray-800">{item.description}</span>
                )}
              </td>
              
              {/* QUANTITY COLUMN */}
              <td class="py-3 align-top">
                {isEditing ? (
                  /*
                    NUMBER INPUT for quantity.
                    
                    min="1" prevents negative quantities.
                    parseFloat handles the conversion from string to number,
                    with || 0 as a fallback for empty/invalid input.
                  */
                  <input 
                    type="number" 
                    class="w-full border rounded p-2 text-sm" 
                    value={item.quantity} 
                    min="1"
                    onInput$={(e: any) => item.quantity = parseFloat(e.target.value) || 0}
                  />
                ) : (
                  <span class="text-gray-600">{item.quantity}</span>
                )}
              </td>
              
              {/* PRICE COLUMN */}
              <td class="py-3 align-top">
                {isEditing ? (
                  /*
                    PRICE INPUT with dollar sign prefix.
                    
                    The relative positioning allows the absolute $ to overlay.
                    pl-6 (padding-left) creates space for the $ symbol.
                    step="0.01" allows cents input.
                  */
                  <div class="relative">
                    <span class="absolute left-3 top-2 text-gray-500">$</span>
                    <input 
                      type="number" 
                      class="w-full border rounded pl-6 p-2 text-sm" 
                      value={item.price} 
                      min="0"
                      step="0.01"
                      onInput$={(e: any) => item.price = parseFloat(e.target.value) || 0}
                    />
                  </div>
                ) : (
                  /* toFixed(2) ensures 2 decimal places for currency */
                  <span class="text-gray-600">${item.price.toFixed(2)}</span>
                )}
              </td>
              
              {/* 
                LINE TOTAL COLUMN
                Calculated automatically: quantity × price
                Always read-only since it's derived data.
              */}
              <td class="py-3 text-right align-top font-medium text-gray-800">
                ${(item.quantity * item.price).toFixed(2)}
              </td>
              
              {/* DELETE BUTTON (Edit mode only) */}
              {isEditing && (
                <td class="py-3 text-right align-top">
                  {/*
                    DELETE BUTTON with icon.
                    
                    onClick$ triggers removeItem$ with the current index.
                    The arrow function () => removeItem$(index) is needed
                    to pass the index parameter.
                    
                    Hover state changes from gray to red for visual feedback.
                  */}
                  <button 
                    onClick$={() => removeItem$(index)}
                    class="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    {/* SVG Trash Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* 
        ADD ITEM BUTTON (Edit mode only)
        
        Allows users to add new line items to the invoice.
        Positioned below the table with visual hierarchy.
      */}
      {isEditing && (
        <button 
          onClick$={addItem$}
          class="mt-4 flex items-center gap-2 text-sm text-blue-600 font-medium hover:text-blue-700"
        >
          {/* SVG Plus Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Add Line Item
        </button>
      )}
    </div>
  );
});