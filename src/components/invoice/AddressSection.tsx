/**
 * ============================================================================
 * ADDRESSSECTION.TSX - BILLING ADDRESS DISPLAY/EDIT COMPONENT
 * ============================================================================
 * 
 * This reusable component displays address information for either:
 * - "Bill From" (sender/company address)
 * - "Bill To" (recipient/client address)
 * 
 * It supports two modes:
 * - Edit Mode: Form inputs for modifying address data
 * - Preview Mode: Read-only text display
 * 
 * WHAT YOU'LL LEARN:
 * - How to create reusable components with TypeScript interfaces
 * - Using generics with component$ for type-safe props
 * - Reactive two-way binding with Qwik stores
 * - Form input patterns (text input, textarea)
 */

// ============================================================================
// IMPORTS
// ============================================================================

/**
 * component$ - Qwik's lazy-loadable component definition
 */
import { component$ } from '@builder.io/qwik';

/**
 * Address - TypeScript interface from our types file
 * Using the `type` keyword ensures it's removed at compile time
 * (types don't exist at runtime, only at build time for type checking)
 */
import type { Address } from '../../types/invoice';

// ============================================================================
// COMPONENT PROPS INTERFACE
// ============================================================================

/**
 * AddressSectionProps - Defines the expected props for this component.
 * 
 * BENEFITS OF EXPLICIT INTERFACES:
 * 1. Self-documenting: Others can see what props are needed
 * 2. IDE autocomplete: Your editor shows available props
 * 3. Type safety: TypeScript catches wrong prop types
 * 4. Refactoring: Changing interface updates all usages
 * 
 * WHY NOT USE PropsOf<any>?
 * While quicker, PropsOf<any> loses type safety.
 * Explicit interfaces are better for maintainability.
 */
interface AddressSectionProps {
  /** Label for the section (e.g., "Bill From" or "Bill To") */
  title: string;
  
  /** 
   * The address data object - this is mutable!
   * When passed from a useStore, changes here update the parent.
   * This is Qwik's reactive store pattern.
   */
  data: Address;
  
  /** Controls whether to show edit inputs or read-only text */
  isEditing: boolean;
}

// ============================================================================
// ADDRESS SECTION COMPONENT
// ============================================================================

/**
 * AddressSection - A reusable address display/edit component.
 * 
 * GENERIC COMPONENT PATTERN:
 * component$<AddressSectionProps> tells TypeScript the exact shape
 * of props this component accepts. This enables:
 * - Autocomplete when using the component
 * - Error highlighting for wrong prop types
 * - Documentation on hover in your IDE
 * 
 * REACTIVE DATA FLOW:
 * The `data` prop comes from a parent's useStore. When we modify
 * `data.name = "..."`, Qwik's reactivity system:
 * 1. Detects the change
 * 2. Marks dependent components as "dirty"
 * 3. Re-renders only affected parts of the UI
 * 
 * This is different from React where you'd need setState!
 */
export const AddressSection = component$<AddressSectionProps>(({ title, data, isEditing }) => {
  return (
    <div class="mb-8">
      {/* 
        Section Title
        Using uppercase and small, muted text for a professional look.
        tracking-wider adds letter spacing for uppercase text readability.
      */}
      <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{title}</h3>
      
      {/* 
        EDIT MODE: Form inputs for modifying address
        The space-y-2 class adds vertical spacing between form elements.
      */}
      {isEditing ? (
        <div class="space-y-2">
          {/* 
            NAME INPUT
            
            value={data.name}: Two-way binding - displays current value
            onInput$: Updates the store when user types
            
            The $ suffix on onInput$ is crucial for Qwik!
            It marks this as a lazy-loadable event handler.
          */}
          <input 
            class="w-full border rounded p-2 text-sm font-semibold" 
            value={data.name} 
            onInput$={(e: any) => data.name = e.target.value} 
            placeholder="Name"
          />
          
          {/* 
            ADDRESS TEXTAREA
            
            Using textarea instead of input because addresses
            can be multi-line. rows={2} sets minimum visible lines.
          */}
          <textarea 
            class="w-full border rounded p-2 text-sm" 
            rows={2}
            value={data.address} 
            onInput$={(e: any) => data.address = e.target.value} 
            placeholder="Address"
          />
          
          {/* EMAIL INPUT */}
          <input 
            class="w-full border rounded p-2 text-sm" 
            value={data.email} 
            onInput$={(e: any) => data.email = e.target.value} 
            placeholder="Email"
          />
        </div>
      ) : (
        /* 
          PREVIEW MODE: Read-only text display
          
          Shows the address data in a clean, professional format.
          whitespace-pre-line preserves line breaks in the address text.
        */
        <div>
          {/* Name - bold for prominence */}
          <p class="font-semibold text-gray-800">{data.name}</p>
          
          {/* Address - allows multi-line display */}
          <p class="text-sm text-gray-600 whitespace-pre-line">{data.address}</p>
          
          {/* Email - smaller, muted text */}
          <p class="text-sm text-gray-600">{data.email}</p>
        </div>
      )}
    </div>
  );
});