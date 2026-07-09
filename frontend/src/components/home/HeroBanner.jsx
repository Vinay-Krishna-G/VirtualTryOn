/**
 * components/home/HeroBanner.jsx — Luxury editorial hero
 */
import { useState, useEffect } from "react";

const HERO_SLIDES = [
  {
    tag: "New Arrival",
    headline: "Wear the\nFuture of\nFashion",
    sub: "Upload one photo. Our AI drapes any garment on you in seconds.",
    accent: "#c9a96e",
  },
  {
    tag: "AI Powered",
    headline: "Your Perfect\nFit. Before\nYou Buy.",
    sub: "No more returns. No more guessing. See it on you — instantly.",
    accent: "#8b9cf4",
  },
  {
    tag: "Virtual Try-On",
    headline: "Dress Like\nRoyalty,\nEvery Day",
    sub: "Thousands of styles. One click to visualise them on your body.",
    accent: "#c9a96e",
  },
];

export default function HeroBanner({ onExplore }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [animating, setAnimating] = useState(false);

  // Auto-rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
        setAnimating(false);
      }, 300);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[activeSlide];

  return (
    <div
      style={{
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        position: "relative",
        background: "var(--color-surface)",
        minHeight: "clamp(280px, 45vw, 480px)",
        display: "flex",
        alignItems: "center",
        border: "1px solid var(--color-border-brand)",
      }}
    >
      {/* Animated background orbs */}
      <div
        style={{
          position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden",
        }}
      >
        <div style={{
          position: "absolute", top: "-80px", right: "-80px",
          width: "350px", height: "350px", borderRadius: "50%",
          background: `radial-gradient(circle, ${slide.accent}22 0%, transparent 70%)`,
          animation: "float 6s ease-in-out infinite",
          transition: "background 1s ease",
        }} />
        <div style={{
          position: "absolute", bottom: "-100px", left: "10%",
          width: "250px", height: "250px", borderRadius: "50%",
          background: `radial-gradient(circle, ${slide.accent}15 0%, transparent 70%)`,
          animation: "float 8s ease-in-out infinite reverse",
          transition: "background 1s ease",
        }} />
        {/* Grid overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
      </div>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "clamp(2rem, 5vw, 4rem)",
          maxWidth: "600px",
          opacity: animating ? 0 : 1,
          transform: animating ? "translateY(10px)" : "translateY(0)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
        }}
      >
        {/* Tag */}
        <div style={{ marginBottom: "1.25rem" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: `${slide.accent}20`,
              border: `1px solid ${slide.accent}40`,
              padding: "0.3rem 0.85rem",
              borderRadius: "var(--radius-full)",
              fontSize: "0.65rem",
              fontWeight: "700",
              color: slide.accent,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            <span style={{
              width: "5px", height: "5px", borderRadius: "50%",
              background: slide.accent, display: "inline-block",
              animation: "pulse 2s infinite",
            }} />
            {slide.tag}
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            color: "var(--color-text)",
            fontSize: "clamp(2rem, 5.5vw, 3.5rem)",
            fontWeight: "700",
            lineHeight: "1.1",
            letterSpacing: "-0.02em",
            marginBottom: "1rem",
            whiteSpace: "pre-line",
          }}
        >
          {slide.headline.split("\n")[0]}
          <br />
          <span className="text-gold">{slide.headline.split("\n")[1]}</span>
          <br />
          {slide.headline.split("\n")[2]}
        </h1>

        {/* Subtext */}
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "clamp(0.88rem, 1.5vw, 1.05rem)",
            lineHeight: "1.65",
            marginBottom: "2rem",
            maxWidth: "420px",
          }}
        >
          {slide.sub}
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button
            onClick={onExplore}
            style={{
              background: "linear-gradient(135deg, #c9a96e, #e8c987)",
              color: "#1a1208",
              border: "none",
              padding: "0.85rem 2rem",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.8rem",
              fontWeight: "800",
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              boxShadow: "0 8px 30px rgba(201,169,110,0.3)",
              transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(201,169,110,0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(201,169,110,0.3)";
            }}
          >
            Explore Collection
          </button>
          <button
            style={{
              background: "transparent",
              color: "var(--color-text)",
              border: "1px solid var(--color-glass-border)",
              padding: "0.85rem 1.75rem",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.8rem",
              fontWeight: "600",
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              backdropFilter: "blur(8px)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--color-border-brand)";
              e.currentTarget.style.color = "var(--color-brand)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--color-glass-border)";
              e.currentTarget.style.color = "var(--color-text)";
            }}
          >
            ✨ Try On Now
          </button>
        </div>

        {/* Stats row */}
        <div style={{
          display: "flex", gap: "2rem", marginTop: "2.5rem",
          paddingTop: "1.5rem",
          borderTop: "1px solid var(--color-border-hover)",
        }}>
          {[["50K+", "Happy Shoppers"], ["98%", "Fit Accuracy"], ["< 60s", "Generation"]].map(([num, label]) => (
            <div key={label}>
              <div style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.35rem", fontWeight: "700",
                color: "var(--color-brand)",
                lineHeight: 1,
              }}>{num}</div>
              <div style={{
                fontSize: "0.65rem", color: "var(--color-text-light)",
                fontWeight: "500", letterSpacing: "0.04em",
                textTransform: "uppercase", marginTop: "0.2rem",
              }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide indicators */}
      <div style={{
        position: "absolute", bottom: "1.5rem", right: "1.5rem",
        display: "flex", gap: "6px", zIndex: 3,
      }}>
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveSlide(i)}
            style={{
              width: i === activeSlide ? "24px" : "6px",
              height: "6px",
              borderRadius: "3px",
              background: i === activeSlide ? "var(--color-brand)" : "var(--color-border-hover)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
