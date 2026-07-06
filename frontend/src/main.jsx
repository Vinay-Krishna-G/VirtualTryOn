/**
 * main.jsx
 *
 * Why this file exists:
 *   This is the JavaScript ENTRY POINT — the first file that runs.
 *   Its only job is to:
 *   1. Import our global styles (index.css with Tailwind)
 *   2. Find the <div id="root"> in index.html
 *   3. Mount our App component inside it using React
 *
 * React.StrictMode:
 *   This is a special wrapper that helps catch bugs during development.
 *   It runs some checks twice to warn about common mistakes.
 *   It has NO effect in production builds.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Our global CSS — this is where Tailwind gets imported
import "./index.css";

import App from "./App.jsx";

// Find the <div id="root"> in index.html and mount React inside it
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
