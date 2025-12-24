/**
 * ============================================================================
 * ROUTER-HEAD.TSX - DYNAMIC DOCUMENT HEAD MANAGEMENT
 * ============================================================================
 * 
 * This component manages the document <head> section of your HTML.
 * It dynamically updates the title, meta tags, links, and scripts
 * as users navigate between pages.
 * 
 * WHY THIS MATTERS FOR SEO:
 * - Search engines read <title> and <meta> tags for indexing
 * - The canonical URL prevents duplicate content penalties
 * - Open Graph tags control how links appear on social media
 * - Proper viewport settings ensure mobile compatibility
 * 
 * HOW PAGES DEFINE HEAD CONTENT:
 * Each route can export a `head` object or function:
 * 
 * @example
 * // In your page file (e.g., routes/about/index.tsx)
 * export const head: DocumentHead = {
 *   title: "About Us | My Invoice App",
 *   meta: [
 *     { name: "description", content: "Learn about our invoice solution" },
 *     { property: "og:title", content: "About Us" }
 *   ]
 * };
 * 
 * WHAT YOU'LL LEARN:
 * - How useDocumentHead() hook provides page-specific metadata
 * - How useLocation() provides the current URL information
 * - Dynamic rendering of meta tags, links, styles, and scripts
 */

// ============================================================================
// IMPORTS
// ============================================================================

/**
 * component$ - Qwik's component definition with lazy-loading boundary
 */
import { component$ } from "@builder.io/qwik";

/**
 * useDocumentHead - Hook that returns the current page's head metadata.
 * This data comes from the nearest route's exported `head` object.
 * 
 * useLocation - Hook that returns information about the current URL:
 * - loc.url.href: Full URL (https://example.com/about)
 * - loc.url.pathname: Path only (/about)
 * - loc.params: URL parameters from dynamic routes ([id])
 * - loc.isNavigating: True during page transitions
 */
import { useDocumentHead, useLocation } from "@builder.io/qwik-city";

// ============================================================================
// ROUTER HEAD COMPONENT
// ============================================================================

/**
 * RouterHead - Renders the dynamic <head> content for the current page.
 * 
 * This component is called from root.tsx inside the <head> tag.
 * It reads metadata from the current route and renders appropriate tags.
 * 
 * AUTOMATIC UPDATES:
 * When users navigate to a new page, QwikCity automatically:
 * 1. Reads the new page's `head` export
 * 2. Re-renders this component with updated data
 * 3. Updates the document <head> with new title, meta, etc.
 */
export const RouterHead = component$(() => {
  /**
   * Get the document head metadata from the current route.
   * 
   * The `head` object contains:
   * - title: Page title shown in browser tab
   * - meta: Array of <meta> tags (description, keywords, og:*, etc.)
   * - links: Array of <link> tags (stylesheets, preload, etc.)
   * - styles: Array of inline <style> tags
   * - scripts: Array of <script> tags
   */
  const head = useDocumentHead();
  
  /**
   * Get the current location/URL information.
   * Used here to set the canonical URL for SEO.
   */
  const loc = useLocation();

  return (
    <>
      {/* 
        PAGE TITLE
        Displayed in the browser tab and used as the main SEO title.
        Each page should have a unique, descriptive title.
      */}
      <title>{head.title}</title>

      {/* 
        CANONICAL URL
        Tells search engines the "official" URL for this page.
        Prevents duplicate content issues when the same page is
        accessible via multiple URLs (with/without trailing slash, etc.)
      */}
      <link rel="canonical" href={loc.url.href} />
      
      {/* 
        VIEWPORT META TAG
        Essential for responsive design on mobile devices.
        - width=device-width: Use the device's actual width
        - initial-scale=1.0: Start at 100% zoom
      */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* 
        FAVICON
        The small icon shown in browser tabs, bookmarks, etc.
        SVG format is preferred for crisp display at any size.
      */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

      {/* 
        DYNAMIC META TAGS
        Iterates through all meta tags defined in the page's head export.
        Common meta tags include:
        - name="description": Page description for search results
        - name="keywords": Keywords for SEO (less important nowadays)
        - property="og:*": Open Graph for social media sharing
        - name="twitter:*": Twitter-specific card metadata
      */}
      {head.meta.map((m) => (
        <meta key={m.key} {...m} />
      ))}

      {/* 
        DYNAMIC LINK TAGS
        External resources like stylesheets, fonts, preload hints.
        Example uses:
        - rel="stylesheet": External CSS files
        - rel="preload": Preload important resources
        - rel="preconnect": Early connection to external domains
      */}
      {head.links.map((l) => (
        <link key={l.key} {...l} />
      ))}

      {/* 
        INLINE STYLES
        CSS that should be embedded directly in the page.
        Useful for critical CSS that should load immediately.
        
        The dangerouslySetInnerHTML pattern is used because
        style content must be set as raw HTML, not as text content.
      */}
      {head.styles.map((s) => (
        <style
          key={s.key}
          {...s.props}
          {...(s.props?.dangerouslySetInnerHTML
            ? {}
            : { dangerouslySetInnerHTML: s.style })}
        />
      ))}

      {/* 
        INLINE SCRIPTS
        JavaScript that should be embedded directly in the page.
        Use sparingly - most scripts should be in separate files.
        
        Similar to styles, uses dangerouslySetInnerHTML to
        inject raw script content.
      */}
      {head.scripts.map((s) => (
        <script
          key={s.key}
          {...s.props}
          {...(s.props?.dangerouslySetInnerHTML
            ? {}
            : { dangerouslySetInnerHTML: s.script })}
        />
      ))}
    </>
  );
});
