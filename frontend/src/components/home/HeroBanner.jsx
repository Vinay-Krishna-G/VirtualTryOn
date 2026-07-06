/**
 * components/home/HeroBanner.jsx
 *
 * Why this file exists:
 *   The hero is the first impression — it should communicate value instantly.
 *   We use a clean, bold statement that a shop owner immediately understands.
 *   NOT "AI ENABLED" — that's jargon. Instead: the customer benefit.
 *
 * Input (props):
 *   - onExplore (function): called when "Explore Collection" is clicked
 *
 * Output:
 *   - Full-width banner with headline, subtext, and a CTA button
 */
export default function HeroBanner({ onExplore }) {
  return (
    <div
      style={{
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        position: "relative",
        background: "linear-gradient(135deg, #0d7377 0%, #14b8b8 50%, #0f766e 100%)",
        padding: "1.5rem",
        minHeight: "140px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {/* Decorative circles — subtle depth */}
      <div
        style={{
          position: "absolute",
          top: "-40px",
          right: "-40px",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.07)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-60px",
          right: "20%",
          width: "140px",
          height: "140px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", maxWidth: "480px" }}>
        {/* Emoji + pill */}
        <div style={{ marginBottom: "0.75rem" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              background: "rgba(255,255,255,0.2)",
              padding: "0.2rem 0.6rem",
              borderRadius: "100px",
              fontSize: "0.65rem",
              fontWeight: "600",
              color: "#fff",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            ✨ AI Try-On Available
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            color: "#fff",
            fontSize: "clamp(1.4rem, 4vw, 2rem)",
            fontWeight: "800",
            lineHeight: "1.15",
            letterSpacing: "-0.02em",
            marginBottom: "0.5rem",
            textShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          See Yourself
          <br /> Before You Buy.
        </h1>

        {/* Subtext */}
        <p
          style={{
            color: "rgba(255,255,255,0.9)",
            fontSize: "clamp(0.85rem, 2vw, 1rem)",
            lineHeight: "1.4",
            marginBottom: "1rem",
            maxWidth: "380px",
          }}
        >
          Upload one photo. Try any outfit instantly.
          No guessing. No returns.
        </p>

        {/* CTA */}
        <button
          onClick={onExplore}
          style={{
            background: "#fff",
            color: "var(--color-brand-dark)",
            border: "none",
            padding: "0.6rem 1.25rem",
            borderRadius: "var(--radius-full)",
            fontSize: "0.85rem",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-1px)";
            e.target.style.boxShadow = "0 6px 16px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
          }}
        >
          Explore Collection
        </button>
      </div>
    </div>
  );
}
