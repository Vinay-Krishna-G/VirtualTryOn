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



// ── Route: POST /api/generate/enhance ─────────────────────────────────────────
router.post(
  "/enhance",
  uploadPersonImage.single("personImage"),
  async (req, res) => {
    const uploadedPersonImage = req.file;

    if (!uploadedPersonImage) {
      return res.status(400).json({
        success: false,
        error: "Person image is required. Please upload a photo.",
      });
    }

    try {
      const pythonFormData = new FormData();
      pythonFormData.append("person_image", fs.createReadStream(uploadedPersonImage.path), {
        filename: uploadedPersonImage.originalname,
        contentType: uploadedPersonImage.mimetype,
      });

      const pythonResponse = await axios.post(
        `${PYTHON_AI_SERVICE_URL}/api/try-on/enhance`,
        pythonFormData,
        {
          headers: { ...pythonFormData.getHeaders() },
          responseType: "arraybuffer", // We expect a raw image stream
          timeout: 60000,
        }
      );

      // Return the enhanced image bytes back to React
      res.setHeader("Content-Type", "image/jpeg");
      res.send(pythonResponse.data);
    } catch (error) {
      console.error("[Node Gateway] Error calling Python Enhance:", error.message);
      
      // Try to parse the JSON error returned by Python if it failed quality checks
      let errorMsg = "Enhancement failed.";
      if (error.response?.data) {
        try {
          // Because responseType is arraybuffer, we need to convert it back to string/json
          const errorJson = JSON.parse(error.response.data.toString("utf8"));
          if (errorJson.message) errorMsg = errorJson.message;
        } catch (e) {
          // ignore parsing error
        }
      }
      
      return res.status(error.response?.status || 500).json({
        success: false,
        error: errorMsg,
      });
    } finally {
      if (uploadedPersonImage && fs.existsSync(uploadedPersonImage.path)) {
        fs.unlinkSync(uploadedPersonImage.path);
      }
    }
  }
);

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
    const { productId, size } = req.body;

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
    const garmentFileName = size ? `${productId}_${size}.png` : `${productId}.png`;
    console.log(`[Node Gateway] Try-On Request received. Product: ${productId}, Size: ${size || 'default'}, Resolved File: ${garmentFileName}`);
    
    if (!productId) {
      return res.status(404).json({
        success: false,
        error: `Product ID is missing.`,
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
      // We expect JSON back because we upgraded to the async architecture
      const pythonResponse = await axios.post(
        `${PYTHON_AI_SERVICE_URL}/generate`,
        pythonFormData,
        {
          headers: {
            ...pythonFormData.getHeaders(),
          },
          responseType: "json",
          timeout: 600000,
        }
      );

      // ── Return the job ID to React ──────────────────────────────────
      res.json(pythonResponse.data);

    } catch (error) {
      console.error("[Node Gateway] Error calling Python AI Service:", error.message);
      
      let errorMsg = "AI generation failed. Please try again.";
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
           errorMsg = error.response.data;
        } else if (error.response.data.message) {
           errorMsg = error.response.data.message;
        } else if (error.response.data.error) {
           errorMsg = error.response.data.error;
        }
      }
      
      return res.status(error.response?.status || 500).json({
        success: false,
        error: errorMsg,
        detail: error.response?.data || error.message,
      });
    } finally {
      // ── Clean up the uploaded file ─────────────────────────────────────────
      if (uploadedPersonImage && fs.existsSync(uploadedPersonImage.path)) {
        fs.unlinkSync(uploadedPersonImage.path);
      }
    }
  }
);

// ── Route: GET /api/generate/status/:id ───────────────────────────────────────
router.get("/status/:id", async (req, res) => {
  try {
    const pythonResponse = await axios.get(
      `${PYTHON_AI_SERVICE_URL}/api/try-on/status/${req.params.id}`,
      { responseType: "json" }
    );
    res.json(pythonResponse.data);
  } catch (error) {
    console.error("Error fetching status from Python:", error.message);
    res.status(500).json({ success: false, error: "Failed to fetch status." });
  }
});

module.exports = router;
