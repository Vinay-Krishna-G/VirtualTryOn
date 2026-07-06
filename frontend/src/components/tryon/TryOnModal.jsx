/**
 * components/tryon/TryOnModal.jsx
 *
 * Why this file exists:
 *   The Try-On interaction must never navigate away from the product page.
 *   This modal/bottom-sheet lets the user upload their photo and trigger
 *   generation without losing their place.
 *
 *   Mobile:  Slides up from the bottom (bottom sheet pattern)
 *   Desktop: Centered dialog
 *
 * Input (props):
 *   - product (object): the garment being tried on
 *   - onClose (function): close the modal without generating
 *   - onGenerate (function): called with (file) when user taps Generate
 *   - isGenerating (boolean): true while the API call is running
 *
 * Output:
 *   - Modal overlay with photo upload and generate button
 */

import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";

export default function TryOnModal({ product, onClose, onGenerate, isGenerating }) {
  // The file the user selected
  const [selectedFile, setSelectedFile] = useState(null);
  // Local preview URL for the selected file
  const [previewUrl, setPreviewUrl] = useState(null);
  // Whether user is dragging a file over the zone
  const [isDragging, setIsDragging] = useState(false);
  // Validation error message
  const [errorMessage, setErrorMessage] = useState("");

  const fileInputRef = useRef(null);

  /**
   * processFile
   *
   * Why it exists:
   *   Both "click to browse" and "drag & drop" call this function.
   *   Centralizing validation avoids repeating the same checks.
   *
   * Input: file (File object)
   * Output: updates state or sets errorMessage
   */
  const processFile = useCallback((file) => {
    setErrorMessage("");

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please upload an image file (JPG, PNG, or WEBP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("Image too large. Max size is 10MB.");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }, []);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) processFile(file);
  }

  function handleDragOver(e) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }

  function handleGenerateClick() {
    if (!selectedFile) {
      setErrorMessage("Please select a photo first.");
      return;
    }
    onGenerate(selectedFile);
  }

  // Handle body scroll lock and ESC key
  useEffect(() => {
    // Lock scrolling on mount
    document.body.style.overflow = "hidden";
    
    // ESC key to close
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      // Restore scrolling on unmount
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  // Close when clicking the backdrop
  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  const modalContent = (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Try on ${product.name}`}
    >
      <div className="modal-panel">
        {/* ── Modal Header ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.25rem 1.25rem 0",
            marginBottom: "0.5rem",
          }}
        >
          {/* Drag handle (mobile visual cue) */}
          <div>
            <div
              style={{
                width: "36px",
                height: "4px",
                background: "var(--color-border)",
                borderRadius: "2px",
                margin: "0 auto 0.75rem",
              }}
            />
            <h2 style={{ fontSize: "1.05rem", fontWeight: "700", color: "var(--color-text)" }}>
              Welcome to the Virtual Dressing Room
            </h2>
            <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "2px" }}>
              {product.name}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: "var(--color-surface-2)",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              fontSize: "1rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-text-muted)",
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* ── Content ── */}
        <div style={{ padding: "1rem 1.25rem 1.5rem" }}>
          {/* Product thumbnail */}
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              alignItems: "center",
              padding: "0.75rem",
              background: "var(--color-surface-2)",
              borderRadius: "var(--radius-md)",
              marginBottom: "1.25rem",
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{ width: "52px", height: "70px", objectFit: "cover", borderRadius: "8px" }}
            />
            <div>
              <p style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--color-text)" }}>
                {product.name}
              </p>
              <p style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", marginTop: "2px" }}>
                {product.brand}
              </p>
            </div>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="tryon-file-input"
          />

          {/* Upload zone or preview */}
          {previewUrl ? (
            // Photo selected — show preview
            <div style={{ marginBottom: "1.25rem", position: "relative" }}>
              <img
                src={previewUrl}
                alt="Your uploaded photo"
                style={{
                  width: "100%",
                  maxHeight: "260px",
                  objectFit: "cover",
                  borderRadius: "var(--radius-md)",
                  border: "2px solid var(--color-brand)",
                }}
              />
              <button
                onClick={() => fileInputRef.current.click()}
                style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
                  background: "rgba(0,0,0,0.65)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  padding: "0.35rem 0.75rem",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  backdropFilter: "blur(6px)",
                }}
              >
                Change Photo
              </button>
            </div>
          ) : (
            // No photo — show drop zone
            <div
              onClick={() => fileInputRef.current.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              role="button"
              tabIndex={0}
              aria-label="Upload your photo"
              onKeyDown={(e) => e.key === "Enter" && fileInputRef.current.click()}
              style={{
                border: `2px dashed ${isDragging ? "var(--color-brand)" : "var(--color-border)"}`,
                borderRadius: "var(--radius-md)",
                padding: "2.5rem 1.5rem",
                textAlign: "center",
                cursor: "pointer",
                marginBottom: "1.25rem",
                background: isDragging ? "var(--color-brand-light)" : "var(--color-surface-2)",
                transition: "all 0.18s ease",
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📸</div>
              <p style={{ fontWeight: "600", color: "var(--color-brand)", marginBottom: "0.3rem" }}>
                {isDragging ? "Drop your photo!" : "Upload Your Photo"}
              </p>
              <p style={{ fontSize: "0.8rem", color: "var(--color-text-light)" }}>
                Tap to choose or drag & drop
              </p>
            </div>
          )}

          {/* Photo requirements */}
          <div
            style={{
              padding: "0.75rem 1rem",
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: "var(--radius-md)",
              marginBottom: "1.25rem",
            }}
          >
            <p style={{ fontSize: "0.78rem", fontWeight: "700", color: "#15803d", marginBottom: "0.4rem" }}>
              For best results:
            </p>
            {["Stand straight, full body visible", "Plain background preferred", "Good lighting"].map(
              (tip) => (
                <p key={tip} style={{ fontSize: "0.75rem", color: "#16a34a", marginBottom: "0.2rem" }}>
                  ✓ {tip}
                </p>
              )
            )}
          </div>

          {/* Error */}
          {errorMessage && (
            <div
              style={{
                padding: "0.6rem 0.75rem",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "var(--radius-md)",
                color: "#dc2626",
                fontSize: "0.8rem",
                marginBottom: "1rem",
              }}
            >
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Generate button */}
          {isGenerating ? (
            <div style={{ textAlign: "center", padding: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.75rem" }}>
                <div className="spinner" />
              </div>
              <p style={{ fontWeight: "600", color: "var(--color-brand)", fontSize: "0.9rem" }}>
                Generating your try-on...
              </p>
              <p style={{ fontSize: "0.78rem", color: "var(--color-text-light)", marginTop: "0.3rem" }}>
                Usually takes 15–30 seconds
              </p>
            </div>
          ) : (
            <button
              onClick={handleGenerateClick}
              disabled={!selectedFile}
              className="btn-tryon"
              id="generate-btn"
              style={{ width: "100%", padding: "1rem" }}
            >
              ✨ Generate Try-On
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
