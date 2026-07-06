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
          gap: "2.5rem", // More breathing room for a premium feel
        }}
      >
        {/* Category filter — only show when searching */}
        {searchQuery && (
          <div style={{ marginBottom: "-1.5rem" }}>
            <CategoryScroller
              categories={categories}
              activeCategory={activeCategory}
              onSelect={setActiveCategory}
            />
          </div>
        )}

        {/* If searching, just show standard grid */}
        {searchQuery ? (
          <div ref={gridRef}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "1rem" }}>
              Results for "{searchQuery}"
            </h2>
            <ProductGrid
              products={products}
              activeCategory={activeCategory}
              searchQuery={searchQuery}
              onSelectProduct={onSelectProduct}
            />
          </div>
        ) : (
          /* ── Premium Editorial Layout ── */
          <>
            {/* Hero Campaign */}
            <div ref={gridRef}>
              <HeroBanner onExplore={handleExplore} />
            </div>

            {/* New Collection */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1rem" }}>
                <h2 style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--color-text)", letterSpacing: "-0.02em" }}>
                  New Collection
                </h2>
                <button style={{ background: "none", border: "none", color: "var(--color-brand)", fontWeight: "600", fontSize: "0.85rem", cursor: "pointer" }}>
                  View All →
                </button>
              </div>
              <ProductGrid
                products={products.slice(0, 4)} // Just show top 4
                activeCategory="All"
                searchQuery=""
                onSelectProduct={onSelectProduct}
              />
            </div>

            {/* ── Customer Gallery ── */}
            <div style={{ background: "var(--color-surface)", margin: "0 -1rem", padding: "2.5rem 1rem", borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)" }}>
              <div style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                  <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--color-text)", letterSpacing: "-0.03em" }}>
                    Real Customers. Real Try-Ons.
                  </h2>
                  <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginTop: "0.4rem" }}>
                    See how our AI styling assistant is helping thousands shop with confidence.
                  </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
                  {/* Hardcoded gallery item 1 */}
                  <div style={{ background: "#fff", borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--color-border)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                    <div style={{ display: "flex", height: "180px" }}>
                      <div style={{ flex: 1, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", borderRight: "1px solid #e2e8f0" }}>
                         <span style={{ fontSize: "2rem" }}>👤</span>
                      </div>
                      <div style={{ flex: 1, background: "#f8fafc", position: "relative" }}>
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `url(${products[0]?.image})`, backgroundSize: "cover", backgroundPosition: "top", opacity: 0.9 }}></div>
                        <div style={{ position: "absolute", bottom: "8px", right: "8px", background: "var(--color-brand)", color: "#fff", fontSize: "0.6rem", padding: "0.15rem 0.4rem", borderRadius: "10px", fontWeight: "700" }}>✨ AI</div>
                      </div>
                    </div>
                    <div style={{ padding: "0.75rem", fontSize: "0.8rem" }}>
                      <div style={{ color: "#f59e0b", fontSize: "0.9rem", marginBottom: "0.2rem" }}>★★★★★</div>
                      <p style={{ color: "var(--color-text)", fontWeight: "500" }}>"Tried it on virtually, bought it instantly. Perfect fit!"</p>
                      <p style={{ color: "var(--color-text-light)", fontSize: "0.7rem", marginTop: "0.3rem" }}>— Priya S.</p>
                    </div>
                  </div>
                  
                  {/* Hardcoded gallery item 2 */}
                  <div style={{ background: "#fff", borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--color-border)", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                    <div style={{ display: "flex", height: "180px" }}>
                      <div style={{ flex: 1, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", borderRight: "1px solid #e2e8f0" }}>
                         <span style={{ fontSize: "2rem" }}>👩🏽</span>
                      </div>
                      <div style={{ flex: 1, background: "#f8fafc", position: "relative" }}>
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `url(${products[1]?.image})`, backgroundSize: "cover", backgroundPosition: "top", opacity: 0.9 }}></div>
                        <div style={{ position: "absolute", bottom: "8px", right: "8px", background: "var(--color-brand)", color: "#fff", fontSize: "0.6rem", padding: "0.15rem 0.4rem", borderRadius: "10px", fontWeight: "700" }}>✨ AI</div>
                      </div>
                    </div>
                    <div style={{ padding: "0.75rem", fontSize: "0.8rem" }}>
                      <div style={{ color: "#f59e0b", fontSize: "0.9rem", marginBottom: "0.2rem" }}>★★★★★</div>
                      <p style={{ color: "var(--color-text)", fontWeight: "500" }}>"Saved me so much time. Looked exactly like the preview."</p>
                      <p style={{ color: "var(--color-text-light)", fontSize: "0.7rem", marginTop: "0.3rem" }}>— Anjali M.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Best Sellers */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1rem" }}>
                <h2 style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--color-text)", letterSpacing: "-0.02em" }}>
                  Best Sellers
                </h2>
                <button style={{ background: "none", border: "none", color: "var(--color-brand)", fontWeight: "600", fontSize: "0.85rem", cursor: "pointer" }}>
                  View All →
                </button>
              </div>
              <ProductGrid
                products={products.slice(4, 8)} // Next 4
                activeCategory="All"
                searchQuery=""
                onSelectProduct={onSelectProduct}
              />
            </div>
            
          </>
        )}
      </div>

    </div>
  );
}
