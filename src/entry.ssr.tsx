/**
 * ============================================================================
 * ENTRY.SSR.TSX - SERVER-SIDE RENDERING ENTRY POINT
 * ============================================================================
 * 
 * WHAT IS THIS FILE?
 * 
 * This is the SSR (Server-Side Rendering) entry point for your Qwik application.
 * Whenever your app is rendered OUTSIDE the browser (on a server), this file
 * is the starting point. This includes:
 * 
 * - Development server:     npm run start / npm run dev
 * - Preview server:         npm run preview
 * - Production build:       npm run build
 * - Edge/Serverless:        Cloudflare Workers, AWS Lambda, Vercel, etc.
 * - Traditional servers:    Express, Fastify, Node.js HTTP
 * 
 * WHY SSR MATTERS:
 * - Faster initial page load (users see content immediately)
 * - Better SEO (search engines can crawl your content)
 * - Works without JavaScript (graceful degradation)
 * - Resumable - Qwik serializes state so the browser can "resume" without
 *   re-executing all JavaScript
 * 
 * WHAT YOU'LL LEARN:
 * - How Qwik's streaming SSR works
 * - Container attributes for the HTML document
 * - How server data flows from server to client
 */

// ============================================================================
// IMPORTS
// ============================================================================

/**
 * renderToStream - Qwik's SSR rendering function that outputs HTML as a stream.
 * 
 * WHY STREAMING?
 * Instead of waiting for the entire page to render before sending anything,
 * streaming sends HTML chunks to the browser as they're ready. Benefits:
 * - Faster Time to First Byte (TTFB)
 * - Browser can start rendering while server is still working
 * - Better perceived performance for users
 * 
 * RenderToStreamOptions - TypeScript type defining configuration options
 * for the streaming render (container attributes, server data, etc.)
 */
import {
  renderToStream,
  type RenderToStreamOptions,
} from "@builder.io/qwik/server";

/**
 * Root - The root component of your application (from root.tsx).
 * This is what gets rendered to HTML by the SSR process.
 */
import Root from "./root";

// ============================================================================
// SSR RENDER FUNCTION
// ============================================================================

/**
 * Default export function - Called by the server adapter to render your app.
 * 
 * HOW IT WORKS:
 * 1. Server receives an HTTP request
 * 2. Server adapter (Express, Cloudflare, etc.) calls this function
 * 3. renderToStream converts <Root /> to HTML
 * 4. HTML is streamed back to the browser
 * 5. Browser displays content and "resumes" Qwik components as needed
 * 
 * @param opts - Options passed by the server adapter, including request info
 * @returns A stream of HTML that the server sends to the browser
 */
export default function (opts: RenderToStreamOptions) {
  return renderToStream(<Root />, {
    // Spread existing options from the server adapter
    ...opts,
    
    /**
     * CONTAINER ATTRIBUTES
     * These attributes are applied to the <html> tag of your document.
     * 
     * Common use cases:
     * - Setting the document language (lang="en-us")
     * - Adding data attributes for theming
     * - Adding class names for styling
     * 
     * The spread operator preserves any attributes passed by the adapter.
     */
    containerAttributes: {
      lang: "en-us",
      ...opts.containerAttributes,
    },
    
    /**
     * SERVER DATA
     * Data that should be available to components during SSR and serialized
     * for the client. This is useful for passing request-specific data like:
     * - User authentication status
     * - Request headers/cookies
     * - Environment-specific configuration
     * 
     * Access in components via useServerData() hook.
     */
    serverData: {
      ...opts.serverData,
    },
  });
}
