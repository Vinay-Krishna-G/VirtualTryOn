/**
 * pages/Home.jsx — No search bar, fully theme-aware
 */
import { useState, useRef } from "react";
import HeroBanner from "../components/home/HeroBanner";
import CategoryScroller from "../components/home/CategoryScroller";
import ProductGrid from "../components/home/ProductGrid";

export default function Home({ products, categories, onSelectProduct }) {
  const [activeGender, setActiveGender] = useState("Women");
  const [activeCategory, setActiveCategory] = useState("All");
  const gridRef = useRef(null);

  function handleExplore() {
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Filter products by gender
  const genderProducts = products.filter((p) => p.gender === activeGender);
  
  // Calculate dynamic categories for selected gender
  const dynamicCategories = ["All", ...new Set(genderProducts.map((p) => p.category))];

  // Filter products by active category
  const filteredProducts = activeCategory === "All"
    ? genderProducts
    : genderProducts.filter((p) => p.category === activeCategory);

  // If gender changes, reset category if it's not present in new gender
  if (activeCategory !== "All" && !dynamicCategories.includes(activeCategory)) {
    setActiveCategory("All");
  }

  return (
    <div className="page-enter">
      <div style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "2.5rem" }}>

        {/* ── Hero ── */}
        <div>
          <HeroBanner onExplore={handleExplore} />
        </div>

        {/* ── Department & Category Filters ── */}
        <div>
          {/* Gender Tabs */}
          <div style={{
            display: "flex", gap: "0.5rem", marginBottom: "1.25rem",
            justifyContent: "center"
          }}>
            {["Women", "Men"].map(gender => (
              <button
                key={gender}
                onClick={() => {
                  setActiveGender(gender);
                  setActiveCategory("All");
                }}
                style={{
                  padding: "0.5rem 1.5rem",
                  borderRadius: "var(--radius-full)",
                  border: `1px solid ${activeGender === gender ? "var(--color-brand)" : "var(--color-border)"}`,
                  background: activeGender === gender ? "var(--color-brand-light)" : "transparent",
                  color: activeGender === gender ? "var(--color-brand)" : "var(--color-text-muted)",
                  fontSize: "0.8rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                {gender}'s
              </button>
            ))}
          </div>

          <CategoryScroller
            categories={dynamicCategories}
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
          />
        </div>

        {/* ── Product Grid ── */}
        <div ref={gridRef}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.25rem" }}>
            <div>
              <p style={{
                fontSize: "0.6rem", fontWeight: "700", color: "var(--color-brand)",
                textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem",
              }}>
                ✦ {activeGender}'s {activeCategory === "All" ? "Collection" : activeCategory}
              </p>
              <h2 style={{
                fontFamily: "var(--font-serif)", fontSize: "clamp(1.2rem, 3vw, 1.6rem)",
                fontWeight: "700", color: "var(--color-text)", letterSpacing: "-0.02em",
              }}>
                {activeCategory === "All" ? "New Arrivals" : activeCategory}
              </h2>
            </div>
            <span style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
              {filteredProducts.length} items
            </span>
          </div>

          <ProductGrid
            products={filteredProducts}
            activeCategory={activeCategory}
            searchQuery=""
            onSelectProduct={onSelectProduct}
          />
        </div>

        {/* ── AI Try-On Callout ── */}
        <div style={{
          borderRadius: "var(--radius-lg)", overflow: "hidden",
          border: "1px solid var(--color-border-brand)",
          background: "var(--color-brand-light)",
          padding: "clamp(1.5rem, 4vw, 2.5rem) clamp(1.25rem, 4vw, 2rem)",
          position: "relative",
        }}>
          <div style={{
            position: "absolute", top: "-60px", right: "-60px",
            width: "220px", height: "220px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,169,110,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{ position: "relative", zIndex: 1, maxWidth: "500px" }}>
            <span style={{
              display: "inline-block", fontSize: "0.6rem", fontWeight: "700",
              color: "var(--color-brand)", textTransform: "uppercase",
              letterSpacing: "0.12em", marginBottom: "0.75rem",
              padding: "0.25rem 0.65rem",
              border: "1px solid var(--color-border-brand)",
              borderRadius: "var(--radius-full)",
            }}>
              ✨ Powered by AI
            </span>
            <h2 style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.3rem, 3vw, 1.8rem)", fontWeight: "700",
              color: "var(--color-text)", lineHeight: 1.2, marginBottom: "0.75rem",
            }}>
              Try Before You Buy.{" "}
              <span className="text-gold">Zero Guesswork.</span>
            </h2>
            <p style={{
              fontSize: "0.88rem", color: "var(--color-text-muted)",
              lineHeight: "1.65", marginBottom: "1.5rem",
            }}>
              Our AI virtually drapes any garment on your uploaded photo in under 60 seconds. 
              See the exact fit, colour, and drape before placing your order.
            </p>
            <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
              {["Realistic Draping", "Private & Secure", "Ready in 60s"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ color: "var(--color-brand)", fontSize: "0.8rem" }}>✓</span>
                  <span style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", fontWeight: "500" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Testimonials ── */}
        <div style={{ paddingBottom: "1rem" }}>
          <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
            <p style={{
              fontSize: "0.6rem", fontWeight: "700", color: "var(--color-brand)",
              textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.35rem",
            }}>
              ✦ Real Customers
            </p>
            <h2 style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.2rem, 3vw, 1.7rem)", fontWeight: "700",
              color: "var(--color-text)", letterSpacing: "-0.02em",
            }}>
              What Our Shoppers Say
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "1rem" }}>
            {[
              { name: "Priya S.", review: "Tried it on virtually, bought it instantly. The fit was perfect!", rating: "★★★★★", loc: "Mumbai" },
              { name: "Anjali M.", review: "Saved me so many returns. This feature is a total game changer.", rating: "★★★★★", loc: "Delhi" },
              { name: "Kavitha R.", review: "I was skeptical, but the AI preview was spot-on. Love it!", rating: "★★★★★", loc: "Bangalore" },
            ].map((t) => (
              <div
                key={t.name}
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  padding: "1.25rem",
                  transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border-brand)";
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "var(--shadow-gold)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ color: "#f59e0b", fontSize: "0.8rem", marginBottom: "0.65rem" }}>{t.rating}</div>
                <p style={{ fontSize: "0.87rem", color: "var(--color-text-muted)", lineHeight: "1.65", marginBottom: "1rem", fontStyle: "italic" }}>
                  "{t.review}"
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--color-text)" }}>{t.name}</span>
                  <span style={{ fontSize: "0.7rem", color: "var(--color-text-light)" }}>{t.loc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
