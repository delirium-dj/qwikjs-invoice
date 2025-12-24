/**
 * ============================================================================
 * ENTRY.DEV.TSX - CLIENT-SIDE ONLY DEVELOPMENT MODE
 * ============================================================================
 * 
 * WHAT IS THIS FILE?
 * 
 * This is an alternative development entry point that renders your app
 * entirely in the browser (client-side) without any server-side rendering.
 * 
 * ⚠️  IMPORTANT: This mode is for development/debugging ONLY!
 * 
 * WHEN TO USE THIS:
 * - Debugging client-side specific issues
 * - Testing without SSR complications
 * - Rapid prototyping where SSR doesn't matter
 * 
 * HOW IT DIFFERS FROM SSR MODE (entry.ssr.tsx):
 * 
 * | Aspect              | Client-Side (this file) | SSR Mode              |
 * |---------------------|-------------------------|-----------------------|
 * | Initial render      | In browser              | On server             |
 * | SEO                 | Poor (empty HTML)       | Good (full HTML)      |
 * | First paint         | Slower                  | Faster                |
 * | Bundle size         | Larger                  | Smaller               |
 * | Qwik optimizations  | Not exercised           | Fully utilized        |
 * 
 * WHY SSR IS PREFERRED:
 * - Qwik's "resumability" only works with SSR (the browser resumes where
 *   the server left off, instead of re-executing everything)
 * - SSR pre-renders HTML so users see content immediately
 * - Search engines can crawl SSR content
 * 
 * WHAT YOU'LL LEARN:
 * - The difference between client-side render() and SSR renderToStream()
 * - Why Qwik is designed for SSR-first development
 */

// ============================================================================
// IMPORTS
// ============================================================================

/**
 * render - Qwik's client-side rendering function.
 * Unlike renderToStream (SSR), this renders directly into the DOM.
 * 
 * RenderOptions - TypeScript type for client-side render configuration
 * (less options than SSR since there's no server context)
 */
import { render, type RenderOptions } from "@builder.io/qwik";

/**
 * Root - The root component, same as SSR mode.
 * The only difference is HOW it gets rendered (client vs server).
 */
import Root from "./root";

// ============================================================================
// CLIENT-SIDE RENDER FUNCTION
// ============================================================================

/**
 * Default export function - Renders the app in the browser.
 * 
 * HOW IT WORKS:
 * 1. Browser requests index.html (empty shell)
 * 2. JavaScript bundle loads and executes
 * 3. This function is called, rendering <Root /> into the document
 * 4. App becomes interactive
 * 
 * CONTRAST WITH SSR:
 * With SSR, steps 1-3 happen on the server, and the browser receives
 * fully-rendered HTML immediately. The app "resumes" interactivity
 * instead of rendering from scratch.
 * 
 * @param opts - Render options (DOM container, etc.)
 * @returns Promise that resolves when rendering completes
 */
export default function (opts: RenderOptions) {
  // Render the Root component directly into the document
  // Unlike SSR, this replaces/fills the DOM in the browser
  return render(document, <Root />, opts);
}
