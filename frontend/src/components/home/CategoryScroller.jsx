/**
 * components/home/CategoryScroller.jsx — Luxury dark redesign
 */
export default function CategoryScroller({ categories, activeCategory, onSelect }) {
  const ICONS = {
    "All": "✦",
    "Sarees": "🥻",
    "Lehengas": "👰",
    "Kurtis": "👚",
    "Suits": "🎽",
    "Shirts": "👔",
    "Blazers": "🧥",
    "Jeans": "👖",
    "T-Shirts": "👕",
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "0.5rem",
        overflowX: "auto",
        paddingBottom: "4px",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        WebkitOverflowScrolling: "touch",
      }}
      role="tablist"
      aria-label="Product categories"
    >
      {categories.map((category) => {
        const isActive = activeCategory === category;
        const icon = ICONS[category] || "✦";

        return (
          <button
            key={category}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(category)}
            style={{
              flexShrink: 0,
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "0.45rem 1.1rem",
              borderRadius: "var(--radius-full)",
              border: isActive
                ? "1px solid rgba(201,169,110,0.5)"
                : "1px solid var(--color-border)",
              cursor: "pointer",
              fontSize: "0.78rem",
              fontWeight: "600",
              transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
              whiteSpace: "nowrap",
              letterSpacing: "0.03em",
              background: isActive
                ? "linear-gradient(135deg, rgba(201,169,110,0.15), rgba(201,169,110,0.08))"
                : "var(--color-glass)",
              backdropFilter: "blur(8px)",
              color: isActive ? "var(--color-brand)" : "var(--color-text-muted)",
              boxShadow: isActive ? "0 0 12px rgba(201,169,110,0.15)" : "none",
            }}
          >
            <span style={{ fontSize: "0.85rem" }}>{icon}</span>
            {category}
          </button>
        );
      })}

      <style>{`
        div[role="tablist"]::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
