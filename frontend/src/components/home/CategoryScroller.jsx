/**
 * components/home/CategoryScroller.jsx — Professional pill filters
 */
export default function CategoryScroller({ categories, activeCategory, onSelect }) {
  return (
    <div
      style={{
        display: "flex", gap: "0.5rem",
        overflowX: "auto", paddingBottom: "4px",
        scrollbarWidth: "none", msOverflowStyle: "none",
        WebkitOverflowScrolling: "touch",
      }}
      role="tablist"
      aria-label="Product categories"
    >
      {categories.map((category) => {
        const isActive = activeCategory === category;
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
              padding: "0.4rem 1rem",
              borderRadius: "var(--radius-full)",
              border: isActive
                ? "1px solid var(--color-border-brand)"
                : "1px solid var(--color-border)",
              cursor: "pointer",
              fontSize: "0.72rem",
              fontWeight: isActive ? "700" : "500",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              background: isActive ? "var(--color-brand-light)" : "transparent",
              color: isActive ? "var(--color-brand)" : "var(--color-text-muted)",
            }}
          >
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
