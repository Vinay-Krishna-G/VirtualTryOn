import React from "react";
import { createPortal } from "react-dom";

export default function PhotoGuidelines({ onClose, errorReason }) {
  // Use the newly generated real example images
  const goodImageUrl = "/guidelines/good_photo.png";
  const badImageUrl = "/guidelines/bad_photo.png";

  const modalContent = (
    <div
      className="modal-backdrop"
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 99999,
        background: "rgba(0,0,0,0.85)", backdropFilter: "blur(5px)",
        display: "flex", justifyContent: "center", alignItems: "center",
        padding: "1rem"
      }}
    >
      <div
        className="modal-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          maxWidth: "600px", width: "100%",
          padding: "2rem",
          display: "flex", flexDirection: "column", gap: "1.5rem",
          position: "relative"
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "1.5rem", right: "1.5rem",
            background: "transparent", border: "none", color: "var(--color-text-muted)",
            cursor: "pointer"
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div>
          <h2 style={{ fontSize: "1.5rem", fontFamily: "var(--font-serif)", fontStyle: "italic", marginBottom: "0.5rem" }}>
            Photo Rejected
          </h2>
          <p style={{ color: "var(--color-danger)", fontSize: "0.9rem", fontWeight: "600", padding: "0.75rem", background: "rgba(235,87,87,0.1)", borderRadius: "var(--radius-md)", border: "1px solid rgba(235,87,87,0.2)" }}>
            {errorReason || "Your image did not meet the quality standards for a successful try-on."}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          {/* GOOD */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div style={{ position: "relative" }}>
              <img src={goodImageUrl} alt="Good example" style={{ width: "100%", borderRadius: "var(--radius-md)" }} />
              <div style={{ position: "absolute", top: "8px", right: "8px", background: "#2ea043", color: "white", borderRadius: "50%", padding: "4px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
            </div>
            <ul style={{ fontSize: "0.8rem", color: "var(--color-text)", paddingLeft: "1.2rem", margin: 0, lineHeight: 1.6 }}>
              <li>Well-lit environment</li>
              <li>Camera in focus (not blurry)</li>
              <li>Full body visible</li>
            </ul>
          </div>

          {/* BAD */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div style={{ position: "relative" }}>
              <img src={badImageUrl} alt="Bad example" style={{ width: "100%", borderRadius: "var(--radius-md)", opacity: 0.8 }} />
              <div style={{ position: "absolute", top: "8px", right: "8px", background: "#f85149", color: "white", borderRadius: "50%", padding: "4px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </div>
            </div>
            <ul style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", paddingLeft: "1.2rem", margin: 0, lineHeight: 1.6 }}>
              <li>Too dark or backlit</li>
              <li>Blurry / out of focus</li>
              <li>Limbs cropped out</li>
            </ul>
          </div>
        </div>

        <button onClick={onClose} style={{
          background: "var(--color-brand)", color: "white", border: "none",
          padding: "0.75rem", borderRadius: "var(--radius-md)", cursor: "pointer",
          fontWeight: "600", fontSize: "1rem"
        }}>
          Got it, let me try another photo
        </button>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
