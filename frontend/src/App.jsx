/**
 * App.jsx
 *
 * Why this file exists:
 *   The root component. It owns two things:
 *   1. Navigation state — which page is currently visible
 *   2. Selected product — passed down to ProductDetails
 *
 *   We use simple useState navigation (no React Router).
 *   This is intentional for the demo — it's simpler to explain,
 *   simpler to test, and has zero external dependencies.
 *
 *   Pages:
 *     "home"      → Home.jsx        (product listing)
 *     "product"   → ProductDetails.jsx (single product + Try On)
 *     "dashboard" → MerchantDashboard.jsx (owner analytics)
 *
 *   Component tree:
 *     App
 *     ├── Header (persistent, top of every page)
 *     ├── Home | ProductDetails | MerchantDashboard (switches based on page)
 *     └── BottomNavigation (persistent, bottom on mobile)
 */

import { useState, useEffect } from "react";
import Header from "./components/layout/Header";
import BottomNavigation from "./components/layout/BottomNavigation";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import { getProducts, getCategories } from "./services/productService";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Data state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // ── Navigation handlers ────────────────────────────────────────────────────

  /**
   * handleSelectProduct
   *
   * Why it exists:
   *   Called when user clicks a ProductCard in the grid.
   *   Stores the product and navigates to the details page.
   *
   * Input: product (object)
   * Output: updates state, renders ProductDetails
   */
  function handleSelectProduct(product) {
    setSelectedProduct(product);
    setCurrentPage("product");
    // Scroll to top so the product image is visible immediately
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /**
   * handleNavigateHome
   *
   * Why it exists:
   *   Called by the logo click, Back button, and BottomNavigation.
   *   Can also be called with "dashboard" to navigate there.
   *
   * Input: page (string) — defaults to "home"
   * Output: updates currentPage state
   */
  function handleNavigateHome(page = "home") {
    setCurrentPage(typeof page === "string" ? page : "home");
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Persistent header — shown on all pages */}
      <Header
        onNavigateHome={handleNavigateHome}
        currentPage={currentPage}
      />

      {/* Page content — switches based on currentPage */}
      <main>
        {isLoading ? (
          <div style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--color-text-light)" }}>
            Loading store experience...
          </div>
        ) : (
          <>
            {currentPage === "home" && (
              <Home
                products={products}
                categories={categories}
                onSelectProduct={handleSelectProduct}
              />
            )}

        {currentPage === "product" && selectedProduct && (
          <ProductDetails
            product={selectedProduct}
            onBack={() => handleNavigateHome("home")}
          />
        )}

        {currentPage === "dashboard" && (
          <AnalyticsDashboard
            products={products}
            onBack={() => handleNavigateHome("home")}
          />
        )}
          </>
        )}
      </main>

      {/* Persistent bottom navigation — visible on mobile only */}
      <BottomNavigation
        currentPage={currentPage}
        onNavigate={handleNavigateHome}
      />
    </>
  );
}
