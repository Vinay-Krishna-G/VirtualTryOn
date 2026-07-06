/**
 * pages/Home.jsx
 *
 * Why this file exists:
 *   The landing page — what every customer sees first.
 *   Contains: search bar, category filter, hero banner, product grid.
 *   Feels like a real shopping app, not an AI tool.
 *
 * Input (props):
 *   - products (array): full product list
 *   - categories (string[]): category list for filters
 *   - onSelectProduct (function): navigate to product details
 *
 * Output:
 *   - The Home page layout
 */

import { useState, useRef } from "react";
import HeroBanner from "../components/home/HeroBanner";
import CategoryScroller from "../components/home/CategoryScroller";
import ProductGrid from "../components/home/ProductGrid";

export default function Home({ products, categories, onSelectProduct }) {
  // Which category pill is active — "All" by default
  const [activeCategory, setActiveCategory] = useState("All");
  // Text typed into the search bar
  const [searchQuery, setSearchQuery] = useState("");

  // Ref to the product grid section so we can scroll to it
  const gridRef = useRef(null);

  /**
   * handleExplore
   *
   * Why it exists:
   *   When the hero CTA "Explore Collection" is clicked,
   *   we smoothly scroll the user down to the product grid.
   *
   * Input: none
   * Output: page scrolls to the product grid
   */
  function handleExplore() {
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /**
   * handleSearch
   *
   * Why it exists:
   *   Updates the search query state when the user types.
   *   The ProductGrid component reads this to filter results.
   *
   * Input: event (React input change event)
   * Output: updates searchQuery state
   */
  function handleSearch(event) {
    setSearchQuery(event.target.value);
    // Also reset category to "All" when searching
    if (event.target.value) setActiveCategory("All");
  }

  return (
    <div className="page-enter">
      {/* ── Search Bar ── */}
      <div
        style={{
          padding: "1rem 1rem 0",
          maxWidth: "var(--max-width)",
          margin: "0 auto",
        }}
      >
        <div style={{ position: "relative" }}>
          <span
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "1rem",
              color: "var(--color-text-light)",
              pointerEvents: "none",
            }}
          >
            🔍
          </span>
          <input
            type="search"
            placeholder="Search sarees, kurtis, lehengas..."
            value={searchQuery}
            onChange={handleSearch}
            aria-label="Search products"
            style={{
              width: "100%",
              padding: "0.8rem 1rem 0.8rem 2.75rem",
              borderRadius: "var(--radius-full)",
              border: "1.5px solid var(--color-border)",
              background: "var(--color-surface)",
              fontSize: "0.9rem",
              color: "var(--color-text)",
              outline: "none",
              fontFamily: "var(--font)",
              transition: "border-color 0.18s ease, box-shadow 0.18s ease",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--color-brand)";
              e.target.style.boxShadow = "0 0 0 3px rgba(13,115,119,0.12)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--color-border)";
              e.target.style.boxShadow = "none";
            }}
          />
          {/* Clear button appears when there's text */}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              style={{
                position: "absolute",
                right: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1rem",
                color: "var(--color-text-light)",
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── Main Content ── */}
      <div
        style={{
          maxWidth: "var(--max-width)",
          margin: "0 auto",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
        }}
      >
        {/* Category filter — only show when not searching */}
        {!searchQuery && (
          <CategoryScroller
            categories={categories}
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
          />
        )}

        {/* Hero banner — only show when not searching or filtering */}
        {!searchQuery && activeCategory === "All" && (
          <HeroBanner onExplore={handleExplore} />
        )}

        {/* Product grid section */}
        <div ref={gridRef}>
          {/* Section heading */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.75rem",
            }}
          >
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: "700",
                color: "var(--color-text)",
              }}
            >
              {searchQuery
                ? `Results for "${searchQuery}"`
                : activeCategory === "All"
                ? "Trending Now"
                : activeCategory}
            </h2>
            <span style={{ fontSize: "0.8rem", color: "var(--color-text-light)" }}>
              {/* Show filtered count */}
              {products.filter((p) => {
                const cat = activeCategory === "All" || p.category === activeCategory;
                const q = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
                return cat && q;
              }).length}{" "}
              items
            </span>
          </div>

          <ProductGrid
            products={products}
            activeCategory={activeCategory}
            searchQuery={searchQuery}
            onSelectProduct={onSelectProduct}
          />
        </div>
      </div>
    </div>
  );
}
