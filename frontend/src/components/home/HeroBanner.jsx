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
        padding: "2.5rem 2rem",
        minHeight: "200px",
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
              gap: "5px",
              background: "rgba(255,255,255,0.2)",
              color: "#fff",
              padding: "0.25rem 0.75rem",
              borderRadius: "var(--radius-full)",
              fontSize: "0.75rem",
              fontWeight: "700",
              letterSpacing: "0.04em",
            }}
          >
            ✨ AI Try-On Available
          </span>
        </div>

        {/* Headline */}
        <h2
          style={{
            fontSize: "clamp(1.4rem, 5vw, 2rem)",
            fontWeight: "800",
            color: "#fff",
            lineHeight: "1.2",
            letterSpacing: "-0.02em",
            marginBottom: "0.75rem",
          }}
        >
          See Yourself<br />Before You Buy
        </h2>

        {/* Subtext */}
        <p
          style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: "0.9rem",
            lineHeight: "1.6",
            marginBottom: "1.5rem",
            maxWidth: "340px",
          }}
        >
          Upload one photo. Try any outfit instantly.
          No guessing. No returns.
        </p>

        {/* CTA */}
        <button
          onClick={onExplore}
          id="hero-explore-btn"
          style={{
            background: "#fff",
            color: "var(--color-brand-dark)",
            fontWeight: "700",
            fontSize: "0.875rem",
            padding: "0.75rem 1.75rem",
            borderRadius: "var(--radius-md)",
            border: "none",
            cursor: "pointer",
            transition: "all 0.18s ease",
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            letterSpacing: "0.01em",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
          }}
        >
          Explore Collection →
        </button>
      </div>
    </div>
  );
}
