/**
 * components/product/ProductCard.jsx
 * Professional luxury product card — no emojis, editorial hover
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
        transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        boxShadow: hovered ? "var(--shadow-md)" : "var(--shadow-card)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        position: "relative",
      }}
    >
      {/* Image */}
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
            transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            transform: hovered ? "scale(1.05)" : "scale(1)",
            opacity: imgLoaded ? 1 : 0,
          }}
        />

        {/* Subtle gradient */}
        <div style={{
          position: "absolute", inset: 0,
          background: hovered
            ? "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)"
            : "linear-gradient(to top, rgba(0,0,0,0.2) 0%, transparent 60%)",
          transition: "background 0.35s ease",
        }} />

        {/* Discount badge */}
        {product.discount > 0 && (
          <div style={{
            position: "absolute", top: "10px", left: "10px",
            background: "var(--color-brand)", color: "#fff",
            fontSize: "0.58rem", fontWeight: "700",
            padding: "0.2rem 0.5rem", borderRadius: "var(--radius-xs)",
            letterSpacing: "0.05em", textTransform: "uppercase",
          }}>
            -{product.discount}%
          </div>
        )}

        {/* Try-On CTA — slides in on hover */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "0.75rem",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(10px)",
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
          <div style={{
            background: "var(--color-brand)",
            color: "#fff", textAlign: "center",
            padding: "0.6rem", borderRadius: "var(--radius-xs)",
            fontSize: "0.62rem", fontWeight: "700",
            letterSpacing: "0.1em", textTransform: "uppercase",
            boxShadow: "0 4px 20px rgba(184,150,90,0.35)",
          }}>
            Virtual Try-On
          </div>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "0.8rem 0.85rem 1rem" }}>
        <p style={{
          fontSize: "0.58rem", fontWeight: "600", color: "var(--color-brand)",
          textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem",
        }}>
          {product.brand}
        </p>

        <p style={{
          fontSize: "0.82rem", fontWeight: "500", color: "var(--color-text)",
          lineHeight: "1.3", marginBottom: "0.5rem",
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {product.name}
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "3px", marginBottom: "0.5rem" }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="var(--color-brand)">
            <polygon points="5,1 6.18,3.86 9.33,4 7,5.86 7.63,9 5,7.5 2.37,9 3,5.86 0.67,4 3.82,3.86"/>
          </svg>
          <span style={{ fontSize: "0.68rem", fontWeight: "600", color: "var(--color-text)" }}>
            {product.rating}
          </span>
          <span style={{ fontSize: "0.62rem", color: "var(--color-text-muted)" }}>
            ({product.reviewCount?.toLocaleString("en-IN")})
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.88rem", fontWeight: "700", color: "var(--color-text)" }}>
            {formatPrice(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <span style={{ fontSize: "0.7rem", color: "var(--color-text-muted)", textDecoration: "line-through" }}>
              {formatPrice(product.originalPrice)}
            </span>
          )}
          {product.discount > 0 && (
            <span style={{ fontSize: "0.62rem", fontWeight: "600", color: "var(--color-success)" }}>
              {product.discount}% off
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
