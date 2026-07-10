/**
 * components/layout/BottomNavigation.jsx — Professional SVG icons, no emojis
 */

const NAV_ITEMS = [
  {
    id: "home",
    label: "Home",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    id: "cart",
    label: "Bag",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
  },
];

export default function BottomNavigation({ currentPage, onNavigate, theme, onToggleTheme }) {
  const isDark = theme === "dark";

  function handleTap(itemId) {
    if (itemId === "cart") {
      alert("Demo: Bag feature coming soon!");
      return;
    }
    onNavigate(itemId);
  }

  return (
    <nav
      role="navigation"
      aria-label="Bottom navigation"
      className="bottom-nav"
      style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        zIndex: 40, height: "var(--bottom-nav-height)",
        background: isDark ? "rgba(8,8,8,0.93)" : "rgba(250,250,248,0.95)",
        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        borderTop: "1px solid var(--color-border)",
        display: "flex", alignItems: "stretch",
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = currentPage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleTap(item.id)}
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
            style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: "4px", background: "none", border: "none",
              cursor: "pointer", padding: "0.5rem", position: "relative",
              transition: "all 0.2s ease",
              color: isActive ? "var(--color-brand)" : "var(--color-text-muted)",
            }}
          >
            {isActive && (
              <span style={{
                position: "absolute", top: 0, left: "50%",
                transform: "translateX(-50%)",
                width: "24px", height: "2px",
                background: "var(--color-brand)",
                borderRadius: "0 0 2px 2px",
              }} />
            )}
            {item.icon}
            <span style={{
              fontSize: "0.55rem", fontWeight: isActive ? "700" : "500",
              letterSpacing: "0.07em", textTransform: "uppercase",
            }}>
              {item.label}
            </span>
          </button>
        );
      })}

      {/* Theme Toggle */}
      <button
        onClick={onToggleTheme}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: "4px", background: "none", border: "none",
          cursor: "pointer", padding: "0.5rem",
          color: "var(--color-text-muted)", transition: "color 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-brand)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
      >
        {isDark ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        )}
        <span style={{ fontSize: "0.55rem", fontWeight: "500", letterSpacing: "0.07em", textTransform: "uppercase" }}>
          Theme
        </span>
      </button>
    </nav>
  );
}
