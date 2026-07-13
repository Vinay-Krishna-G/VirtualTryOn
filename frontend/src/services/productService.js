/**
 * services/productService.js
 *
 * Why this file exists:
 *   Decouples the UI from the data source.
 *   Currently returns mock data, but is structured as an async API
 *   so it can easily be swapped to a real REST API later
 *   (e.g., axios.get('/api/products')) without changing components.
 */

import { products as mockProducts, getCategories as mockGetCategories } from "../mock/products";

export async function getProducts() {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) throw new Error('Failed to fetch products');
    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getCategories() {
  const products = await getProducts();
  const categories = new Set(products.map(p => p.category));
  return Array.from(categories);
}
