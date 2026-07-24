/**
 * pages/Home.jsx — Professional luxury home, editorial layout
 */
import { useState, useRef } from "react";
import HeroBanner from "../components/home/HeroBanner";
import CategoryScroller from "../components/home/CategoryScroller";
import ProductGrid from "../components/home/ProductGrid";

export default function Home({ products, categories, onSelectProduct }) {
  const [activeGender, setActiveGender] = useState("Women");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const gridRef = useRef(null);

  function handleExplore() {
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const genderProducts = products.filter((p) => p.gender === activeGender);
  
  // Compute categories with counts
  const categoryCounts = genderProducts.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});
  
  const dynamicCategories = [
    { name: "All", count: genderProducts.length },
    ...Object.entries(categoryCounts).map(([name, count]) => ({ name, count }))
  ];

  const filteredProducts = activeCategory === "All"
    ? genderProducts
    : genderProducts.filter((p) => p.category === activeCategory);

  if (activeCategory !== "All" && !categoryCounts[activeCategory]) {
    setActiveCategory("All");
  }

  return (
    <div className="page-enter">
      <div style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "4.5rem" }}>

        {/* Hero */}
        <HeroBanner onExplore={handleExplore} />

        {/* Filters */}
        <div>
          {/* Gender Tabs */}
          <div style={{ display: "flex", gap: "0", marginBottom: "1.5rem", borderBottom: "1px solid var(--color-border)" }}>
            {["Women", "Men"].map(gender => (
              <button
                key={gender}
                onClick={() => { setActiveGender(gender); setActiveCategory("All"); }}
                style={{
                  padding: "0.6rem 1.5rem",
                  border: "none",
                  borderBottom: `2px solid ${activeGender === gender ? "var(--color-brand)" : "transparent"}`,
                  background: "transparent",
                  color: activeGender === gender ? "var(--color-text)" : "var(--color-text-muted)",
                  fontSize: "0.75rem",
                  fontWeight: activeGender === gender ? "700" : "500",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  marginBottom: "-1px",
                }}
              >
                {gender}'s
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <CategoryScroller
                categories={dynamicCategories}
                activeCategory={activeCategory}
                onSelect={setActiveCategory}
              />
              <div style={{ position: "relative", minWidth: "240px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}>
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input 
                  type="text" 
                  placeholder="Search collection..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%", padding: "0.6rem 1rem 0.6rem 2.2rem",
                    background: "var(--color-surface)", border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-full)", color: "var(--color-text)",
                    fontSize: "0.85rem", outline: "none", transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "var(--color-brand)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--color-border)"}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid Section */}
        <div ref={gridRef}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.5rem" }}>
            <div>
              <p style={{
                fontSize: "0.58rem", fontWeight: "600", color: "var(--color-brand)",
                textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: "0.35rem",
              }}>
                {activeGender}'s {activeCategory === "All" ? "Collection" : activeCategory}
              </p>
              <h2 style={{
                fontFamily: "var(--font-serif)", fontStyle: "italic",
                fontSize: "clamp(1.4rem, 3vw, 2rem)",
                fontWeight: "600", color: "var(--color-text)", letterSpacing: "-0.01em",
              }}>
                {activeCategory === "All" ? "New Arrivals" : activeCategory}
              </h2>
            </div>
            <span style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", fontWeight: "500" }}>
              {filteredProducts.length} pieces
            </span>
          </div>

          <ProductGrid
            products={filteredProducts}
            activeCategory={activeCategory}
            searchQuery={searchQuery}
            onSelectProduct={onSelectProduct}
          />
        </div>

        {/* AI Try-On Feature Banner */}
        <div style={{
          borderRadius: "var(--radius-lg)", overflow: "hidden",
          border: "1px solid var(--color-border-brand)",
          background: "linear-gradient(135deg, rgba(184,150,90,0.07) 0%, rgba(184,150,90,0.02) 100%)",
          padding: "clamp(2rem, 4vw, 3rem) clamp(1.75rem, 4vw, 2.5rem)",
          position: "relative",
        }}>
          <div style={{
            position: "absolute", top: 0, right: 0, bottom: 0,
            width: "40%", pointerEvents: "none",
            background: "radial-gradient(circle at 80% 50%, rgba(184,150,90,0.08) 0%, transparent 70%)",
          }} />
          <div style={{ position: "relative", zIndex: 1, maxWidth: "520px" }}>
            <p style={{
              fontSize: "0.6rem", fontWeight: "700", color: "var(--color-brand)",
              textTransform: "uppercase", letterSpacing: "0.16em", marginBottom: "0.85rem",
              display: "flex", alignItems: "center", gap: "8px",
            }}>
              <span style={{ width: "20px", height: "1px", background: "var(--color-brand)", display: "inline-block" }} />
              Powered by AI
            </p>
            <h2 style={{
              fontFamily: "var(--font-serif)", fontStyle: "italic",
              fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: "600",
              color: "var(--color-text)", lineHeight: 1.2, marginBottom: "1rem",
            }}>
              Try Before You Buy.<br />
              <span className="text-gold">Zero Guesswork.</span>
            </h2>
            <p style={{
              fontSize: "0.88rem", color: "var(--color-text-muted)",
              lineHeight: "1.7", marginBottom: "1.75rem", fontWeight: "400",
            }}>
              Our AI virtually drapes any garment on your uploaded photo in under 60 seconds.
              See the exact fit, colour, and drape — before placing your order.
            </p>
            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
              {["Realistic Draping", "Private & Secure", "Ready in 60s"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="6.5" stroke="var(--color-brand)" strokeWidth="1"/>
                    <polyline points="4.5,7 6.5,9 9.5,5" stroke="var(--color-brand)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                  </svg>
                  <span style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", fontWeight: "500" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div style={{ paddingBottom: "1.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <p style={{
              fontSize: "0.6rem", fontWeight: "600", color: "var(--color-brand)",
              textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: "0.5rem",
            }}>
              Client Stories
            </p>
            <h2 style={{
              fontFamily: "var(--font-serif)", fontStyle: "italic",
              fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: "600",
              color: "var(--color-text)", letterSpacing: "-0.01em",
            }}>
              What Our Shoppers Say
            </h2>
          </div>

          <div 
            className="snap-container hide-scrollbar" 
            style={{ 
              display: "flex", gap: "1.5rem", overflowX: "auto", 
              paddingBottom: "1rem", margin: "0 -1.5rem", padding: "0 1.5rem 1rem" 
            }}
          >
            {[
              { name: "Priya S.", review: "Tried it virtually, bought it instantly. The fit was perfect — no returns needed.", rating: 5, loc: "Mumbai" },
              { name: "Anjali M.", review: "Saved me from so many poor choices. This feature is a genuine game changer for online shopping.", rating: 5, loc: "Delhi" },
              { name: "Kavitha R.", review: "I was sceptical, but the AI preview was spot-on. Love the confidence it gives.", rating: 5, loc: "Bangalore" },
              { name: "Neha D.", review: "The drape and colour accuracy is unbelievable. Felt like I was trying it in the store.", rating: 5, loc: "Pune" },
            ].map((t) => (
              <div
                key={t.name}
                className="snap-item"
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  padding: "1.75rem",
                  minWidth: "280px", maxWidth: "320px", flexShrink: 0,
                  transition: "border-color 0.2s, transform 0.25s, box-shadow 0.25s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border-brand)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "var(--shadow-gold)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ display: "flex", gap: "3px", marginBottom: "1rem" }}>
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} width="14" height="14" viewBox="0 0 10 10" fill="var(--color-brand)">
                      <polygon points="5,1 6.18,3.86 9.33,4 7,5.86 7.63,9 5,7.5 2.37,9 3,5.86 0.67,4 3.82,3.86"/>
                    </svg>
                  ))}
                </div>
                <p style={{
                  fontSize: "0.9rem", color: "var(--color-text-muted)",
                  lineHeight: "1.8", marginBottom: "1.5rem",
                  fontStyle: "italic", fontFamily: "var(--font-serif)",
                }}>
                  "{t.review}"
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--color-text)" }}>{t.name}</span>
                  <span style={{ fontSize: "0.7rem", color: "var(--color-text-muted)" }}>{t.loc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
