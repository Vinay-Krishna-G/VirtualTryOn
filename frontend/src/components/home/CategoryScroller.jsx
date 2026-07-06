/**
 * components/home/CategoryScroller.jsx
 *
 * Why this file exists:
 *   Lets users filter products by category.
 *   Horizontal scroll on mobile (no wrapping), flex row on desktop.
 *   The "All" pill is selected by default.
 *
 * Input (props):
 *   - categories (string[]): list from getCategories()
 *   - activeCategory (string): currently selected category
 *   - onSelect (function): called with the category name when tapped
 *
 * Output:
 *   - Horizontally scrollable row of tappable category pills
 */

export default function CategoryScroller({ categories, activeCategory, onSelect }) {
  // Icons for known categories — falls back to 🏷️
  const ICONS = {
    "All": "🛍️",
    "Sarees": "🥻",
    "Lehengas": "👰",
    "Kurtis": "👚",
    "Suits": "🎽",
    "Men's Wear": "👔",
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "0.5rem",
        overflowX: "auto",
        paddingBottom: "4px",   /* prevents scrollbar from clipping pill shadows */
        scrollbarWidth: "none",  /* hide scrollbar on Firefox */
        msOverflowStyle: "none", /* hide scrollbar on IE */
        WebkitOverflowScrolling: "touch",
      }}
      role="tablist"
      aria-label="Product categories"
    >
      {categories.map((category) => {
        const isActive = activeCategory === category;
        const icon = ICONS[category] || "🏷️";

        return (
          <button
            key={category}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(category)}
            style={{
              flexShrink: 0,   /* never wrap or compress */
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "0.45rem 1rem",
              borderRadius: "var(--radius-full)",
              border: "1.5px solid",
              cursor: "pointer",
              fontSize: "0.82rem",
              fontWeight: "600",
              transition: "all 0.18s ease",
              whiteSpace: "nowrap",
              /* Active: filled teal; Inactive: outlined grey */
              background: isActive ? "var(--color-brand)" : "var(--color-surface)",
              borderColor: isActive ? "var(--color-brand)" : "var(--color-border)",
              color: isActive ? "#fff" : "var(--color-text-muted)",
              boxShadow: isActive ? "0 3px 10px rgba(13,115,119,0.3)" : "none",
            }}
          >
            <span style={{ fontSize: "0.9rem" }}>{icon}</span>
            {category}
          </button>
        );
      })}

      {/* Hide scrollbar on webkit (Chrome, Safari) */}
      <style>{`
        div[role="tablist"]::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
