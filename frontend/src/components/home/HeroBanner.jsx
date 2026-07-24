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
      border: "1px solid var(--color-border)",
      display: "flex",
      flexDirection: "column",
    }}>
      
      {/* Container for split layout */}
      <div className="hero-split-container">
        
        {/* Left Content Area */}
        <div style={{
          flex: "1 1 50%",
          padding: "clamp(2.5rem, 5vw, 4rem) clamp(2rem, 5vw, 4rem)",
          position: "relative", zIndex: 2,
          display: "flex", flexDirection: "column", justifyContent: "center"
        }}>
          
          <div style={{
            opacity: animating ? 0 : 1,
            transform: animating ? "translateY(8px)" : "translateY(0)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
            maxWidth: "600px",
          }}>
            {/* Tag */}
            <div style={{ marginBottom: "1.5rem" }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                fontSize: "0.65rem", fontWeight: "600",
                color: "var(--color-brand)", textTransform: "uppercase", letterSpacing: "0.16em",
              }}>
                <span style={{ width: "24px", height: "1px", background: "var(--color-brand)", display: "inline-block" }} />
                {slide.tag}
              </span>
            </div>

            {/* Headline */}
            <h1 style={{
              fontFamily: "var(--font-serif)",
              color: "var(--color-text)",
              fontSize: "clamp(2.4rem, 5vw, 4rem)",
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
              fontSize: "clamp(0.88rem, 1.2vw, 1rem)",
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
            </div>
            
            {/* Slide indicators inside content on desktop */}
            <div style={{
              display: "flex", gap: "8px", marginTop: "3rem",
            }}>
              {HERO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  style={{
                    width: i === activeSlide ? "32px" : "6px",
                    height: "3px",
                    borderRadius: "1.5px",
                    background: i === activeSlide ? "var(--color-brand)" : "var(--color-border-hover)",
                    border: "none", cursor: "pointer",
                    transition: "all 0.35s ease", padding: 0,
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            
          </div>
        </div>

        {/* Right Image Area */}
        <div className="hero-img-container" style={{
          flex: "1 1 50%",
          position: "relative",
          minHeight: "300px",
          overflow: "hidden"
        }}>
          <img 
            src="/hero_lifestyle.png" 
            alt="Fashion editorial model" 
            style={{
              position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center",
            }}
          />
          {/* Subtle gradient overlay to merge image with background */}
          <div style={{
            position: "absolute", top: 0, bottom: 0, left: 0, width: "30%",
            background: "linear-gradient(to right, var(--color-surface) 0%, transparent 100%)",
            opacity: 0.8
          }} className="hero-gradient" />
        </div>
      </div>
      
      {/* Responsive adjustments */}
      <style>{`
        .hero-split-container {
          display: flex;
          flex-direction: column-reverse;
          position: relative;
        }
        @media (min-width: 900px) {
          .hero-split-container {
            flex-direction: row;
          }
          .hero-img-container { min-height: 540px !important; }
        }
        @media (max-width: 899px) {
          .hero-gradient { 
            width: 100% !important; height: 30% !important;
            background: linear-gradient(to top, var(--color-surface) 0%, transparent 100%) !important;
            top: auto !important;
          }
        }
      `}</style>
    </div>
  );
}
