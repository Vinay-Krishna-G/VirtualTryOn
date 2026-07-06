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
  // Simulate network delay for realism in the prototype
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockProducts;
}

export async function getCategories() {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return mockGetCategories();
}
