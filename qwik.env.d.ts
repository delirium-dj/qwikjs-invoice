/**
 * ============================================================================
 * QWIK.ENV.D.TS - GLOBAL TYPE DECLARATIONS
 * ============================================================================
 * 
 * This is a TypeScript declaration file (.d.ts) that adds global type 
 * definitions to your project. Declaration files don't contain any 
 * executable code - they only provide type information.
 * 
 * WHY .D.TS FILES?
 * - Add type definitions for things TypeScript doesn't know about
 * - Extend global types (window, process, etc.)
 * - Declare ambient modules (like CSS imports)
 * - Reference types from other packages
 * 
 * FILE NAMING:
 * The ".env.d.ts" naming convention indicates this file contains
 * environment-related type declarations. It's automatically included
 * because of the "include" pattern in tsconfig.json: "./*.d.ts"
 * 
 * WHAT YOU'LL LEARN:
 * - Triple-slash directives (/// <reference>)
 * - How to add global type definitions
 * - Vite's client-side type extensions
 */

// ============================================================================
// VITE CLIENT TYPES
// ============================================================================

/**
 * Triple-slash directive to reference Vite's client types.
 * 
 * WHAT THIS PROVIDES:
 * This adds TypeScript definitions for Vite-specific features:
 * 
 * - import.meta.env: Environment variables
 *   - import.meta.env.MODE: 'development' or 'production'
 *   - import.meta.env.DEV: true in development
 *   - import.meta.env.PROD: true in production
 *   - import.meta.env.BASE_URL: Base public path
 *   - import.meta.env.VITE_*: Custom env variables
 * 
 * - import.meta.hot: Hot Module Replacement API
 *   - import.meta.hot.accept(): Accept hot updates
 *   - import.meta.hot.dispose(): Cleanup on module replacement
 * 
 * - Asset imports: Types for importing non-JS files
 *   - import logo from './logo.png': Returns URL string
 *   - import styles from './style.css?inline': Returns CSS string
 * 
 * For more info, see: https://vitejs.dev/guide/features#client-types
 */
/// <reference types="vite/client" />

