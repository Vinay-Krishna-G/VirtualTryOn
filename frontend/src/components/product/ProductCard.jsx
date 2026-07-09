/**
 * components/product/ProductCard.jsx
 * — No "Try On" pill on image, hover CTA overlay instead
 * — Full mobile responsive, skeleton loader
 */
import { useState } from "react";
import { formatPrice } from "../../mock/products";

export default function ProductCard({ product, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <article
      onClick={() => onSelect(product)}
      role="button"
      tabIndex={0}
      aria-label={`View ${product.name}`}
      onKeyDown={(e) => e.key === "Enter" && onSelect(product)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--color-surface)",
        borderRadius: "var(--radius-md)",
        border: `1px solid ${hovered ? "var(--color-border-brand)" : "var(--color-border)"}`,
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        boxShadow: hovered ? "var(--shadow-md)" : "var(--shadow-card)",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        position: "relative",
      }}
    >
      {/* ── Image Container ── */}
      <div style={{ position: "relative", aspectRatio: "3/4", background: "var(--color-surface-2)", overflow: "hidden" }}>
        {!imgLoaded && (
          <div className="skeleton" style={{ position: "absolute", inset: 0, borderRadius: 0 }} />
        )}

        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          style={{
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "top",
            transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            transform: hovered ? "scale(1.07)" : "scale(1)",
            opacity: imgLoaded ? 1 : 0,
          }}
        />

        {/* Gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: hovered
            ? "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)"
            : "linear-gradient(to top, rgba(0,0,0,0.25) 0%, transparent 60%)",
          transition: "background 0.3s ease",
        }} />

        {/* Discount badge — top left */}
        {product.discount > 0 && (
          <div style={{
            position: "absolute", top: "10px", left: "10px",
            background: "var(--color-success)", color: "#0a1208",
            fontSize: "0.6rem", fontWeight: "800",
            padding: "0.2rem 0.5rem", borderRadius: "var(--radius-xs)",
            letterSpacing: "0.04em", textTransform: "uppercase",
          }}>
            -{product.discount}%
          </div>
        )}

        {/* "Virtual Try-On" CTA on hover — slides up */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "0.75rem",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
          <div style={{
            background: "linear-gradient(135deg, #c9a96e, #e8c987)",
            color: "#1a1208", textAlign: "center",
            padding: "0.6rem", borderRadius: "var(--radius-sm)",
            fontSize: "0.7rem", fontWeight: "800",
            letterSpacing: "0.06em", textTransform: "uppercase",
            boxShadow: "0 4px 16px rgba(201,169,110,0.4)",
          }}>
            ✨ Virtual Try-On
          </div>
        </div>
      </div>

      {/* ── Product Info ── */}
      <div style={{ padding: "0.75rem 0.75rem 0.9rem" }}>
        <p style={{
          fontSize: "0.6rem", fontWeight: "700", color: "var(--color-brand)",
          textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.2rem",
        }}>
          {product.brand}
        </p>

        <p style={{
          fontSize: "0.82rem", fontWeight: "600", color: "var(--color-text)",
          lineHeight: "1.25", marginBottom: "0.4rem",
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {product.name}
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "3px", marginBottom: "0.5rem" }}>
          <span style={{ color: "#f59e0b", fontSize: "0.6rem" }}>★★★★★</span>
          <span style={{ fontSize: "0.65rem", fontWeight: "600", color: "var(--color-text)" }}>
            {product.rating}
          </span>
          <span style={{ fontSize: "0.6rem", color: "var(--color-text-light)" }}>
            ({product.reviewCount.toLocaleString("en-IN")})
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: "0.35rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.9rem", fontWeight: "800", color: "var(--color-text)" }}>
            {formatPrice(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <span style={{ fontSize: "0.68rem", color: "var(--color-text-light)", textDecoration: "line-through" }}>
              {formatPrice(product.originalPrice)}
            </span>
          )}
          {product.discount > 0 && (
            <span style={{ fontSize: "0.65rem", fontWeight: "700", color: "var(--color-success)" }}>
              {product.discount}% off
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
