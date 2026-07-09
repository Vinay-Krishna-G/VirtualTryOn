/**
 * components/layout/BottomNavigation.jsx
 * — No search or dashboard, theme toggle included
 */

const NAV_ITEMS = [
  { id: "home",  label: "Home",  emoji: "🏠" },
  { id: "cart",  label: "Cart",  emoji: "🛒" },
];

export default function BottomNavigation({ currentPage, onNavigate, theme, onToggleTheme }) {
  const isDark = theme === "dark";

  function handleTap(itemId) {
    if (itemId === "cart") {
      alert("Demo: Cart feature coming soon!");
      return;
    }
    onNavigate(itemId);
  }

  return (
    <>
      <nav
        role="navigation"
        aria-label="Bottom navigation"
        className="bottom-nav"
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          zIndex: 40, height: "var(--bottom-nav-height)",
          background: isDark ? "rgba(10,10,11,0.90)" : "rgba(247,245,242,0.94)",
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          borderTop: "1px solid var(--color-border-hover)",
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
                  width: "30px", height: "2px",
                  background: "linear-gradient(90deg, #c9a96e, #e8c987)",
                  borderRadius: "0 0 2px 2px",
                  boxShadow: "0 0 8px rgba(201,169,110,0.5)",
                }} />
              )}
              <span style={{ fontSize: "1.2rem" }}>{item.emoji}</span>
              <span style={{
                fontSize: "0.58rem", fontWeight: isActive ? "700" : "500",
                letterSpacing: "0.06em", textTransform: "uppercase",
              }}>
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Theme Toggle in bottom nav */}
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
        >
          <span style={{ fontSize: "1.2rem" }}>{isDark ? "☀️" : "🌙"}</span>
          <span style={{ fontSize: "0.58rem", fontWeight: "500", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Theme
          </span>
        </button>
      </nav>
    </>
  );
}
