/**
 * ============================================================================
 * VITE.CONFIG.TS - BUILD TOOL CONFIGURATION
 * ============================================================================
 * 
 * Vite is the build tool and development server for this Qwik application.
 * This file configures how Vite compiles, bundles, and serves your code.
 * 
 * WHAT IS VITE?
 * Vite ("fast" in French) is a modern build tool that provides:
 * - Lightning-fast development server with Hot Module Replacement (HMR)
 * - Optimized production builds with code splitting
 * - Native ES module support for faster page loads
 * 
 * HOW THIS CONFIG WORKS:
 * - When running `npm run dev`, Vite uses this config for the dev server
 * - When running `npm run build`, Vite uses this config for production builds
 * - When deploying to various platforms, adapter configs extend this base
 * 
 * WHAT YOU'LL LEARN:
 * - Vite plugin configuration
 * - Environment-specific settings (dev vs prod)
 * - Dependency optimization
 * - Cache control headers
 */

// ============================================================================
// IMPORTS
// ============================================================================

/**
 * defineConfig - Helper function that provides TypeScript intellisense
 * for Vite configuration options. It doesn't change behavior, just
 * helps with autocompletion and type checking.
 * 
 * UserConfig - TypeScript type for the Vite configuration object.
 */
import { defineConfig, type UserConfig } from "vite";

/**
 * qwikVite - The core Qwik plugin for Vite.
 * Handles Qwik's component compilation, optimization, and code splitting.
 * This is what makes Qwik's unique "resumability" feature work.
 */
import { qwikVite } from "@builder.io/qwik/optimizer";

/**
 * qwikCity - The QwikCity plugin for file-based routing.
 * Automatically generates routes from the /routes folder structure.
 */
import { qwikCity } from "@builder.io/qwik-city/vite";

/**
 * tsconfigPaths - Enables TypeScript path aliases in Vite.
 * Allows imports like "~/components/..." instead of relative paths.
 */
import tsconfigPaths from "vite-tsconfig-paths";

/**
 * Package.json import - Used to access dependencies list.
 * This enables the duplicate dependency checking at startup.
 */
import pkg from "./package.json";

// ============================================================================
// DEPENDENCY VALIDATION
// ============================================================================

/**
 * PkgDep - Type alias for the dependency objects in package.json.
 * Format: { "package-name": "version", ... }
 */
type PkgDep = Record<string, string>;

/**
 * Extract dependencies and devDependencies from package.json.
 * 
 * Destructuring with defaults: If dependencies or devDependencies
 * are undefined, use empty objects instead to prevent errors.
 * 
 * The `as any as { ... }` is a TypeScript workaround for the
 * package.json import which doesn't have perfect typing.
 */
const { dependencies = {}, devDependencies = {} } = pkg as any as {
  dependencies: PkgDep;
  devDependencies: PkgDep;
  [key: string]: unknown;
};

/**
 * Run validation check immediately on config load.
 * This catches common mistakes before the build starts.
 */
errorOnDuplicatesPkgDeps(devDependencies, dependencies);

// ============================================================================
// VITE CONFIGURATION
// ============================================================================

/**
 * Note that Vite normally starts from `index.html` but the qwikCity plugin 
 * makes it start at `src/entry.ssr.tsx` instead. This is because QwikCity
 * generates the HTML server-side, not from a static HTML file.
 */
