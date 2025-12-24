/**
 * ============================================================================
 * PRETTIER.CONFIG.JS - CODE FORMATTER CONFIGURATION
 * ============================================================================
 * 
 * Prettier is an opinionated code formatter that ensures consistent code style
 * across your entire codebase. It handles things like:
 * - Indentation (spaces/tabs)
 * - Quote style (single/double)
 * - Line length
 * - Trailing commas
 * - Semicolons
 * 
 * WHY PRETTIER?
 * - Eliminates style debates in code reviews
 * - Consistent formatting across the team
 * - Can be run automatically on save
 * - Integrates with most editors
 * 
 * HOW TO USE:
 * - npm run fmt: Format all files
 * - npm run fmt.check: Check formatting without changing files
 * - Install Prettier extension in your editor for format-on-save
 * 
 * For all configuration options, see:
 * @see https://prettier.io/docs/configuration
 * 
 * @type {import("prettier").Config}
 */
const config = {
  // ==========================================================================
  // PLUGINS
  // ==========================================================================
  
  /**
   * plugins - Extend Prettier with additional formatters.
   * 
   * TAILWIND PLUGIN:
   * The prettier-plugin-tailwindcss plugin automatically sorts Tailwind
   * CSS classes in a consistent, logical order based on:
   * 1. Layout (display, position, etc.)
   * 2. Flexbox/Grid
   * 3. Spacing (margin, padding)
   * 4. Sizing (width, height)
   * 5. Typography
   * 6. Visual (colors, shadows)
   * 7. Interactive (hover, focus)
   * 
   * @example
   * Before: "text-blue-500 flex p-4 hover:bg-gray-100 mt-2"
   * After:  "mt-2 flex p-4 text-blue-500 hover:bg-gray-100"
   */
  plugins: ["prettier-plugin-tailwindcss"],
  
  // ==========================================================================
  // FORMATTING OPTIONS (Using Defaults)
  // ==========================================================================
  
  /**
   * Common options you might want to configure:
   * 
   * tabWidth: 2,              // Spaces per indentation level
   * useTabs: false,           // Use spaces instead of tabs
   * semi: true,               // Add semicolons at end of statements
   * singleQuote: true,        // Use single quotes instead of double
   * trailingComma: "es5",     // Add trailing commas where valid in ES5
   * printWidth: 80,           // Line length before wrapping
   * bracketSpacing: true,     // Spaces in object literals: { foo: bar }
   * arrowParens: "always",    // Always use parens in arrow functions: (x) => x
   * 
   * This config uses Prettier's defaults for most options.
   * Customize as needed for your team's preferences.
   */
};

export default config;

