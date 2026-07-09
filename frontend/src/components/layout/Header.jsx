/**
 * components/layout/Header.jsx
 * — Professional SVG logo, no search bar, no dashboard link
 * — Theme toggle, glassmorphism scroll effect
 */
import { useState, useEffect } from "react";

// Professional SVG logo mark
function LogoMark() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="36" rx="10" fill="url(#logo-grad)" />
      {/* Dress silhouette */}
      <path
        d="M18 6 L22 11 L26 9 L24 15 L28 28 H8 L12 15 L10 9 L14 11 Z"
        fill="rgba(255,255,255,0.25)"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      <path
        d="M14 11 Q18 13 22 11 L24 15 Q18 18 12 15 Z"
        fill="rgba(255,255,255,0.15)"
      />
      {/* Sparkle dots */}
      <circle cx="10" cy="12" r="1" fill="rgba(255,255,255,0.8)" />
      <circle cx="26" cy="11" r="0.75" fill="rgba(255,255,255,0.7)" />
      <circle cx="28" cy="20" r="0.6" fill="rgba(255,255,255,0.5)" />
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="36" y2="36">
          <stop offset="0%" stopColor="#c9a96e" />
          <stop offset="100%" stopColor="#a8813d" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Header({ onNavigateHome, currentPage, theme, onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isDark = theme === "dark";

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        height: "var(--header-height)",
        background: scrolled
          ? isDark ? "rgba(10,10,11,0.90)" : "rgba(247,245,242,0.92)"
          : isDark ? "rgba(10,10,11,0.55)" : "rgba(247,245,242,0.75)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: scrolled
          ? `1px solid var(--color-border-hover)`
          : "1px solid transparent",
        transition: "all 0.3s ease",
        animation: "fadeInDown 0.4s ease forwards",
      }}
    >
      <div
        style={{
          maxWidth: "var(--max-width)",
          margin: "0 auto",
          padding: "0 1.25rem",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        {/* ── Logo ── */}
        <button
          onClick={onNavigateHome}
          aria-label="VirtualFit Home"
          style={{ display: "flex", alignItems: "center", gap: "10px", background: "none", border: "none", padding: 0, cursor: "pointer", flexShrink: 0 }}
        >
          <LogoMark />
          <div style={{ lineHeight: 1.1 }}>
            <div style={{
              fontSize: "1.05rem", fontWeight: "800",
              fontFamily: "var(--font-serif)",
              color: "var(--color-text)", letterSpacing: "-0.02em",
            }}>
              VirtualFit
            </div>
            <div style={{
              fontSize: "0.52rem", fontWeight: "700",
              color: "var(--color-brand)", letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}>
              AI Fashion
            </div>
          </div>
        </button>

        {/* ── Center Nav (Desktop only) ── */}
        <nav className="header-nav" style={{ display: "none", gap: "2rem" }}>
          {["New Arrivals", "Sarees", "Kurtis", "Lehengas"].map((item) => (
            <button
              key={item}
              style={{
                background: "none", border: "none",
                color: "var(--color-text-muted)",
                fontSize: "0.8rem", fontWeight: "500",
                letterSpacing: "0.04em", cursor: "pointer",
                padding: "0.25rem 0", transition: "color 0.2s",
                textTransform: "uppercase",
              }}
              onMouseEnter={(e) => (e.target.style.color = "var(--color-text)")}
              onMouseLeave={(e) => (e.target.style.color = "var(--color-text-muted)")}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* ── Right Side: Theme Toggle + Cart ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {/* Theme Toggle */}
          <button
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            title={`Switch to ${isDark ? "light" : "dark"} mode`}
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          {/* Cart */}
          <button
            aria-label="Shopping cart"
            onClick={() => alert("Demo: Cart feature!")}
            style={{
              position: "relative",
              background: "var(--color-glass)",
              border: "1px solid var(--color-glass-border)",
              borderRadius: "var(--radius-sm)",
              width: "38px", height: "38px",
              fontSize: "1rem", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--color-border-brand)";
              e.currentTarget.style.background = "var(--color-brand-light)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--color-glass-border)";
              e.currentTarget.style.background = "var(--color-glass)";
            }}
          >
            🛒
          </button>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) { .header-nav { display: flex !important; } }
      `}</style>
    </header>
  );
}
