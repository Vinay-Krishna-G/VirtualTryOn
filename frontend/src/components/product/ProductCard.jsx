/**
 * components/product/ProductCard.jsx
 *
 * Why this file exists:
 *   The reusable card shown in product grids throughout the app.
 *   Displays the garment image, name, rating, price, discount,
 *   and a "✨ Try On" pill badge.
 *
 *   The "✨ Try On" pill is the key design decision here —
 *   it signals AI capability without making it the focus.
 *
 * Input (props):
 *   - product (object): product data from products.js
 *   - onSelect (function): called with the product when the card is clicked
 *
 * Output:
 *   - A tappable product card (navigates to product details)
 */

import { formatPrice } from "../../mock/products";

export default function ProductCard({ product, onSelect }) {
  return (
    <article
      onClick={() => onSelect(product)}
      role="button"
      tabIndex={0}
      aria-label={`View ${product.name}, ${formatPrice(product.price)}`}
      onKeyDown={(e) => e.key === "Enter" && onSelect(product)}
      style={{
        background: "var(--color-surface)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--color-border)",
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.18s ease, box-shadow 0.18s ease",
        boxShadow: "var(--shadow-card)",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "var(--shadow-md)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "var(--shadow-card)";
      }}
    >
      {/* ── Product Image ── */}
      <div
        style={{
          position: "relative",
          aspectRatio: "3/4",
          background: "#f9f9f9",
          overflow: "hidden",
        }}
      >
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
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.04)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        />

        {/* Discount badge — top left */}
        {product.discount > 0 && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              background: "var(--color-success)",
              color: "#fff",
              fontSize: "0.7rem",
              fontWeight: "700",
              padding: "0.2rem 0.5rem",
              borderRadius: "var(--radius-full)",
            }}
          >
            {product.discount}% OFF
          </div>
        )}

        {/* ✨ Try On pill — bottom of image */}
        <div
          style={{
            position: "absolute",
            bottom: "8px",
            left: "8px",
          }}
        >
          <span className="pill pill-tryon">✨ Try On</span>
        </div>
      </div>

      {/* ── Product Info ── */}
      <div style={{ padding: "0.75rem" }}>
        {/* Brand */}
        <p
          style={{
            fontSize: "0.65rem",
            fontWeight: "600",
            color: "var(--color-text-light)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: "0.2rem",
          }}
        >
          {product.brand}
        </p>

        {/* Product name */}
        <p
          style={{
            fontSize: "0.875rem",
            fontWeight: "600",
            color: "var(--color-text)",
            lineHeight: "1.35",
            marginBottom: "0.4rem",
            /* Clamp to 2 lines max */
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.name}
        </p>

        {/* Rating */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            marginBottom: "0.5rem",
          }}
        >
          <span style={{ color: "#f59e0b", fontSize: "0.75rem" }}>★</span>
          <span style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--color-text)" }}>
            {product.rating}
          </span>
          <span style={{ fontSize: "0.72rem", color: "var(--color-text-light)" }}>
            ({product.reviewCount.toLocaleString("en-IN")})
          </span>
        </div>

        {/* Pricing */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "6px", flexWrap: "wrap" }}>
          <span className="price-current" style={{ fontSize: "1rem" }}>
            {formatPrice(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <span className="price-original">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
