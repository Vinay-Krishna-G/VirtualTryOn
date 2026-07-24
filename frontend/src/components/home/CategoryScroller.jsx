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
      {categories.map((catObj) => {
        // Support both old string array and new object array {name, count}
        const category = typeof catObj === "string" ? catObj : catObj.name;
        const count = typeof catObj === "object" ? catObj.count : null;
        
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
              gap: "6px",
              padding: "0.55rem 1.25rem",
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
              background: isActive ? "var(--color-brand)" : "var(--color-surface)",
              color: isActive ? "#fff" : "var(--color-text)",
              boxShadow: isActive ? "var(--shadow-gold)" : "none",
            }}
          >
            {category}
            {count !== null && (
              <span style={{ 
                opacity: 0.6, fontSize: "0.85em", 
                background: isActive ? "rgba(255,255,255,0.2)" : "var(--color-surface-2)",
                padding: "0.1rem 0.35rem", borderRadius: "10px"
              }}>
                {count}
              </span>
            )}
          </button>
        );
      })}
      <style>{`
        div[role="tablist"]::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
