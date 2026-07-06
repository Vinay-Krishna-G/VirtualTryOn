/**
 * components/GenerateStep.jsx
 *
 * Why this component exists:
 *   This is Step 3. The user has uploaded their photo and selected
 *   a garment. Now they confirm their choices and click "Generate".
 *
 *   This component:
 *   1. Shows a side-by-side preview of the person photo + selected garment
 *   2. Has a "Generate Virtual Try-On" button
 *   3. Shows a loading animation while the AI is working
 *   4. Calls onGenerate() which triggers the actual API call in App.jsx
 *
 * Input (props):
 *   - uploadedImageUrl (string): the person's photo preview URL
 *   - selectedProduct (object): the chosen garment
 *   - isGenerating (boolean): true while the AI call is in-flight
 *   - onGenerate (function): called when user clicks the Generate button
 *
 * Output:
 *   - Confirmation UI with a big generate button
 */

export default function GenerateStep({
  uploadedImageUrl,
  selectedProduct,
  isGenerating,
  onGenerate,
}) {
  return (
    <div className="animate-fade-in-up" style={{ maxWidth: "700px", margin: "0 auto" }}>
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "700",
          color: "#f8fafc",
          marginBottom: "0.5rem",
          textAlign: "center",
        }}
      >
        Ready to Generate
      </h2>
      <p
        style={{
          color: "#94a3b8",
          textAlign: "center",
          marginBottom: "2.5rem",
          fontSize: "0.9rem",
        }}
      >
        Our AI will show you wearing the selected garment
      </p>

      {/* --- Side-by-Side Preview --- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "2.5rem",
        }}
      >
        {/* Person Photo */}
        <div className="card" style={{ overflow: "hidden", padding: 0 }}>
          <div
            style={{
              background: "rgba(124,58,237,0.1)",
              padding: "0.6rem 1rem",
              borderBottom: "1px solid rgba(124,58,237,0.2)",
            }}
          >
            <p style={{ color: "#a78bfa", fontSize: "0.8rem", fontWeight: "600" }}>
              📸 Your Photo
            </p>
          </div>
          <img
            src={uploadedImageUrl}
            alt="Your uploaded photo"
            style={{
              width: "100%",
              aspectRatio: "3/4",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>

        {/* Arrow between the two images */}
        <div
          style={{
            fontSize: "2rem",
            color: "#7c3aed",
            textAlign: "center",
            flexShrink: 0,
          }}
        >
          ✨
        </div>

        {/* Selected Garment */}
        <div className="card" style={{ overflow: "hidden", padding: 0 }}>
          <div
            style={{
              background: "rgba(124,58,237,0.1)",
              padding: "0.6rem 1rem",
              borderBottom: "1px solid rgba(124,58,237,0.2)",
            }}
          >
            <p style={{ color: "#a78bfa", fontSize: "0.8rem", fontWeight: "600" }}>
              👘 Selected Garment
            </p>
          </div>
          <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            style={{
              width: "100%",
              aspectRatio: "3/4",
              objectFit: "cover",
              display: "block",
            }}
          />
          <div style={{ padding: "0.75rem 1rem" }}>
            <p style={{ fontWeight: "600", fontSize: "0.9rem", color: "#f8fafc" }}>
              {selectedProduct.name}
            </p>
            <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.2rem" }}>
              {selectedProduct.category}
            </p>
          </div>
        </div>
      </div>

      {/* --- Generate Button or Loading State --- */}
      {isGenerating ? (
        // LOADING STATE: AI is working
        <div style={{ textAlign: "center", padding: "1rem" }}>
          {/* Spinner */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
            <div className="spinner" style={{ width: "56px", height: "56px" }} />
          </div>

          <p style={{ color: "#a78bfa", fontWeight: "600", fontSize: "1.1rem", marginBottom: "0.5rem" }}>
            AI is working its magic...
          </p>
          <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
            This usually takes 10–30 seconds
          </p>

          {/* Animated progress dots */}
          <div
            style={{
              display: "flex",
              gap: "6px",
              justifyContent: "center",
              marginTop: "1.5rem",
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#7c3aed",
                  animation: `pulse-glow 1.2s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        // READY STATE: show the generate button
        <div style={{ textAlign: "center" }}>
          <button
            onClick={onGenerate}
            className="btn-primary"
            id="generate-tryon-button"
            style={{
              fontSize: "1.05rem",
              padding: "1rem 3rem",
              background: "linear-gradient(135deg, #7c3aed, #f59e0b)",
              boxShadow: "0 8px 32px rgba(124,58,237,0.4)",
            }}
          >
            ✨ Generate Virtual Try-On
          </button>
          <p style={{ color: "#4b5563", fontSize: "0.8rem", marginTop: "1rem" }}>
            Powered by AI — results in ~20 seconds
          </p>
        </div>
      )}
    </div>
  );
}
