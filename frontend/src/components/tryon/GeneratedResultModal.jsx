/**
 * components/tryon/GeneratedResultModal.jsx
 *
 * Why this file exists:
 *   After the AI generates the try-on image, we show the result
 *   in this modal without navigating away from the product page.
 *   The user can download the result, try again, or go straight to "Buy Now".
 *
 * Input (props):
 *   - product (object): the garment that was tried on
 *   - originalImageUrl (string): the user's uploaded photo (for before/after)
 *   - resultImageUrl (string): the AI-generated image URL
 *   - onClose (function): close and return to product details
 *   - onTryAgain (function): close result and re-open upload modal
 *
 * Output:
 *   - Modal showing before/after comparison with action buttons
 */

import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function GeneratedResultModal({
  product,
  originalImageUrl,
  resultImageUrl,
  onClose,
  onTryAgain,
}) {
  /**
   * handleDownload
   *
   * Why it exists:
   *   Creates a temporary anchor tag to trigger a file download.
   *   This is the standard browser technique for downloading files
   *   that are already loaded in memory.
   *
   * Input: none
   * Output: triggers browser download dialog
   */
  function handleDownload() {
    const link = document.createElement("a");
    link.href = resultImageUrl;
    link.download = `tryon-${product.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  const modalContent = (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Try-on result"
    >
      <div className="modal-panel" style={{ maxWidth: "560px" }}>
        {/* ── Header ── */}
        <div
          style={{
            padding: "1.25rem 1.25rem 0",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "0.75rem",
          }}
        >
          <div>
            <div
              style={{
                width: "36px",
                height: "4px",
                background: "var(--color-border)",
                borderRadius: "2px",
                margin: "0 auto 0.75rem 0",
              }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "1.4rem" }}>🎉</span>
              <h2 style={{ fontSize: "1.05rem", fontWeight: "700", color: "var(--color-text)" }}>
                Your Look is Ready!
              </h2>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "3px" }}>
              {product.name}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close result"
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

        {/* ── Before / After Comparison ── */}
        <div style={{ padding: "0 1.25rem", marginBottom: "1.25rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            {/* Before */}
            <div>
              <p
                style={{
                  fontSize: "0.7rem",
                  fontWeight: "700",
                  color: "var(--color-text-light)",
                  textAlign: "center",
                  marginBottom: "0.4rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Original
              </p>
              <img
                src={originalImageUrl}
                alt="Original photo"
                style={{
                  width: "100%",
                  aspectRatio: "3/4",
                  objectFit: "cover",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border)",
                }}
              />
            </div>

            {/* After */}
            <div>
              <p
                style={{
                  fontSize: "0.7rem",
                  fontWeight: "700",
                  color: "var(--color-brand)",
                  textAlign: "center",
                  marginBottom: "0.4rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                ✨ Try-On
              </p>
              <img
                src={resultImageUrl}
                alt="AI generated try-on result"
                style={{
                  width: "100%",
                  aspectRatio: "3/4",
                  objectFit: "cover",
                  borderRadius: "var(--radius-md)",
                  border: "2px solid var(--color-brand)",
                  boxShadow: "0 0 20px rgba(13,115,119,0.2)",
                }}
              />
            </div>
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div
          style={{
            padding: "0 1.25rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.6rem",
          }}
        >
          {/* Buy Now — primary action */}
          <button
            onClick={() => alert("Demo: This would open the checkout flow!")}
            className="btn-primary"
            id="result-buy-now-btn"
            style={{ width: "100%", padding: "1rem", fontSize: "1rem" }}
          >
            🛒 Buy Now — {/* price inline */}
            {product ? `₹${product.price.toLocaleString("en-IN")}` : ""}
          </button>

          {/* Secondary actions row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
            <button
              onClick={handleDownload}
              className="btn-outline"
              id="download-result-btn"
              style={{ padding: "0.75rem", fontSize: "0.85rem" }}
            >
              ⬇️ Save Image
            </button>
            <button
              onClick={onTryAgain}
              style={{
                padding: "0.75rem",
                borderRadius: "var(--radius-md)",
                border: "1.5px solid var(--color-border)",
                background: "transparent",
                color: "var(--color-text-muted)",
                fontWeight: "600",
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "all 0.18s ease",
                fontFamily: "var(--font)",
              }}
              onMouseEnter={(e) => (e.target.style.borderColor = "var(--color-brand)")}
              onMouseLeave={(e) => (e.target.style.borderColor = "var(--color-border)")}
            >
              🔁 Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
