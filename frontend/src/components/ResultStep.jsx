/**
 * components/ResultStep.jsx
 *
 * Why this component exists:
 *   This is Step 4 — the payoff! The AI has finished and returned
 *   a generated image of the person wearing the garment.
 *
 *   This component:
 *   1. Shows the result image prominently
 *   2. Lets the user download the result
 *   3. Shows a comparison view (before/after)
 *   4. Has a "Try Another" button to restart the flow
 *
 * Input (props):
 *   - resultImageUrl (string): the AI-generated try-on image URL
 *   - selectedProduct (object): the garment that was applied
 *   - uploadedImageUrl (string): the original photo (for comparison)
 *   - onStartOver (function): called to reset the whole flow
 *
 * Output:
 *   - The final result display with download and restart options
 */

export default function ResultStep({
  resultImageUrl,
  selectedProduct,
  uploadedImageUrl,
  onStartOver,
}) {
  /**
   * handleDownload
   *
   * Why it exists:
   *   Programmatically triggers a file download when the user
   *   clicks "Save Image". We create a temporary <a> element,
   *   set its href to the result URL, and click it.
   *
   * Input: none
   * Output: triggers browser file download
   */
  function handleDownload() {
    const link = document.createElement("a");
    link.href = resultImageUrl;
    link.download = `virtual-tryon-${selectedProduct.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="animate-fade-in-up" style={{ maxWidth: "800px", margin: "0 auto" }}>
      {/* --- Success Header --- */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🎉</div>
        <h2
          style={{
            fontSize: "1.75rem",
            fontWeight: "800",
            color: "#f8fafc",
            marginBottom: "0.5rem",
          }}
        >
          Your Virtual Try-On is Ready!
        </h2>
        <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
          Here's how you look in{" "}
          <span style={{ color: "#a78bfa", fontWeight: "600" }}>
            {selectedProduct.name}
          </span>
        </p>
      </div>

      {/* --- Result Image --- */}
      <div
        className="card"
        style={{
          overflow: "hidden",
          padding: 0,
          marginBottom: "1.5rem",
          boxShadow: "0 0 60px rgba(124,58,237,0.4)",
          border: "2px solid rgba(124,58,237,0.5)",
        }}
      >
        <img
          src={resultImageUrl}
          alt={`Virtual try-on result wearing ${selectedProduct.name}`}
          style={{
            width: "100%",
            maxHeight: "600px",
            objectFit: "contain",
            display: "block",
            background: "#0a0a14",
          }}
        />
      </div>

      {/* --- Before / After Comparison --- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {/* Before */}
        <div className="card" style={{ overflow: "hidden", padding: 0 }}>
          <div
            style={{
              padding: "0.5rem 0.75rem",
              background: "rgba(255,255,255,0.03)",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <p style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "600" }}>
              BEFORE
            </p>
          </div>
          <img
            src={uploadedImageUrl}
            alt="Original photo"
            style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", display: "block" }}
          />
        </div>

        {/* After */}
        <div
          className="card"
          style={{
            overflow: "hidden",
            padding: 0,
            border: "1px solid rgba(124,58,237,0.4)",
          }}
        >
          <div
            style={{
              padding: "0.5rem 0.75rem",
              background: "rgba(124,58,237,0.1)",
              borderBottom: "1px solid rgba(124,58,237,0.2)",
            }}
          >
            <p style={{ fontSize: "0.75rem", color: "#a78bfa", fontWeight: "600" }}>
              AFTER ✨
            </p>
          </div>
          <img
            src={resultImageUrl}
            alt="AI try-on result"
            style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", display: "block" }}
          />
        </div>
      </div>

      {/* --- Action Buttons --- */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {/* Download button */}
        <button
          onClick={handleDownload}
          className="btn-primary"
          id="download-result-button"
          style={{ padding: "0.875rem 2rem" }}
        >
          ⬇️ Save Image
        </button>

        {/* Share button (placeholder for future functionality) */}
        <button
          onClick={onStartOver}
          style={{
            padding: "0.875rem 2rem",
            borderRadius: "12px",
            border: "1px solid rgba(124,58,237,0.4)",
            background: "rgba(124,58,237,0.1)",
            color: "#a78bfa",
            fontWeight: "600",
            cursor: "pointer",
            fontSize: "0.95rem",
            transition: "all 0.2s ease",
            fontFamily: "var(--font-sans)",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(124,58,237,0.2)";
            e.target.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "rgba(124,58,237,0.1)";
            e.target.style.transform = "translateY(0)";
          }}
          id="try-another-button"
        >
          🔄 Try Another Outfit
        </button>
      </div>

      {/* --- Store CTA (for the demo pitch) --- */}
      <div
        style={{
          marginTop: "2.5rem",
          padding: "1.25rem",
          background:
            "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(245,158,11,0.1))",
          border: "1px solid rgba(124,58,237,0.25)",
          borderRadius: "16px",
          textAlign: "center",
        }}
      >
        <p style={{ color: "#f59e0b", fontWeight: "700", fontSize: "1rem", marginBottom: "0.4rem" }}>
          ✨ Love the look?
        </p>
        <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
          Visit the store to purchase{" "}
          <span style={{ color: "#a78bfa", fontWeight: "600" }}>{selectedProduct.name}</span>
        </p>
      </div>
    </div>
  );
}
