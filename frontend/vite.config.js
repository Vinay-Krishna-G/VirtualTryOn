/**
 * vite.config.js
 *
 * Why this file exists:
 *   Vite needs configuration to:
 *   1. Use the Tailwind CSS plugin (so we get utility classes in our JSX)
 *   2. Set up a proxy so our React app can call /api/* and have it
 *      forwarded to the Node.js backend on port 3001.
 *      This avoids CORS errors during development.
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    // react() adds JSX transform and fast-refresh
    react(),
    // tailwindcss() scans our files for class names and generates CSS
    tailwindcss(),
  ],

  server: {
    port: 5173,
    proxy: {
      /**
       * Any request to /api/* during dev will be forwarded to
       * http://localhost:3001/api/*
       *
       * Example:
       *   React calls  →  GET /api/products
       *   Vite proxies →  GET http://localhost:3001/api/products
       *
       * This means React never needs to know the Node server URL.
       */
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
