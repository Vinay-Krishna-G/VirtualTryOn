/**
 * App.jsx — Root with theme management
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
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Theme — persisted to localStorage
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("vf-theme") || "dark";
  });

  // Apply theme to <html> element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("vf-theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

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

  function handleSelectProduct(product) {
    setSelectedProduct(product);
    setCurrentPage("product");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleNavigateHome(page = "home") {
    setCurrentPage(typeof page === "string" ? page : "home");
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  return (
    <>
      <Header
        onNavigateHome={handleNavigateHome}
        currentPage={currentPage}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main>
        {isLoading ? (
          <div style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "2rem 1.25rem" }}>
            <div className="skeleton" style={{ height: "380px", marginBottom: "2rem", borderRadius: "var(--radius-lg)" }} />
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1rem",
            }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton" style={{ height: "280px", borderRadius: "var(--radius-md)" }} />
              ))}
            </div>
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

      <BottomNavigation
        currentPage={currentPage}
        onNavigate={handleNavigateHome}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    </>
  );
}
