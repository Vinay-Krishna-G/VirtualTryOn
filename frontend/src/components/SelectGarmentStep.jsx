/**
 * components/SelectGarmentStep.jsx
 *
 * Why this component exists:
 *   This is Step 2 of our flow. After uploading their photo,
 *   the user picks which garment they want to try on.
 *
 *   We show a grid of product cards with:
 *   - Category filter buttons at the top
 *   - Each card shows the garment image, name, and tags
 *   - Selected card is highlighted with a purple border and glow
 *
 * Input (props):
 *   - products (array): list of all garment objects from products.js
 *   - categories (string[]): filter categories like ["All", "Saree", ...]
 *   - selectedProduct (object|null): the currently selected garment
 *   - onSelect (function): called with (product) when user clicks a card
 *
 * Output:
 *   - A filterable product grid with interactive selection
 */

import { useState } from "react";

export default function SelectGarmentStep({
  products,
  categories,
  selectedProduct,
  onSelect,
}) {
  // activeCategory controls which filter is currently applied
  const [activeCategory, setActiveCategory] = useState("All");

  /**
   * filteredProducts
   *
   * Why it exists:
   *   We don't want to show ALL products when a category filter is active.
   *   This filters the list based on the activeCategory.
   *
   * Input: activeCategory (string)
   * Output: filtered products array
   */
  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div className="animate-fade-in-up">
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "700",
          color: "#f8fafc",
          marginBottom: "0.5rem",
          textAlign: "center",
        }}
      >
        Select a Garment
      </h2>
      <p
        style={{
          color: "#94a3b8",
          textAlign: "center",
          marginBottom: "2rem",
          fontSize: "0.9rem",
        }}
      >
        Choose the outfit you'd like to try on
      </p>

      {/* --- Category Filter Buttons --- */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: "2rem",
        }}
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            style={{
              padding: "0.4rem 1rem",
              borderRadius: "999px",
              border: "1px solid",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: "500",
              transition: "all 0.2s ease",
              // Active category: filled purple; Others: outlined
              background:
                activeCategory === category
                  ? "linear-gradient(135deg, #7c3aed, #5b21b6)"
                  : "rgba(255,255,255,0.05)",
              borderColor:
                activeCategory === category
                  ? "#7c3aed"
                  : "rgba(255,255,255,0.1)",
              color: activeCategory === category ? "white" : "#94a3b8",
              boxShadow:
                activeCategory === category
                  ? "0 4px 12px rgba(124,58,237,0.4)"
                  : "none",
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* --- Product Grid --- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        {filteredProducts.map((product) => {
          // Is this the currently selected product?
          const isSelected = selectedProduct?.id === product.id;

          return (
            <div
              key={product.id}
              onClick={() => onSelect(product)}
              role="button"
              aria-label={`Select ${product.name}`}
              aria-pressed={isSelected}
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onSelect(product)}
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.25s ease",
                border: isSelected
                  ? "2px solid #7c3aed"
                  : "2px solid rgba(255,255,255,0.06)",
                background: "#16213e",
                boxShadow: isSelected
                  ? "0 0 30px rgba(124,58,237,0.5)"
                  : "0 4px 16px rgba(0,0,0,0.4)",
                transform: isSelected ? "scale(1.02)" : "scale(1)",
                position: "relative",
              }}
            >
              {/* Selected checkmark badge */}
              {isSelected && (
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    width: "28px",
                    height: "28px",
                    background: "#7c3aed",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "700",
                    fontSize: "0.85rem",
                    zIndex: 1,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                  }}
                >
                  ✓
                </div>
              )}

              {/* Product Image */}
              <div style={{ aspectRatio: "3/4", overflow: "hidden", background: "#0a0a14" }}>
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                />
              </div>

              {/* Product Info */}
              <div style={{ padding: "0.875rem" }}>
                <p
                  style={{
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    color: "#f8fafc",
                    marginBottom: "0.25rem",
                    lineHeight: "1.3",
                  }}
                >
                  {product.name}
                </p>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#64748b",
                    marginBottom: "0.5rem",
                    lineHeight: "1.4",
                  }}
                >
                  {product.description}
                </p>

                {/* Tags */}
                <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
                  {product.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      style={{
                        background: "rgba(124,58,237,0.15)",
                        border: "1px solid rgba(124,58,237,0.25)",
                        color: "#a78bfa",
                        padding: "0.1rem 0.4rem",
                        borderRadius: "4px",
                        fontSize: "0.65rem",
                        fontWeight: "500",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* No results message */}
      {filteredProducts.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
          No products in this category yet.
        </div>
      )}
    </div>
  );
}
