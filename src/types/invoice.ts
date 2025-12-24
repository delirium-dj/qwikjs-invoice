/**
 * ============================================================================
 * INVOICE.TS - TYPE DEFINITIONS FOR THE INVOICE APPLICATION
 * ============================================================================
 * 
 * This file defines TypeScript interfaces that describe the shape of your
 * invoice data. These types provide:
 * 
 * 1. TYPE SAFETY - TypeScript catches errors at compile time (not runtime)
 * 2. INTELLISENSE - Your IDE shows available properties as you type
 * 3. DOCUMENTATION - Types serve as documentation for data structures
 * 4. REFACTORING - Changing a type shows you all affected code
 * 
 * WHAT YOU'LL LEARN:
 * - How TypeScript interfaces define object shapes
 * - The difference between type aliases and interfaces
 * - How to export types for use across multiple files
 * 
 * WHY SEPARATE TYPE FILES?
 * - Keeps type definitions organized and easy to find
 * - Allows importing just the types without any runtime code
 * - Makes it easy to share types between components, utilities, and APIs
 */

// ============================================================================
// ADDRESS INTERFACE
// ============================================================================

/**
 * Address - Represents contact information for a party in the invoice.
 * Used for both the sender ("Bill From") and recipient ("Bill To").
 * 
 * INTERFACE SYNTAX:
 * - Properties are listed with name: type
 * - Each property becomes a required field
 * - Add ? after name to make optional (e.g., phone?: string)
 * 
 * @example
 * const clientAddress: Address = {
 *   name: "Acme Corporation",
 *   email: "billing@acme.com",
 *   address: "123 Main St, New York, NY 10001"
 * };
 */
export interface Address {
  /** Full name of the person or company */
  name: string;
  
  /** Email address for sending the invoice */
  email: string;
  
  /** Physical or mailing address - can include multiple lines */
  address: string;
}

// ============================================================================
// LINE ITEM INTERFACE
// ============================================================================

/**
 * LineItem - Represents a single billable item on the invoice.
 * Each line item has a description, quantity, and price.
 * 
 * CALCULATING TOTALS:
 * The total for each line item is: quantity × price
 * Line items are stored in an array and summed for the subtotal.
 * 
 * @example
 * const webDevService: LineItem = {
 *   id: 1,
 *   description: "Website Development",
 *   quantity: 40,  // 40 hours
 *   price: 100     // $100 per hour = $4,000 total
 * };
 */
export interface LineItem {
  /** 
   * Unique identifier for this line item.
   * Used as React/Qwik key prop for efficient list rendering.
   * Typically generated using Date.now() or an auto-increment counter.
   */
  id: number;
  
  /** Description of the product or service being billed */
  description: string;
  
  /** Number of units (hours, products, etc.) */
  quantity: number;
  
  /** Price per unit in the invoice currency (e.g., USD) */
  price: number;
}

// ============================================================================
// INVOICE INTERFACE
// ============================================================================

/**
 * Invoice - The main data structure representing a complete invoice.
 * This is the primary type used throughout the application.
 * 
 * INVOICE CALCULATION FLOW:
 * 1. Subtotal = Sum of all (item.quantity × item.price)
 * 2. Tax Amount = Subtotal × (taxRate / 100)
 * 3. Total = Subtotal + Tax Amount
 * 
 * DATE FORMAT:
 * Dates are stored as ISO 8601 strings (YYYY-MM-DD) for:
 * - Easy serialization/deserialization
 * - Compatibility with HTML date inputs
 * - Consistent sorting and comparison
 * 
 * @example
 * const invoice: Invoice = {
 *   id: "INV-2024-001",
 *   createdAt: "2024-01-15",
 *   dueDate: "2024-01-29",
 *   from: { name: "My Company", email: "...", address: "..." },
 *   to: { name: "Client", email: "...", address: "..." },
 *   items: [{ id: 1, description: "...", quantity: 1, price: 100 }],
 *   notes: "Payment terms: Net 14",
 *   taxRate: 8.5
 * };
 */
export interface Invoice {
  /** 
   * Unique invoice identifier (e.g., "INV-2024-0001").
   * Often includes year and sequential number for easy reference.
   */
  id: string;
  
  /** Date the invoice was created (ISO format: YYYY-MM-DD) */
  createdAt: string;
  
  /** Payment due date (ISO format: YYYY-MM-DD) */
  dueDate: string;
  
  /** Sender's contact information (your company) */
  from: Address;
  
  /** Recipient's contact information (the client) */
  to: Address;
  
  /** Array of billable items on this invoice */
  items: LineItem[];
  
  /** 
   * Additional notes or payment instructions.
   * Displayed at the bottom of the invoice.
   */
  notes: string;
  
  /** 
   * Tax rate as a percentage (e.g., 8 for 8% tax).
   * Applied to the subtotal to calculate tax amount.
   */
  taxRate: number;
}