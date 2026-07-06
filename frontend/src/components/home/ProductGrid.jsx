/**
 * components/home/ProductGrid.jsx
 *
 * Why this file exists:
 *   Renders the grid of ProductCards.
 *   Handles filtering logic based on the active category.
 *   Handles search query filtering.
 *   Shows a "no results" state when nothing matches.
 *
 * Input (props):
 *   - products (array): full product list from products.js
 *   - activeCategory (string): category filter, e.g. "Sarees"
 *   - searchQuery (string): text typed in the search bar
 *   - onSelectProduct (function): called with a product when card is clicked
 *
 * Output:
 *   - Responsive CSS grid of ProductCard components
 */

import ProductCard from "../product/ProductCard";

export default function ProductGrid({
  products,
  activeCategory,
  searchQuery,
  onSelectProduct,
}) {
  /**
   * filteredProducts
   *
   * Why it exists:
   *   Apply category filter AND text search simultaneously.
   *   If both are active, a product must satisfy BOTH conditions.
   *
   * Input: products[], activeCategory string, searchQuery string
   * Output: filtered products array
   */
  const filteredProducts = products.filter((product) => {
    // Category check — "All" shows everything
    const matchesCategory =
      activeCategory === "All" || product.category === activeCategory;

    // Search check — match name, brand, or tags (case-insensitive)
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === "" ||
      product.name.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.tags.some((tag) => tag.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  // No results state
  if (filteredProducts.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "4rem 1rem",
          color: "var(--color-text-light)",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
        <p style={{ fontWeight: "600", color: "var(--color-text-muted)", marginBottom: "0.4rem" }}>
          No products found
        </p>
        <p style={{ fontSize: "0.85rem" }}>
          Try a different search term or category
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        /* Mobile: 2 columns. Tablet: 3. Desktop: 4. */
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "0.75rem",
      }}
      className="product-grid"
    >
      {filteredProducts.map((product, index) => (
        <div
          key={product.id}
          style={{
            animation: `fadeInUp 0.3s ease ${index * 0.05}s both`,
          }}
        >
          <ProductCard product={product} onSelect={onSelectProduct} />
        </div>
      ))}

      {/* Responsive columns via inline style */}
      <style>{`
        @media (min-width: 640px) {
          .product-grid { grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        }
        @media (min-width: 1024px) {
          .product-grid { grid-template-columns: repeat(4, 1fr); gap: 1.25rem; }
        }
      `}</style>
    </div>
  );
}
