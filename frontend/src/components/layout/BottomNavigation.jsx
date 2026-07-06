/**
 * components/layout/BottomNavigation.jsx
 *
 * Why this file exists:
 *   Mobile users navigate with their thumbs, so important actions
 *   live at the bottom of the screen within easy reach.
 *   This is a standard mobile UX pattern (used by Myntra, Amazon, etc.)
 *
 *   On desktop (tablet and wider), this bar is hidden — the header handles it.
 *
 * Input (props):
 *   - currentPage (string): "home" | "product" | "dashboard"
 *   - onNavigate (function): called with the page name when tapped
 *
 * Output:
 *   Fixed bottom bar with 4 navigation items (mobile only)
 */

const NAV_ITEMS = [
  { id: "home",      icon: "🏠", label: "Home" },
  { id: "search",    icon: "🔍", label: "Search" },
  { id: "dashboard", icon: "📊", label: "Dashboard" },
  { id: "cart",      icon: "🛒", label: "Cart" },
];

export default function BottomNavigation({ currentPage, onNavigate }) {
  function handleTap(itemId) {
    if (itemId === "cart" || itemId === "search") {
      alert(`Demo: ${itemId.charAt(0).toUpperCase() + itemId.slice(1)} feature coming soon!`);
      return;
    }
    onNavigate(itemId);
  }

  return (
    <>
      {/* Only visible on mobile (hidden on md+) */}
      <nav
        role="navigation"
        aria-label="Bottom navigation"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          background: "#fff",
          borderTop: "1px solid var(--color-border)",
          boxShadow: "0 -2px 12px rgba(0,0,0,0.08)",
          height: "var(--bottom-nav-height)",
          display: "flex",
          alignItems: "stretch",
        }}
        className="bottom-nav"
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
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "3px",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0.5rem",
                transition: "color 0.15s ease",
                color: isActive ? "var(--color-brand)" : "var(--color-text-light)",
              }}
            >
              <span style={{ fontSize: "1.25rem" }}>{item.icon}</span>
              <span
                style={{
                  fontSize: "0.62rem",
                  fontWeight: isActive ? "700" : "500",
                  letterSpacing: "0.02em",
                }}
              >
                {item.label}
              </span>
              {/* Active indicator dot */}
              {isActive && (
                <span
                  style={{
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    background: "var(--color-brand)",
                    position: "absolute",
                    bottom: "6px",
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Hide bottom nav on tablet/desktop */}
      <style>{`
        @media (min-width: 768px) {
          .bottom-nav { display: none !important; }
          body { padding-bottom: 0 !important; }
        }
      `}</style>
    </>
  );
}
