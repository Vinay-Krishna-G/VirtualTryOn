/**
 * middleware/uploadMiddleware.js
 *
 * Why this file exists:
 *   When React sends us a photo (as a multipart/form-data POST request),
 *   Node.js by itself doesn't know how to read binary file data.
 *   We need a special library called Multer.
 *
 *   What is Multer?
 *   - Multer is a Node.js middleware for handling multipart/form-data
 *   - "Middleware" means it runs between the incoming request and our route handler
 *   - Without Multer, req.file would be undefined — the image would be lost
 *   - We installed it with: npm install multer
 *
 *   How it works:
 *   1. React sends: POST /api/generate with { personImage: <file> }
 *   2. Multer intercepts the request before our route handler runs
 *   3. Multer reads the binary file data from the request
 *   4. Multer saves it to our /uploads folder
 *   5. Multer adds req.file = { path, filename, size, ... } to the request object
 *   6. Our route handler can now access the file via req.file
 *
 * Input: none (this module exports a configured multer instance)
 * Output: multer middleware that can be used in route definitions
 */

// We are importing multer — a library for handling file uploads
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ── Storage Configuration ─────────────────────────────────────────────────────
// multer.diskStorage tells Multer to save files to disk (not just memory).
// We configure TWO things: where to save, and what to name the file.

const personImageStorage = multer.diskStorage({
  /**
   * destination: tells Multer which folder to save uploaded files in.
   *
   * Input: req (the request), file (info about the file), cb (callback)
   * Output: calls cb(null, folderPath) to tell Multer the destination
   */
  destination: function (req, file, cb) {
    const uploadFolder = path.join(__dirname, "..", "uploads");

    // Create the folder if it doesn't exist yet
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }

    cb(null, uploadFolder);
  },

  /**
   * filename: tells Multer what to name the saved file.
   *
   * We use Date.now() to make each filename unique.
   * Without this, two uploads of "photo.jpg" would overwrite each other.
   *
   * Input: req, file, cb
   * Output: calls cb(null, filename) with our chosen name
   */
  filename: function (req, file, cb) {
    // Example output: person-1704067200000.jpg
    const uniqueTimestamp = Date.now();
    const fileExtension = path.extname(file.originalname); // e.g. ".jpg"
    const fileName = `person-${uniqueTimestamp}${fileExtension}`;
    cb(null, fileName);
  },
});

// ── File Type Filter ──────────────────────────────────────────────────────────
/**
 * imageFileFilter
 *
 * Why it exists:
 *   We only want to accept image files.
 *   Without this, anyone could upload any file type (e.g., .exe, .pdf).
 *   This is a basic security measure.
 *
 * Input:
 *   - req: the HTTP request
 *   - file: info about the uploaded file (name, mimetype, etc.)
 *   - cb: callback to accept or reject the file
 *
 * Output:
 *   - cb(null, true) = accept the file
 *   - cb(error) = reject with error
 */
function imageFileFilter(req, file, cb) {
  // mimetype looks like "image/jpeg" or "image/png"
  const isImage = file.mimetype.startsWith("image/");

  if (isImage) {
    cb(null, true); // ✅ Accept
  } else {
    cb(new Error("Only image files are allowed."), false); // ❌ Reject
  }
}

// ── Create the Multer Instance ────────────────────────────────────────────────
// This combines our storage config and file filter into one middleware
const uploadPersonImage = multer({
  storage: personImageStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB maximum file size
  },
});

module.exports = { uploadPersonImage };
