/**
 * components/layout/Header.jsx
 *
 * Why this file exists:
 *   The persistent top bar shown on every page.
 *   On mobile: logo + cart icon (search is inline on home page).
 *   On desktop: logo + cart icon + page title.
 *   Clicking the logo always goes back to the home page.
 *
 * Input (props):
 *   - onNavigateHome (function): called when logo is clicked
 *   - currentPage (string): "home" | "product" | "dashboard"
 *   - cartCount (number): items in cart (always 0 in demo)
 *
 * Output: sticky top header bar
 */
export default function Header({ onNavigateHome, currentPage, cartCount = 0 }) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "#fff",
        borderBottom: "1px solid var(--color-border)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        height: "var(--header-height)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--max-width)",
          margin: "0 auto",
          padding: "0 1rem",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        {/* ── Logo ── */}
        <button
          onClick={onNavigateHome}
          aria-label="Go to home page"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          {/* Logo mark */}
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, var(--color-brand), #14b8b8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
            }}
          >
            👗
          </div>

          {/* Wordmark */}
          <div style={{ lineHeight: 1.1 }}>
            <div
              style={{
                fontSize: "1rem",
                fontWeight: "800",
                color: "var(--color-text)",
                letterSpacing: "-0.03em",
              }}
            >
              Fashion Store
            </div>
            <div style={{ fontSize: "0.6rem", color: "var(--color-brand)", fontWeight: "600" }}>
              AI Try-On Enabled
            </div>
          </div>
        </button>

        {/* ── Right side ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Merchant Dashboard link — shows how it looks to the store owner */}
          {currentPage !== "dashboard" && (
            <button
              onClick={() => onNavigateHome("dashboard")}
              style={{
                background: "var(--color-brand-light)",
                color: "var(--color-brand-dark)",
                border: "1px solid rgba(13,115,119,0.2)",
                borderRadius: "var(--radius-full)",
                padding: "0.3rem 0.75rem",
                fontSize: "0.72rem",
                fontWeight: "700",
                cursor: "pointer",
                display: "none",  /* hidden on mobile, shown on md+ */
                letterSpacing: "0.01em",
              }}
              className="dashboard-btn"
              aria-label="View merchant dashboard"
            >
              📊 Dashboard
            </button>
          )}

          {/* Cart icon with badge */}
          <button
            aria-label={`Shopping cart with ${cartCount} items`}
            onClick={() => alert("Demo: Cart feature coming soon!")}
            style={{
              position: "relative",
              background: "none",
              border: "none",
              fontSize: "1.4rem",
              padding: "0.25rem",
              cursor: "pointer",
              color: "var(--color-text)",
            }}
          >
            🛒
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-2px",
                  right: "-4px",
                  background: "var(--color-brand)",
                  color: "#fff",
                  borderRadius: "50%",
                  width: "16px",
                  height: "16px",
                  fontSize: "0.6rem",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Show dashboard button on tablet/desktop via inline style + media */}
      <style>{`
        @media (min-width: 640px) {
          .dashboard-btn { display: inline-flex !important; }
        }
      `}</style>
    </header>
  );
}
