/**
 * components/tryon/GeneratedResultModal.jsx
 * Premium result experience — full editorial reveal
 */
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function GeneratedResultModal({
  product,
  originalImageUrl,
  resultImageUrl,
  onClose,
  onTryAgain,
}) {
  const [view, setView] = useState("result"); // "result" | "compare"
  const [fullscreen, setFullscreen] = useState(false);
  const [shareMsg, setShareMsg] = useState("");

  async function handleDownload() {
    try {
      setShareMsg("Saving...");
      // Fetch the image to bypass cross-origin download restrictions
      const response = await fetch(resultImageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `virtualfit-${product.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      setShareMsg("Saved!");
      setTimeout(() => setShareMsg(""), 2000);
    } catch (error) {
      console.error("Failed to download image:", error);
      setShareMsg("Failed to save");
      setTimeout(() => setShareMsg(""), 2000);
    }
  }

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") { if (fullscreen) setFullscreen(false); else onClose(); } };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose, fullscreen]);

  function handleBackdropClick(e) { if (e.target === e.currentTarget) onClose(); }

  const price = product ? `₹${product.price.toLocaleString("en-IN")}` : "";

  const modalContent = (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Try-on result"
      style={{ alignItems: "center" }}
    >
      <div
        className="modal-panel"
        style={{
          maxWidth: "600px",
          display: "flex", flexDirection: "column",
          borderRadius: "var(--radius-xl)",
          animation: "scaleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", paddingTop: "0.85rem", flexShrink: 0 }}>
          <div style={{ width: "32px", height: "2.5px", background: "var(--color-border-hover)", borderRadius: "2px" }} />
        </div>

        {/* Header */}
        <div style={{ padding: "0.85rem 1.5rem 0", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.85rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.3rem" }}>
                {/* Success indicator */}
                <div style={{
                  width: "18px", height: "18px", borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--color-brand), var(--color-brand-hover))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                    <polyline points="2,6 5,9 10,3"/>
                  </svg>
                </div>
                <p style={{
                  fontSize: "0.56rem", fontWeight: "700", color: "var(--color-brand)",
                  textTransform: "uppercase", letterSpacing: "0.16em",
                }}>
                  Your Look is Ready
                </p>
              </div>
              <h2 style={{
                fontFamily: "var(--font-serif)", fontStyle: "italic",
                fontSize: "1.25rem", fontWeight: "600", color: "var(--color-text)",
                lineHeight: 1.2,
              }}>
                {product.name}
              </h2>
            </div>

            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                background: "transparent", border: "1px solid var(--color-border)",
                borderRadius: "50%", width: "30px", height: "30px",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--color-text-muted)", cursor: "pointer",
                flexShrink: 0, transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--color-brand)";
                e.currentTarget.style.color = "var(--color-brand)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border)";
                e.currentTarget.style.color = "var(--color-text-muted)";
              }}
            >
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="1" y1="1" x2="11" y2="11"/><line x1="11" y1="1" x2="1" y2="11"/>
              </svg>
            </button>
          </div>

          {/* View toggle */}
          <div style={{
            display: "flex", gap: "0", background: "var(--color-surface-2)",
            border: "1px solid var(--color-border)", borderRadius: "var(--radius-full)",
            padding: "3px", marginBottom: "1rem",
          }}>
            {[
              { id: "result", label: "Try-On Result" },
              { id: "compare", label: "Before / After" },
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                style={{
                  flex: 1, padding: "0.4rem 0.85rem",
                  borderRadius: "var(--radius-full)", border: "none",
                  fontSize: "0.68rem", fontWeight: "600",
                  cursor: "pointer", transition: "all 0.2s ease",
                  textTransform: "uppercase", letterSpacing: "0.06em",
                  background: view === v.id ? "var(--color-brand)" : "transparent",
                  color: view === v.id ? "#fff" : "var(--color-text-muted)",
                }}
              >
                {v.label}
              </button>
            ))}
          </div>

          <div style={{ height: "1px", background: "var(--color-border)", marginBottom: "1rem" }} />
        </div>

        {/* Image area */}
        <div style={{ padding: "0 1.5rem", overflowY: "auto", flex: 1 }}>

          {/* Result view — large single image */}
          {view === "result" && (
            <div style={{ position: "relative", marginBottom: "1rem" }}>
              <img
                src={resultImageUrl}
                alt="Your virtual try-on result"
                style={{
                  width: "100%",
                  maxHeight: "340px",
                  objectFit: "contain",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--color-border-brand)",
                  background: "var(--color-surface-2)",
                  display: "block",
                }}
              />
              {/* Overlay label */}
              <div style={{
                position: "absolute", top: "12px", left: "12px",
                background: "var(--color-brand)", color: "#fff",
                fontSize: "0.58rem", fontWeight: "700",
                padding: "0.2rem 0.6rem", borderRadius: "var(--radius-full)",
                letterSpacing: "0.08em", textTransform: "uppercase",
              }}>
                AI Generated
              </div>
              {/* Expand button */}
              <button
                onClick={() => setFullscreen(true)}
                style={{
                  position: "absolute", top: "12px", right: "12px",
                  background: "rgba(0,0,0,0.65)", color: "#fff",
                  border: "none", borderRadius: "var(--radius-sm)",
                  padding: "0.3rem 0.6rem",
                  display: "flex", alignItems: "center", gap: "5px",
                  cursor: "pointer", backdropFilter: "blur(8px)",
                  fontSize: "0.6rem", fontWeight: "600", letterSpacing: "0.05em",
                }}
                aria-label="View fullscreen"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
                  <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
                </svg>
                Expand
              </button>
            </div>
          )}

          {/* Compare view — side by side */}
          {view === "compare" && (
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                <div>
                  <p style={{
                    fontSize: "0.6rem", fontWeight: "600", color: "var(--color-text-muted)",
                    textTransform: "uppercase", letterSpacing: "0.09em",
                    textAlign: "center", marginBottom: "0.5rem",
                  }}>
                    Original
                  </p>
                  <img
                    src={originalImageUrl}
                    alt="Your original photo"
                    style={{
                      width: "100%", aspectRatio: "3/4", objectFit: "cover",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--color-border)",
                    }}
                  />
                </div>
                <div>
                  <p style={{
                    fontSize: "0.6rem", fontWeight: "600", color: "var(--color-brand)",
                    textTransform: "uppercase", letterSpacing: "0.09em",
                    textAlign: "center", marginBottom: "0.5rem",
                  }}>
                    Virtual Try-On
                  </p>
                  <div style={{ position: "relative" }}>
                    <img
                      src={resultImageUrl}
                      alt="AI generated result"
                      style={{
                        width: "100%", aspectRatio: "3/4", objectFit: "cover",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--color-border-brand)",
                        boxShadow: "var(--shadow-gold)",
                      }}
                    />
                    <button
                      onClick={() => setFullscreen(true)}
                      style={{
                        position: "absolute", top: "8px", right: "8px",
                        background: "rgba(0,0,0,0.65)", color: "#fff",
                        border: "none", borderRadius: "50%",
                        width: "26px", height: "26px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", backdropFilter: "blur(8px)",
                      }}
                      aria-label="View fullscreen"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
                        <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Product summary strip */}
          <div style={{
            display: "flex", gap: "0.85rem", alignItems: "center",
            padding: "0.7rem 0.85rem",
            background: "var(--color-surface-2)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)", marginBottom: "1rem",
          }}>
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: "40px", height: "54px", objectFit: "cover", objectPosition: "top",
                borderRadius: "5px", border: "1px solid var(--color-border)",
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: "0.55rem", fontWeight: "700", color: "var(--color-brand)",
                textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: "0.2rem",
              }}>
                {product.brand}
              </p>
              <p style={{
                fontSize: "0.8rem", fontWeight: "500", color: "var(--color-text)",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {product.name}
              </p>
            </div>
            <p style={{
              fontSize: "1rem", fontWeight: "700", color: "var(--color-text)",
              flexShrink: 0, letterSpacing: "-0.01em",
            }}>
              {price}
            </p>
          </div>
        </div>

        {/* Action buttons — fixed bottom */}
        <div style={{ padding: "0 1.5rem 1.5rem", flexShrink: 0 }}>
          {/* Primary CTA */}
          <button
            onClick={() => alert("Demo: Opening checkout...")}
            className="btn-primary"
            id="result-buy-now-btn"
            style={{ width: "100%", padding: "1rem", fontSize: "0.8rem", marginBottom: "0.6rem" }}
          >
            Buy Now — {price}
          </button>

          {/* Secondary row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
            <button
              onClick={handleDownload}
              className="btn-outline"
              id="download-result-btn"
              style={{ padding: "0.75rem", fontSize: "0.75rem", gap: "6px" }}
            >
              {shareMsg ? shareMsg : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Save Image
                </>
              )}
            </button>
            <button
              onClick={onTryAgain}
              className="btn-outline"
              style={{ padding: "0.75rem", fontSize: "0.75rem", gap: "6px" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <polyline points="1 4 1 10 7 10"/>
                <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
              </svg>
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {createPortal(modalContent, document.body)}

      {/* Fullscreen overlay */}
      {fullscreen && createPortal(
        <div
          style={{
            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
            background: "rgba(0,0,0,0.95)", zIndex: 100000,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "2rem", animation: "fadeIn 0.2s ease forwards",
          }}
          onClick={() => setFullscreen(false)}
        >
          {/* Header bar */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0,
            padding: "1.25rem 1.5rem",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)",
          }}>
            <div>
              <p style={{ fontSize: "0.58rem", fontWeight: "600", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.2rem" }}>
                Virtual Try-On Result
              </p>
              <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "1rem", color: "#fff", fontWeight: "600" }}>
                {product.name}
              </p>
            </div>
            <button
              onClick={() => setFullscreen(false)}
              style={{
                background: "rgba(255,255,255,0.1)", color: "#fff",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "50%", width: "38px", height: "38px",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                backdropFilter: "blur(8px)",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="1" y1="1" x2="11" y2="11"/><line x1="11" y1="1" x2="1" y2="11"/>
              </svg>
            </button>
          </div>

          <img
            src={resultImageUrl}
            alt="Fullscreen virtual try-on"
            style={{
              maxWidth: "100%", maxHeight: "100%", objectFit: "contain",
              borderRadius: "var(--radius-md)",
            }}
            onClick={(e) => e.stopPropagation()}
          />

          {/* Download bar at bottom */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            padding: "1.5rem",
            background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
            display: "flex", justifyContent: "center", gap: "0.75rem",
          }}>
            <button
              onClick={(e) => { e.stopPropagation(); handleDownload(); }}
              style={{
                background: "rgba(255,255,255,0.1)", color: "#fff",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "var(--radius-sm)", padding: "0.6rem 1.25rem",
                fontSize: "0.72rem", fontWeight: "600", cursor: "pointer",
                backdropFilter: "blur(8px)", display: "flex", alignItems: "center", gap: "6px",
                letterSpacing: "0.06em", textTransform: "uppercase",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Save Image
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setFullscreen(false); }}
              style={{
                background: "var(--color-brand)", color: "#fff",
                border: "none",
                borderRadius: "var(--radius-sm)", padding: "0.6rem 1.25rem",
                fontSize: "0.72rem", fontWeight: "600", cursor: "pointer",
                letterSpacing: "0.06em", textTransform: "uppercase",
              }}
            >
              Close
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
