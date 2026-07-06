/**
 * pages/MerchantDashboard.jsx
 *
 * Why this file exists:
 *   The secret weapon for the shop owner demo.
 *   After showing the customer experience, switch to this page and say:
 *   "As the shop owner, you'll see which products customers tried on
 *   and what drove sales."
 *
 *   ALL DATA IS HARDCODED / FAKE. This is purely for demonstration.
 *   In a real product, this data would come from analytics.
 *
 * Input (props):
 *   - products (array): product list (for top tried-on list)
 *   - onBack (function): navigate back to home
 *
 * Output:
 *   - A dashboard-style analytics page for shop owners
 */

import { formatPrice } from "../data/products";

// ── Hardcoded demo stats ──────────────────────────────────────
// These numbers are intentionally chosen to feel realistic.
// "21% conversion" is a believable metric for feature adoption.
const OVERVIEW_STATS = [
  { label: "Today's Visitors", value: "284", icon: "👥", trend: "+12%", up: true },
  { label: "Try-Ons Generated", value: "61", icon: "✨", trend: "+34%", up: true },
  { label: "Try-On Conversion", value: "21%", icon: "📈", trend: "+5%", up: true },
  { label: "Avg Session", value: "4m 12s", icon: "⏱️", trend: "+0.8m", up: true },
];

const WEEKLY_DATA = [
  { day: "Mon", tryon: 38, views: 180 },
  { day: "Tue", tryon: 52, views: 220 },
  { day: "Wed", tryon: 45, views: 195 },
  { day: "Thu", tryon: 61, views: 284 },
  { day: "Fri", tryon: 78, views: 310 },
  { day: "Sat", tryon: 95, views: 380 },
  { day: "Sun", tryon: 67, views: 290 },
];

const maxTryon = Math.max(...WEEKLY_DATA.map((d) => d.tryon));

