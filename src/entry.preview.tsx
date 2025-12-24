/**
 * ============================================================================
 * ENTRY.PREVIEW.TSX - PRODUCTION BUILD PREVIEW SERVER
 * ============================================================================
 * 
 * WHAT IS THIS FILE?
 * 
 * This is the entry point for `npm run preview` - a local server that
 * serves your PRODUCTION BUILD. It's useful for testing your built
 * application before deploying it.
 * 
 * THE DEVELOPMENT WORKFLOW:
 * 
 * 1. npm run dev      → Development mode with hot reloading (uses entry.ssr.tsx)
 * 2. npm run build    → Creates optimized production bundle
 * 3. npm run preview  → THIS FILE - serves the production bundle locally
 * 4. Deploy           → Push to Cloudflare, Vercel, AWS, etc.
 * 
 * WHY PREVIEW MATTERS:
 * - Catches production-only bugs before deploying
 * - Tests minified/optimized code behavior
 * - Verifies asset paths and loading work correctly
 * - Simulates real production environment locally
 * 
 * HOW IT DIFFERS FROM DEV MODE:
 * 
 * | Aspect          | Dev Mode              | Preview Mode           |
 * |-----------------|-----------------------|------------------------|
 * | Bundle          | Unbundled, HMR        | Production optimized   |
 * | Source maps     | Full                  | Minimal                |
 * | Code splitting  | Lazy (for speed)      | Fully optimized        |
 * | Speed           | Fast rebuilds         | Production performance |
 * 
 * Learn more about Vite's preview command:
 * - https://vitejs.dev/config/preview-options.html#preview-options
 */

// ============================================================================
// IMPORTS
// ============================================================================

/**
 * createQwikCity - Factory function that creates a Node.js compatible
 * request handler for QwikCity applications.
 * 
 * This "middleware/node" adapter works with Vite's preview server,
 * which is a simple Node.js HTTP server.
 */
import { createQwikCity } from "@builder.io/qwik-city/middleware/node";

/**
 * qwikCityPlan - Auto-generated module containing your app's route structure.
 * 
 * This is created during the build process and includes:
 * - All routes from your /routes folder
 * - Layout hierarchy
 * - Data loaders and actions
 * - Menu items and configuration
 * 
 * ⚠️  IMPORTANT: qwikCityPlan must be imported BEFORE the render function
 * to ensure routes are registered before rendering starts.
 */
import qwikCityPlan from "@qwik-city-plan";

/**
 * render - The SSR render function from entry.ssr.tsx
 * This handles the actual HTML generation for each request.
 */
// make sure qwikCityPlan is imported before entry
import render from "./entry.ssr";

// ============================================================================
// EXPORT QWIKCITY NODE ADAPTER
// ============================================================================

/**
 * Default export - The QwikCity Node.js adapter configured for preview.
 * 
 * HOW IT WORKS:
 * 1. Vite's preview server receives an HTTP request
 * 2. The request is passed to this QwikCity adapter
 * 3. Adapter matches the URL to a route in qwikCityPlan
 * 4. The render function generates HTML
 * 5. HTML is sent back to the browser
 * 
 * DEPLOYMENT ADAPTERS:
 * For production deployment, you'd use a different adapter:
 * - @builder.io/qwik-city/adapters/cloudflare-pages
 * - @builder.io/qwik-city/adapters/vercel-edge
 * - @builder.io/qwik-city/adapters/netlify-edge
 * - etc.
 */
export default createQwikCity({ render, qwikCityPlan });
