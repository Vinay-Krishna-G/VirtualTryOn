/**
 * pages/ProductDetails.jsx — Dark luxury redesign
 */
import { useState } from "react";
import { formatPrice } from "../mock/products";
import TryOnModal from "../components/tryon/TryOnModal";
import GeneratedResultModal from "../components/tryon/GeneratedResultModal";
import { generateTryOn } from "../services/tryonService";

export default function ProductDetails({ product, onBack }) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState(null);
  const [resultImageUrl, setResultImageUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [descExpanded, setDescExpanded] = useState(true);
  const [imgLoaded, setImgLoaded] = useState(false);

  async function handleGenerate(file) {
    setIsGenerating(true);
    setUploadedFile(file);
    const preview = URL.createObjectURL(file);
    setUploadedPreviewUrl(preview);
    try {
      const blobUrl = await generateTryOn(file, product.id);
      setResultImageUrl(blobUrl);
      setIsTryOnOpen(false);
      setIsResultOpen(true);
    } catch (error) {
      console.error("Try-on generation failed:", error);
      alert("Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  function handleTryAgain() {
    setIsResultOpen(false);
    setIsTryOnOpen(true);
  }

  return (
    <div className="page-enter">
      {/* Back button */}
      <div style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "1rem 1.25rem 0" }}>
        <button
          onClick={onBack}
          style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "var(--color-glass)", border: "1px solid var(--color-glass-border)",
            backdropFilter: "blur(8px)", borderRadius: "var(--radius-full)",
            cursor: "pointer", color: "var(--color-text-muted)",
            fontSize: "0.8rem", fontWeight: "600", padding: "0.4rem 1rem",
            transition: "all 0.2s", letterSpacing: "0.02em",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--color-border-brand)";
            e.currentTarget.style.color = "var(--color-brand)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--color-glass-border)";
            e.currentTarget.style.color = "var(--color-text-muted)";
          }}
        >
          ← Back
        </button>
      </div>

      <div
        style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "1rem 0 3rem" }}
        className="product-layout"
      >
        {/* Product Image */}
        <div style={{ position: "relative" }}>
          {!imgLoaded && (
            <div className="skeleton" style={{ position: "absolute", inset: 0, borderRadius: 0, zIndex: 1 }} />
          )}
          <img
            src={product.image}
            alt={product.name}
            onLoad={() => setImgLoaded(true)}
            style={{
              width: "100%", aspectRatio: "4/5", objectFit: "cover", objectPosition: "top",
              display: "block", opacity: imgLoaded ? 1 : 0, transition: "opacity 0.3s ease",
            }}
            className="product-hero-img"
          />
          {product.discount > 0 && (
            <div style={{
              position: "absolute", top: "16px", left: "16px",
              background: "var(--color-success)", color: "#0a1208",
              padding: "0.3rem 0.8rem", borderRadius: "var(--radius-xs)",
              fontSize: "0.72rem", fontWeight: "800", letterSpacing: "0.04em", textTransform: "uppercase",
            }}>
              -{product.discount}%
            </div>
          )}
        </div>

        {/* Product Info */}
        <div style={{ padding: "1.5rem 1.25rem" }}>
          <p style={{
            fontSize: "0.65rem", fontWeight: "700", color: "var(--color-brand)",
            textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem",
          }}>{product.brand}</p>

          <h1 style={{
            fontFamily: "var(--font-serif)", fontSize: "clamp(1.4rem, 3vw, 2rem)",
            fontWeight: "700", color: "var(--color-text)", lineHeight: "1.2",
            letterSpacing: "-0.02em", marginBottom: "1rem",
          }}>{product.name}</h1>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ color: "#f59e0b", fontSize: "0.85rem" }}>★</span>
              <span style={{ fontWeight: "700", fontSize: "0.88rem", color: "var(--color-text)" }}>{product.rating}</span>
              <span style={{ color: "var(--color-text-light)", fontSize: "0.8rem" }}>
                {product.reviewCount.toLocaleString("en-IN")} reviews
              </span>
            </div>
            <span className="pill pill-tryon">✨ {product.tryOnCount.toLocaleString("en-IN")} tried this</span>
          </div>

          <div style={{
            display: "flex", alignItems: "baseline", gap: "10px", flexWrap: "wrap",
            marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid var(--color-border)",
          }}>
            <span className="price-current">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && <span className="price-original">{formatPrice(product.originalPrice)}</span>}
            {product.discount > 0 && <span className="price-discount">{product.discount}% off</span>}
          </div>

          {/* Color picker */}
          {product.colors.length > 0 && (
            <div style={{ marginBottom: "1.25rem" }}>
              <p style={{ fontSize: "0.78rem", fontWeight: "600", color: "var(--color-text-muted)", marginBottom: "0.6rem" }}>
                Color: <span style={{ color: "var(--color-brand)" }}>{selectedColor}</span>
              </p>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {product.colors.map((color) => (
                  <button key={color} onClick={() => setSelectedColor(color)} style={{
                    padding: "0.35rem 0.9rem", borderRadius: "var(--radius-full)",
                    border: selectedColor === color ? "1px solid rgba(201,169,110,0.6)" : "1px solid var(--color-border)",
                    cursor: "pointer", fontSize: "0.78rem", fontWeight: "600", transition: "all 0.18s ease",
                    background: selectedColor === color ? "rgba(201,169,110,0.12)" : "transparent",
                    color: selectedColor === color ? "var(--color-brand)" : "var(--color-text-muted)",
                    fontFamily: "var(--font)",
                  }}>{color}</button>
                ))}
              </div>
            </div>
          )}

          {/* Size picker */}
          {product.sizes.length > 1 && (
            <div style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid var(--color-border)" }}>
              <p style={{ fontSize: "0.78rem", fontWeight: "600", color: "var(--color-text-muted)", marginBottom: "0.6rem" }}>
                Size: <span style={{ color: "var(--color-brand)" }}>{selectedSize}</span>
              </p>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {product.sizes.map((size) => (
                  <button key={size} onClick={() => setSelectedSize(size)} style={{
                    width: "44px", height: "44px", borderRadius: "var(--radius-sm)",
                    border: selectedSize === size ? "1px solid rgba(201,169,110,0.6)" : "1px solid var(--color-border)",
                    cursor: "pointer", fontSize: "0.8rem", fontWeight: "600", transition: "all 0.18s ease",
                    background: selectedSize === size ? "rgba(201,169,110,0.12)" : "transparent",
                    color: selectedSize === size ? "var(--color-brand)" : "var(--color-text-muted)",
                    fontFamily: "var(--font)",
                  }}>{size}</button>
                ))}
              </div>
            </div>
          )}

          {/* AI Try-On Section */}
          <div style={{
            background: "linear-gradient(135deg, rgba(201,169,110,0.08), rgba(201,169,110,0.03))",
            border: "1px solid rgba(201,169,110,0.2)",
            borderRadius: "var(--radius-lg)", padding: "1.5rem",
            marginBottom: "1.25rem", position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: "-40px", right: "-40px",
              width: "150px", height: "150px", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(201,169,110,0.1) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />
            <p style={{
              fontSize: "0.6rem", fontWeight: "800", color: "var(--color-brand)",
              textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem",
            }}>✨ Virtual Dressing Room</p>
            <p style={{
              fontFamily: "var(--font-serif)", fontSize: "1rem", fontWeight: "600",
              color: "var(--color-text)", marginBottom: "0.75rem", lineHeight: "1.35",
            }}>
              See yourself wearing this before ordering
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", marginBottom: "1.25rem" }}>
              {["Realistic AI visualization", "Private & secure", "Ready in under 60s"].map((b) => (
                <div key={b} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ color: "var(--color-brand)", fontSize: "0.75rem" }}>✓</span>
                  <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", fontWeight: "500" }}>{b}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setIsTryOnOpen(true)} className="btn-tryon" id="try-on-btn"
              style={{ width: "100%", padding: "1rem", fontSize: "0.9rem" }}>
              ✨ Try It On
            </button>
          </div>

          {/* Cart + Buy */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.25rem" }}>
            <button onClick={() => alert("Demo: Add to Cart!")} className="btn-outline" style={{ width: "100%", padding: "0.9rem" }}>
              🛒 Add to Cart
            </button>
            <button onClick={() => alert("Demo: Buy Now!")} className="btn-primary" style={{ width: "100%", padding: "0.9rem" }}>
              ⚡ Buy Now
            </button>
          </div>

          {/* Delivery */}
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "0.85rem 1rem", background: "var(--color-surface-2)",
            borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)",
            marginBottom: "1.5rem",
          }}>
            <span style={{ fontSize: "1.2rem" }}>🚚</span>
            <div>
              <p style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--color-text)" }}>Free Delivery</p>
              <p style={{ fontSize: "0.72rem", color: "var(--color-text-light)" }}>Arrives in {product.deliveryDays} days</p>
            </div>
          </div>

          {/* Description */}
          <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1rem" }}>
            <button onClick={() => setDescExpanded((v) => !v)} style={{
              width: "100%", display: "flex", justifyContent: "space-between",
              alignItems: "center", background: "none", border: "none",
              cursor: "pointer", padding: 0, fontFamily: "var(--font)",
            }}>
              <span style={{ fontWeight: "700", fontSize: "0.88rem", color: "var(--color-text)" }}>Description</span>
              <span style={{ fontSize: "0.85rem", color: "var(--color-text-light)", transition: "transform 0.2s", transform: descExpanded ? "rotate(180deg)" : "rotate(0)" }}>▼</span>
            </button>
            {descExpanded && (
              <p style={{
                marginTop: "0.85rem", fontSize: "0.85rem",
                lineHeight: "1.75", color: "var(--color-text-muted)",
                animation: "fadeInUp 0.25s ease forwards",
              }}>{product.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {isTryOnOpen && (
        <TryOnModal product={product} onClose={() => setIsTryOnOpen(false)} onGenerate={handleGenerate} isGenerating={isGenerating} />
      )}
      {isResultOpen && resultImageUrl && (
        <GeneratedResultModal
          product={product} originalImageUrl={uploadedPreviewUrl} resultImageUrl={resultImageUrl}
          onClose={() => setIsResultOpen(false)} onTryAgain={handleTryAgain}
        />
      )}

      <style>{`
        .product-layout { display: flex; flex-direction: column; }
        .product-hero-img { max-height: 520px; }
        @media (min-width: 768px) {
          .product-layout { display: grid; grid-template-columns: 1fr 1fr; align-items: start; gap: 2.5rem; padding: 1.5rem; }
          .product-hero-img { border-radius: var(--radius-lg); max-height: 700px; }
        }
        @media (min-width: 1024px) { .product-layout { grid-template-columns: 1fr 1.1fr; } }
      `}</style>
    </div>
  );
}
