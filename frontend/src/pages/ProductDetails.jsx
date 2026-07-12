/**
 * pages/ProductDetails.jsx — Professional luxury product page
 * No emojis. Editorial layout. Robust against missing optional fields.
 */
import { useState } from "react";
import { formatPrice } from "../mock/products";
import TryOnModal from "../components/tryon/TryOnModal";
import GeneratedResultModal from "../components/tryon/GeneratedResultModal";
import { generateTryOn, checkTryOnStatus } from "../services/tryonService";

export default function ProductDetails({ product, onBack }) {
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState(null);
  const [resultImageUrl, setResultImageUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [selectedSize, setSelectedSize] = useState("L");

  // Dynamically compute the image URL to display based on the selected size
  const displayImage = (product.hasSizes && selectedSize) 
    ? `/products/${product.id}_${selectedSize}.png`
    : product.image;

  async function handleGenerate(file) {
    setIsGenerating(true);
    const preview = URL.createObjectURL(file);
    setUploadedPreviewUrl(preview);
    try {
      const jobId = await generateTryOn(file, product.id, product.hasSizes ? selectedSize : null);
      if (!jobId) throw new Error("No job ID returned from server.");

      let isDone = false;
      while (!isDone) {
        await new Promise(r => setTimeout(r, 3000)); // Poll every 3 seconds
        const statusData = await checkTryOnStatus(jobId);

        if (statusData.status === "completed") {
          setResultImageUrl(statusData.image_url);
          setIsTryOnOpen(false);
          setIsResultOpen(true);
          isDone = true;
        } else if (statusData.status === "failed") {
          alert("Generation failed on server.");
          isDone = true;
        }
      }
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
      {/* Back */}
      <div style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "1.25rem 1.5rem 0" }}>
        <button
          onClick={onBack}
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "none", border: "none",
            cursor: "pointer", color: "var(--color-text-muted)",
            fontSize: "0.72rem", fontWeight: "500",
            transition: "color 0.2s", letterSpacing: "0.05em",
            textTransform: "uppercase", padding: "0.25rem 0",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-brand)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to Collection
        </button>
      </div>

      <div
        style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "1.25rem 0 4rem" }}
        className="product-layout"
      >
        {/* Product Image */}
        <div style={{ position: "relative", overflow: "hidden" }}>
          {!imgLoaded && (
            <div className="skeleton" style={{ position: "absolute", inset: 0, borderRadius: 0, zIndex: 1 }} />
          )}
          <img
            src={displayImage}
            alt={product.name}
            onLoad={() => setImgLoaded(true)}
            style={{
              width: "100%", aspectRatio: "4/5", objectFit: "cover", objectPosition: "top",
              display: "block", opacity: imgLoaded ? 1 : 0, transition: "opacity 0.4s ease",
            }}
            className="product-hero-img"
          />
          {product.discount > 0 && (
            <div style={{
              position: "absolute", top: "16px", left: "16px",
              background: "var(--color-brand)", color: "#fff",
              padding: "0.3rem 0.75rem", borderRadius: "var(--radius-xs)",
              fontSize: "0.68rem", fontWeight: "700", letterSpacing: "0.06em", textTransform: "uppercase",
            }}>
              -{product.discount}%
            </div>
          )}
        </div>

        {/* Product Info */}
        <div style={{ padding: "1.5rem 1.5rem 2rem" }}>

          {/* Brand + Category */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <p style={{
              fontSize: "0.65rem", fontWeight: "600", color: "var(--color-brand)",
              textTransform: "uppercase", letterSpacing: "0.12em",
            }}>{product.brand}</p>
            <span style={{
              fontSize: "0.6rem", fontWeight: "500", color: "var(--color-text-muted)",
              border: "1px solid var(--color-border)", padding: "0.15rem 0.55rem",
              borderRadius: "var(--radius-full)", letterSpacing: "0.06em", textTransform: "uppercase",
            }}>
              {product.category}
            </span>
          </div>

          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
            fontWeight: "600", fontStyle: "italic",
            color: "var(--color-text)", lineHeight: "1.15",
            letterSpacing: "-0.01em", marginBottom: "1rem",
          }}>{product.name}</h1>

          {/* Rating */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", gap: "2px" }}>
              {[1,2,3,4,5].map(i => (
                <svg key={i} width="12" height="12" viewBox="0 0 10 10" fill={i <= Math.round(product.rating) ? "var(--color-brand)" : "var(--color-border-hover)"}>
                  <polygon points="5,1 6.18,3.86 9.33,4 7,5.86 7.63,9 5,7.5 2.37,9 3,5.86 0.67,4 3.82,3.86"/>
                </svg>
              ))}
            </div>
            <span style={{ fontWeight: "600", fontSize: "0.82rem", color: "var(--color-text)" }}>
              {product.rating}
            </span>
            {product.reviewCount && (
              <span style={{ color: "var(--color-text-muted)", fontSize: "0.78rem" }}>
                {product.reviewCount.toLocaleString("en-IN")} reviews
              </span>
            )}
          </div>

          {/* Price */}
          <div style={{
            display: "flex", alignItems: "baseline", gap: "10px", flexWrap: "wrap",
            marginBottom: "1.75rem", paddingBottom: "1.75rem", borderBottom: "1px solid var(--color-border)",
          }}>
            <span className="price-current">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="price-original">{formatPrice(product.originalPrice)}</span>
            )}
            {product.discount > 0 && (
              <span className="price-discount">{product.discount}% off</span>
            )}
          </div>

          {/* AI Try-On */}
          {product.hasSizes && (
            <div style={{ marginBottom: "1.5rem" }}>
              <p style={{ fontSize: "0.8rem", fontWeight: "600", marginBottom: "0.5rem" }}>Select Garment Source Size</p>
              <div style={{ display: "flex", gap: "10px" }}>
                {["L", "XL", "XXL"].map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      flex: 1,
                      padding: "0.6rem 0",
                      background: selectedSize === size ? "var(--color-brand)" : "transparent",
                      color: selectedSize === size ? "#fff" : "var(--color-text)",
                      border: `1px solid ${selectedSize === size ? "var(--color-brand)" : "var(--color-border)"}`,
                      borderRadius: "var(--radius-sm)",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "0.85rem",
                      transition: "all 0.2s"
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{
            background: "linear-gradient(135deg, rgba(184,150,90,0.06), rgba(184,150,90,0.02))",
            border: "1px solid var(--color-border-brand)",
            borderRadius: "var(--radius-lg)",
            marginBottom: "1.25rem", overflow: "hidden",
            position: "relative",
          }}>
            {/* Top content */}
            <div style={{ padding: "1.5rem 1.5rem 1.25rem", position: "relative" }}>
              <div style={{
                position: "absolute", top: 0, right: 0,
                width: "150px", height: "150px", borderRadius: "50%",
                background: "radial-gradient(circle, rgba(184,150,90,0.09) 0%, transparent 70%)",
                transform: "translate(40%, -40%)", pointerEvents: "none",
              }} />

              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.5rem" }}>
                <div style={{
                  width: "6px", height: "6px", borderRadius: "50%",
                  background: "var(--color-brand)",
                  boxShadow: "0 0 8px rgba(184,150,90,0.6)",
                  animation: "pulse 2s infinite",
                }} />
                <p style={{
                  fontSize: "0.58rem", fontWeight: "700", color: "var(--color-brand)",
                  textTransform: "uppercase", letterSpacing: "0.14em",
                }}>
                  Virtual Dressing Room — Powered by AI
                </p>
              </div>

              <p style={{
                fontFamily: "var(--font-serif)", fontSize: "1.15rem", fontStyle: "italic",
                fontWeight: "600", color: "var(--color-text)", marginBottom: "0.9rem", lineHeight: "1.3",
              }}>
                See yourself wearing this, before you buy.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {[
                  { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", text: "Private & secure — your photo is never stored" },
                  { icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z", text: "Photorealistic AI — garment adapts to your body" },
                  { icon: "M12 2v20M2 12h20", text: "Results ready in under 60 seconds" },
                ].map(({ icon, text }) => (
                  <div key={text} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                    <div style={{
                      width: "20px", height: "20px", flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: "var(--color-brand-light)",
                      borderRadius: "var(--radius-xs)",
                      border: "1px solid var(--color-border-brand)",
                    }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand)" strokeWidth="1.8" strokeLinecap="round">
                        <path d={icon}/>
                      </svg>
                    </div>
                    <span style={{ fontSize: "0.76rem", color: "var(--color-text-muted)", lineHeight: "1.55", paddingTop: "2px" }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust stat bar */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
              borderTop: "1px solid var(--color-border-brand)",
            }}>
              {[["98%", "Accuracy"], ["< 60s", "Avg. Time"], ["50K+", "Tries"]].map(([num, label], i) => (
                <div key={label} style={{
                  padding: "0.85rem 0.5rem", textAlign: "center",
                  borderRight: i < 2 ? "1px solid var(--color-border-brand)" : "none",
                  background: "rgba(184,150,90,0.03)",
                }}>
                  <p style={{
                    fontFamily: "var(--font-serif)", fontSize: "1.1rem",
                    fontWeight: "600", color: "var(--color-brand)", lineHeight: 1,
                  }}>{num}</p>
                  <p style={{
                    fontSize: "0.54rem", color: "var(--color-text-muted)",
                    fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "0.25rem",
                  }}>{label}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{ padding: "1rem 1.5rem 1.5rem" }}>
              <button
                onClick={() => setIsTryOnOpen(true)}
                className="btn-tryon"
                id="try-on-btn"
                style={{ width: "100%", padding: "1rem", fontSize: "0.82rem", letterSpacing: "0.08em" }}
              >
                Start Virtual Try-On
              </button>
            </div>
          </div>

          {/* Cart + Buy */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.25rem" }}>
            <button
              onClick={() => alert("Demo: Add to Bag!")}
              className="btn-outline"
              style={{ width: "100%", padding: "0.9rem" }}
            >
              Add to Bag
            </button>
            <button
              onClick={() => alert("Demo: Buy Now!")}
              className="btn-primary"
              style={{ width: "100%", padding: "0.9rem" }}
            >
              Buy Now
            </button>
          </div>

          {/* Delivery */}
          <div style={{
            display: "flex", alignItems: "center", gap: "12px",
            padding: "0.9rem 1rem", background: "var(--color-surface-2)",
            borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)",
            marginBottom: "1.5rem",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand)" strokeWidth="1.5">
              <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
              <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
            <div>
              <p style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--color-text)" }}>
                Free Delivery
              </p>
              <p style={{ fontSize: "0.7rem", color: "var(--color-text-muted)", marginTop: "1px" }}>
                Arrives in 3–5 business days
              </p>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1.25rem" }}>
              <p style={{ fontSize: "0.72rem", fontWeight: "700", color: "var(--color-text)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>
                Product Details
              </p>
              <p style={{
                fontSize: "0.85rem", lineHeight: "1.8", color: "var(--color-text-muted)",
              }}>{product.description}</p>
            </div>
          )}
        </div>
      </div>

      {isTryOnOpen && (
        <TryOnModal
          product={{ ...product, image: displayImage }}
          onClose={() => setIsTryOnOpen(false)}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />
      )}
      {isResultOpen && resultImageUrl && (
        <GeneratedResultModal
          product={product}
          originalImageUrl={uploadedPreviewUrl}
          resultImageUrl={resultImageUrl}
          onClose={() => setIsResultOpen(false)}
          onTryAgain={handleTryAgain}
        />
      )}

      <style>{`
        .product-layout { display: flex; flex-direction: column; }
        .product-hero-img { max-height: 580px; }
        @media (min-width: 768px) {
          .product-layout {
            display: grid;
            grid-template-columns: 1fr 1fr;
            align-items: start;
            gap: 3rem;
            padding: 1.5rem 1.5rem;
          }
          .product-hero-img {
            border-radius: var(--radius-lg);
            max-height: 720px;
          }
        }
        @media (min-width: 1024px) { .product-layout { grid-template-columns: 1.05fr 1fr; } }
      `}</style>
    </div>
  );
}
