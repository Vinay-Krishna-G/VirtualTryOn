/**
 * App.jsx
 *
 * Why this file exists:
 *   This is the ROOT component of our React app.
 *   It's responsible for:
 *   1. Keeping track of WHERE the user is in the flow (which step)
 *   2. Storing the data collected at each step (uploaded image, selected product)
 *   3. Calling the Node.js backend when the user clicks "Generate"
 *   4. Rendering the correct step component based on the current step
 *
 * The 4-step flow:
 *   Step 1: Upload Photo     → UploadStep.jsx
 *   Step 2: Select Garment   → SelectGarmentStep.jsx
 *   Step 3: Generate         → GenerateStep.jsx
 *   Step 4: Result           → ResultStep.jsx
 *
 * Data flow:
 *   App.jsx holds all state (like a manager).
 *   It passes data DOWN to child components via props.
 *   Child components call functions passed as props to send data UP.
 */

import { useState } from "react";
import axios from "axios";

import StepIndicator from "./components/StepIndicator";
import UploadStep from "./components/UploadStep";
import SelectGarmentStep from "./components/SelectGarmentStep";
import GenerateStep from "./components/GenerateStep";
import ResultStep from "./components/ResultStep";

import { products, getCategories } from "./data/products";

// ─── State Explanation ───────────────────────────────────────────────────────
// currentStep   → which step (1–4) the user is on
// uploadedFile  → the raw File object from the browser (used for API calls)
// uploadedImageUrl → temporary local URL for previewing the image in the UI
// selectedProduct → the garment object the user selected
// isGenerating  → true while we're waiting for the AI result
// resultImageUrl → the URL of the AI-generated image
// errorMessage  → any error to show to the user
// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImageUrl, setResultImageUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const categories = getCategories();

  // ─── Step 1 Handler ─────────────────────────────────────────────────────────
  /**
   * handleUpload
   *
   * Why it exists:
   *   Called by UploadStep when the user selects a photo.
   *   We store the file and preview URL, then advance to step 2.
   *
   * Input:
   *   - file (File): the raw image file
   *   - previewUrl (string): temporary browser URL for preview
   *
   * Output:
   *   - Updates state, moves to step 2
   */
  function handleUpload(file, previewUrl) {
    setUploadedFile(file);
    setUploadedImageUrl(previewUrl);
    setCurrentStep(2);
  }

  // ─── Step 2 Handler ─────────────────────────────────────────────────────────
  /**
   * handleSelectProduct
   *
   * Why it exists:
   *   Called by SelectGarmentStep when the user clicks a product card.
   *   We store the selection but DON'T advance the step automatically —
   *   the user needs to explicitly click "Continue" first.
   *
   * Input:
   *   - product (object): the selected product from products.js
   *
   * Output:
   *   - Updates selectedProduct state
   */
  function handleSelectProduct(product) {
    setSelectedProduct(product);
  }

  /**
   * handleContinueToGenerate
   *
   * Why it exists:
   *   Separate function to advance from step 2 to step 3.
   *   This way we can validate that a product IS selected.
   *
   * Input: none
   * Output: moves to step 3 if a product is selected
   */
  function handleContinueToGenerate() {
    if (!selectedProduct) return;
    setCurrentStep(3);
  }

  // ─── Step 3 Handler ─────────────────────────────────────────────────────────
  /**
   * handleGenerate
   *
   * Why it exists:
   *   This is the core function that calls the Node.js backend.
   *   The backend then calls the Python AI service.
   *
   *   Why we use FormData:
   *     Regular JSON cannot contain binary file data.
   *     FormData is a special format (multipart/form-data) that allows
   *     mixing text fields AND file data in one HTTP request.
   *
   *   Why we use axios:
   *     axios is a library that makes HTTP calls easier than the browser's
   *     built-in fetch(). It handles JSON parsing and error handling for us.
   *     We installed it with: npm install axios
   *
   * Input: none (reads from state: uploadedFile + selectedProduct)
   * Output:
   *   - On success: sets resultImageUrl and moves to step 4
   *   - On failure: sets errorMessage
   */
  async function handleGenerate() {
    setIsGenerating(true);
    setErrorMessage("");

    try {
      // Build the multipart form payload
      const formData = new FormData();

      // "personImage" = the key the Node backend expects
      formData.append("personImage", uploadedFile);

      // "productId" = tells the backend which garment image to use
      formData.append("productId", selectedProduct.id);

      // POST to Node.js backend
      // Because of the Vite proxy in vite.config.js:
      //   /api/generate → http://localhost:3001/api/generate
      const response = await axios.post("/api/generate", formData, {
        // Tell the browser this is a file upload, not JSON
        headers: { "Content-Type": "multipart/form-data" },
        // responseType: "blob" tells axios to return raw binary data
        // (the generated image file), not try to parse it as JSON
        responseType: "blob",
      });

      // Convert the raw binary response into a URL we can use in <img>
      const imageBlob = response.data;
      const generatedUrl = URL.createObjectURL(imageBlob);

      setResultImageUrl(generatedUrl);
      setCurrentStep(4);
    } catch (error) {
      // Log for debugging — this shows up in the browser DevTools console
      console.error("Generation failed:", error);
      setErrorMessage(
        "Something went wrong during generation. Please try again."
      );
    } finally {
      // Always set isGenerating to false when done, whether success or failure
      setIsGenerating(false);
    }
  }

  // ─── Reset Handler ───────────────────────────────────────────────────────────
  /**
   * handleStartOver
   *
   * Why it exists:
   *   After seeing the result, the user might want to try another outfit.
   *   This resets all state back to the beginning.
   *
   * Input: none
   * Output: all state reset, back to step 1
   */
  function handleStartOver() {
    setCurrentStep(1);
    setUploadedFile(null);
    setUploadedImageUrl(null);
    setSelectedProduct(null);
    setResultImageUrl(null);
    setErrorMessage("");
    setIsGenerating(false);
  }

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", fontFamily: "var(--font-sans)" }}>
      {/* ── Header ── */}
      <header
        style={{
          borderBottom: "1px solid rgba(124,58,237,0.2)",
          background: "rgba(15,15,26,0.8)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "1rem 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo / Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #7c3aed, #f59e0b)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
              }}
            >
              👘
            </div>
            <div>
              <h1
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "800",
                  color: "#f8fafc",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                VirtualFit
              </h1>
              <p style={{ fontSize: "0.65rem", color: "#7c3aed", fontWeight: "500" }}>
                AI-Powered Try-On
              </p>
            </div>
          </div>

          {/* Demo badge */}
          <div
            style={{
              background: "rgba(245,158,11,0.15)",
              border: "1px solid rgba(245,158,11,0.3)",
              color: "#f59e0b",
              padding: "0.3rem 0.75rem",
              borderRadius: "999px",
              fontSize: "0.75rem",
              fontWeight: "600",
            }}
          >
            DEMO
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem 4rem" }}>
        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Error Banner */}
        {errorMessage && (
          <div
            style={{
              maxWidth: "600px",
              margin: "0 auto 2rem",
              padding: "1rem 1.25rem",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "12px",
              color: "#fca5a5",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            ⚠️ {errorMessage}
          </div>
        )}

        {/* ── Step 1: Upload Photo ── */}
        {currentStep === 1 && (
          <UploadStep
            onUpload={handleUpload}
            uploadedImageUrl={uploadedImageUrl}
          />
        )}

        {/* ── Step 2: Select Garment ── */}
        {currentStep === 2 && (
          <div>
            <SelectGarmentStep
              products={products}
              categories={categories}
              selectedProduct={selectedProduct}
              onSelect={handleSelectProduct}
            />

            {/* Navigation buttons for step 2 */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "2rem",
                maxWidth: "900px",
                margin: "2rem auto 0",
              }}
            >
              {/* Back button */}
              <button
                onClick={() => setCurrentStep(1)}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#94a3b8",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.9rem",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.borderColor = "rgba(124,58,237,0.4)")}
                onMouseLeave={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              >
                ← Back
              </button>

              {/* Continue button */}
              <button
                onClick={handleContinueToGenerate}
                disabled={!selectedProduct}
                className="btn-primary"
                id="continue-to-generate-button"
                style={{ padding: "0.75rem 2rem" }}
              >
                {selectedProduct
                  ? `Continue with ${selectedProduct.name} →`
                  : "Select a garment to continue"}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Generate ── */}
        {currentStep === 3 && (
          <div>
            <GenerateStep
              uploadedImageUrl={uploadedImageUrl}
              selectedProduct={selectedProduct}
              isGenerating={isGenerating}
              onGenerate={handleGenerate}
            />

            {/* Back button (only when not generating) */}
            {!isGenerating && (
              <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                <button
                  onClick={() => setCurrentStep(2)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#64748b",
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.85rem",
                    textDecoration: "underline",
                  }}
                >
                  ← Change garment selection
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Step 4: Result ── */}
        {currentStep === 4 && resultImageUrl && (
          <ResultStep
            resultImageUrl={resultImageUrl}
            selectedProduct={selectedProduct}
            uploadedImageUrl={uploadedImageUrl}
            onStartOver={handleStartOver}
          />
        )}
      </main>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "1.5rem",
          textAlign: "center",
          color: "#374151",
          fontSize: "0.8rem",
        }}
      >
        VirtualFit Demo — Built to show shop owners the future of retail
      </footer>
    </div>
  );
}
