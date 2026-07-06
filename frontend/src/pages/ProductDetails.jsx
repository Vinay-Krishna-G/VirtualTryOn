/**
 * pages/ProductDetails.jsx
 *
 * Why this file exists:
 *   The product detail page — where the Try-On feature lives.
 *   This is the most important page in the demo.
 *
 *   Layout (mobile):
 *   - Large product image
 *   - Product name, brand, rating
 *   - Price with discount
 *   - Color picker
 *   - "Try Before Buying" premium section with the TryOn button
 *   - Add to Cart + Buy Now (demo stubs)
 *   - Description accordion
 *
 *   The TryOnModal opens ON TOP of this page — no navigation away.
 *
 * Input (props):
 *   - product (object): the selected product
 *   - onBack (function): go back to the previous page (home)
 *
 * Output:
 *   - Full product detail view + modals
 */

import { useState } from "react";
import { formatPrice } from "../data/products";
import TryOnModal from "../components/tryon/TryOnModal";
import GeneratedResultModal from "../components/tryon/GeneratedResultModal";
import axios from "axios";

export default function ProductDetails({ product, onBack }) {
  // Which color variant is selected
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  // Which size is selected
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  // Is the TryOn upload modal open
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);
  // Is the result modal open
  const [isResultOpen, setIsResultOpen] = useState(false);
  // The user's uploaded photo (File object + preview URL)
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState(null);
  // The generated try-on image URL
  const [resultImageUrl, setResultImageUrl] = useState(null);
  // True while waiting for AI
  const [isGenerating, setIsGenerating] = useState(false);
  // Is the description section expanded
  const [descExpanded, setDescExpanded] = useState(true);

  /**
   * handleGenerate
   *
   * Why it exists:
   *   Called when user taps "Generate" inside TryOnModal.
   *   Sends the person image + productId to Node.js backend.
   *   Node.js forwards both to Python AI service.
   *   We receive the generated PNG and display it.
   *
   * Input: file (File) — the person's uploaded photo
   * Output: sets resultImageUrl and opens result modal
   */
  async function handleGenerate(file) {
    setIsGenerating(true);
    setUploadedFile(file);
    // Create a local preview URL for "before" comparison
    const preview = URL.createObjectURL(file);
    setUploadedPreviewUrl(preview);

    try {
      // Build multipart form data with person image + product id
      const formData = new FormData();
      formData.append("personImage", file);
      formData.append("productId", product.id);

      // POST to Node backend — Vite proxy routes this to localhost:3001
      const response = await axios.post("/api/generate", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        responseType: "blob",   // Response is binary image data
      });

      // Convert the binary response to a displayable URL
      const blobUrl = URL.createObjectURL(response.data);
      setResultImageUrl(blobUrl);

      // Close upload modal, open result modal
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
    // Close result modal, re-open upload modal
    setIsResultOpen(false);
    setIsTryOnOpen(true);
  }

  // Render stars from a rating number like 4.8
  function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(5 - full - (half ? 1 : 0));
  }

  return (
    <div className="page-enter">
      {/* ── Back button ── */}
      <div
        style={{
          maxWidth: "var(--max-width)",
          margin: "0 auto",
          padding: "0.75rem 1rem 0",
        }}
      >
        <button
          onClick={onBack}
          aria-label="Go back"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--color-text-muted)",
            fontSize: "0.875rem",
            fontWeight: "500",
            fontFamily: "var(--font)",
            padding: "0.25rem",
          }}
        >
          ← Back
        </button>
      </div>

      <div
        style={{
          maxWidth: "var(--max-width)",
          margin: "0 auto",
          padding: "0.5rem 0 2rem",
        }}
        className="product-layout"
      >
        {/* ── Product Image ── */}
        <div style={{ position: "relative" }}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: "100%",
              aspectRatio: "4/5",
              objectFit: "cover",
              display: "block",
            }}
            className="product-hero-img"
          />

          {/* Discount ribbon */}
          {product.discount > 0 && (
            <div
              style={{
                position: "absolute",
                top: "16px",
                left: "16px",
                background: "var(--color-success)",
                color: "#fff",
                padding: "0.3rem 0.75rem",
                borderRadius: "var(--radius-full)",
                fontSize: "0.8rem",
                fontWeight: "800",
              }}
            >
              {product.discount}% OFF
            </div>
          )}
        </div>

        {/* ── Product Info Column ── */}
        <div style={{ padding: "1.25rem 1rem" }}>
          {/* Brand */}
          <p
            style={{
              fontSize: "0.72rem",
              fontWeight: "700",
              color: "var(--color-brand)",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              marginBottom: "0.35rem",
            }}
          >
            {product.brand}
          </p>

          {/* Product name */}
          <h1
            style={{
              fontSize: "1.3rem",
              fontWeight: "800",
              color: "var(--color-text)",
              lineHeight: "1.25",
              letterSpacing: "-0.02em",
              marginBottom: "0.75rem",
            }}
          >
            {product.name}
          </h1>

          {/* Rating + Reviews + TryOn count */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              flexWrap: "wrap",
              marginBottom: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ color: "#f59e0b", fontSize: "0.9rem" }}>★</span>
              <span style={{ fontWeight: "700", fontSize: "0.9rem" }}>{product.rating}</span>
              <span style={{ color: "var(--color-text-light)", fontSize: "0.8rem" }}>
                {product.reviewCount.toLocaleString("en-IN")} reviews
              </span>
            </div>
            {/* Key demo stat: how many used AI Try-On */}
            <span className="pill pill-tryon">
              ✨ {product.tryOnCount.toLocaleString("en-IN")} tried this on
            </span>
          </div>

          {/* Price block */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "10px",
              flexWrap: "wrap",
              marginBottom: "1.25rem",
              paddingBottom: "1.25rem",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <span className="price-current">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="price-original">{formatPrice(product.originalPrice)}</span>
            )}
            {product.discount > 0 && (
              <span className="price-discount">{product.discount}% off</span>
            )}
          </div>

          {/* Color picker */}
          {product.colors.length > 0 && (
            <div style={{ marginBottom: "1.25rem" }}>
              <p style={{ fontSize: "0.82rem", fontWeight: "600", color: "var(--color-text)", marginBottom: "0.5rem" }}>
                Color: <span style={{ color: "var(--color-brand)" }}>{selectedColor}</span>
              </p>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    style={{
                      padding: "0.35rem 0.875rem",
                      borderRadius: "var(--radius-full)",
                      border: "1.5px solid",
                      cursor: "pointer",
                      fontSize: "0.78rem",
                      fontWeight: "500",
                      transition: "all 0.15s ease",
                      background: selectedColor === color ? "var(--color-brand)" : "transparent",
                      borderColor: selectedColor === color ? "var(--color-brand)" : "var(--color-border)",
                      color: selectedColor === color ? "#fff" : "var(--color-text-muted)",
                      fontFamily: "var(--font)",
                    }}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size picker (if not free size) */}
          {product.sizes.length > 1 && (
            <div
              style={{
                marginBottom: "1.25rem",
                paddingBottom: "1.25rem",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              <p style={{ fontSize: "0.82rem", fontWeight: "600", color: "var(--color-text)", marginBottom: "0.5rem" }}>
                Size: <span style={{ color: "var(--color-brand)" }}>{selectedSize}</span>
              </p>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "var(--radius-sm)",
                      border: "1.5px solid",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                      transition: "all 0.15s ease",
                      background: selectedSize === size ? "var(--color-brand)" : "transparent",
                      borderColor: selectedSize === size ? "var(--color-brand)" : "var(--color-border)",
                      color: selectedSize === size ? "#fff" : "var(--color-text-muted)",
                      fontFamily: "var(--font)",
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── ✨ Try Before Buying Section — the hero feature ── */}
          <div
            style={{
              background: "linear-gradient(135deg, #fef3c7, #fff7ed)",
              border: "1.5px solid rgba(217,119,6,0.25)",
              borderRadius: "var(--radius-lg)",
              padding: "1.25rem",
              marginBottom: "1.25rem",
            }}
          >
            <p
              style={{
                fontSize: "0.68rem",
                fontWeight: "800",
                color: "var(--color-tryon)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "0.4rem",
              }}
            >
              ✨ Try Before Buying
            </p>
            <p
              style={{
                fontSize: "1rem",
                fontWeight: "700",
                color: "var(--color-text)",
                marginBottom: "0.35rem",
                lineHeight: "1.3",
              }}
            >
              See yourself wearing this {product.category.replace(/s$/, "").toLowerCase()}
            </p>
            <p
              style={{
                fontSize: "0.8rem",
                color: "var(--color-text-muted)",
                marginBottom: "1rem",
                lineHeight: "1.5",
              }}
            >
              Upload your full-body photo. Our AI will show you the result in seconds.
            </p>

            <button
              onClick={() => setIsTryOnOpen(true)}
              className="btn-tryon"
              id="try-on-btn"
              style={{ width: "100%", padding: "0.9rem" }}
            >
              ✨ Try On Now
            </button>
          </div>

          {/* ── Cart + Buy buttons ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.25rem" }}>
            <button
              onClick={() => alert("Demo: Add to Cart feature — would be implemented in the real app!")}
              className="btn-outline"
              style={{ width: "100%", padding: "0.9rem", fontSize: "0.95rem" }}
            >
              🛒 Add to Cart
            </button>
            <button
              onClick={() => alert("Demo: Buy Now — would open checkout in the real app!")}
              className="btn-primary"
              style={{ width: "100%", padding: "0.9rem", fontSize: "0.95rem" }}
            >
              ⚡ Buy Now
            </button>
          </div>

          {/* Delivery info */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "0.75rem",
              background: "var(--color-surface-2)",
              borderRadius: "var(--radius-md)",
              marginBottom: "1.25rem",
            }}
          >
            <span style={{ fontSize: "1.1rem" }}>🚚</span>
            <div>
              <p style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--color-text)" }}>
                Free Delivery
              </p>
              <p style={{ fontSize: "0.72rem", color: "var(--color-text-light)" }}>
                Arrives in {product.deliveryDays} days
              </p>
            </div>
          </div>

          {/* Description accordion */}
          <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1rem" }}>
            <button
              onClick={() => setDescExpanded((v) => !v)}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                fontFamily: "var(--font)",
              }}
            >
              <span style={{ fontWeight: "700", fontSize: "0.9rem", color: "var(--color-text)" }}>
                Description
              </span>
              <span style={{ fontSize: "1rem", color: "var(--color-text-light)" }}>
                {descExpanded ? "▲" : "▼"}
              </span>
            </button>
            {descExpanded && (
              <p
                style={{
                  marginTop: "0.75rem",
                  fontSize: "0.85rem",
                  lineHeight: "1.7",
                  color: "var(--color-text-muted)",
                }}
              >
                {product.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Modals (rendered on top of everything) ── */}
      {isTryOnOpen && (
        <TryOnModal
          product={product}
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

      {/* Responsive layout: side-by-side on tablet+ */}
      <style>{`
        .product-layout {
          display: flex;
          flex-direction: column;
        }
        .product-hero-img {
          max-height: 480px;
        }
        @media (min-width: 768px) {
          .product-layout {
            display: grid;
            grid-template-columns: 1fr 1fr;
            align-items: start;
            gap: 2rem;
            padding: 1.5rem;
          }
          .product-hero-img {
            border-radius: var(--radius-lg);
            max-height: 600px;
          }
        }
        @media (min-width: 1024px) {
          .product-layout {
            grid-template-columns: 1fr 1.1fr;
          }
        }
      `}</style>
    </div>
  );
}
