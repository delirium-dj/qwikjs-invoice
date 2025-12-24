/**
 * ============================================================================
 * ESLINT.CONFIG.JS - CODE QUALITY & LINTING CONFIGURATION
 * ============================================================================
 * 
 * ESLint analyzes your code for potential errors, style issues, and
 * best practice violations. This file configures which rules to enforce.
 * 
 * ESLINT FLAT CONFIG (NEW FORMAT):
 * This project uses ESLint's new "flat config" format (eslint.config.js)
 * instead of the legacy .eslintrc format. Benefits:
 * - More explicit and predictable configuration
 * - Better TypeScript support
 * - Easier to compose multiple configs
 * 
 * WHAT YOU'LL LEARN:
 * - ESLint flat config structure
 * - Integrating TypeScript with ESLint
 * - Qwik-specific linting rules
 * - Configuring global variables
 */

// ============================================================================
// IMPORTS
// ============================================================================

/**
 * @eslint/js - ESLint's recommended JavaScript rules.
 * These are battle-tested rules that catch common JavaScript mistakes.
 */
import js from "@eslint/js";

/**
 * globals - Predefined global variable sets.
 * Tells ESLint which variables exist in different environments
 * (browser has `window`, Node has `process`, etc.)
 */
import globals from "globals";

/**
 * typescript-eslint - TypeScript integration for ESLint.
 * Provides TypeScript-aware linting rules and parser configuration.
 */
import tseslint from "typescript-eslint";

/**
 * eslint/config - Utilities for ESLint flat config.
 * globalIgnores() creates an ignore pattern configuration object.
 */
import { globalIgnores } from "eslint/config";

/**
 * eslint-plugin-qwik - Qwik-specific linting rules.
 * Catches common mistakes in Qwik code, like:
 * - Missing $ suffix on handlers
 * - Incorrect use of signals
 * - Serialization issues
 */
import { qwikEslint9Plugin } from "eslint-plugin-qwik";

// ============================================================================
// IGNORE PATTERNS
// ============================================================================

/**
 * Files and directories to exclude from linting.
 * 
 * WHY IGNORE THESE?
 * - Generated files (dist, build, node_modules)
 * - Lock files (package-lock.json, yarn.lock)
 * - IDE/editor configs
 * - Build outputs and caches
 * 
 * Ignoring these speeds up linting and avoids false positives.
 */
const ignores = [
  // Log and system files
  "**/*.log",
  "**/.DS_Store",
  "**/.*.",
  ".vscode/settings.json",
  "**/.history",
  "**/.yarn",
  
  // Build outputs (Bazel - a build tool)
  "**/bazel-*",
  "**/bazel-bin",
  "**/bazel-out",
  "**/bazel-qwik",
  "**/bazel-testlogs",
  
  // Distribution and build outputs
  "**/dist",
  "**/dist-dev",
  "**/lib",
  "**/lib-types",
  "**/etc",
  "**/external",
  "**/node_modules",
  "**/temp",
  "**/tsc-out",
  "**/tsdoc-metadata.json",
  "**/target",
  "**/output",
  "**/rollup.config.js",
  "**/build",
  "**/.cache",
  "**/.vscode",
  "**/.rollup.cache",
  "**/dist",
  
  // TypeScript build info
  "**/tsconfig.tsbuildinfo",
  
  // Config files (often have special syntax)
  "**/vite.config.ts",
  
  // Test files (might have different rules)
  "**/*.spec.tsx",
  "**/*.spec.ts",
  
  // Deployment outputs
  "**/.netlify",
  
  // Lock files
  "**/pnpm-lock.yaml",
  "**/package-lock.json",
  "**/yarn.lock",
  
  // Server-specific code
  "**/server",
  
  // This config file itself
  "eslint.config.js",
];

// ============================================================================
// ESLINT CONFIGURATION
// ============================================================================

/**
 * Export the ESLint configuration using tseslint.config() helper.
 * This helper properly types and merges multiple config objects.
 * 
 * The config is an array where each element is a configuration object.
 * Later configs override earlier ones for matching files.
 */
export default tseslint.config(
  // ----- GLOBAL IGNORES -----
  // Apply ignore patterns to all files
  globalIgnores(ignores),
  
  // ----- JAVASCRIPT RECOMMENDED RULES -----
  // ESLint's built-in recommended rules for JavaScript
  js.configs.recommended,
  
  // ----- TYPESCRIPT RECOMMENDED RULES -----
  // TypeScript-specific rules that require type information
  tseslint.configs.recommended,
  
  // ----- QWIK RECOMMENDED RULES -----
  // Qwik-specific rules for component best practices
  qwikEslint9Plugin.configs.recommended,
  
  // ----- GLOBAL VARIABLES -----
  {
    /**
     * languageOptions - Configure how ESLint parses your code.
     */
    languageOptions: {
      /**
       * globals - Define which global variables exist.
       * Spread multiple environment globals together:
       * - browser: window, document, localStorage, etc.
       * - node: process, __dirname, require, etc.
       * - es2021: Promise, Map, Set, etc.
       * - serviceworker: ServiceWorkerGlobalScope
       */
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        ...globals.serviceworker,
      },
      /**
       * parserOptions - Configure the TypeScript parser.
       * 
       * projectService: Automatically finds and uses tsconfig.json
       * tsconfigRootDir: Where to look for tsconfig.json
       */
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  
  // ----- CUSTOM RULE OVERRIDES -----
  {
    /**
     * rules - Override or customize individual lint rules.
     * 
     * Rule values:
     * - "off" or 0: Disable the rule
     * - "warn" or 1: Show warning (doesn't fail build)
     * - "error" or 2: Show error (fails build)
     */
    rules: {
      /**
       * @typescript-eslint/no-explicit-any
       * 
       * Normally this rule prevents using `any` type, but we disable it
       * because sometimes `any` is necessary in Qwik event handlers
       * and when working with external libraries.
       * 
       * In a stricter codebase, you might want to enable this.
       */
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
);

