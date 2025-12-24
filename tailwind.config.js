/**
 * ============================================================================
 * TAILWIND.CONFIG.JS - TAILWIND CSS CONFIGURATION
 * ============================================================================
 * 
 * Tailwind CSS is a utility-first CSS framework that provides low-level
 * utility classes (like `flex`, `p-4`, `text-blue-500`) for building designs.
 * 
 * This file configures Tailwind for your Qwik project.
 * 
 * WHY TAILWIND?
 * - No context switching between HTML and CSS files
 * - Consistent design system with predefined scales
 * - Dead CSS elimination (only used classes are included)
 * - Responsive design made easy (md:, lg:, etc.)
 * 
 * WHAT YOU'LL LEARN:
 * - Content paths for class detection
 * - Theme customization
 * - Plugin system
 * 
 * For more configuration options, see:
 * https://tailwindcss.com/docs/configuration
 */

/** @type {import('tailwindcss').Config} */
export default {
  // ==========================================================================
  // CONTENT PATHS
  // ==========================================================================
  
  /*
   * content - Tells Tailwind which files to scan for class names.
   * 
   * Tailwind scans these files for class names like "flex", "p-4", etc.
   * and only includes CSS for classes that are actually used.
   * 
   * GLOB PATTERN EXPLAINED:
   * - "./src/**\/*" - All files in src, any depth
   * - "{js,ts,jsx,tsx,mdx}" - Only these file extensions
   * 
   * If you add new directories with Tailwind classes (like a /components
   * folder outside of /src), add them here!
   */
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  
  // ==========================================================================
  // THEME CUSTOMIZATION
  // ==========================================================================
  
  /*
   * theme - Customize Tailwind's default design tokens.
   * 
   * You can override colors, fonts, spacing, breakpoints, and more.
   * 
   * extend: Add to the defaults (keeps existing values)
   * vs
   * Direct properties: Replace the defaults entirely
   * 
   * EXAMPLE - Custom brand colors:
   * 
   * theme: {
   *   extend: {
   *     colors: {
   *       brand: { 50: '#f0f9ff', 500: '#3b82f6', 900: '#1e3a8a' }
   *     },
   *   },
   * },
   */
  theme: {
    extend: {
      // Add custom theme extensions here
      // For example: custom colors, fonts, spacing, etc.
    },
  },
  
  // ==========================================================================
  // PLUGINS
  // ==========================================================================
  
  /*
   * plugins - Extend Tailwind with additional utilities or components.
   * 
   * Popular plugins include:
   * - @tailwindcss/forms: Better form element styling
   * - @tailwindcss/typography: Prose styling for content
   * - @tailwindcss/aspect-ratio: Aspect ratio utilities
   * - daisyui: Complete component library
   */
  plugins: [],
};
