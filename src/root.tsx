/**
 * ============================================================================
 * ROOT.TSX - THE FOUNDATION OF YOUR QWIK APPLICATION
 * ============================================================================
 * 
 * This is the root component of your QwikCity application. It serves as the
 * entry point that wraps your entire app with essential providers and defines
 * the basic HTML document structure (<html>, <head>, <body>).
 * 
 * WHAT YOU'LL LEARN:
 * - How Qwik's component$ function creates resumable components
 * - The role of QwikCityProvider in enabling routing and SSR
 * - How RouterOutlet renders your page content based on the URL
 * - Development vs production optimizations (like PWA manifest)
 */

// ============================================================================
// IMPORTS
// ============================================================================

/**
 * component$ - Qwik's component definition function
 * The $ suffix indicates this is a "lazy-loadable" boundary. Qwik will
 * automatically split your code and only load this component when needed.
 * 
 * isDev - A boolean that's true during development mode (npm run dev)
 * Useful for conditionally including/excluding features based on environment.
 */
import { component$, isDev } from "@builder.io/qwik";

/**
 * QwikCityProvider - The top-level wrapper that enables:
 *   - File-based routing (pages in the /routes folder)
 *   - Server-side rendering (SSR)
 *   - Document head management
 *   - Data loading and prefetching
 * 
 * RouterOutlet - A placeholder component that renders the current page
 * based on the URL. When users navigate, this component swaps out
 * to display the correct route from the /routes folder.
 */
import { QwikCityProvider, RouterOutlet } from "@builder.io/qwik-city";

/**
 * RouterHead - A custom component that manages the document <head> content
 * (title, meta tags, links, scripts). It automatically updates when you
 * navigate between pages, using each page's exported `head` object.
 */
import { RouterHead } from "./components/router-head/router-head";

/**
 * Global CSS - Imported here to apply styles across the entire application.
 * This typically includes Tailwind CSS, CSS reset/normalize, and any
 * global custom styles you want available everywhere.
 */
import "./global.css";

// ============================================================================
// ROOT COMPONENT
// ============================================================================

/**
 * The default export is the root component that gets rendered for every page.
 * 
 * IMPORTANT: This component defines the entire HTML document structure.
 * Unlike React or Vue where you typically start inside <div id="app">,
 * QwikCity gives you control over the full document including <head> and <body>.
 */
export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   * 
   * WHY QwikCityProvider MUST BE AT THE TOP:
   * - It provides routing context to all child components
   * - It enables server-side rendering capabilities
   * - It manages document head updates as you navigate
   * - It handles data loading/fetching coordination
   */

  return (
    <QwikCityProvider>
      {/* 
        DOCUMENT HEAD
        Contains metadata, stylesheets, and scripts loaded before page content.
        The <head> tag is standard HTML - Qwik renders it during SSR.
      */}
      <head>
        {/* Character encoding - always use UTF-8 for proper text rendering */}
        <meta charset="utf-8" />

        {/*
          PWA MANIFEST LINK (Production Only)
          
          The manifest.json file is used for Progressive Web App (PWA) features
          like "Add to Home Screen" on mobile devices. We only include it in
          production (!isDev) because:
          - It's not needed during development
          - It references the BASE_URL which may differ between dev and prod
          
          import.meta.env.BASE_URL - Vite's built-in environment variable that
          returns the base path configured for your app (e.g., "/" or "/app/")
        */}
        {!isDev && (
          <link
            rel="manifest"
            href={`${import.meta.env.BASE_URL}manifest.json`}
          />
        )}

        {/* 
          RouterHead dynamically renders page-specific meta tags, title, etc.
          Each route can export a `head` object to customize its SEO settings.
        */}
        <RouterHead />
      </head>

      {/* 
        DOCUMENT BODY
        The lang="en" attribute helps screen readers and search engines
        understand the primary language of your content.
      */}
      <body lang="en">
        {/* 
          RouterOutlet - This is where your page content appears!
          
          When users navigate to different URLs:
          - /          → renders src/routes/index.tsx
          - /about     → renders src/routes/about/index.tsx
          - /users/123 → renders src/routes/users/[id]/index.tsx
          
          QwikCity automatically matches URLs to files in the /routes folder.
        */}
        <RouterOutlet />
      </body>
    </QwikCityProvider>
  );
});