export default defineConfig(({ command, mode }): UserConfig => {
  /**
   * Configuration function receives context:
   * - command: 'serve' (dev) or 'build' (production)
   * - mode: 'development', 'production', or custom modes
   * 
   * You can use these to return different configs for different scenarios.
   */
  return {
    // ==========================================================================
    // PLUGINS
    // ==========================================================================
    
    /**
     * Plugins extend Vite's functionality.
     * ORDER MATTERS: qwikCity must come before qwikVite.
     */
    plugins: [
      qwikCity(),           // File-based routing
      qwikVite(),           // Qwik core optimization
      tsconfigPaths({ root: "." })  // TypeScript path aliases
    ],
    
    // ==========================================================================
    // DEPENDENCY OPTIMIZATION
    // ==========================================================================
    
    /**
     * optimizeDeps - Controls how Vite pre-bundles dependencies.
     * 
     * Pre-bundling converts CommonJS dependencies to ES modules
     * for faster dev server startup. Some dependencies need to
     * be excluded if they cause issues.
     */
    optimizeDeps: {
      /**
       * exclude - Dependencies to skip pre-bundling.
       * Put problematic deps here, especially those with binaries.
       * For example ['better-sqlite3'] if you use that in server functions.
       */
      exclude: [],
    },

    // ==========================================================================
    // ADVANCED SSR SETTINGS (Commented Out)
    // ==========================================================================
    
    /**
     * This is an advanced setting for production SSR bundling.
     * It improves the bundling of your server code.
     * 
     * UNCOMMENT WITH CAUTION:
     * Only use if you understand the difference between
     * dependencies (production) and devDependencies (build-time).
     * 
     * noExternal: Packages to bundle INTO the server code.
     *   - Put devDependencies here (needed at build time only)
     *   
     * external: Packages to keep EXTERNAL to the bundle.
     *   - Put production dependencies here (especially native modules)
     */
    // ssr:
    //   command === "build" && mode === "production"
    //     ? {
    //         // All dev dependencies should be bundled in the server build
    //         noExternal: Object.keys(devDependencies),
    //         // Anything marked as a dependency will not be bundled
    //         // These should only be production binary deps (including deps of deps), CLI deps, and their module graph
    //         // If a dep-of-dep needs to be external, add it here
    //         // For example, if something uses `bcrypt` but you don't have it as a dep, you can write
    //         // external: [...Object.keys(dependencies), 'bcrypt']
    //         external: Object.keys(dependencies),
    //       }
    //     : undefined,

    // ==========================================================================
    // DEVELOPMENT SERVER SETTINGS
    // ==========================================================================
    
    server: {
      headers: {
        /**
         * Cache-Control header for development.
         * 
         * "public, max-age=0" means:
         * - public: Response can be cached
         * - max-age=0: Cache expires immediately
         * 
         * This ensures fresh content during development.
         */
        "Cache-Control": "public, max-age=0",
      },
    },
    
    // ==========================================================================
    // PREVIEW SERVER SETTINGS
    // ==========================================================================
    
    preview: {
      headers: {
        /**
         * Cache-Control header for preview mode.
         * 
         * "public, max-age=600" means:
         * - public: Response can be cached
         * - max-age=600: Cache for 10 minutes
         * 
         * Preview mode simulates production, so caching is enabled.
         */
        "Cache-Control": "public, max-age=600",
      },
    },
  };
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * errorOnDuplicatesPkgDeps - Validates package.json dependencies.
 * 
 * This function runs at startup to catch common configuration mistakes:
 * 
 * 1. DUPLICATE DEPENDENCIES:
 *    If a package is in both dependencies AND devDependencies,
 *    this causes build issues. All duplicates should be in devDependencies.
 * 
 * 2. QWIK PACKAGES IN WRONG PLACE:
 *    Qwik packages (@builder.io/qwik, @builder.io/qwik-city) must be
 *    in devDependencies, not dependencies. This is because they're
 *    processed at build time and shouldn't be bundled as runtime deps.
 * 
 * WHY THIS MATTERS:
 * - Prevents "Invalid module @qwik-city-plan" errors
 * - Ensures correct bundling in production
 * - Catches mistakes before they cause cryptic errors
 * 
 * @param devDependencies - Development-only dependencies
 * @param dependencies - Production runtime dependencies
 * @throws Error if validation fails
 */
function errorOnDuplicatesPkgDeps(
  devDependencies: PkgDep,
  dependencies: PkgDep,
) {
  let msg = "";
  
  /**
   * Find packages that exist in BOTH devDependencies and dependencies.
   * These are duplicates that need to be removed from one list.
   */
  const duplicateDeps = Object.keys(devDependencies).filter(
    (dep) => dependencies[dep],
  );

  /**
   * Find any Qwik packages incorrectly placed in dependencies.
   * Qwik packages are build-time tools and should always be in devDependencies.
   */
  const qwikPkg = Object.keys(dependencies).filter((value) =>
    /qwik/i.test(value),
  );

  // Error if Qwik packages are in the wrong place
  msg = `Move qwik packages ${qwikPkg.join(", ")} to devDependencies`;
  if (qwikPkg.length > 0) {
    throw new Error(msg);
  }

  // Error if there are duplicate dependencies
  msg = `
    Warning: The dependency "${duplicateDeps.join(", ")}" is listed in both "devDependencies" and "dependencies".
    Please move the duplicated dependencies to "devDependencies" only and remove it from "dependencies"
  `;
  if (duplicateDeps.length > 0) {
    throw new Error(msg);
  }
}
