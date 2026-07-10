/**
 * components/home/HeroBanner.jsx — Luxury editorial hero
 * Inspired by Net-a-Porter / Mytheresa
 */
import { useState, useEffect } from "react";

const HERO_SLIDES = [
  {
    tag: "New Season",
    headline: "Wear the Future",
    sub: "Upload your photo. Our AI drapes any garment on you in seconds — before you buy.",
    accent: "#b8965a",
  },
  {
    tag: "AI Technology",
    headline: "Your Perfect Fit",
    sub: "No more returns. No more guesswork. See exactly how it looks on your body — instantly.",
    accent: "#b8965a",
  },
  {
    tag: "Virtual Dressing Room",
    headline: "Try Before You Buy",
    sub: "Thousands of styles. One click to visualise them on you with photorealistic accuracy.",
    accent: "#b8965a",
  },
];

export default function HeroBanner({ onExplore }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
        setAnimating(false);
      }, 300);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[activeSlide];

  return (
    <div style={{
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
      position: "relative",
      background: "var(--color-surface)",
      minHeight: "clamp(300px, 46vw, 520px)",
      display: "flex",
      alignItems: "center",
      border: "1px solid var(--color-border)",
    }}>
      {/* Background texture */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: 0, right: 0,
          width: "60%", height: "100%",
          background: "linear-gradient(135deg, transparent 40%, rgba(184,150,90,0.04) 100%)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 80% 50%, rgba(184,150,90,0.06) 0%, transparent 60%)",
        }} />
      </div>

      {/* Left accent bar */}
      <div style={{
        position: "absolute", left: 0, top: "20%", bottom: "20%",
        width: "3px",
        background: "linear-gradient(to bottom, transparent, var(--color-brand), transparent)",
        borderRadius: "0 2px 2px 0",
      }} />

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 2,
        padding: "clamp(2.5rem, 5vw, 5rem) clamp(2rem, 5vw, 5rem)",
        maxWidth: "680px",
        opacity: animating ? 0 : 1,
        transform: animating ? "translateY(8px)" : "translateY(0)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }}>
        {/* Tag */}
        <div style={{ marginBottom: "1.5rem" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            fontSize: "0.65rem", fontWeight: "600",
            color: "var(--color-brand)", textTransform: "uppercase", letterSpacing: "0.16em",
          }}>
            <span style={{
              width: "24px", height: "1px",
              background: "var(--color-brand)", display: "inline-block",
            }} />
            {slide.tag}
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: "var(--font-serif)",
          color: "var(--color-text)",
          fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
          fontWeight: "600",
          lineHeight: "1.08",
          letterSpacing: "-0.01em",
          marginBottom: "1.25rem",
          fontStyle: "italic",
        }}>
          {slide.headline}
        </h1>

        {/* Subtext */}
        <p style={{
          color: "var(--color-text-muted)",
          fontSize: "clamp(0.88rem, 1.5vw, 1rem)",
          lineHeight: "1.7",
          marginBottom: "2.5rem",
          maxWidth: "420px",
          fontWeight: "400",
        }}>
          {slide.sub}
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          <button
            onClick={onExplore}
            style={{
              background: "var(--color-brand)",
              color: "#fff", border: "none",
              padding: "0.8rem 2rem",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.72rem", fontWeight: "600",
              cursor: "pointer", textTransform: "uppercase",
              letterSpacing: "0.1em",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-brand-hover)";
              e.currentTarget.style.boxShadow = "var(--shadow-gold)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--color-brand)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Explore Collection
          </button>
          <button
            style={{
              background: "transparent", color: "var(--color-text-2)",
              border: "1px solid var(--color-border-hover)",
              padding: "0.8rem 1.75rem",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.72rem", fontWeight: "600",
              cursor: "pointer", textTransform: "uppercase",
              letterSpacing: "0.1em", transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--color-brand)";
              e.currentTarget.style.color = "var(--color-brand)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--color-border-hover)";
              e.currentTarget.style.color = "var(--color-text-2)";
            }}
          >
            Try On Now
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: "flex", gap: "2.5rem", marginTop: "3rem",
          paddingTop: "1.75rem",
          borderTop: "1px solid var(--color-border)",
        }}>
          {[["50K+", "Happy Shoppers"], ["98%", "Fit Accuracy"], ["< 60s", "Generation"]].map(([num, label]) => (
            <div key={label}>
              <div style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.5rem", fontWeight: "600",
                color: "var(--color-brand)", lineHeight: 1,
              }}>{num}</div>
              <div style={{
                fontSize: "0.6rem", color: "var(--color-text-muted)",
                fontWeight: "500", letterSpacing: "0.08em",
                textTransform: "uppercase", marginTop: "0.3rem",
              }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide indicators */}
      <div style={{
        position: "absolute", bottom: "1.75rem", right: "1.75rem",
        display: "flex", gap: "8px", zIndex: 3,
      }}>
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveSlide(i)}
            style={{
              width: i === activeSlide ? "28px" : "5px",
              height: "2px",
              borderRadius: "1px",
              background: i === activeSlide ? "var(--color-brand)" : "var(--color-border-hover)",
              border: "none", cursor: "pointer",
              transition: "all 0.35s ease", padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