export default function MerchantDashboard({ products, onBack }) {
  // Sort products by tryOnCount descending to show most-tried
  const topProducts = [...products]
    .sort((a, b) => b.tryOnCount - a.tryOnCount)
    .slice(0, 5);

  return (
    <div className="page-enter">
      {/* ── Header ── */}
      <div
        style={{
          background: "var(--color-surface)",
          borderBottom: "1px solid var(--color-border)",
          padding: "0.75rem 1rem",
        }}
      >
        <div
          style={{
            maxWidth: "var(--max-width)",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "1rem",
                fontWeight: "800",
                color: "var(--color-text)",
                letterSpacing: "-0.02em",
              }}
            >
              📊 Merchant Dashboard
            </h1>
            <p style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", marginTop: "2px" }}>
              Thursday, 6 July 2026 — Demo Data
            </p>
          </div>
          <button
            onClick={onBack}
            style={{
              background: "none",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-full)",
              padding: "0.35rem 0.875rem",
              fontSize: "0.78rem",
              fontWeight: "600",
              cursor: "pointer",
              color: "var(--color-text-muted)",
              fontFamily: "var(--font)",
            }}
          >
            ← Back to Store
          </button>
        </div>
      </div>

      <div
        style={{
          maxWidth: "var(--max-width)",
          margin: "0 auto",
          padding: "1.25rem 1rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        {/* ── Overview Stats Grid ── */}
        <div className="stats-grid">
          {OVERVIEW_STATS.map((stat) => (
            <div
              key={stat.label}
              className="card"
              style={{ padding: "1.25rem", position: "relative", overflow: "hidden" }}
            >
              {/* Background icon — decorative */}
              <div
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  fontSize: "3.5rem",
                  opacity: 0.06,
                  lineHeight: 1,
                  pointerEvents: "none",
                }}
              >
                {stat.icon}
              </div>

              <p style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", fontWeight: "600", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {stat.label}
              </p>
              <p style={{ fontSize: "1.8rem", fontWeight: "800", color: "var(--color-text)", lineHeight: 1, marginBottom: "0.4rem", letterSpacing: "-0.03em" }}>
                {stat.value}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ fontSize: "0.72rem", color: stat.up ? "var(--color-success)" : "var(--color-danger)", fontWeight: "700" }}>
                  {stat.up ? "▲" : "▼"} {stat.trend}
                </span>
                <span style={{ fontSize: "0.7rem", color: "var(--color-text-light)" }}>vs yesterday</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Bar Chart: Try-Ons This Week ── */}
        <div className="card" style={{ padding: "1.25rem" }}>
          <p style={{ fontWeight: "700", fontSize: "0.95rem", marginBottom: "0.25rem", color: "var(--color-text)" }}>
            Try-Ons This Week
          </p>
          <p style={{ fontSize: "0.75rem", color: "var(--color-text-light)", marginBottom: "1.25rem" }}>
            Number of AI try-on sessions per day
          </p>

          <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "120px" }}>
            {WEEKLY_DATA.map((day) => {
              const heightPct = (day.tryon / maxTryon) * 100;
              const isToday = day.day === "Thu";
              return (
                <div
                  key={day.day}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                    height: "100%",
                    justifyContent: "flex-end",
                  }}
                >
                  <span style={{ fontSize: "0.68rem", fontWeight: "700", color: isToday ? "var(--color-brand)" : "var(--color-text-light)" }}>
                    {day.tryon}
                  </span>
                  <div
                    title={`${day.day}: ${day.tryon} try-ons`}
                    style={{
                      width: "100%",
                      height: `${heightPct}%`,
                      background: isToday
                        ? "var(--color-brand)"
                        : "rgba(13,115,119,0.2)",
                      borderRadius: "4px 4px 0 0",
                      transition: "opacity 0.2s",
                    }}
                  />
                  <span style={{ fontSize: "0.65rem", color: isToday ? "var(--color-brand)" : "var(--color-text-light)", fontWeight: isToday ? "700" : "400" }}>
                    {day.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Top Products by Try-On Usage ── */}
        <div className="card" style={{ padding: "1.25rem" }}>
          <p style={{ fontWeight: "700", fontSize: "0.95rem", marginBottom: "0.25rem", color: "var(--color-text)" }}>
            Most Tried-On Products
          </p>
          <p style={{ fontSize: "0.75rem", color: "var(--color-text-light)", marginBottom: "1rem" }}>
            Products that generated the most AI try-on sessions
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {topProducts.map((product, index) => {
              const barWidth = (product.tryOnCount / topProducts[0].tryOnCount) * 100;
              return (
                <div key={product.id}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "4px" }}>
                    {/* Rank */}
                    <span
                      style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        background: index === 0 ? "#f59e0b" : "var(--color-surface-2)",
                        color: index === 0 ? "#fff" : "var(--color-text-muted)",
                        fontSize: "0.7rem",
                        fontWeight: "800",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {index + 1}
                    </span>

                    {/* Product thumbnail */}
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: "36px", height: "48px", objectFit: "cover", borderRadius: "4px", flexShrink: 0 }}
                    />

                    {/* Name and count */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: "600", fontSize: "0.82rem", color: "var(--color-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {product.name}
                      </p>
                      <p style={{ fontSize: "0.72rem", color: "var(--color-text-muted)" }}>
                        {product.tryOnCount.toLocaleString("en-IN")} try-ons
                      </p>
                    </div>

                    {/* Price */}
                    <span style={{ fontWeight: "700", fontSize: "0.82rem", color: "var(--color-text)", flexShrink: 0 }}>
                      {formatPrice(product.price)}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div
                    style={{
                      height: "4px",
                      background: "var(--color-surface-2)",
                      borderRadius: "2px",
                      marginLeft: "22px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${barWidth}%`,
                        background: index === 0 ? "#f59e0b" : "var(--color-brand)",
                        borderRadius: "2px",
                        transition: "width 0.6s ease",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Business Value callout ── */}
        <div
          style={{
            background: "linear-gradient(135deg, var(--color-brand), #14b8b8)",
            borderRadius: "var(--radius-lg)",
            padding: "1.5rem",
            color: "#fff",
          }}
        >
          <p style={{ fontSize: "0.72rem", fontWeight: "800", letterSpacing: "0.08em", opacity: 0.8, marginBottom: "0.4rem" }}>
            WHY THIS MATTERS
          </p>
          <p style={{ fontSize: "1.05rem", fontWeight: "700", lineHeight: "1.4", marginBottom: "0.5rem" }}>
            Customers who use AI Try-On are 3× more likely to complete a purchase.
          </p>
          <p style={{ fontSize: "0.82rem", opacity: 0.85, lineHeight: "1.5" }}>
            Reduce returns. Increase confidence. Let every customer try before they buy — without leaving home.
          </p>
        </div>
      </div>

      {/* Responsive stats grid */}
      <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        @media (min-width: 640px) {
          .stats-grid { grid-template-columns: repeat(4, 1fr); }
        }
      `}</style>
    </div>
  );
}
