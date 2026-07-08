/**
 * routes/tryon.js
 *
 * Why this file exists:
 *   This is the most important route in the Node backend.
 *   It's the bridge between React and the Python AI service.
 *
 *   What happens when React calls POST /api/generate:
 *   1. Multer saves the person's photo to /uploads/
 *   2. We look up which garment was selected (by productId)
 *   3. We send BOTH images to the Python AI service
 *   4. Python generates the try-on image and sends it back
 *   5. We forward that image back to React
 *
 * Endpoint:
 *   POST /api/generate
 *   Body: multipart/form-data { personImage: <file>, productId: <string> }
 *   Response: image/png (the generated try-on image)
 */

const express = require("express");
const router = express.Router();
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");

const { uploadPersonImage } = require("../middleware/uploadMiddleware");

// Python AI service URL — matches what we'll set up in Phase 3
const PYTHON_AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

// Product image lookup — maps productId to the actual image file path
// We need local file paths (not /products/... URLs) to read the files and send to Python
const PRODUCT_IMAGE_PATHS = {
  "red-silk-saree": "red-silk-saree.png",
  "blue-cotton-saree": "blue-cotton-saree.png",
  "wedding-lehenga": "wedding-lehenga.png",
  "printed-kurti": "printed-kurti.png",
  "designer-saree": "designer-saree.png",
  "green-saree": "green-saree.png",
  "white-shirt": "white-shirt.png",
  "black-blazer": "black-blazer.png",
  "purple-saree": "purple-saree.png",
  "anarkali-suit": "anarkali-suit.png",
};

// ── Route: POST /api/generate ─────────────────────────────────────────────────
/**
 * POST /api/generate
 *
 * Why it exists:
 *   React needs to generate a try-on image.
 *   React sends us the person's photo + the product ID.
 *   We call Python which returns the generated image.
 *   We return that image to React.
 *
 * Request body (multipart/form-data):
 *   - personImage: the uploaded photo file
 *   - productId: e.g. "red-silk-saree"
 *
 * Response:
 *   - 200: image/png binary data (the try-on result)
 *   - 400: missing data
 *   - 404: product not found
 *   - 500: AI service error
 */
router.post(
  "/",
  // Step 1: Run Multer middleware to handle the file upload
  // uploadPersonImage.single("personImage") means:
  //   "Read the file from the field named 'personImage' in the form"
  uploadPersonImage.single("personImage"),

  async (req, res) => {
    // After Multer runs, the uploaded file info is at req.file
    const uploadedPersonImage = req.file;
    const { productId } = req.body;

    // ── Validate inputs ───────────────────────────────────────────────────────
    if (!uploadedPersonImage) {
      return res.status(400).json({
        success: false,
        error: "Person image is required. Please upload a photo.",
      });
    }

    if (!productId) {
      return res.status(400).json({
        success: false,
        error: "Product ID is required. Please select a garment.",
      });
    }

    // ── Find the garment image path ───────────────────────────────────────────
    const garmentFileName = PRODUCT_IMAGE_PATHS[productId];
    if (!garmentFileName) {
      return res.status(404).json({
        success: false,
        error: `Product '${productId}' not found.`,
      });
    }

    // Build the full path to the garment image file.
    // The frontend stores product images in frontend/public/products/
    // We reference them from the Node server side here.
    const garmentImagePath = path.join(
      __dirname,
      "..",
      "..",
      "frontend",
      "public",
      "products",
      garmentFileName
    );

    if (!fs.existsSync(garmentImagePath)) {
      return res.status(500).json({
        success: false,
        error: `Garment image file not found on server: ${garmentFileName}`,
      });
    }

    // ── Call the Python AI Service ────────────────────────────────────────────
    // Why FormData again?
    //   Python's FastAPI also receives files via multipart/form-data.
    //   So we build a new FormData object to send to Python.
    //
    // Why is this a NEW FormData?
    //   The FormData that React sent us is already consumed by Multer.
    //   We need to build a fresh FormData to forward to Python.

    try {
      const pythonFormData = new FormData();

      // Attach the person's image (we read it from disk)
      pythonFormData.append("person_image", fs.createReadStream(uploadedPersonImage.path), {
        filename: uploadedPersonImage.originalname,
        contentType: uploadedPersonImage.mimetype,
      });

      // Attach the garment image
      pythonFormData.append("garment_image", fs.createReadStream(garmentImagePath), {
        filename: garmentFileName,
        contentType: "image/png",
      });

      // Send to Python
      // responseType: "arraybuffer" means we want raw binary data back,
      // not a string or JSON. The AI service returns an image file.
      const pythonResponse = await axios.post(
        `${PYTHON_AI_SERVICE_URL}/generate`,
        pythonFormData,
        {
          headers: {
            // FormData has its own headers (including the boundary for multipart)
            // We must spread them, otherwise the request will be malformed
            ...pythonFormData.getHeaders(),
          },
          responseType: "arraybuffer",
          timeout: 600000, // 10-minute timeout (HuggingFace free spaces queue can be slow)
        }
      );

      // ── Return the generated image to React ──────────────────────────────────
      // We set the Content-Type header so the browser knows it's an image
      res.set("Content-Type", "image/png");
      res.send(pythonResponse.data);

    } catch (error) {
      // Log the full error for debugging
      console.error("Error calling Python AI service:", error.message);

      // Don't expose internal error details to the client in production
      res.status(500).json({
        success: false,
        error: "AI generation failed. Please try again.",
        // In development, include more detail:
        detail: process.env.NODE_ENV === "production" ? undefined : error.message,
      });

    } finally {
      // ── Clean up the uploaded file ─────────────────────────────────────────
      // We no longer need the person's photo on disk after sending it to Python.
      // Leaving it would waste storage over time.
      if (uploadedPersonImage && fs.existsSync(uploadedPersonImage.path)) {
        fs.unlinkSync(uploadedPersonImage.path);
      }
    }
  }
);

module.exports = router;
