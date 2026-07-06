/**
 * server.js
 *
 * Why this file exists:
 *   This is the ENTRY POINT of our Node.js backend.
 *   It's responsible for:
 *   1. Creating the Express application
 *   2. Adding middleware (CORS, JSON parsing)
 *   3. Registering all routes
 *   4. Starting the HTTP server on port 3001
 *
 * What is Express?
 *   Express is a web framework for Node.js.
 *   It makes it easy to:
 *   - Define routes (GET /api/products, POST /api/generate, etc.)
 *   - Add middleware (code that runs on every request)
 *   - Handle errors
 *   We installed it with: npm install express
 *
 * What is CORS?
 *   CORS = Cross-Origin Resource Sharing.
 *   Browsers block requests between different "origins" by default.
 *   Origin = protocol + domain + port. Example: http://localhost:5173
 *   Our React app runs on port 5173.
 *   Our Node server runs on port 3001.
 *   These are DIFFERENT origins, so the browser would block the request.
 *   The cors() middleware adds the right headers to tell the browser:
 *   "It's okay for React (port 5173) to talk to this server."
 *   We installed it with: npm install cors
 */

const express = require("express");
const cors = require("cors");
const path = require("path");

// Import our route handlers
const productsRouter = require("./routes/products");
const tryonRouter = require("./routes/tryon");

// Create the Express application
const app = express();

// Port to listen on — 3001 is our backend port
const PORT = process.env.PORT || 3001;

// ── Middleware ────────────────────────────────────────────────────────────────
// Middleware runs on EVERY request before it reaches a route handler.

/**
 * CORS middleware
 *
 * Why it exists:
 *   Without this, the browser would block React from calling our API.
 *   We restrict it to our frontend's origin for security.
 */
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST"],
  })
);

/**
 * JSON body parser
 *
 * Why it exists:
 *   When requests come in with a JSON body, Express needs to parse it.
 *   Without this, req.body would be undefined for JSON requests.
 *   Note: For multipart/form-data (file uploads), Multer handles parsing instead.
 */
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
// We attach each router to a URL prefix.
// Any request starting with /api/products → handled by productsRouter
// Any request starting with /api/generate → handled by tryonRouter

app.use("/api/products", productsRouter);
app.use("/api/generate", tryonRouter);

// ── Health Check Route ────────────────────────────────────────────────────────
/**
 * GET /api/health
 *
 * Why it exists:
 *   A simple endpoint to verify the server is running.
 *   Useful for debugging: curl http://localhost:3001/api/health
 *
 * Input: none
 * Output: { "status": "ok", "message": "...", "timestamp": "..." }
 */
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "VirtualFit Node.js backend is running",
    timestamp: new Date().toISOString(),
    port: PORT,
  });
});

// ── 404 Handler ───────────────────────────────────────────────────────────────
/**
 * Catch-all for unknown routes
 *
 * Why it exists:
 *   If a request comes in for a route we haven't defined,
 *   instead of Express returning a confusing HTML error page,
 *   we return a clean JSON error.
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.path}`,
  });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
/**
 * Express error handler (4 parameters = error handler)
 *
 * Why it exists:
 *   If any route throws an error (even unhandled ones),
 *   this catches it and returns a clean JSON response.
 *   Without this, Express would return HTML which React can't parse.
 */
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);
  res.status(500).json({
    success: false,
    error: error.message || "Internal server error",
  });
});

// ── Start the Server ──────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 VirtualFit Node.js Backend running!`);
  console.log(`   URL:     http://localhost:${PORT}`);
  console.log(`   Health:  http://localhost:${PORT}/api/health`);
  console.log(`   Products: http://localhost:${PORT}/api/products`);
  console.log(`\n   Waiting for React (port 5173) → Python (port 8000)\n`);
});
