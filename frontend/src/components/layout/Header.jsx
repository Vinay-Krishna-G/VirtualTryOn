/**
 * components/layout/Header.jsx
 * Professional luxury fashion header — no emojis, clean editorial style
 */
import { useState, useEffect } from "react";

function LogoMark() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="url(#vf-grad)" />
      <path
        d="M16 5 L19.5 10 L24 8 L22 14 L26 26 H6 L10 14 L8 8 L12.5 10 Z"
        fill="rgba(255,255,255,0.22)"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 10 Q16 12 19.5 10 L22 14 Q16 17 10 14 Z"
        fill="rgba(255,255,255,0.12)"
      />
      <defs>
        <linearGradient id="vf-grad" x1="0" y1="0" x2="32" y2="32">
          <stop offset="0%" stopColor="#b8965a" />
          <stop offset="100%" stopColor="#8b6914" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Header({ onNavigateHome, currentPage, theme, onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
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
          ? isDark ? "rgba(8,8,8,0.94)" : "rgba(250,250,248,0.95)"
          : isDark ? "rgba(8,8,8,0.5)" : "rgba(250,250,248,0.7)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: `1px solid ${scrolled ? "var(--color-border)" : "transparent"}`,
        transition: "all 0.3s ease",
        animation: "fadeInDown 0.4s ease forwards",
      }}
    >
      <div
        style={{
          maxWidth: "var(--max-width)",
          margin: "0 auto",
          padding: "0 1.5rem",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        {/* Logo */}
        <button
          onClick={onNavigateHome}
          aria-label="VirtualFit Home"
          style={{
            display: "flex", alignItems: "center", gap: "10px",
            background: "none", border: "none", padding: 0, cursor: "pointer", flexShrink: 0,
          }}
        >
          <LogoMark />
          <div style={{ lineHeight: 1.1 }}>
            <div style={{
              fontSize: "0.95rem",
              fontWeight: "700",
              fontFamily: "var(--font-serif)",
              color: "var(--color-text)",
              letterSpacing: "0.01em",
            }}>
              VirtualFit
            </div>
            <div style={{
              fontSize: "0.5rem",
              fontWeight: "600",
              color: "var(--color-brand)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}>
              AI Fashion
            </div>
          </div>
        </button>

        {/* Center Nav — desktop only */}
        <nav className="header-nav" style={{ display: "none", gap: "2.5rem" }}>
          {["New Arrivals", "Sarees", "Kurtis", "Lehengas"].map((item) => (
            <button
              key={item}
              style={{
                background: "none", border: "none",
                color: "var(--color-text-muted)",
                fontSize: "0.75rem", fontWeight: "500",
                letterSpacing: "0.06em", cursor: "pointer",
                transition: "color 0.2s", textTransform: "uppercase",
              }}
              onMouseEnter={(e) => (e.target.style.color = "var(--color-text)")}
              onMouseLeave={(e) => (e.target.style.color = "var(--color-text-muted)")}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Right: Theme + Cart */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            title={`Switch to ${isDark ? "light" : "dark"} mode`}
          >
            {isDark ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          <button
            aria-label="Search"
            style={{
              background: "none", border: "none",
              cursor: "pointer", color: "var(--color-text-muted)",
              padding: "0.5rem", transition: "color 0.2s",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>

          <button
            aria-label="Shopping bag"
            onClick={() => alert("Demo: Bag feature!")}
            style={{
              position: "relative",
              background: "var(--color-glass)",
              border: "1px solid var(--color-glass-border)",
              borderRadius: "var(--radius-sm)",
              width: "36px", height: "36px",
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
              color: "var(--color-text-muted)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--color-border-brand)";
              e.currentTarget.style.color = "var(--color-brand)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--color-glass-border)";
              e.currentTarget.style.color = "var(--color-text-muted)";
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) { .header-nav { display: flex !important; } }
      `}</style>
    </header>
  );
}
