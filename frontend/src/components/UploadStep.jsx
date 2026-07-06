/**
 * components/UploadStep.jsx
 *
 * Why this component exists:
 *   This is Step 1 of our flow. The user uploads their photo here.
 *   We need to:
 *   1. Let the user click to open a file picker
 *   2. Let the user drag-and-drop an image file
 *   3. Show a preview of the uploaded image
 *   4. Validate that it's actually an image file
 *   5. Call onUpload() when done so the parent (App.jsx) knows
 *
 * Input (props):
 *   - onUpload (function): called with (file, previewUrl) when user picks an image
 *   - uploadedImageUrl (string|null): if set, we show the existing preview
 *
 * Output:
 *   - A drag-and-drop zone with preview, or instructions if no image yet
 */

import { useState, useRef, useCallback } from "react";

export default function UploadStep({ onUpload, uploadedImageUrl }) {
  // isDragging = true when the user drags a file over the drop zone
  const [isDragging, setIsDragging] = useState(false);

  // errorMessage = shown when user uploads something that isn't an image
  const [errorMessage, setErrorMessage] = useState("");

  // fileInputRef lets us programmatically click the hidden <input type="file">
  const fileInputRef = useRef(null);

  /**
   * validateAndProcess
   *
   * Why it exists:
   *   Whether the user clicks to browse OR drags a file,
   *   we run the same validation logic. So we pull it into one function.
   *
   * Input:
   *   - file (File object): the raw file from the browser
   *
   * Output:
   *   - Calls onUpload(file, previewUrl) if valid
   *   - Sets errorMessage if invalid
   */
  const validateAndProcess = useCallback(
    (file) => {
      setErrorMessage("");

      // Check it's an image type (image/jpeg, image/png, image/webp, etc.)
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Please upload an image file (JPG, PNG, or WEBP).");
        return;
      }

      // File size check — 10MB limit
      const tenMB = 10 * 1024 * 1024;
      if (file.size > tenMB) {
        setErrorMessage("Image is too large. Please use a file under 10MB.");
        return;
      }

      // URL.createObjectURL() creates a temporary browser URL for the file
      // so we can display it in an <img> tag without uploading it yet.
      const previewUrl = URL.createObjectURL(file);
      onUpload(file, previewUrl);
    },
    [onUpload]
  );

  // Called when the user picks a file from the OS file picker
  function handleFileInputChange(event) {
    const file = event.target.files[0];
    if (file) {
      validateAndProcess(file);
    }
  }

  // Called when something is dragged over our drop zone
  function handleDragOver(event) {
    // Prevent browser default (which would open the file)
    event.preventDefault();
    setIsDragging(true);
  }

  // Called when the drag leaves our drop zone
  function handleDragLeave() {
    setIsDragging(false);
  }

  // Called when the user drops a file onto our drop zone
  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);

    // dataTransfer.files contains the dropped files
    const file = event.dataTransfer.files[0];
    if (file) {
      validateAndProcess(file);
    }
  }

  // Programmatically open the file picker when user clicks the zone
  function handleZoneClick() {
    fileInputRef.current.click();
  }

  return (
    <div className="animate-fade-in-up" style={{ maxWidth: "520px", margin: "0 auto" }}>
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "700",
          color: "#f8fafc",
          marginBottom: "0.5rem",
          textAlign: "center",
        }}
      >
        Upload Your Photo
      </h2>
      <p
        style={{
          color: "#94a3b8",
          textAlign: "center",
          marginBottom: "2rem",
          fontSize: "0.9rem",
        }}
      >
        Use a full-body photo for the best try-on results
      </p>

      {/* --- Hidden file input --- */}
      {/* We hide this and trigger it programmatically for better styling */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        style={{ display: "none" }}
        id="photo-upload-input"
      />

      {/* --- Drop Zone or Preview --- */}
      {uploadedImageUrl ? (
        // CASE A: User has already uploaded a photo — show the preview
        <div
          style={{
            borderRadius: "16px",
            overflow: "hidden",
            border: "2px solid rgba(124,58,237,0.5)",
            boxShadow: "0 0 40px rgba(124,58,237,0.2)",
            position: "relative",
          }}
        >
          <img
            src={uploadedImageUrl}
            alt="Your uploaded photo"
            style={{ width: "100%", maxHeight: "400px", objectFit: "cover", display: "block" }}
          />
          {/* Change photo button */}
          <button
            onClick={handleZoneClick}
            style={{
              position: "absolute",
              bottom: "16px",
              right: "16px",
              background: "rgba(0,0,0,0.75)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "8px",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              fontSize: "0.85rem",
              backdropFilter: "blur(8px)",
            }}
          >
            Change Photo
          </button>
        </div>
      ) : (
        // CASE B: No photo yet — show the drag-and-drop zone
        <div
          onClick={handleZoneClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          aria-label="Upload photo drop zone"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleZoneClick()}
          style={{
            border: `2px dashed ${isDragging ? "#7c3aed" : "rgba(124,58,237,0.4)"}`,
            borderRadius: "16px",
            padding: "4rem 2rem",
            textAlign: "center",
            cursor: "pointer",
            background: isDragging
              ? "rgba(124,58,237,0.1)"
              : "rgba(255,255,255,0.02)",
            transition: "all 0.2s ease",
            transform: isDragging ? "scale(1.01)" : "scale(1)",
          }}
        >
          {/* Upload icon */}
          <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>📸</div>

          <p style={{ color: "#a78bfa", fontWeight: "600", marginBottom: "0.5rem" }}>
            {isDragging ? "Drop your photo here!" : "Drag & drop your photo here"}
          </p>
          <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
            or click anywhere to browse
          </p>

          <div
            style={{
              display: "inline-flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {["JPG", "PNG", "WEBP"].map((format) => (
              <span
                key={format}
                style={{
                  background: "rgba(124,58,237,0.15)",
                  border: "1px solid rgba(124,58,237,0.3)",
                  color: "#a78bfa",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  fontWeight: "500",
                }}
              >
                {format}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* --- Error Message --- */}
      {errorMessage && (
        <div
          style={{
            marginTop: "1rem",
            padding: "0.75rem 1rem",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "8px",
            color: "#fca5a5",
            fontSize: "0.875rem",
          }}
        >
          ⚠️ {errorMessage}
        </div>
      )}

      {/* --- Tips --- */}
      <div
        style={{
          marginTop: "1.5rem",
          padding: "1rem",
          background: "rgba(245,158,11,0.08)",
          border: "1px solid rgba(245,158,11,0.2)",
          borderRadius: "12px",
        }}
      >
        <p style={{ color: "#f59e0b", fontWeight: "600", marginBottom: "0.5rem", fontSize: "0.85rem" }}>
          💡 Tips for best results
        </p>
        <ul style={{ color: "#94a3b8", fontSize: "0.8rem", paddingLeft: "1.25rem" }}>
          <li>Stand against a plain background</li>
          <li>Make sure your full body is visible</li>
          <li>Use good lighting</li>
        </ul>
      </div>
    </div>
  );
}
